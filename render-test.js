// Test script for Render deployment
require('dotenv').config();

console.log('=== Render Deployment Test ===');
console.log('Testing environment variables and database connection...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('PORT:', process.env.PORT || 'undefined');
console.log('DB_HOST:', process.env.DB_HOST || 'undefined');
console.log('DB_NAME:', process.env.DB_NAME || 'undefined');
console.log('DB_USER:', process.env.DB_USER || 'undefined');
console.log('DB_PASS:', process.env.DB_PASS ? '[SET]' : '[NOT SET]');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '[SET]' : '[NOT SET]');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[SET]' : '[NOT SET]');
console.log('BASE_URL:', process.env.BASE_URL || 'undefined');

console.log('\n=== Database Connection Test ===');

// Test database connection
const testDatabaseConnection = async () => {
    try {
        const { Client } = require('pg');
        
        const config = {
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        };
        
        console.log('Attempting to connect with config:');
        console.log('- Host:', config.host);
        console.log('- Database:', config.database);
        console.log('- User:', config.user);
        console.log('- SSL:', config.ssl ? 'enabled' : 'disabled');
        
        const client = new Client(config);
        await client.connect();
        
        const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
        console.log('✅ Database connection successful!');
        console.log('- Current time:', result.rows[0].current_time);
        console.log('- PostgreSQL version:', result.rows[0].pg_version.split(' ')[0]);
        
        // Test if tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        console.log('\n📋 Available tables:');
        if (tablesResult.rows.length === 0) {
            console.log('- No tables found (this is normal for new database)');
        } else {
            tablesResult.rows.forEach(row => {
                console.log('-', row.table_name);
            });
        }
        
        await client.end();
        return true;
        
    } catch (error) {
        console.log('❌ Database connection failed:');
        console.log('- Error:', error.message);
        console.log('- Code:', error.code);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n🔧 Troubleshooting for ECONNREFUSED:');
            console.log('1. Check if DB_HOST is set correctly (should NOT be localhost)');
            console.log('2. Verify database is created in Render');
            console.log('3. Ensure environment variables are set in Render dashboard');
            console.log('4. Check if database service is running');
        }
        
        return false;
    }
};

// Run the test
const runTest = async () => {
    const success = await testDatabaseConnection();
    
    console.log('\n=== Summary ===');
    if (success) {
        console.log('✅ All tests passed! Your database connection is working.');
        console.log('🚀 Your application should deploy successfully on Render.');
    } else {
        console.log('❌ Database connection failed. Please check the troubleshooting steps above.');
        console.log('📖 See RENDER_SETUP.md for detailed setup instructions.');
    }
    
    process.exit(success ? 0 : 1);
};

runTest().catch(console.error); 