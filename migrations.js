const mysql = require('mysql2');
const migration = require('mysql-migrations');
require('dotenv').config();

console.log(process.env.DB_HOST);
const connection = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

migration.init(connection, __dirname + '/migrations');