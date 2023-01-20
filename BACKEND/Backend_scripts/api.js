let express = require('express');
let bcrypt = require('bcrypt');
let body_parser = require('body-parser');
let jwt = require('jsonwebtoken');
let mysql = require('mysql');
let cors = require('cors');
let app = express();
let fs = require('fs');

require('dotenv').config({ path: '/home/gdanag/Documents/Sourcemind/Dollarfish_app/BACKEND/Backend_scripts/.env'});
console.log(__dirname, '.env')

let user_data = require('../data/user.json');
let card_data = require('../data/credit_card.json');
let subscription_data = require('../data/subscription.json')
let payment_data = require('../data/Payment.json');
let logo_data = require('../data/logo_data.json');
let category_data = require('../data/category_data.json');


const tableCreateQuery = fs.readFileSync('/home/gdanag/Documents/Sourcemind/Dollarfish_app/BACKEND/data/Dollarfish_model.sql').toString();

//console.log(userForeignKeyQuery)

const { HOST, CURRENT_USER ,PASSWORD, DATABASE } = process.env 

const connection = mysql.createConnection({
    host: HOST,
    user: CURRENT_USER,
    password: PASSWORD,
    database: DATABASE, 
    multipleStatements: true
});

//https://stackoverflow.com/questions/32715273/node-mysql-throwing-connection-timeout
connection.query(`USE ${DATABASE}`)
connection.query('DROP TABLE IF EXISTS logos;')
connection.query('DROP TABLE IF EXISTS Payment;')
connection.query('DROP TABLE IF EXISTS Category;')
connection.query('DROP TABLE IF EXISTS subscription;')
connection.query('DROP TABLE IF EXISTS credit_card;')
connection.query('DROP TABLE IF EXISTS user;')

connection.query(tableCreateQuery);

const fillUserData = function(data) {
   
    // connection.query('ALTER TABLE user DROP FOREIGN KEY')
    let insertCommand = `INSERT INTO user (
        first_name,
        last_name,
        user_id,
        email,
        password)\
        VALUES (
            "${data.first_name}",
            "${data.last_name}", 
            ${data.user_id}, 
            "${data.email}",
            "${data.password}"
            );`

    connection.query(insertCommand);
}

const fillCategoryData = function(data) {
    let insertCommand = `INSERT INTO Category (
        sub_id,
        first_category,
        second_category,
        third_category)\
        VALUES (
            ${data.sub_id},
            "${data.first_category}",
            "${data.second_category}",
            "${data.third_category}"
            );`

    connection.query(insertCommand);
}

const fillPaymentData = function(data) {
    let insertCommand = `INSERT INTO Payment (
        payment_id,
        subscription_id,
        receipt_id,payment_date, 
        payment_amount)\
        VALUES (
            ${data.payment_id}, 
            ${data.subscription_id}, 
            ${data.receipt_id}, 
            "${data.payment_date}", 
            ${data.payment_amount})`; 

    connection.query(insertCommand);
}

const fillSubscriptionData = function(data) {
    let insertCommand = `INSERT INTO subscription (
        subscription_id, 
        card_id, 
        subscription_name, 
        autopay_plan_name, 
        autopay_type, 
        next_billing_date, 
        amount_to_pay, 
        logo_id, 
        sub_category_id, 
        sub_pay_id)
        VALUES ( 
            ${data.subscription_id}, 
            ${data.card_id},
            "${data.subscription_name}",
            "${data.autopay_plan_name}",
            "${data.autopay_type}", 
            "${data.next_billing_date}", 
            ${data.amount_to_pay}, 
            ${data.logo_id}, 
            ${data.sub_category_id},
            ${data.sub_pay_id}
            );`

    connection.query(insertCommand)
}

const fillLogoData = function(data) {
    let insertCommand = `INSERT INTO logos (
        subscription_id, 
        subscription_logo) \
        VALUES (
            ${data.subscription_id}, 
            "${data.subscription_logo}")`

    connection.query(insertCommand);
}

const fillCreditCardData = function(data) {
    let insertCommand = `INSERT INTO credit_card (
        card_id,
        card_brand,
        card_issuer,
        credit_limit,
        expiration_date,
        user_id)\
    VALUES (
        ${data.card_id},
        "${data.card_brand}",
        "${data.card_issuer}",
        ${data.credit_limit},
        "${data.expiration_date}", 
        ${data.user_id}
        )`

    connection.query(insertCommand);
}

let fillData = function(data, fillingFunction) {
    for(let i = 0; i < data.length; i++)
        fillingFunction(data[i]);
}


fillData(user_data, fillUserData);
fillData(card_data, fillCreditCardData);
fillData(subscription_data, fillSubscriptionData); 

const corsOptions = {
    origin: "http://127.0.0.1:5500",
    credentials: true
};

app.use(cors(corsOptions));
app.use(body_parser.urlencoded({ extended: false }))
app.use(body_parser.json())

app.get('/signup/:address', (req, res) => {
    console.log("params are "+ req.params.address)
    let emailToCheck = req.params.address;
    let emailCheckQuery = "SELECT email FROM mydb.user WHERE email = " + `"${emailToCheck}"`;

    connection.query(emailCheckQuery, function(err, result) {
        try {
            if(!result[0])
                res.send({result: 'not found'})
            else
                res.send({result: 'found'})
        }
        catch (error) {
            res.send({result: 'found'})
        }  
    })
})

app.post('/signup/', (req, res) => {
        console.log("params are "+ req.body)
        try {
            fillUserData(req.body)
        }
        catch (error) {
            console.log(error)
        }
})

app.post('/cards/', (req, res) => {
        console.log("params are "+ req.body)
        try {
            fillCreditCardData(req.body)
        }
        catch (error) {
            console.log(error)
        }
})

app.get('/subscriptions/:id', (req, res) => {
    let myQuery = 'SELECT\
                    credit_card.user_id,\
                    subscription.subs_record_id,\
                    subscription.autopay_plan_name,\
                    subscription.autopay_type,\
                    subscription.next_billing_date,\
                    subscription.amount_to_pay,\
                    Category.first_category,\
                    Category.second_category,\
                    Category.third_category,\
                    subscription.subscription_name,\
                    logos.subscription_logo\
                FROM mydb.credit_card\
                LEFT JOIN mydb.subscription\
                ON credit_card.card_id = subscription.card_id\
                INNER JOIN mydb.Category\
                ON subscription.sub_category_id = Category.sub_id\
                INNER JOIN mydb.logos\
                ON subscription.logo_id = logos.subscription_id;'

    connection.query(myQuery, function(err, result) {
        try {
            console.log('hi my result is', result)
            res.send(result)
        }
        catch (error) {
             console.log(error)
             res.send({err: 'subs query problem'})
        }
    })
})

app.listen(3000, () => {
    console.log('currently listening to port 3000')
})
