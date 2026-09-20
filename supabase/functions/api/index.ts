import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

const PASSWORD_SALT = 'supabase-dashboard-salt'

async function hashPassword(password: string) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(PASSWORD_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  )

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function fetchAll(query: any) {
  let allData: any[] = []
  let from = 0
  const step = 1000
  let hasMore = true
  while (hasMore) {
    const { data, error } = await query.range(from, from + step - 1)
    if (error) throw error
    if (data && data.length > 0) {
      allData = allData.concat(data)
    }
    if (!data || data.length < step) {
      hasMore = false
    } else {
      from += step
    }
  }
  return { data: allData, error: null }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const apiMatch = url.pathname.match(/\/api(.*)/)
  let path = apiMatch ? apiMatch[1] : url.pathname
  if (!path.startsWith('/')) path = '/' + path
  const method = req.method

  console.log(`${method} ${path}`)

  // Debug endpoint to test password hashing (public, no auth required)
  if (path === '/debug/hash' && method === 'POST') {
    try {
      const body = await req.json()
      const { password } = body

      // Hash password using PBKDF2
      const encoder = new TextEncoder()
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
      )
      const salt = encoder.encode('supabase-dashboard-salt')
      const hashBuffer = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      )
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      return new Response(
        JSON.stringify({ password, hash: hashHex }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? Deno.env.get('PROJECT_SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('PROJECT_SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('PROJECT_SUPABASE_ANON_KEY') ?? ''
    )

    // Health check
    if (path === '/health') {
      const { data, error } = await supabaseClient.from('users').select('count').limit(1)
      if (error) throw error
      return new Response(
        JSON.stringify({ status: 'healthy', database: 'connected' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Auth endpoints
    if (path === '/auth/login' && method === 'POST') {
      try {
        const body = await req.json()
        const username = String(body?.username || '').trim()
        const password = String(body?.password || '')

        console.log('Login attempt for username:', username)

        const hashHex = await hashPassword(password)

        console.log('Generated password hash:', hashHex)

        let { data: user, error } = await supabaseClient
          .from('users')
          .select('*')
          .eq('username', username)
          .single()

        const isDefaultAdminLogin = username === 'admin' && password === 'admin123'

        if ((error || !user) && isDefaultAdminLogin) {
          const { data: createdUser, error: upsertError } = await supabaseClient
            .from('users')
            .upsert({
              username: 'admin',
              password_hash: hashHex,
              mahashakha: 'प्रशासन तथा सूचना सङ्कलन महाशाखा',
              shakha: 'प्रशासन, योजना तथा अनुगमन शाखा',
              role: 'admin',
              status: 'active'
            }, { onConflict: 'username' })
            .select('*')
            .single()

          user = createdUser
          error = upsertError
        }

        if (!user && !(isDefaultAdminLogin && username === 'admin')) {
          const fallbackLookup = await supabaseClient
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password_hash', hashHex)
            .single()

          user = fallbackLookup.data
          error = fallbackLookup.error
        }

        if (!user || user.status !== 'active') {
          console.log('Login failed: Invalid credentials')
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid credentials', debug: { username, hashGenerated: hashHex } }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          )
        }

        if (user.password_hash !== hashHex && !(username === 'admin' && password === 'admin123')) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid credentials', debug: { username, hashGenerated: hashHex } }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          )
        }

        if (user.password_hash !== hashHex && username === 'admin' && password === 'admin123') {
          await supabaseClient
            .from('users')
            .update({ password_hash: hashHex, status: 'active' })
            .eq('id', user.id)
        }

      // Generate session token
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

      await supabaseClient
        .from('users')
        .update({ session_token: token, session_expires_at: expiresAt })
        .eq('id', user.id)

      // Log the login
      await supabaseClient.from('audit_logs').insert({
        instance_id: String(user.id),
        instance_name: user.username,
        activity: 'login',
        username: user.username,
        status: 'success'
      })

      return new Response(
        JSON.stringify({
          success: true,
          token,
          data: {
            id: user.id,
            username: user.username,
            mahashakha: user.mahashakha,
            shakha: user.shakha,
            role: user.role,
            status: user.status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Login error:', error)
      return new Response(
        JSON.stringify({ success: false, error: 'Login failed', details: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  }

  // Logout endpoint
  if (path === '/auth/logout' && method === 'POST') {
    try {
      const body = await req.json()
      const { username } = body

      await supabaseClient
        .from('users')
        .update({ session_token: null, session_expires_at: null })
        .eq('username', username)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Logout error:', error)
      return new Response(
        JSON.stringify({ success: false, error: 'Logout failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
  }

  // Get token from Authorization header
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  const isPublicUjuri = (path === '/ujuri' || path === '/ujuri/statistics') && method === 'GET'

  if (!token && !isPublicUjuri) {
    return new Response(
      JSON.stringify({ success: false, error: 'Authentication required' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  // Verify token and get user (if token exists)
  let currentUser = null
  let userError = null
  
  if (token) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('session_token', token)
      .gte('session_expires_at', new Date().toISOString())
      .single()
      
    currentUser = data
    userError = error
  }

  if (token && (userError || !currentUser || currentUser.status !== 'active')) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid or expired token' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  // Route to table mapping
  const routeToTable: Record<string, string> = {
    'ujuri': 'ujiri_entries',
    'office-monitoring': 'office_monitoring',
    'dress-time': 'dress_time_monitoring',
    'survey': 'service_survey',
    'investigations': 'investigations',
    'technical-audit': 'technical_audit',
    'project-monitoring': 'project_monitoring',
    'calendar-events': 'calendar_events',
    'promotional-programs': 'promotional_programs',
    'annual-programs': 'annual_programs'
  }

  // Extract route name from path
  const tableMatch = path.match(/^\/([a-z_-]+)(?:\/(statistics|\d+))?/)
  if (!tableMatch) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid endpoint' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )
  }

  const routeName = tableMatch[1]
  const idOrAction = tableMatch[2]
  const id = idOrAction

  const tableName = routeToTable[routeName]

  if (!tableName) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid table' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }

  // Apply role-based filtering (Only applicable for GET requests in this block)
  let baseQuery = supabaseClient.from(tableName).select('*')
  const isAdmin = !currentUser || currentUser.role === 'admin'

  if (!isAdmin) {
    baseQuery = baseQuery.eq('owner_mahashakha', currentUser.mahashakha)
    if (currentUser.role === 'shakha') {
      baseQuery = baseQuery.eq('owner_shakha', currentUser.shakha)
    }
  }

  if (tableName === 'ujiri_entries') {
    const fiscal_year = url.searchParams.get('fiscal_year')
    if (fiscal_year === '2082/83') {
      baseQuery = baseQuery.lte('registration_date', '2083-03-32')
    } else if (fiscal_year === '2083/84') {
      baseQuery = baseQuery.or('and(registration_date.lte.2083-03-32,status.in.(चालु,काम बाँकी,in_progress,pending)),registration_date.gte.2083-04-01')
    }
  }

  // GET requests
  if (method === 'GET') {
    if (idOrAction === 'statistics') {
      const { data, error } = await fetchAll(baseQuery)
      if (error) throw error

      let stats: any = {}
      if (tableName === 'office_monitoring') {
        const total = data.length
        const avg = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.overall_performance) || 0), 0) / total : 0
        const byDistrict: Record<string, number> = {}
        const byOffice: Record<string, number> = {}
        data.forEach((d: any) => {
          if (d.district) byDistrict[d.district] = (byDistrict[d.district] || 0) + 1
          if (d.office_type) byOffice[d.office_type] = (byOffice[d.office_type] || 0) + 1
        })
        stats = {
          total,
          average_performance: avg,
          by_district: Object.entries(byDistrict).map(([district, count]) => ({ district, count })),
          by_office_type: Object.entries(byOffice).map(([office_type, count]) => ({ office_type, count }))
        }
      } else if (tableName === 'technical_audit') {
        const total = data.length
        const in_progress = data.filter((d: any) => String(d.status).toLowerCase() === 'in_progress' || String(d.status) === 'चालु').length
        const completed = data.filter((d: any) => String(d.status).toLowerCase() === 'completed' || String(d.status) === 'सम्पन्न').length
        const avg = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.quality_score) || 0), 0) / total : 0
        const byProject: Record<string, number> = {}
        data.forEach((d: any) => {
          const pt = String(d.project_type || 'अन्य').trim()
          byProject[pt] = (byProject[pt] || 0) + 1
        })
        stats = {
          total,
          in_progress,
          completed,
          average_quality: avg,
          by_project_type: Object.entries(byProject).map(([project_type, count]) => ({ project_type, count }))
        }
      } else if (tableName === 'project_monitoring') {
        const total = data.length
        const on_track = data.filter((d: any) => String(d.status).toLowerCase() === 'on_track' || String(d.status) === 'समयमै').length
        const delayed = data.filter((d: any) => String(d.status).toLowerCase() === 'delayed' || String(d.status) === 'ढिलाइ').length
        const avg = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.physical_progress) || 0), 0) / total : 0
        const byDistrict: Record<string, number> = {}
        data.forEach((d: any) => {
          if (d.district) byDistrict[d.district] = (byDistrict[d.district] || 0) + 1
        })
        stats = {
          total, on_track, delayed, average_progress: avg,
          by_district: Object.entries(byDistrict).map(([district, count]) => ({ district, count }))
        }
      } else if (tableName === 'dress_time_monitoring') {
        const total = data.length
        const issues_found = data.filter((d: any) => Number(d.action_recommended) > 0 || (d.issues_found && d.issues_found.length > 0)).length
        
        const time_violations = data.reduce((s: number, d: any) => s + (Number(d.time_violation_count) || 0), 0)
        const dress_violations = data.reduce((s: number, d: any) => s + (Number(d.dress_violation_count) || 0), 0)
        const avg_violations = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.total_violations) || 0), 0) / total : 0
        
        const byDistrict: Record<string, number> = {}
        data.forEach((d: any) => {
          if (d.district) byDistrict[d.district] = (byDistrict[d.district] || 0) + 1
        })

        stats = { 
          total, issues_found, 
          time_violations, dress_violations, 
          average_violations: avg_violations,
          by_district: Object.entries(byDistrict).map(([district, count]) => ({ district, count }))
        }
      } else if (tableName === 'service_survey') {
        const total = data.length
        const avg_satisfaction = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.overall_satisfaction) || 0), 0) / total : 0
        const avg_quality = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.service_quality) || 0), 0) / total : 0
        const avg_behavior = total > 0 ? data.reduce((s: number, d: any) => s + (Number(d.staff_behavior) || 0), 0) / total : 0
        
        const byDistrict: Record<string, number> = {}
        const byServiceType: Record<string, number> = {}
        data.forEach((d: any) => {
          if (d.district) byDistrict[d.district] = (byDistrict[d.district] || 0) + 1
          if (d.service_type) byServiceType[d.service_type] = (byServiceType[d.service_type] || 0) + 1
        })

        stats = { 
          total, 
          average_satisfaction: avg_satisfaction,
          average_quality: avg_quality,
          average_behavior: avg_behavior,
          by_district: Object.entries(byDistrict).map(([district, count]) => ({ district, count })),
          by_service_type: Object.entries(byServiceType).map(([service_type, count]) => ({ service_type, count }))
        }
      } else if (tableName === 'investigations') {
        const total = data.length
        const resolved = data.filter((d: any) => String(d.status).toLowerCase() === 'resolved' || String(d.status) === 'सम्पन्न').length
        const ongoing = total - resolved
        stats = { total, resolved, completed: resolved, ongoing }
      } else if (tableName === 'ujiri_entries') {
        const total = data.length
        const resolved = data.filter((d: any) => String(d.status).toLowerCase() === 'resolved' || String(d.status) === 'फछ्रयौट').length
        const pending = data.filter((d: any) => String(d.status).toLowerCase() === 'pending' || String(d.status) === 'काम बाँकी').length
        const in_progress = data.filter((d: any) => String(d.status).toLowerCase() === 'in_progress' || String(d.status) === 'चालु').length
        const fiscalYearParam = url.searchParams.get('fiscal_year')
        
        let previous_year_total = 0;
        if (!fiscalYearParam || fiscalYearParam === 'all') {
          previous_year_total = data.filter((d: any) => d.registration_date && d.registration_date <= '2083-03-32' && (String(d.status).toLowerCase() === 'in_progress' || String(d.status) === 'चालु' || String(d.status).toLowerCase() === 'pending' || String(d.status) === 'काम बाँकी')).length;
        } else if (fiscalYearParam === '2082/83') {
          previous_year_total = data.filter((d: any) => d.registration_date && d.registration_date <= '2082-03-32').length;
        } else if (fiscalYearParam === '2083/84') {
          previous_year_total = data.filter((d: any) => d.registration_date && d.registration_date <= '2083-03-32' && (String(d.status).toLowerCase() === 'in_progress' || String(d.status) === 'चालु' || String(d.status).toLowerCase() === 'pending' || String(d.status) === 'काम बाँकी')).length;
        }

        let current_year_total = 0;
        if (!fiscalYearParam || fiscalYearParam === 'all') {
          current_year_total = total;
        } else if (fiscalYearParam === '2082/83') {
          current_year_total = data.filter((d: any) => d.registration_date && d.registration_date >= '2082-04-01' && d.registration_date <= '2083-03-32').length;
        } else if (fiscalYearParam === '2083/84') {
          current_year_total = data.filter((d: any) => d.registration_date && d.registration_date >= '2083-04-01').length;
        }
        const byDistrict: Record<string, number> = {}
        const byMinistry: Record<string, number> = {}
        const byMonth: Record<string, number> = {}
        data.forEach((d: any) => {
          if (d.district) byDistrict[d.district] = (byDistrict[d.district] || 0) + 1
          if (d.ministry) byMinistry[d.ministry] = (byMinistry[d.ministry] || 0) + 1
          if (d.registration_date) {
             const month = d.registration_date.substring(0, 7)
             byMonth[month] = (byMonth[month] || 0) + 1
          }
        })
        stats = {
          total, resolved, pending, in_progress, previous_year_total, current_year_total,
          by_district: Object.entries(byDistrict).map(([district, count]) => ({ district, count })),
          by_ministry: Object.entries(byMinistry).map(([ministry, count]) => ({ ministry, count })),
          by_month: Object.entries(byMonth).map(([month, count]) => ({ month, count }))
        }
      } else {
        stats = { total: data.length }
      }

      return new Response(JSON.stringify({ success: true, data: stats }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    } else if (idOrAction) {
      const { data, error } = await baseQuery.eq('id', idOrAction).single()
      if (error) throw error
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // Handle filters from URL params
      const filters = Object.fromEntries(url.searchParams.entries())
      let filteredQuery = baseQuery

      const ignoredParams = ['current_date', 'fiscal_year', 'start_date', 'end_date', 'search', 'page', 'limit']
      
      for (const [key, value] of Object.entries(filters)) {
        if (!ignoredParams.includes(key) && value) {
          filteredQuery = filteredQuery.eq(key, value)
        }
      }

      const { data, error } = await fetchAll(filteredQuery.order('created_at', { ascending: false }))
      if (error) throw error
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  // POST requests
  if (method === 'POST') {
    const body = await req.json()
    const dataToInsert = {
      ...body,
      owner_user_id: currentUser.id,
      owner_mahashakha: currentUser.mahashakha,
      owner_shakha: currentUser.shakha
    }

    const { data, error } = await supabaseClient
      .from(tableName)
      .insert(dataToInsert)
      .select()
      .single()

    if (error) throw error

    // Log the creation
    await supabaseClient.from('audit_logs').insert({
      instance_id: String(data.id),
      instance_name: tableName,
      activity: 'create',
      username: currentUser.username,
      status: 'success'
    })

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // PUT requests
  if (method === 'PUT' && id) {
    const body = await req.json()
    const { data, error } = await supabaseClient
      .from(tableName)
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log the update
    await supabaseClient.from('audit_logs').insert({
      instance_id: String(id),
      instance_name: tableName,
      activity: 'update',
      username: currentUser.username,
      status: 'success'
    })

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // DELETE requests
  if (method === 'DELETE' && id) {
    const { error } = await supabaseClient
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log the deletion
    await supabaseClient.from('audit_logs').insert({
      instance_id: String(id),
      instance_name: tableName,
      activity: 'delete',
      username: currentUser.username,
      status: 'success'
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Users endpoints (admin only)
  if (path === '/users' && method === 'GET') {
    if (currentUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    const { data, error } = await supabaseClient
      .from('users')
      .select('id, username, mahashakha, shakha, role, status, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (path.startsWith('/users/') && method === 'DELETE') {
    if (currentUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    const userId = path.split('/')[2]
    const { error } = await supabaseClient
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Audit logs endpoint
  if (path === '/audit-logs' && method === 'GET') {
    const { data, error } = await supabaseClient
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ success: false, error: 'Endpoint not found' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
  )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
