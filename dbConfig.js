// bring the enviroment variables
require('dotenv').config();

const { Pool } = require('pg');

const isProducttion = process.env.NODE_ENV === 'production';

const connectionStr = 'postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.send.DB_PORT}/${process.env.DB_DATABASE}';

const connectionCredentials = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

const pool = new Pool(connectionCredentials);

module.exports = pool;
