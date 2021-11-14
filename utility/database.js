const mysql = require('mysql2')
require('dotenv').config();

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = {
    query: conn.query,
    execute: conn.execute,
    run: async (query) => {
        try {
            const result = await conn.promise().query(query);
            console.log(result);
            return result;
        } catch (e) {
            console.error(query);
            throw e;
        }
    },
    // init: async () => {
    //     const conn = await pool.getConnection();
    //     console.log(conn);
    //     await conn.query({
    //         sql: 'CREATE DATABASE `mosaic-api`;'
    //     })
    // }
}
