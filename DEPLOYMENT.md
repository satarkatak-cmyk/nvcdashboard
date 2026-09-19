# तैनाथी गाइड (Deployment Guide)

यस गाइडले तपाईंको राष्ट्रिय सतर्कता केन्द्र Dashboard लाई Netlify मा deploy गर्न र Supabase database बाट CRUD operations सुनिश्चित गर्न तरिका व्याख्या गर्दछ।

## आवश्यकताहरू (Prerequisites)

- GitHub खाता
- Netlify खाता
- Supabase खाता
- Node.js र npm स्थापित

## चरण १: Supabase Setup

### १.१ Supabase Project बनाउनुहोस्

1. [supabase.com](https://supabase.com) मा जानुहोस् र नयाँ project बनाउनुहोस्
2. Project को नाम दिनुहोस् (उदाहरण: `risk-map-dashboard`)
3. Database password सेट गर्नुहोस् र यसलाई सुरक्षित राख्नुहोस्
4. Region छनोट गर्नुहोस् (उदाहरण: Southeast Asia)

### १.२ Database Schema Setup

1. Supabase Dashboard मा जानुहोस् → SQL Editor
2. `database/schema.sql` फाइलको सामग्री copy गर्नुहोस्
3. SQL Editor मा paste गर्नुहोस् र Run गर्नुहोस्
4. सबै tables सफलतापूर्वक बनेको सुनिश्चित गर्नुहोस्

### १.३ Environment Variables प्राप्त गर्नुहोस्

Supabase Dashboard मा:

1. **Project Settings** → **API** मा जानुहोस्
2. यी values copy गर्नुहोस्:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

### १.४ Default Admin User Setup

SQL Editor मा यो query run गर्नुहोस्:

```sql
-- Default admin user (password: admin123)
INSERT INTO users (username, password_hash, mahashakha, shakha, role, status)
VALUES (
  'admin',
  'salt:YOUR_HASHED_PASSWORD', -- योलाई proper hash सँग replace गर्नुहोस्
  'प्रशासन तथा सूचना सङ्कलन महाशाखा',
  'प्रशासन, योजना तथा अनुगमन शाखा',
  'admin',
  'active'
)
ON CONFLICT (username) DO NOTHING;
```

## चरण २: Supabase Edge Functions Setup

### २.१ Supabase CLI Install गर्नुहोस्

```bash
npm install -g supabase
```

### २.२ Edge Functions Deploy गर्नुहोस्

1. Project root मा जानुहोस्
2. Supabase सँग link गर्नुहोस्:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

3. Edge functions deploy गर्नुहोस्:

```bash
supabase functions deploy api
```

4. Environment variables set गर्नुहोस् (Note: Supabase CLI ले SUPABASE_ prefix allow गर्दैन):

```bash
supabase secrets set PROJECT_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
supabase secrets set PROJECT_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## चरण ३: Netlify Configuration

### ३.१ netlify.toml Update गर्नुहोस्

`netlify.toml` फाइलमा यो line update गर्नुहोस्:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://YOUR_PROJECT_REF.supabase.co/functions/v1/:splat"
  status = 200
  force = true
```

`YOUR_PROJECT_REF` लाई तपाईंको Supabase project reference सँग replace गर्नुहोस्।

### ३.२ index.html मा Configuration थप्नुहोस्

`index.html` को `<head>` section मा यो script थप्नुहोस्:

```html
<script>
  window.SUPABASE_URL = 'https://YOUR_PROJECT_REF.supabase.co';
  window.API_BASE_URL = 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/api';
</script>
```

## चरण ४: GitHub मा Push गर्नुहोस्

### ४.१ Git Repository Initialize गर्नुहोस्

```bash
git init
git add .
git commit -m "Initial commit"
```

### ४.२ GitHub मा Push गर्नुहोस्

1. GitHub मा नयाँ repository बनाउनुहोस्
2. तपाईंको repository सँग connect गर्नुहोस्:

```bash
git remote add origin https://github.com/YOUR_USERNAME/supanvc.git
git branch -M main
git push -u origin main
```

## चरण ५: Netlify मा Deploy गर्नुहोस्

### ५.१ Netlify मा GitHub Connect गर्नुहोस्

1. [netlify.com](https://netlify.com) मा जानुहोस्
2. "Add new site" → "Import an existing project" क्लिक गर्नुहोस्
3. GitHub छनोट गर्नुहोस् र तपाईंको repository select गर्नुहोस्

### ५.२ Build Settings Configure गर्नुहोस्

Netlify deploy settings मा:

- **Build command**: खाली छोड्नुहोस् (static site)
- **Publish directory**: `.`root directory)
- **Branch to deploy**: `main`

### ५.३ Environment Variables Add गर्नुहोस्

Netlify → Site settings → Environment variables मा:

```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
API_BASE_URL=https://YOUR_PROJECT_REF.supabase.co/functions/v1/api
```

### ५.४ Deploy गर्नुहोस्

"Deploy site" button क्लिक गर्नुहोस्। Deploy complete हुनेछ।

## चरण ६: Testing र Verification

### ६.१ Application Access गर्नुहोस्

1. Netlify द्वारा प्रदान गरिएको URL मा जानुहोस्
2. Login page मा जानुहोस्
3. Default credentials:
   - Username: `admin`
   - Password: `admin123`

### ६.२ CRUD Operations Test गर्नुहोस्

1. **Create**: नयाँ entry थप्नुहोस् (उदाहरण: उजुरी entry)
2. **Read**: सबै entries हेर्नुहोस्
3. **Update**: कुनै entry edit गर्नुहोस्
4. **Delete**: कुनै entry delete गर्नुहोस्

### ६.३ Database Verify गर्नुहोस्

Supabase Dashboard → Table Editor मा गएर data सही रूपमा save भएको verify गर्नुहोस्।

## समस्या समाधान (Troubleshooting)

### CORS Errors

यदि CORS errors आउँछ भने:

1. Supabase Dashboard → Authentication → URL Configuration
2. तपाईंको Netlify URL add गर्नुहोस्
3. Redirect URLs मा पनि add गर्नुहोस्

### Authentication Failures

यदि login fail हुँदै छ भने:

1. Edge function properly deployed छ कि छैन check गर्नुहोस्
2. Environment variables सही छ कि छैन verify गर्नुहोस्
3. Browser console मा errors हेर्नुहोस्

### Database Connection Issues

यदि database connect हुँदैन भने:

1. Supabase project active छ कि छैन check गर्नुहोस्
2. Database URL correct छ कि छैन verify गर्नुहोस्
3. SSL connection enabled छ कि छैन check गर्नुहोस्

## सुरक्षा सुझावहरू (Security Recommendations)

1. **Default Password Change**: पहिलो login पछि admin password change गर्नुहोस्
2. **Environment Variables**: `.env` फाइल कहिल्यै commit गर्नुहोस्
3. **Row Level Security**: Supabase मा RLS policies enable गर्नुहोस्
4. **API Keys**: Service role key कहिल्यै client-side मा use गर्नुहोस्
5. **HTTPS**: Netlify automatically HTTPS provide गर्दछ

## Production Checklist

- [ ] Supabase project setup complete
- [ ] Database schema migrated
- [ ] Edge functions deployed
- [ ] Netlify configuration updated
- [ ] GitHub repository connected
- [ ] Environment variables set
- [ ] Application deployed successfully
- [ ] CRUD operations tested
- [ ] Default password changed
- [ ] Security measures implemented

## सहायता (Support)

यदि तपाईंलाई कुनै समस्या भएमा:

1. Browser console check गर्नुहोस्
2. Netlify deploy logs हेर्नुहोस्
3. Supabase logs check गर्नुहोस्
4. Edge function logs हेर्नुहोस्

---

**नोट**: यो deployment guide ले Netlify + Supabase combination use गर्दछ। यो serverless architecture ले तपाईंको application लाई scalable र cost-effective बनाउँछ।
