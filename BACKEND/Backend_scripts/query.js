const mysql = require('mysql')
const insertionCallback = require('./insertMethods')
const fs = require('fs')

require('dotenv').config({ path: '/home/gdanag/Documents/Sourcemind/Dollarfish_app/BACKEND/Backend_scripts/.env' })
const { HOST, CURRENT_USER, PASSWORD, DATABASE } = process.env;

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: HOST,
            user: CURRENT_USER,
            password: PASSWORD,
            database: DATABASE,
            multipleStatements: true
        });

        this.user_data = require('../data/user.json');
        this.card_data = require('../data/credit_card.json');
        this.subscription_data = require('../data/subscription.json')
        this.payment_data = require('../data/Payment.json');
        this.logo_data = require('../data/logo_data.json');
        this.category_data = require('../data/category_data.json'); 
    
        this.fillData = this.fillData.bind(this)
    }

    fillData(myDataName, callbackName) {
        const myData = this[myDataName]
        let myCallback = insertionCallback(callbackName)
        myCallback = myCallback.bind(this)
        
        for(let i = 0; i < myData.length; i++) {
            try {
                myCallback(myData[i])
            } catch (error) {
                console.warn("insertion problem detected")
            }
        }
    }

    selectSchema() {
        this.connection.query(`USE ${DATABASE}`)
    }

    dropTables(tableNames) {
        for(let i = 0; i < tableNames.length; i++)
            this.connection.query(`DROP TABLE IF EXISTS ${tableNames[i]};`)
    }

    createSchemaTables() {
        let tableCreateQuery = fs.readFileSync('/home/gdanag/Documents/Sourcemind/Dollarfish_app/BACKEND/data/Dollarfish_model.sql').toString();
        this.connection.query(tableCreateQuery)
    }
}

let mydb = new Database;
module.exports = mydb;