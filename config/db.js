const pgpInit = require('pg-promise')
require('dotenv').config();

const pgp = pgpInit();

const db = pgp({
    host: process.env.DB_HOST || 'localhost',
    port: 5432, //default postgresSQL port
    database: process.env.DB_NAME || 'task_management_db',
    user: process.env.DB_USER || 'macbookair',
    password: process.env.DB_PASS || '',
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
})

module.exports = db;
