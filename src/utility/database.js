
require('dotenv').config();
const Sequelize = require('sequelize');
const mysql = require('mysql2');
const { DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB_NAME, TEST_DB_NAME, NODE_ENV } = process.env;
const databaseName = NODE_ENV === 'test' ? TEST_DB_NAME : DB_NAME;
const initialize = async () => {
    console.log('connecting to init test db');
    const connection = mysql.createConnection({host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD});
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`)
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
        max: 5,
        min: 0,
        aquire: 30000,
        idle: 10000,
    }});


const db = {
    Sequelize,
    sequelize,
    initialize
};
db.DSF = require('../models/DSF.model')(sequelize, Sequelize);
db.Project = require('../models/Project.model')(sequelize, Sequelize);
module.exports = db;
