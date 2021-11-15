const mysql = require('mysql2')
require('dotenv').config();

const pool = mysql.createPoolPromise({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = {
    query: pool.query,
    execute: pool.execute,
    run: async (query) => {
        const conn = await pool.getConnection();
        try {
            const [result] = await conn.query(query);
            await conn.destroy();
            return result;
        } catch (e) {
            await conn.destroy();
            console.error(query);
        }
    },
}
