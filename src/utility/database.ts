import dotenv from 'dotenv';
import {Sequelize} from 'sequelize-typescript';

dotenv.config();
const { DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB_NAME} = process.env;

const sequelize = new Sequelize({
    host: DB_HOST,
    database: DB_NAME,
    port: parseInt(DB_PORT, 10),
    dialect: "mysql",
    username: DB_USER,
    password: DB_PASSWORD,
    models: [__dirname + '/models'],
});

const db = {
    Sequelize,
    sequelize,
};

export default db;