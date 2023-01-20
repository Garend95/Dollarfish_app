let express = require('express');
let body_parser = require('body-parser');
let cors = require('cors');
let app = express();
let fs = require('fs');
let { connection, fillData } = require('./query')

// require('dotenv').config({ path: '/home/gdanag/Documents/Sourcemind/Dollarfish_app/BACKEND/Backend_scripts/.env'});

//https://stackoverflow.com/questions/32715273/node-mysql-throwing-connection-timeout


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
