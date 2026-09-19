const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Read schema file
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Create connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default database first
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

async function initializeDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('Connected to PostgreSQL...');
        
        // Check if database exists
        const dbCheckResult = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'dashboard'"
        );
        
        if (dbCheckResult.rows.length === 0) {
            console.log('Creating database "dashboard"...');
            await client.query('CREATE DATABASE dashboard');
            console.log('Database "dashboard" created successfully.');
        } else {
            console.log('Database "dashboard" already exists.');
        }
        
        // Close connection to postgres and connect to dashboard
        await client.release();
        
        // Connect to the dashboard database
        const dashboardPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: 'dashboard',
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
        });
        
        const dashboardClient = await dashboardPool.connect();
        
        try {
            console.log('Connected to dashboard database...');
            
            // Execute schema
            console.log('Executing schema...');
            await dashboardClient.query(schema);
            console.log('Schema executed successfully.');
            
            console.log('Database initialization completed successfully!');
            
        } finally {
            dashboardClient.release();
            await dashboardPool.end();
        }
        
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        // Only end the main pool if it hasn't been ended yet
        if (pool.totalCount > 0) {
            await pool.end();
        }
    }
}

// Run initialization
initializeDatabase();