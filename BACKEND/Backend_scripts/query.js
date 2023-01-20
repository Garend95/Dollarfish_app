const mysql = require('mysql')

require('dotenv').config({ path: '/home/gdanag/Documents/Sourcemind/Dollarfish_app/BACKEND/Backend_scripts/.env' })

const { HOST, CURRENT_USER ,PASSWORD, DATABASE } = process.env;

const connection = mysql.createConnection({
    host: HOST,
    user: CURRENT_USER,
    password: PASSWORD,
    database: DATABASE, 
    multipleStatements: true
});

module.exports = connection;