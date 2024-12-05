const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();


const dbUrl = process.env.DB_URL;

const pool = mysql.createPool(dbUrl);

module.exports = pool.promise();

