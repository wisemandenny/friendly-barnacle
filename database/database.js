require('dotenv').config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const Sequelize = require('sequelize');
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
};
db.DSF = require('./DSF.model')(sequelize, Sequelize);
db.Project = require('./Project.model')(sequelize, Sequelize);
module.exports = db;
