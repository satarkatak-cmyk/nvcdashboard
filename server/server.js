const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: true });
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const crypto = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(crypto.scrypt);
const pbkdf2Async = promisify(crypto.pbkdf2);
const authSessions = new Map();
const PASSWORD_SALT = 'supabase-dashboard-salt';

const databaseHost = process.env.DB_HOST || 'localhost';
const isSupabaseDatabase = databaseHost.endsWith('.supabase.co');
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!databaseUrl && isSupabaseDatabase) {
    console.warn('DATABASE_URL is not configured. The direct Supabase database host may be unreachable; use the Session Pooler URI from Supabase Dashboard.');
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-hashes'", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrcAttr: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net", "https://raw.githubusercontent.com"],
            upgradeInsecureRequests: null,
        }
    }
}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // dashboard polling and navigation can make many API requests
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again later.'
        });
    }
});
app.use('/api', limiter);

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// PostgreSQL connection pool
const pool = new Pool({
    ...(databaseUrl ? { connectionString: databaseUrl } : {}),
    host: databaseHost,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'dashboard',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: isSupabaseDatabase || databaseUrl ? { rejectUnauthorized: false } : undefined,
    // Supabase Session Pooler limits the project to 15 clients.
    // Keep room for pgAdmin and other clients while serving dashboard requests.
    max: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Force a connection test on startup
pool.connect()
    .then(async (client) => {
        console.log('Successfully connected to PostgreSQL database');
        try {
            await client.query(`
                DO $$
                DECLARE
                    t text;
                BEGIN
                    FOR t IN
                        SELECT table_name
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND column_name = 'id'
                          AND data_type = 'uuid'
                          AND table_name IN (
                              'ujiri_entries',
                              'office_monitoring',
                              'dress_time_monitoring',
                              'service_survey',
                              'investigations',
                              'technical_audit',
                              'project_monitoring'
                          )
                        GROUP BY table_name
                    LOOP
                        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I_pkey;', t, t);
                        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS __integer_id INTEGER;', t);
                        EXECUTE format(
                            'WITH numbered AS (SELECT ctid, row_number() OVER (ORDER BY id) AS rn FROM %I) UPDATE %I SET __integer_id = numbered.rn FROM numbered WHERE %I.ctid = numbered.ctid;',
                            t, t, t
                        );
                        EXECUTE format('ALTER TABLE %I DROP COLUMN id;', t);
                        EXECUTE format('ALTER TABLE %I RENAME COLUMN __integer_id TO id;', t);
                        EXECUTE format('ALTER TABLE %I ADD PRIMARY KEY (id);', t);
                    END LOOP;
                END $$;
            `);
            await client.query(`
                ALTER TABLE IF EXISTS ujiri_entries
                ADD COLUMN IF NOT EXISTS committee_decision TEXT,
                ADD COLUMN IF NOT EXISTS final_decision_type VARCHAR(100),
                ADD COLUMN IF NOT EXISTS final_decision TEXT,
                ADD COLUMN IF NOT EXISTS decision_date DATE,
                ADD COLUMN IF NOT EXISTS remarks TEXT,
                ADD COLUMN IF NOT EXISTS attachment_files TEXT,
                ADD COLUMN IF NOT EXISTS attachment_data JSONB,
                ADD COLUMN IF NOT EXISTS complaint_source VARCHAR(100);
            `);
            console.log('Ensured ujiri decision columns exist');
            await client.query(`
                ALTER TABLE IF EXISTS office_monitoring
                ADD COLUMN IF NOT EXISTS form_data JSONB;
            `);
            console.log('Ensured office monitoring form data column exists');
            
            // Ensure dress_time_monitoring table has the correct columns
            await client.query(`
                ALTER TABLE IF EXISTS dress_time_monitoring
                ADD COLUMN IF NOT EXISTS local_level VARCHAR(255),
                ADD COLUMN IF NOT EXISTS office_phone VARCHAR(50),
                ADD COLUMN IF NOT EXISTS monitoring_time TIME,
                ADD COLUMN IF NOT EXISTS total_staff INTEGER,
                ADD COLUMN IF NOT EXISTS active_staff INTEGER,
                ADD COLUMN IF NOT EXISTS vacant_staff INTEGER,
                ADD COLUMN IF NOT EXISTS staff_details JSONB,
                ADD COLUMN IF NOT EXISTS team_leader_name VARCHAR(255),
                ADD COLUMN IF NOT EXISTS team_leader_post VARCHAR(255),
                ADD COLUMN IF NOT EXISTS official_name VARCHAR(255),
                ADD COLUMN IF NOT EXISTS official_post VARCHAR(255),
                ADD COLUMN IF NOT EXISTS action_recommended INTEGER DEFAULT 0;
            `);
            console.log('Ensured dress time monitoring columns exist');
            await client.query(`
                CREATE TABLE IF NOT EXISTS calendar_events (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    event_date DATE NOT NULL,
                    event_time TIME NOT NULL,
                    title VARCHAR(100) NOT NULL CHECK (title IN ('उजुरी व्यवस्थापन समिति बैठक', 'मासिक समीक्षा बैठक', 'अन्य बैठक/कार्यक्रम')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Ensured calendar events table exists');
            
            // Create promotional programs table
            await client.query(`
                CREATE TABLE IF NOT EXISTS promotional_programs (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    program_name VARCHAR(255) NOT NULL,
                    program_date DATE NOT NULL,
                    nepali_date VARCHAR(20),
                    province VARCHAR(100),
                    district VARCHAR(100),
                    local_level VARCHAR(100),
                    target_group VARCHAR(255),
                    expected_participants INTEGER,
                    actual_participants INTEGER,
                    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'done', 'cancelled')),
                    program_category VARCHAR(100),
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Ensured promotional programs table exists');
            
            // Create promotional program photos table
            await client.query(`
                CREATE TABLE IF NOT EXISTS promotional_program_photos (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    program_id INTEGER NOT NULL REFERENCES promotional_programs(id) ON DELETE CASCADE,
                    photo_data TEXT NOT NULL,
                    photo_name VARCHAR(255),
                    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Ensured promotional program photos table exists');
            
            // Add quarterly progress column to promotional programs
            await client.query(`
                ALTER TABLE IF EXISTS promotional_programs
                ADD COLUMN IF NOT EXISTS fiscal_year VARCHAR(10),
                ADD COLUMN IF NOT EXISTS quarter INTEGER CHECK (quarter IN (1, 2, 3, 4));
            `);
            console.log('Ensured quarterly progress columns exist');
            await client.query(`
                CREATE TABLE IF NOT EXISTS annual_programs (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    fiscal_year VARCHAR(10) NOT NULL DEFAULT '2083/84',
                    serial_number INTEGER NOT NULL,
                    activity_number VARCHAR(100) NOT NULL DEFAULT '',
                    expenditure_head VARCHAR(100) NOT NULL DEFAULT '',
                    program TEXT NOT NULL,
                    activity TEXT NOT NULL DEFAULT '',
                    budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
                    lead_department TEXT NOT NULL DEFAULT '',
                    supporting_department TEXT NOT NULL DEFAULT '',
                    annual_target NUMERIC(12, 2) NOT NULL DEFAULT 0,
                    months JSONB NOT NULL DEFAULT '[]'::jsonb,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE (fiscal_year, serial_number)
                );
                CREATE INDEX IF NOT EXISTS idx_annual_programs_fiscal_year ON annual_programs(fiscal_year);
            `);
            console.log('Ensured annual programs table exists');
            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    username VARCHAR(100) UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    mahashakha VARCHAR(255) NOT NULL,
                    shakha VARCHAR(255) NOT NULL,
                    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'mahashakha', 'shakha')),
                    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
                    session_token TEXT,
                    session_expires_at TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
                CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
            `);
            console.log('Ensured users table exists');
            await client.query(`
                ALTER TABLE users
                ADD COLUMN IF NOT EXISTS session_token TEXT,
                ADD COLUMN IF NOT EXISTS session_expires_at TIMESTAMP
            `);
            for (const table of [
                'ujiri_entries', 'office_monitoring', 'dress_time_monitoring', 'service_survey',
                'investigations', 'technical_audit', 'project_monitoring', 'calendar_events',
                'promotional_programs', 'annual_programs'
            ]) {
                await client.query(`
                    ALTER TABLE IF EXISTS ${table}
                    ADD COLUMN IF NOT EXISTS owner_user_id INTEGER,
                    ADD COLUMN IF NOT EXISTS owner_mahashakha VARCHAR(255),
                    ADD COLUMN IF NOT EXISTS owner_shakha VARCHAR(255)
                `);
            }
            await client.query(`
                DO $$
                DECLARE
                    table_name TEXT;
                    sequence_name TEXT;
                    max_id INTEGER;
                BEGIN
                    FOREACH table_name IN ARRAY ARRAY[
                        'ujiri_entries', 'office_monitoring', 'dress_time_monitoring', 'service_survey',
                        'investigations', 'technical_audit', 'project_monitoring', 'calendar_events',
                        'promotional_programs', 'annual_programs', 'users', 'audit_logs'
                    ] LOOP
                        IF to_regclass(table_name) IS NOT NULL THEN
                            sequence_name := pg_get_serial_sequence(table_name, 'id');
                            IF sequence_name IS NOT NULL THEN
                                EXECUTE format('SELECT COALESCE(MAX(id), 0) FROM %I', table_name) INTO max_id;
                                PERFORM setval(sequence_name, GREATEST(max_id, 1), max_id > 0);
                            END IF;
                        END IF;
                    END LOOP;
                END $$;
            `);
            console.log('Synchronized identity sequences');
            const defaultAdminPasswordHash = await hashUserPassword('admin123');
            await client.query(`
                INSERT INTO users (username, password_hash, mahashakha, shakha, role, status)
                VALUES ('admin', $1, 'प्रशासन तथा सूचना सङ्कलन महाशाखा', 'प्रशासन, योजना तथा अनुगमन शाखा', 'admin', 'active')
                ON CONFLICT (username) DO NOTHING;
            `, [defaultAdminPasswordHash]);
            console.log('Ensured default admin user exists');
            await client.query(`
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    instance_id VARCHAR(100) NOT NULL,
                    instance_name VARCHAR(255) NOT NULL,
                    activity VARCHAR(30) NOT NULL CHECK (activity IN ('create', 'update', 'delete', 'login', 'logout')),
                    username VARCHAR(100),
                    status VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                CREATE INDEX IF NOT EXISTS idx_audit_logs_activity ON audit_logs(activity);
                CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
            `);
            console.log('Ensured audit logs table exists');
        } catch (error) {
            console.error('Error ensuring promotional programs schema:', error.message);
        }
        client.release();
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL database:', err.message);
        console.log('Server will start but database operations may fail');
    });

// Middleware to check database connection
app.use((req, res, next) => {
    req.db = pool;
    next();
});

function createAuthToken() {
    return crypto.randomBytes(32).toString('hex');
}

async function requireAuth(req, res, next) {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });
    try {
        const result = await req.db.query(`
            SELECT id, username, mahashakha, shakha, role, status
            FROM users
            WHERE session_token = $1 AND session_expires_at > CURRENT_TIMESTAMP
        `, [token]);
        const user = result.rows[0];
        if (!user || user.status !== 'active') {
            authSessions.delete(token);
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        authSessions.set(token, user);
        req.user = user;
        next();
    } catch (error) {
        console.error('Error validating session:', error);
        res.status(500).json({ success: false, error: 'Could not validate session' });
    }
}

function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin access required' });
    next();
}

function scopeCondition(params, user, tableAlias = '') {
    if (!user || user.role === 'admin') return '';
    const prefix = tableAlias ? `${tableAlias}.` : '';
    params.push(user.mahashakha);
    const mahashakhaParam = `$${params.length}`;
    let scope = `${prefix}owner_mahashakha = ${mahashakhaParam}`;
    if (user.role === 'shakha') {
        params.push(user.shakha);
        scope += ` AND ${prefix}owner_shakha = $${params.length}`;
    }
    return ` AND ${scope}`;
}

function addScope(query, params, user, tableAlias = '') {
    return query + scopeCondition(params, user, tableAlias);
}

const scopedTables = new Set([
    'ujiri_entries', 'office_monitoring', 'dress_time_monitoring', 'service_survey',
    'investigations', 'technical_audit', 'project_monitoring', 'calendar_events',
    'promotional_programs', 'annual_programs'
]);

function scopeSql(text, values, user) {
    if (!user || user.role === 'admin') return { text, values };
    const tableMatch = text.match(/\b(?:FROM|UPDATE|DELETE\s+FROM|INSERT\s+INTO)\s+([a-z_][a-z0-9_]*)/i);
    const table = tableMatch && tableMatch[1].toLowerCase();
    if (!table || !scopedTables.has(table)) return { text, values };

    const scopedValues = Array.isArray(values) ? [...values] : [];
    const columnsMatch = text.match(/INSERT\s+INTO\s+[a-z_][a-z0-9_]*\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (columnsMatch && !columnsMatch[1].includes('owner_user_id')) {
        const next = scopedValues.length;
        const replacement = `INSERT INTO ${table} (${columnsMatch[1]}, owner_user_id, owner_mahashakha, owner_shakha) VALUES (${columnsMatch[2]}, $${next + 1}, $${next + 2}, $${next + 3})`;
        scopedValues.push(user.id, user.mahashakha, user.shakha);
        return { text: text.replace(columnsMatch[0], replacement), values: scopedValues };
    }

    const scope = scopeCondition(scopedValues, user);
    if (!scope) return { text, values: scopedValues };
    const scopedText = text.replace(/\s+(GROUP BY|ORDER BY|LIMIT|RETURNING)\b/i, `${scope} $1`);
    return { text: scopedText === text ? `${text}${scope}` : scopedText, values: scopedValues };
}

// Root endpoint - serve the HTML dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const client = await req.db.connect();
        await client.query('SELECT NOW()');
        client.release();
        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
});

// ============================================
// USER MANAGEMENT API ENDPOINTS
// ============================================

const userRoles = ['admin', 'mahashakha', 'shakha'];
const userStatuses = ['active', 'inactive'];
const userShakhaOptions = {
    'प्रशासन तथा सूचना सङ्कलन महाशाखा': [
        'प्रशासन, योजना तथा अनुगमन शाखा',
        'सूचना सङ्‍कलन तथा उजुरी व्यवस्थापन शाखा',
        'आर्थिक प्रशासन शाखा',
        'उजुरी छानविन तथा अन्वेषण शाखा',
        'कानूनी राय तथा परामर्श शाखा',
        'सम्पत्ति विवरण तथा आय अनुगमन शाखा',
        'निर्णय कार्यान्वयन तथा अभिलेख व्यवस्थापन शाखा'
    ],
    'प्राविधिक परीक्षण तथा अनुगमन महाशाखा': [
        'प्राविधिक परीक्षण शाखा',
        'प्राविधिक छानविन तथा अनुगमन शाखा',
        'प्रयोगशाला/परीक्षण शाखा',
        'प्राविधिक परीक्षण तालिम तथा क्षमता विकास शाखा',
        'सूचना प्रविधि शाखा'
    ],
    'प्रहरी महाशाखा': ['प्रहरी शाखा']
};

function validateUserInput(data, requirePassword = true) {
    const { username, password, mahashakha, shakha, role, status } = data;
    if (!username || (requirePassword && !password) || !mahashakha || !shakha || !role || !status) {
        return 'Username, password, mahashakha, shakha, role and status are required';
    }
    if (!userRoles.includes(role)) return 'Invalid role';
    if (!userStatuses.includes(status)) return 'Invalid status';
    if (!userShakhaOptions[mahashakha] || !userShakhaOptions[mahashakha].includes(shakha)) {
        return 'Invalid shakha for selected mahashakha';
    }
    return null;
}

async function hashUserPassword(password) {
    const salt = Buffer.from(PASSWORD_SALT, 'utf8');
    const derivedKey = await pbkdf2Async(password, salt, 100000, 32, 'sha256');
    return derivedKey.toString('hex');
}

async function verifyUserPassword(password, storedHash) {
    if (!storedHash) return false;

    if (storedHash.includes(':')) {
        const [salt, key] = String(storedHash).split(':');
        if (!salt || !key) return false;
        const derivedKey = await scryptAsync(password, salt, 64);
        return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
    }

    const expectedHash = await hashUserPassword(password);
    return crypto.timingSafeEqual(Buffer.from(String(storedHash), 'hex'), Buffer.from(expectedHash, 'hex'));
}

const publicUserFields = `
    id, username, mahashakha, shakha, role, status,
    created_at AS "createdAt", updated_at AS "updatedAt"
`;

async function writeAuditLog(db, activity, username, instanceId, instanceName, status = 'success') {
    await db.query(
        'INSERT INTO audit_logs (instance_id, instance_name, activity, username, status) VALUES ($1, $2, $3, $4, $5)',
        [instanceId, instanceName, activity, username || null, status]
    );
}

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ success: false, error: 'Username and password are required' });

            const result = await req.db.query(
            `SELECT ${publicUserFields}, password_hash AS "passwordHash" FROM users WHERE username = $1`,
            [username.trim()]
        );
        let user = result.rows[0];
        const isDefaultAdminLogin = username.trim() === 'admin' && password === 'admin123';

        if (isDefaultAdminLogin) {
            const defaultHash = await hashUserPassword('admin123');
            await req.db.query(`
                INSERT INTO users (username, password_hash, mahashakha, shakha, role, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (username) DO UPDATE SET
                    password_hash = EXCLUDED.password_hash,
                    status = EXCLUDED.status,
                    mahashakha = EXCLUDED.mahashakha,
                    shakha = EXCLUDED.shakha,
                    role = EXCLUDED.role
            `, ['admin', defaultHash, 'प्रशासन तथा सूचना सङ्कलन महाशाखा', 'प्रशासन, योजना तथा अनुगमन शाखा', 'admin', 'active']);

            const refreshed = await req.db.query(`SELECT ${publicUserFields}, password_hash AS "passwordHash" FROM users WHERE username = $1`, ['admin']);
            user = refreshed.rows[0];
        }

        if (!user || user.status !== 'active') {
            return res.status(401).json({ success: false, error: 'Invalid username or password' });
        }

        const passwordMatches = await verifyUserPassword(password, user.passwordHash || user.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, error: 'Invalid username or password' });
        }

        delete user.passwordHash;
        const token = createAuthToken();
        await req.db.query(
            'UPDATE users SET session_token = $1, session_expires_at = CURRENT_TIMESTAMP + INTERVAL \'30 days\' WHERE id = $2',
            [token, user.id]
        );
        authSessions.set(token, user);
        await writeAuditLog(req.db, 'login', user.username, `user-${user.id}`, 'User Management');
        res.json({ success: true, token, data: user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    try {
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    authSessions.delete(token);
        if (token) await req.db.query('UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE session_token = $1', [token]);
        const { username } = req.body;
        await writeAuditLog(req.db, 'logout', username, username ? `user-${username}` : 'session', 'User Management');
        res.json({ success: true });
    } catch (error) {
        console.error('Error recording logout:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use('/api', (req, res, next) => {
    if (req.path === '/health' || req.path === '/auth/login' || req.path === '/auth/logout') return next();
    return requireAuth(req, res, () => {
        const db = req.db;
        req.db = {
            query: (text, values) => {
                const scoped = scopeSql(text, values, req.user);
                return db.query(scoped.text, scoped.values);
            }
        };
        next();
    });
});

app.get('/api/audit-logs', requireAdmin, async (req, res) => {
    try {
        const { activity } = req.query;
        const params = [];
        let query = `
            SELECT id, instance_id AS "instanceId", instance_name AS "instanceName",
                   activity, username AS "user", TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS timestamp, status
            FROM audit_logs
        `;
        if (activity && activity !== 'all') {
            params.push(activity);
            query += ' WHERE activity = $1';
        }
        query += ' ORDER BY created_at DESC, id DESC';
        const result = await req.db.query(query, params);
        res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/users/change-password', async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;
        if (req.user.username !== String(username || '').trim() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'You can only change your own password' });
        }
        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: 'Username, current password and new password are required' });
        }

        const result = await req.db.query('SELECT id, password_hash FROM users WHERE username = $1', [username.trim()]);
        const user = result.rows[0];
        if (!user || !(await verifyUserPassword(currentPassword, user.password_hash))) {
            return res.status(401).json({ success: false, error: 'हालको पासवर्ड गलत छ।' });
        }

        const passwordHash = await hashUserPassword(newPassword);
        await req.db.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [passwordHash, user.id]
        );
        await writeAuditLog(req.db, 'update', username, `user-${user.id}`, 'Password', 'success');
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/users', requireAdmin, async (req, res) => {
    try {
        const result = await req.db.query(`
            SELECT ${publicUserFields}
            FROM users
            ORDER BY created_at DESC, id DESC
        `);
        res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/users', requireAdmin, async (req, res) => {
    try {
        const validationError = validateUserInput(req.body);
        if (validationError) return res.status(400).json({ success: false, error: validationError });

        const { username, password, mahashakha, shakha, role, status } = req.body;
        const passwordHash = await hashUserPassword(password);
        const result = await req.db.query(`
            INSERT INTO users (username, password_hash, mahashakha, shakha, role, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING ${publicUserFields}
        `, [username.trim(), passwordHash, mahashakha, shakha, role, status]);

        await writeAuditLog(req.db, 'create', username, `user-${result.rows[0].id}`, 'User Management');
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ success: false, error: 'Username already exists' });
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/users/:id', requireAdmin, async (req, res) => {
    try {
        const { username, password, mahashakha, shakha, role, status } = req.body;
        const validationError = validateUserInput(req.body, false);
        if (validationError) return res.status(400).json({ success: false, error: validationError });

        const values = [username.trim(), mahashakha, shakha, role, status];
        let passwordClause = '';
        if (password) {
            values.push(await hashUserPassword(password));
            passwordClause = `, password_hash = $${values.length}`;
        }
        values.push(req.params.id);
        const result = await req.db.query(`
            UPDATE users
            SET username = $1, mahashakha = $2, shakha = $3, role = $4, status = $5,
                updated_at = CURRENT_TIMESTAMP${passwordClause}
            WHERE id = $${values.length}
            RETURNING ${publicUserFields}
        `, values);

        if (!result.rows.length) return res.status(404).json({ success: false, error: 'User not found' });
        await writeAuditLog(req.db, 'update', username, `user-${result.rows[0].id}`, 'User Management');
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ success: false, error: 'Username already exists' });
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
    try {
        const result = await req.db.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ success: false, error: 'User not found' });
        await writeAuditLog(req.db, 'delete', null, `user-${result.rows[0].id}`, 'User Management');
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// UJIRI MANAGEMENT API ENDPOINTS
// ============================================

function addUjiriFiscalYearFilter(query, params, fiscalYear) {
    if (fiscalYear === '2082/83') {
        params.push('2083-03-32');
        return `${query} AND registration_date::text <= $${params.length}`;
    }

    if (fiscalYear === '2083/84') {
        params.push('2083-03-32', '2083-04-01');
        return `${query} AND (registration_date::text >= $${params.length} OR (registration_date::text <= $${params.length - 1} AND status IN ('pending', 'in_progress', 'काम बाँकी', 'चालु')))`;
    }

    return query;
}

function getUjiriPreviousYearCountFilter(fiscalYear) {
    if (fiscalYear === '2082/83') {
        return {
            clause: 'registration_date::text <= $1',
            params: ['2082-03-32']
        };
    }

    if (fiscalYear === '2083/84') {
        return {
            clause: "registration_date::text <= $1 AND status IN ('pending', 'in_progress', 'काम बाँकी', 'चालु')",
            params: ['2083-03-32']
        };
    }

    return {
        clause: 'registration_date::text <= $1',
        params: ['2083-03-32']
    };
}

function getUjiriCurrentYearCountFilter(fiscalYear, currentDate) {
    if (fiscalYear === '2082/83') {
        return {
            clause: 'registration_date::text >= $1 AND registration_date::text <= $2',
            params: ['2082-04-01', '2083-03-32']
        };
    }

    if (fiscalYear === '2083/84') {
        return {
            clause: 'registration_date::text >= $1 AND registration_date::text <= $2',
            params: ['2083-04-01', currentDate || '2083-05-21']
        };
    }

    return {
        clause: 'registration_date::text <= $1',
        params: [currentDate || '2083-05-21']
    };
}

// Get all ujiri entries with filtering
app.get('/api/ujuri', async (req, res) => {
    try {
        const { district, status, start_date, end_date, ministry, search, fiscal_year } = req.query;
        let query = 'SELECT ujiri_entries.*, registration_date::text AS registration_date FROM ujiri_entries WHERE 1=1';
        const params = [];
        let paramCount = 0;

        query = addUjiriFiscalYearFilter(query, params, fiscal_year);
        query += scopeCondition(params, req.user, 'ujiri_entries');
        paramCount = params.length;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (start_date) {
            paramCount++;
            query += ` AND registration_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND registration_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (ministry) {
            paramCount++;
            query += ` AND ministry = $${paramCount}`;
            params.push(ministry);
        }

        if (search) {
            paramCount++;
            query += ` AND (complainant_name ILIKE $${paramCount} OR opponent_name ILIKE $${paramCount} OR registration_number ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        query += ' ORDER BY ujiri_entries.registration_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching ujuri entries:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get ujiri statistics
app.get('/api/ujuri/statistics', async (req, res) => {
    try {
        const { fiscal_year, current_date } = req.query;
        const scopeParams = [];
        const filteredQuery = addUjiriFiscalYearFilter('FROM ujiri_entries WHERE 1=1', scopeParams, fiscal_year);
        const scope = scopeCondition(scopeParams, req.user, 'ujiri_entries');
        const scopedFilteredQuery = `${filteredQuery}${scope}`;
        const previousYearFilter = getUjiriPreviousYearCountFilter(fiscal_year);
        const currentYearFilter = getUjiriCurrentYearCountFilter(fiscal_year, current_date);
        const previousParams = [...previousYearFilter.params];
        const currentParams = [...currentYearFilter.params];
        const previousScope = scopeCondition(previousParams, req.user, 'ujiri_entries');
        const currentScope = scopeCondition(currentParams, req.user, 'ujiri_entries');
        const fiscalParams = fiscal_year === '2082/83'
            ? ['2083-03-32']
            : fiscal_year === '2083/84'
                ? ['2083-03-32', '2083-04-01']
                : [];
        const stats = await Promise.all([
            req.db.query(`SELECT COUNT(*) as total ${scopedFilteredQuery}`, scopeParams),
            req.db.query(`SELECT COUNT(*) as previous_year_total FROM ujiri_entries WHERE ${previousYearFilter.clause}${previousScope}`, previousParams),
            req.db.query(`SELECT COUNT(*) as current_year_total FROM ujiri_entries WHERE ${currentYearFilter.clause}${currentScope}`, currentParams),
            req.db.query(`SELECT COUNT(*) as pending ${scopedFilteredQuery} AND status IN ('pending', 'काम बाँकी')`, scopeParams),
            req.db.query(`SELECT COUNT(*) as resolved ${scopedFilteredQuery} AND status IN ('resolved', 'फछ्रयौट')`, scopeParams),
            req.db.query(`SELECT COUNT(*) as in_progress ${scopedFilteredQuery} AND status IN ('in_progress', 'चालु')`, scopeParams),
            req.db.query(`SELECT district, COUNT(*) as count ${scopedFilteredQuery} GROUP BY district ORDER BY count DESC`, scopeParams),
            req.db.query(`SELECT ministry, COUNT(*) as count ${scopedFilteredQuery} GROUP BY ministry ORDER BY count DESC`, scopeParams),
            req.db.query(`SELECT LEFT(registration_date, 7) as month, COUNT(*) as count ${scopedFilteredQuery} GROUP BY LEFT(registration_date, 7) ORDER BY month DESC`, scopeParams)
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                previous_year_total: stats[1].rows[0].previous_year_total,
                current_year_total: stats[2].rows[0].current_year_total,
                pending: stats[3].rows[0].pending,
                resolved: stats[4].rows[0].resolved,
                in_progress: stats[5].rows[0].in_progress,
                by_district: stats[6].rows,
                by_ministry: stats[7].rows,
                by_month: stats[8].rows
            }
        });
    } catch (error) {
        console.error('Error fetching ujiri statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create new ujiri entry
app.post('/api/ujuri', async (req, res) => {
    try {
        const {
            registration_number,
            registration_date,
            complainant_name,
            opponent_name,
            ministry,
            province,
            district,
            municipality,
            complaint_type,
            complaint_source,
            complaint_description,
            committee_decision,
            final_decision_type,
            final_decision,
            decision_date,
            remarks,
            attachment_files,
            attachment_data,
            status,
            priority,
            assigned_department
        } = req.body;

        const query = `
            INSERT INTO ujiri_entries 
            (registration_number, registration_date, complainant_name, opponent_name, ministry, 
             province, district, municipality, complaint_type, complaint_source, complaint_description, 
             committee_decision, final_decision_type, final_decision, decision_date, remarks, attachment_files, attachment_data, status, 
             priority, assigned_department, owner_user_id, owner_mahashakha, owner_shakha)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
            RETURNING *
        `;

        const values = [
            registration_number,
            registration_date,
            complainant_name,
            opponent_name,
            ministry,
            province,
            district,
            municipality,
            complaint_type,
            complaint_source,
            complaint_description,
            committee_decision || null,
            final_decision_type || null,
            final_decision || null,
            decision_date || null,
            remarks || null,
            attachment_files || null,
            attachment_data ? JSON.stringify(attachment_data) : null,
            status || 'pending',
            priority || 'medium',
            assigned_department, req.user.id, req.user.mahashakha, req.user.shakha
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Ujuri entry created successfully'
        });
    } catch (error) {
        console.error('Error creating ujiri entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update ujiri entry
app.put('/api/ujuri/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            registration_number,
            registration_date,
            complainant_name,
            opponent_name,
            ministry,
            province,
            district,
            municipality,
            complaint_type,
            complaint_source,
            complaint_description,
            committee_decision,
            final_decision_type,
            final_decision,
            decision_date,
            remarks,
            attachment_files,
            attachment_data,
            status,
            priority,
            assigned_department
        } = req.body;

        const values = [
            registration_number,
            registration_date,
            complainant_name,
            opponent_name,
            ministry,
            province,
            district,
            municipality,
            complaint_type,
            complaint_source,
            complaint_description,
            committee_decision || null,
            final_decision_type || null,
            final_decision || null,
            decision_date || null,
            remarks || null,
            attachment_files || null,
            attachment_data ? JSON.stringify(attachment_data) : null,
            status,
            priority,
            assigned_department,
            id
        ];
        const scope = scopeCondition(values, req.user);
        const query = `
            UPDATE ujiri_entries
            SET registration_number = $1, registration_date = $2, complainant_name = $3,
                opponent_name = $4, ministry = $5, province = $6, district = $7,
                municipality = $8, complaint_type = $9, complaint_source = $10, complaint_description = $11,
                committee_decision = $12, final_decision_type = $13, final_decision = $14,
                decision_date = $15, remarks = $16, attachment_files = $17, attachment_data = $18, status = $19, priority = $20, assigned_department = $21
            WHERE id = $22${scope}
            RETURNING *
        `;

        const result = await req.db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ujiri entry not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Ujiri entry updated successfully'
        });
    } catch (error) {
        console.error('Error updating ujiri entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete ujiri entry
app.delete('/api/ujuri/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const values = [id];
        const scope = scopeCondition(values, req.user);
        const result = await req.db.query(`DELETE FROM ujiri_entries WHERE id = $1${scope} RETURNING *`, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ujiri entry not found'
            });
        }

        res.json({
            success: true,
            message: 'Ujiri entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting ujiri entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// OFFICE MONITORING API ENDPOINTS
// ============================================

// Get all office monitoring entries
app.get('/api/office-monitoring', async (req, res) => {
    try {
        const { district, start_date, end_date, office_type } = req.query;
        let query = 'SELECT office_monitoring.*, monitoring_date::text AS monitoring_date FROM office_monitoring WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (start_date) {
            paramCount++;
            query += ` AND monitoring_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND monitoring_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (office_type) {
            paramCount++;
            query += ` AND office_type = $${paramCount}`;
            params.push(office_type);
        }

        query += ' ORDER BY office_monitoring.monitoring_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching office monitoring entries:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get office monitoring statistics
app.get('/api/office-monitoring/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query('SELECT COUNT(*) as total FROM office_monitoring'),
            req.db.query('SELECT AVG(overall_performance) as avg_performance FROM office_monitoring'),
            req.db.query('SELECT district, COUNT(*) as count FROM office_monitoring GROUP BY district ORDER BY count DESC'),
            req.db.query('SELECT office_type, COUNT(*) as count FROM office_monitoring GROUP BY office_type ORDER BY count DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                average_performance: stats[1].rows[0].avg_performance,
                by_district: stats[2].rows,
                by_office_type: stats[3].rows
            }
        });
    } catch (error) {
        console.error('Error fetching office monitoring statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create office monitoring entry
app.post('/api/office-monitoring', async (req, res) => {
    try {
        const {
            office_name, office_type, province, district, monitoring_date,
            monitoring_team, staff_attendance, staff_punctuality_score,
            office_cleanliness_score, service_delivery_score, overall_performance,
            issues_found, recommendations, form_data, follow_up_required, follow_up_date
        } = req.body;

        const query = `
            INSERT INTO office_monitoring 
            (office_name, office_type, province, district, monitoring_date, monitoring_team,
             staff_attendance, staff_punctuality_score, office_cleanliness_score, 
             service_delivery_score, overall_performance, issues_found, recommendations, form_data,
             follow_up_required, follow_up_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *
        `;

        const values = [
            office_name, office_type, province, district, monitoring_date, monitoring_team,
            staff_attendance, staff_punctuality_score, office_cleanliness_score,
            service_delivery_score, overall_performance, issues_found, recommendations,
            form_data, follow_up_required, follow_up_date
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Office monitoring entry created successfully'
        });
    } catch (error) {
        console.error('Error creating office monitoring entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update office monitoring entry
app.put('/api/office-monitoring/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            office_name, office_type, province, district, monitoring_date,
            monitoring_team, staff_attendance, staff_punctuality_score,
            office_cleanliness_score, service_delivery_score, overall_performance,
            issues_found, recommendations, form_data, follow_up_required, follow_up_date
        } = req.body;

        const query = `
            UPDATE office_monitoring 
            SET office_name = $1, office_type = $2, province = $3, district = $4, 
                monitoring_date = $5, monitoring_team = $6, staff_attendance = $7, 
                staff_punctuality_score = $8, office_cleanliness_score = $9, 
                service_delivery_score = $10, overall_performance = $11, 
                issues_found = $12, recommendations = $13, form_data = $14,
                follow_up_required = $15, follow_up_date = $16
            WHERE id = $17
            RETURNING *
        `;

        const values = [
            office_name, office_type, province, district, monitoring_date, monitoring_team,
            staff_attendance, staff_punctuality_score, office_cleanliness_score,
            service_delivery_score, overall_performance, issues_found, recommendations,
            form_data, follow_up_required, follow_up_date, id
        ];

        const result = await req.db.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Office monitoring entry not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Office monitoring entry updated successfully'
        });
    } catch (error) {
        console.error('Error updating office monitoring entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete office monitoring entry
app.delete('/api/office-monitoring/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM office_monitoring WHERE id = $1 RETURNING *';
        const result = await req.db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Office monitoring entry not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Office monitoring entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting office monitoring entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// DRESS TIME MONITORING API ENDPOINTS
// ============================================

// Get all dress time monitoring entries
app.get('/api/dress-time', async (req, res) => {
    try {
        const { district, start_date, end_date, province, local_level, office_name, violation_type } = req.query;
        let query = 'SELECT dtm.*, dtm.monitoring_date::text AS monitoring_date FROM dress_time_monitoring dtm WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (province) {
            paramCount++;
            query += ` AND province = $${paramCount}`;
            params.push(province);
        }

        if (local_level) {
            paramCount++;
            query += ` AND local_level = $${paramCount}`;
            params.push(local_level);
        }

        if (office_name) {
            paramCount++;
            query += ` AND office_name ILIKE $${paramCount}`;
            params.push(`%${office_name}%`);
        }

        if (start_date) {
            paramCount++;
            query += ` AND monitoring_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND monitoring_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (violation_type === 'time') {
            paramCount++;
            query += ` AND time_violation_count > 0`;
        }

        if (violation_type === 'dress') {
            paramCount++;
            query += ` AND dress_violation_count > 0`;
        }

        query += ' ORDER BY dtm.monitoring_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching dress time entries:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get dress time statistics
app.get('/api/dress-time/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query('SELECT COUNT(*) as total FROM dress_time_monitoring'),
            req.db.query('SELECT COUNT(*) as time_violations FROM dress_time_monitoring WHERE time_violation_count > 0'),
            req.db.query('SELECT COUNT(*) as dress_violations FROM dress_time_monitoring WHERE dress_violation_count > 0'),
            req.db.query('SUM(action_recommended) as action_recommended FROM dress_time_monitoring'),
            req.db.query('SELECT province, COUNT(*) as count FROM dress_time_monitoring GROUP BY province ORDER BY count DESC'),
            req.db.query('SELECT district, COUNT(*) as count FROM dress_time_monitoring GROUP BY district ORDER BY count DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                time_violations: stats[1].rows[0].time_violations,
                dress_violations: stats[2].rows[0].dress_violations,
                action_recommended: stats[3].rows[0].action_recommended || 0,
                by_province: stats[4].rows,
                by_district: stats[5].rows
            }
        });
    } catch (error) {
        console.error('Error fetching dress time statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create dress time monitoring entry
app.post('/api/dress-time', async (req, res) => {
    try {
        const {
            province, district, local_level, office_name, office_phone,
            monitoring_date, monitoring_time, total_staff, active_staff, vacant_staff,
            staff_details, team_leader_name, team_leader_post, official_name, official_post,
            time_violation_count, dress_violation_count, total_violations, action_recommended, remarks
        } = req.body;

        const query = `
            INSERT INTO dress_time_monitoring 
            (province, district, local_level, office_name, office_phone, monitoring_date, monitoring_time,
             total_staff, active_staff, vacant_staff, staff_details, team_leader_name, team_leader_post,
             official_name, official_post, time_violation_count, dress_violation_count, total_violations,
             action_recommended, remarks)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING *
        `;

        const values = [
            province, district, local_level, office_name, office_phone, monitoring_date, monitoring_time,
            total_staff, active_staff, vacant_staff, staff_details, team_leader_name, team_leader_post,
            official_name, official_post, time_violation_count, dress_violation_count, total_violations,
            action_recommended, remarks
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Dress time monitoring entry created successfully'
        });
    } catch (error) {
        console.error('Error creating dress time entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update dress time monitoring entry
app.put('/api/dress-time/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            province, district, local_level, office_name, office_phone,
            monitoring_date, monitoring_time, total_staff, active_staff, vacant_staff,
            staff_details, team_leader_name, team_leader_post, official_name, official_post,
            time_violation_count, dress_violation_count, total_violations, action_recommended, remarks
        } = req.body;

        const query = `
            UPDATE dress_time_monitoring 
            SET province = $1, district = $2, local_level = $3, office_name = $4, office_phone = $5,
                monitoring_date = $6, monitoring_time = $7, total_staff = $8, active_staff = $9,
                vacant_staff = $10, staff_details = $11, team_leader_name = $12, team_leader_post = $13,
                official_name = $14, official_post = $15, time_violation_count = $16, dress_violation_count = $17,
                total_violations = $18, action_recommended = $19, remarks = $20
            WHERE id = $21
            RETURNING *
        `;

        const values = [
            province, district, local_level, office_name, office_phone, monitoring_date, monitoring_time,
            total_staff, active_staff, vacant_staff, staff_details, team_leader_name, team_leader_post,
            official_name, official_post, time_violation_count, dress_violation_count, total_violations,
            action_recommended, remarks, id
        ];

        const result = await req.db.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Dress time monitoring entry not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Dress time monitoring entry updated successfully'
        });
    } catch (error) {
        console.error('Error updating dress time entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete dress time monitoring entry
app.delete('/api/dress-time/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM dress_time_monitoring WHERE id = $1 RETURNING *';
        const result = await req.db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Dress time monitoring entry not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Dress time monitoring entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting dress time entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// SERVICE SURVEY API ENDPOINTS
// ============================================

// Get all survey entries
app.get('/api/survey', async (req, res) => {
    try {
        const { district, start_date, end_date, service_type } = req.query;
        let query = 'SELECT service_survey.*, service_survey.survey_date::text AS survey_date FROM service_survey WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (start_date) {
            paramCount++;
            query += ` AND survey_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND survey_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (service_type) {
            paramCount++;
            query += ` AND service_type = $${paramCount}`;
            params.push(service_type);
        }

        query += ' ORDER BY service_survey.survey_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching survey entries:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get survey statistics
app.get('/api/survey/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query('SELECT COUNT(*) as total FROM service_survey'),
            req.db.query('SELECT AVG(overall_satisfaction) as avg_satisfaction FROM service_survey'),
            req.db.query('SELECT AVG(service_quality) as avg_quality FROM service_survey'),
            req.db.query('SELECT AVG(staff_behavior) as avg_behavior FROM service_survey'),
            req.db.query('SELECT district, COUNT(*) as count FROM service_survey GROUP BY district ORDER BY count DESC'),
            req.db.query('SELECT service_type, COUNT(*) as count FROM service_survey GROUP BY service_type ORDER BY count DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                average_satisfaction: stats[1].rows[0].avg_satisfaction,
                average_quality: stats[2].rows[0].avg_quality,
                average_behavior: stats[3].rows[0].avg_behavior,
                by_district: stats[4].rows,
                by_service_type: stats[5].rows
            }
        });
    } catch (error) {
        console.error('Error fetching survey statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create survey entry
app.post('/api/survey', async (req, res) => {
    try {
        const {
            survey_date, respondent_name, respondent_type, service_type, office_visited,
            province, district, local_level, full_address, office_2, office_3,
            good_service_office, weak_service_office, overall_satisfaction,
            service_quality, staff_behavior, timeliness, transparency, accessibility,
            recommendations, suggestions, answer_data
        } = req.body;

        const query = `
            INSERT INTO service_survey 
            (survey_date, respondent_name, respondent_type, service_type, office_visited,
             province, district, local_level, full_address, office_2, office_3,
             good_service_office, weak_service_office, overall_satisfaction,
             service_quality, staff_behavior, timeliness, transparency, accessibility,
             recommendations, suggestions, answer_data)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21, $22)
            RETURNING *
        `;

        const values = [
            survey_date, respondent_name, respondent_type, service_type, office_visited,
            province, district, local_level, full_address, office_2, office_3,
            good_service_office, weak_service_office, overall_satisfaction,
            service_quality, staff_behavior, timeliness, transparency, accessibility,
            recommendations, suggestions, JSON.stringify(answer_data || {})
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Survey entry created successfully'
        });
    } catch (error) {
        console.error('Error creating survey entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// INVESTIGATIONS API ENDPOINTS
// ============================================

// Get all investigations
app.get('/api/investigations', async (req, res) => {
    try {
        const { district, status, start_date, end_date, fiscal_year } = req.query;
        let query = 'SELECT investigations.*, investigations.investigation_date::text AS investigation_date FROM investigations WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (start_date) {
            paramCount++;
            query += ` AND investigations.investigation_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND investigations.investigation_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (fiscal_year) {
            paramCount++;
            query += ` AND fiscal_year = $${paramCount}`;
            params.push(fiscal_year);
        }

        query += ' ORDER BY investigations.investigation_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching investigations:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get investigations statistics
app.get('/api/investigations/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query('SELECT COUNT(*) as total FROM investigations'),
            req.db.query("SELECT COUNT(*) as ongoing FROM investigations WHERE status = 'ongoing'"),
            req.db.query("SELECT COUNT(*) as completed FROM investigations WHERE status = 'completed'"),
            req.db.query('SELECT district, COUNT(*) as count FROM investigations GROUP BY district ORDER BY count DESC'),
            req.db.query('SELECT fiscal_year, COUNT(*) as count FROM investigations GROUP BY fiscal_year ORDER BY fiscal_year DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                ongoing: stats[1].rows[0].ongoing,
                completed: stats[2].rows[0].completed,
                by_district: stats[3].rows,
                by_fiscal_year: stats[4].rows
            }
        });
    } catch (error) {
        console.error('Error fetching investigation statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create investigation entry
app.post('/api/investigations', async (req, res) => {
    try {
        const {
            complaint_registration_number, investigation_title, investigation_type,
            investigation_date, investigator_name, investigation_team, location,
            province, district, status, findings, recommendations,
            action_taken, completion_date, fiscal_year, registration_date,
            complainant_name, respondent_name, office, complaint_details,
            report_date, report_summary, attachment_data
        } = req.body;

        const query = `
            INSERT INTO investigations 
            (complaint_registration_number, investigation_title, investigation_type,
                 registration_date, complainant_name, respondent_name, office, complaint_details,
                 investigation_date, investigator_name, investigation_team, location,
             province, district, status, findings, recommendations,
                 action_taken, completion_date, fiscal_year, report_date, report_summary, attachment_data)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                        $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING *
        `;

        const values = [
            complaint_registration_number, investigation_title, investigation_type,
            registration_date, complainant_name, respondent_name, office, complaint_details,
            investigation_date, investigator_name, investigation_team, location,
            province, district, status || 'ongoing', findings, recommendations,
            action_taken, completion_date, fiscal_year, report_date, report_summary,
            JSON.stringify(attachment_data || [])
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Investigation created successfully'
        });
    } catch (error) {
        console.error('Error creating investigation:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================
// TECHNICAL AUDIT API ENDPOINTS
// ============================================

// Get all technical audits
app.get('/api/technical-audit', async (req, res) => {
    try {
        const { district, status, start_date, end_date, project_type } = req.query;
        let query = 'SELECT technical_audit.*, technical_audit.audit_date::text AS audit_date FROM technical_audit WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (start_date) {
            paramCount++;
            query += ` AND technical_audit.audit_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND technical_audit.audit_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (project_type) {
            paramCount++;
            query += ` AND project_type = $${paramCount}`;
            params.push(project_type);
        }

        query += ' ORDER BY technical_audit.audit_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching technical audits:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get technical audit statistics
app.get('/api/technical-audit/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query('SELECT COUNT(*) as total FROM technical_audit'),
            req.db.query("SELECT COUNT(*) as in_progress FROM technical_audit WHERE status = 'in_progress'"),
            req.db.query("SELECT COUNT(*) as completed FROM technical_audit WHERE status = 'completed'"),
            req.db.query('SELECT AVG(technical_quality_score) as avg_quality FROM technical_audit'),
            req.db.query('SELECT AVG(progress_percentage) as avg_progress FROM technical_audit'),
            req.db.query('SELECT district, COUNT(*) as count FROM technical_audit GROUP BY district ORDER BY count DESC'),
            req.db.query('SELECT project_type, COUNT(*) as count FROM technical_audit GROUP BY project_type ORDER BY count DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                in_progress: stats[1].rows[0].in_progress,
                completed: stats[2].rows[0].completed,
                average_quality: stats[3].rows[0].avg_quality,
                average_progress: stats[4].rows[0].avg_progress,
                by_district: stats[5].rows,
                by_project_type: stats[6].rows
            }
        });
    } catch (error) {
        console.error('Error fetching technical audit statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create technical audit entry
app.post('/api/technical-audit', async (req, res) => {
    try {
        const {
            project_name, project_id, audit_date, audit_team, project_location,
            related_agency, ncr, disposal_date, disposal_info_date, remarks, attachment_data,
            province, district, project_type, technical_quality_score,
            safety_compliance_score, progress_percentage, budget_status,
            technical_findings, recommendations, status
        } = req.body;
        const normalizedAuditDate = String(audit_date || '')
            .replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit))
            .replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, (_, year, month, day) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);

        const query = `
            INSERT INTO technical_audit 
            (project_name, related_agency, ncr, disposal_date, disposal_info_date, remarks, attachment_data,
             project_id, audit_date, audit_team, project_location,
             province, district, project_type, technical_quality_score,
             safety_compliance_score, progress_percentage, budget_status,
             technical_findings, recommendations, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21)
            RETURNING *
        `;

        const values = [
            project_name, related_agency, ncr, disposal_date, disposal_info_date, remarks,
            JSON.stringify(attachment_data || []), project_id, normalizedAuditDate, audit_team, project_location,
            province, district, project_type, technical_quality_score,
            safety_compliance_score, progress_percentage, budget_status,
            technical_findings, recommendations, status || 'in_progress'
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Technical audit created successfully'
        });
    } catch (error) {
        console.error('Error creating technical audit:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update technical audit entry
app.put('/api/technical-audit/:id', async (req, res) => {
    try {
        const {
            project_name, project_id, audit_date, audit_team, project_location,
            related_agency, ncr, disposal_date, disposal_info_date, remarks, attachment_data,
            province, district, project_type, technical_quality_score,
            safety_compliance_score, progress_percentage, budget_status,
            technical_findings, recommendations, status
        } = req.body;
        const normalizedAuditDate = String(audit_date || '')
            .replace(/[०१२३४५६७८९]/g, digit => '०१२३४५६७८९'.indexOf(digit))
            .replace(/^(\d{4})-(\d{1,2})-(\d{1,2})$/, (_, year, month, day) => `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);

        const query = `
            UPDATE technical_audit SET
                project_name = $1, related_agency = $2, ncr = $3, disposal_date = $4,
                disposal_info_date = $5, remarks = $6, attachment_data = $7, project_id = $8,
                audit_date = $9, audit_team = $10, project_location = $11, province = $12,
                district = $13, project_type = $14, technical_quality_score = $15,
                safety_compliance_score = $16, progress_percentage = $17, budget_status = $18,
                technical_findings = $19, recommendations = $20, status = $21,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $22
            RETURNING *
        `;
        const values = [
            project_name, related_agency, ncr, disposal_date, disposal_info_date, remarks,
            JSON.stringify(attachment_data || []), project_id, normalizedAuditDate, audit_team,
            project_location, province, district, project_type, technical_quality_score,
            safety_compliance_score, progress_percentage, budget_status, technical_findings,
            recommendations, status || 'in_progress', req.params.id
        ];
        const result = await req.db.query(query, values);
        if (!result.rowCount) return res.status(404).json({ success: false, error: 'Technical audit not found' });
        res.json({ success: true, data: result.rows[0], message: 'Technical audit updated successfully' });
    } catch (error) {
        console.error('Error updating technical audit:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PROJECT MONITORING API ENDPOINTS
// ============================================

// Get all project monitoring entries
app.get('/api/project-monitoring', async (req, res) => {
    try {
        const { district, status, start_date, end_date, project_sector } = req.query;
        let query = 'SELECT * FROM project_monitoring WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (start_date) {
            paramCount++;
            query += ` AND monitoring_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND monitoring_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (project_sector) {
            paramCount++;
            query += ` AND project_sector = $${paramCount}`;
            params.push(project_sector);
        }

        query += ' ORDER BY monitoring_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching project monitoring entries:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get project monitoring statistics
app.get('/api/project-monitoring/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query(`
                SELECT COUNT(*) AS total,
                       COALESCE(SUM(budget_allocated), 0) AS total_budget_allocated,
                       COALESCE(SUM(budget_spent), 0) AS total_budget_spent,
                      COALESCE(AVG(progress_percentage), 0) AS average_progress,
                      COUNT(*) FILTER (WHERE NULLIF(BTRIM(issues_identified), '') IS NOT NULL) AS issues_count,
                      COUNT(*) FILTER (WHERE progress_percentage < 50.00) AS risk_count
                FROM project_monitoring
            `),
            req.db.query("SELECT COUNT(*) as ongoing FROM project_monitoring WHERE status = 'ongoing'"),
            req.db.query("SELECT COUNT(*) as completed FROM project_monitoring WHERE status = 'completed'"),
            req.db.query('SELECT AVG(quality_score) as avg_quality FROM project_monitoring'),
            req.db.query('SELECT district, COUNT(*) as count FROM project_monitoring GROUP BY district ORDER BY count DESC'),
            req.db.query('SELECT project_sector, COUNT(*) as count FROM project_monitoring GROUP BY project_sector ORDER BY count DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                total_budget_allocated: stats[0].rows[0].total_budget_allocated,
                total_budget_spent: stats[0].rows[0].total_budget_spent,
                issues_count: stats[0].rows[0].issues_count,
                risk_count: stats[0].rows[0].risk_count,
                ongoing: stats[1].rows[0].ongoing,
                completed: stats[2].rows[0].completed,
                average_quality: stats[3].rows[0].avg_quality,
                average_progress: stats[0].rows[0].average_progress,
                by_district: stats[4].rows,
                by_project_sector: stats[5].rows
            }
        });
    } catch (error) {
        console.error('Error fetching project monitoring statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create project monitoring entry
app.post('/api/project-monitoring', async (req, res) => {
    try {
        const {
            project_name, project_code, monitoring_date, monitoring_team, project_location,
            province, district, project_sector, project_type, budget_allocated,
            budget_spent, progress_percentage, quality_score, timeline_status,
            issues_identified, team_members, monitoring_findings, recommendations, status,
            attachment_data, form_data
        } = req.body;

        const query = `
            INSERT INTO project_monitoring 
            (project_name, project_code, monitoring_date, monitoring_team, project_location,
             province, district, project_sector, project_type, budget_allocated,
             budget_spent, progress_percentage, quality_score, timeline_status,
             issues_identified, team_members, monitoring_findings, recommendations, status, attachment_data, form_data)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING *
        `;

        const values = [
            project_name, project_code, monitoring_date, monitoring_team, project_location,
            province, district, project_sector, project_type, budget_allocated,
            budget_spent, progress_percentage, quality_score, timeline_status,
            issues_identified, JSON.stringify(team_members), monitoring_findings, recommendations, status || 'ongoing',
            JSON.stringify(req.body.attachment_data || []), JSON.stringify(req.body.form_data || {})
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Project monitoring entry created successfully'
        });
    } catch (error) {
        console.error('Error creating project monitoring entry:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.put('/api/project-monitoring/:id', async (req, res) => {
    try {
        const fields = ['project_name', 'project_code', 'monitoring_date', 'monitoring_team', 'project_location', 'province', 'district', 'project_sector', 'project_type', 'budget_allocated', 'budget_spent', 'progress_percentage', 'quality_score', 'timeline_status', 'issues_identified', 'team_members', 'monitoring_findings', 'recommendations', 'status', 'attachment_data', 'form_data'];
        const values = fields.map(field => field === 'team_members' || field === 'attachment_data' || field === 'form_data' ? JSON.stringify(req.body[field] || (field === 'team_members' ? [] : {})) : req.body[field]);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const result = await req.db.query(`UPDATE project_monitoring SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, [...values, req.params.id]);
        if (!result.rowCount) return res.status(404).json({ success: false, error: 'Project monitoring record not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating project monitoring entry:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/project-monitoring/:id', async (req, res) => {
    try {
        const result = await req.db.query('DELETE FROM project_monitoring WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ success: false, error: 'Project monitoring record not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error deleting project monitoring entry:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// CALENDAR EVENTS API ENDPOINTS
// ============================================

app.get('/api/calendar-events', async (req, res) => {
    try {
        const result = await req.db.query(`
            SELECT id, event_date::text AS date, TO_CHAR(event_time, 'HH24:MI') AS time, title
            FROM calendar_events
            ORDER BY event_date, event_time, id
        `);
        res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/calendar-events', async (req, res) => {
    try {
        const { date, time, title } = req.body;
        const result = await req.db.query(`
            INSERT INTO calendar_events (event_date, event_time, title)
            VALUES ($1, $2, $3)
            RETURNING id, event_date::text AS date, TO_CHAR(event_time, 'HH24:MI') AS time, title
        `, [date, time, title]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/calendar-events/:id', async (req, res) => {
    try {
        const { date, time, title } = req.body;
        const result = await req.db.query(`
            UPDATE calendar_events
            SET event_date = $1, event_time = $2, title = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, event_date::text AS date, TO_CHAR(event_time, 'HH24:MI') AS time, title
        `, [date, time, title, req.params.id]);
        if (!result.rowCount) return res.status(404).json({ success: false, error: 'Calendar event not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating calendar event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/calendar-events/:id', async (req, res) => {
    try {
        const result = await req.db.query('DELETE FROM calendar_events WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rowCount) return res.status(404).json({ success: false, error: 'Calendar event not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error deleting calendar event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// PROMOTIONAL PROGRAMS API ENDPOINTS
// ============================================

// Helper function to determine quarter from Nepali date
function getQuarterFromNepaliDate(nepaliDate) {
    if (!nepaliDate) return null;
    
    // Nepal fiscal year: साउन १ to असार
    // Format: YYYY/MM/DD (Nepali digits converted to English)
    const dateParts = String(nepaliDate).replace(/[०१२३४५६७८९]/g, d => '०१२३४५६७८९'.indexOf(d)).split('/');
    if (dateParts.length < 2) return null;
    
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[0], 10);
    
    if (isNaN(month) || isNaN(year)) return null;
    
    // Nepal months: 1=बैशाख, 2=जेठ, 3=असार, 4=साउन, 5=भदौ, 6=असोज, 7=कार्तिक, 8=मंसिर, 9=पौष, 10=माघ, 11=फाल्गुन, 12=चैत
    
    // As per user specification:
    // Quarter 1: साउन १ गते देखि असोज महिनासम्म (months 4-6)
    // Quarter 2: कार्तिक १ गते देखि पुस महिनासम्म (months 7-9)
    // Quarter 3: माघ १ गते देखि चैत सम्म (months 10-12)
    // Quarter 4: बैशाख १ गते देखि असार सम्म (months 1-3)
    
    if (month >= 1 && month <= 3) return 4; // बैशाख to असार
    if (month >= 4 && month <= 6) return 1; // साउन to असोज
    if (month >= 7 && month <= 9) return 2; // कार्तिक to पुस
    if (month >= 10 && month <= 12) return 3; // माघ to चैत
    
    return 1; // Default fallback
}

function getQuarterFromProposedQuarter(proposedQuarter, nepaliDate) {
    const quarterMap = { पहिलो: 1, दोस्रो: 2, तेस्रो: 3, चौथो: 4 };
    const quarter = quarterMap[proposedQuarter] || parseInt(proposedQuarter, 10);
    return quarter >= 1 && quarter <= 4 ? quarter : getQuarterFromNepaliDate(nepaliDate);
}

// Helper function to get fiscal year from Nepali date
function getFiscalYearFromNepaliDate(nepaliDate) {
    if (!nepaliDate) return null;
    
    const dateParts = String(nepaliDate).replace(/[०१२३४५६७८९]/g, d => '०१२३४५६७८९'.indexOf(d)).split('/');
    if (dateParts.length < 2) return null;
    
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    
    if (isNaN(year) || isNaN(month)) return null;
    
    // Fiscal year starts in साउन (month 4)
    // If month is 4 or later (Quarters 1, 2, 3), fiscal year is current year
    // If month is 1-3 (Quarter 4), fiscal year is previous year
    if (month >= 4) {
        return `${year}/${year + 1}`;
    } else {
        return `${year - 1}/${year}`;
    }
}

// Get all promotional programs
app.get('/api/promotional-programs', async (req, res) => {
    try {
        const { status, quarter, fiscal_year, start_date, end_date, district } = req.query;
        let query = 'SELECT pp.*, pp.program_date::text AS program_date FROM promotional_programs pp WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (quarter) {
            paramCount++;
            query += ` AND quarter = $${paramCount}`;
            params.push(parseInt(quarter));
        }

        if (fiscal_year) {
            paramCount++;
            query += ` AND fiscal_year = $${paramCount}`;
            params.push(fiscal_year);
        }

        if (start_date) {
            paramCount++;
            query += ` AND program_date >= $${paramCount}`;
            params.push(start_date);
        }

        if (end_date) {
            paramCount++;
            query += ` AND program_date <= $${paramCount}`;
            params.push(end_date);
        }

        if (district) {
            paramCount++;
            query += ` AND district = $${paramCount}`;
            params.push(district);
        }

        query += ' ORDER BY pp.program_date DESC';

        const result = await req.db.query(query, params);
        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching promotional programs:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get promotional program statistics
app.get('/api/promotional-programs/statistics', async (req, res) => {
    try {
        const stats = await Promise.all([
            req.db.query('SELECT COUNT(*) as total FROM promotional_programs'),
            req.db.query("SELECT COUNT(*) as upcoming FROM promotional_programs WHERE status = 'upcoming'"),
            req.db.query("SELECT COUNT(*) as ongoing FROM promotional_programs WHERE status = 'ongoing'"),
            req.db.query("SELECT COUNT(*) as done FROM promotional_programs WHERE status = 'done'"),
            req.db.query('SELECT SUM(expected_participants) as total_expected FROM promotional_programs'),
            req.db.query('SELECT SUM(actual_participants) as total_actual FROM promotional_programs'),
            req.db.query('SELECT quarter, COUNT(*) as count FROM promotional_programs GROUP BY quarter ORDER BY quarter'),
            req.db.query('SELECT fiscal_year, COUNT(*) as count FROM promotional_programs GROUP BY fiscal_year ORDER BY fiscal_year DESC'),
            req.db.query('SELECT district, COUNT(*) as count FROM promotional_programs GROUP BY district ORDER BY count DESC')
        ]);

        res.json({
            success: true,
            data: {
                total: stats[0].rows[0].total,
                upcoming: stats[1].rows[0].upcoming,
                ongoing: stats[2].rows[0].ongoing,
                done: stats[3].rows[0].done,
                total_expected_participants: stats[4].rows[0].total_expected || 0,
                total_actual_participants: stats[5].rows[0].total_actual || 0,
                by_quarter: stats[6].rows,
                by_fiscal_year: stats[7].rows,
                by_district: stats[8].rows
            }
        });
    } catch (error) {
        console.error('Error fetching promotional programs statistics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create new promotional program
app.post('/api/promotional-programs', async (req, res) => {
    try {
        const {
            program_name, program_date, nepali_date, province, district, local_level,
            target_group, expected_participants, actual_participants, status,
            program_category, description, proposed_quarter
        } = req.body;

        const quarter = getQuarterFromProposedQuarter(proposed_quarter, nepali_date);
        const fiscal_year = getFiscalYearFromNepaliDate(nepali_date);

        const query = `
            INSERT INTO promotional_programs 
            (program_name, program_date, nepali_date, province, district, local_level,
             target_group, expected_participants, actual_participants, status,
             program_category, description, quarter, fiscal_year)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;

        const values = [
            program_name, program_date, nepali_date, province, district, local_level,
            target_group, expected_participants ? parseInt(expected_participants) : null,
            actual_participants ? parseInt(actual_participants) : null, status,
            program_category, description, quarter, fiscal_year
        ];

        const result = await req.db.query(query, values);
        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Promotional program created successfully'
        });
    } catch (error) {
        console.error('Error creating promotional program:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Update promotional program
app.put('/api/promotional-programs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            program_name, program_date, nepali_date, province, district, local_level,
            target_group, expected_participants, actual_participants, status,
            program_category, description, proposed_quarter
        } = req.body;

        const quarter = getQuarterFromProposedQuarter(proposed_quarter, nepali_date);
        const fiscal_year = getFiscalYearFromNepaliDate(nepali_date);

        const query = `
            UPDATE promotional_programs 
            SET program_name = $1, program_date = $2, nepali_date = $3, province = $4, 
                district = $5, local_level = $6, target_group = $7, expected_participants = $8,
                actual_participants = $9, status = $10, program_category = $11, description = $12,
                quarter = $13, fiscal_year = $14, updated_at = CURRENT_TIMESTAMP
            WHERE id = $15
            RETURNING *
        `;

        const values = [
            program_name, program_date, nepali_date, province, district, local_level,
            target_group, expected_participants ? parseInt(expected_participants) : null,
            actual_participants ? parseInt(actual_participants) : null, status,
            program_category, description, quarter, fiscal_year, id
        ];

        const result = await req.db.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Promotional program not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Promotional program updated successfully'
        });
    } catch (error) {
        console.error('Error updating promotional program:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete promotional program
app.delete('/api/promotional-programs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query('DELETE FROM promotional_programs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Promotional program not found'
            });
        }

        res.json({
            success: true,
            message: 'Promotional program deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting promotional program:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Upload photos for a promotional program
app.post('/api/promotional-programs/:id/photos', async (req, res) => {
    try {
        const { id } = req.params;
        const { photos } = req.body; // photos should be an array of objects with photo_data and photo_name

        if (!photos || !Array.isArray(photos) || photos.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No photos provided'
            });
        }

        // Insert photos one by one to avoid complex parameter mapping
        const insertedPhotos = [];
        for (const photo of photos) {
            const query = `
                INSERT INTO promotional_program_photos (program_id, photo_data, photo_name)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await req.db.query(query, [id, photo.photo_data, photo.photo_name || null]);
            insertedPhotos.push(result.rows[0]);
        }

        res.status(201).json({
            success: true,
            data: insertedPhotos,
            message: 'Photos uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get photos for a promotional program
app.get('/api/promotional-programs/:id/photos', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query(
            'SELECT * FROM promotional_program_photos WHERE program_id = $1 ORDER BY upload_date DESC',
            [id]
        );

        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Delete a photo
app.delete('/api/promotional-program-photos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await req.db.query('DELETE FROM promotional_program_photos WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Photo not found'
            });
        }

        res.json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Annual program / annual work plan CRUD
app.get('/api/annual-programs', async (req, res) => {
    try {
        const fiscalYear = req.query.fiscal_year || '2083/84';
        const result = await req.db.query(`
            SELECT id, serial_number AS sn, activity_number AS act,
                   expenditure_head AS head, program AS prog, activity,
                   budget, lead_department AS lead,
                   supporting_department AS support, annual_target AS target,
                   months, fiscal_year
            FROM annual_programs
            WHERE fiscal_year = $1
            ORDER BY serial_number, id
        `, [fiscalYear]);
        res.json({ success: true, data: result.rows, count: result.rowCount });
    } catch (error) {
        console.error('Error fetching annual programs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/annual-programs', async (req, res) => {
    try {
        const item = req.body;
        const fiscalYear = item.fiscal_year || '2083/84';
        const result = await req.db.query(`
            INSERT INTO annual_programs
            (fiscal_year, serial_number, activity_number, expenditure_head, program,
             activity, budget, lead_department, supporting_department, annual_target, months)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, serial_number AS sn, activity_number AS act,
                      expenditure_head AS head, program AS prog, activity,
                      budget, lead_department AS lead, supporting_department AS support,
                      annual_target AS target, months, fiscal_year
        `, [
            fiscalYear, Number(item.sn), item.act || '', item.head || '', item.prog,
            item.activity || '', Number(item.budget || 0), item.lead || '',
            item.support || '', Number(item.target || 0), JSON.stringify(item.months || [])
        ]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating annual program:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/annual-programs/:id', async (req, res) => {
    try {
        const item = req.body;
        const result = await req.db.query(`
            UPDATE annual_programs
            SET serial_number = $1, activity_number = $2, expenditure_head = $3,
                program = $4, activity = $5, budget = $6, lead_department = $7,
                supporting_department = $8, annual_target = $9, months = $10,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $11
            RETURNING id, serial_number AS sn, activity_number AS act,
                      expenditure_head AS head, program AS prog, activity,
                      budget, lead_department AS lead, supporting_department AS support,
                      annual_target AS target, months, fiscal_year
        `, [
            Number(item.sn), item.act || '', item.head || '', item.prog, item.activity || '',
            Number(item.budget || 0), item.lead || '', item.support || '',
            Number(item.target || 0), JSON.stringify(item.months || []), req.params.id
        ]);
        if (!result.rows.length) return res.status(404).json({ success: false, error: 'Annual program not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error updating annual program:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/annual-programs/:id', async (req, res) => {
    try {
        const result = await req.db.query('DELETE FROM annual_programs WHERE id = $1 RETURNING id', [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ success: false, error: 'Annual program not found' });
        res.json({ success: true, message: 'Annual program deleted successfully' });
    } catch (error) {
        console.error('Error deleting annual program:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Risk Map Dashboard API Server running on port ${PORT}`);
    console.log(`Server is listening on all network interfaces (Test Mode)`);
    console.log(`Environment: ${process.env.NODE_ENV || 'test'}`);
    console.log(`Database: ${process.env.DB_NAME || 'dashboard'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
    });
});

module.exports = app;