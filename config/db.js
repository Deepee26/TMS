const pgpInit = require('pg-promise')
require('dotenv').config();


const pgp = pgpInit();


const db = pgp({
    host: 'localhost',
    port: 5432, //default postgresSQL port
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: {
        rejectUnauthorized: false //use this only if you are sure about the security of your
    },
})


module.exports = db;
