require('dotenv').config();

console.log('=== Environment Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '[SET]' : '[NOT SET]');
console.log('PORT:', process.env.PORT);

console.log('\n=== Connection Test ===');

// Test local PostgreSQL connection
const testLocalConnection = async () => {
    try {
        const { Client } = require('pg');
        const client = new Client({
            host: 'localhost',
            port: 5432,
            database: 'task_management_db',
            user: 'macbookair',
            password: ''
        });
        
        await client.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✅ Local PostgreSQL connection successful:', result.rows[0].now);
        await client.end();
        return true;
    } catch (error) {
        console.log('❌ Local PostgreSQL connection failed:', error.message);
        return false;
    }
};

// Test environment-based connection
const testEnvConnection = async () => {
    try {
        const { Client } = require('pg');
        const client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: 5432,
            database: process.env.DB_NAME || 'task_management_db',
            user: process.env.DB_USER || 'macbookair',
            password: process.env.DB_PASS || '',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        await client.connect();
        const result = await client.query('SELECT NOW()');
        console.log('✅ Environment-based connection successful:', result.rows[0].now);
        await client.end();
        return true;
    } catch (error) {
        console.log('❌ Environment-based connection failed:', error.message);
        return false;
    }
};

const runTests = async () => {
    console.log('\n--- Testing Local Connection ---');
    await testLocalConnection();
    
    console.log('\n--- Testing Environment Connection ---');
    await testEnvConnection();
    
    console.log('\n=== Recommendations ===');
    
    if (process.env.NODE_ENV === 'production') {
        console.log('🔧 For Render deployment:');
        console.log('1. Make sure you have a PostgreSQL database created in Render');
        console.log('2. Set all database environment variables in Render dashboard');
        console.log('3. Ensure SSL is properly configured');
    } else {
        console.log('🔧 For local development:');
        console.log('1. Start PostgreSQL: brew services start postgresql@14');
        console.log('2. Create database: createdb task_management_db');
        console.log('3. Run: npm run dev');
    }
};

runTests().catch(console.error); 