const fillUserData = function(data) {
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

    this.connection.query(insertCommand);
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

    this.connection.query(insertCommand);
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

    this.connection.query(insertCommand);
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

    this.connection.query(insertCommand)
}

const fillLogoData = function(data) {
    let insertCommand = `INSERT INTO logos (
        subscription_id, 
        subscription_logo) \
        VALUES (
            ${data.subscription_id}, 
            "${data.subscription_logo}")`

    this.connection.query(insertCommand);
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

    this.connection.query(insertCommand);
}

const insertMethods = function(methodName) {
    switch (methodName) {
        case 'user':
            return fillUserData;
        case 'card':
            return fillCreditCardData;
        case 'payment':
            return fillPaymentData;
        case 'subscription':
            return fillSubscriptionData;
        case 'logo': 
            return fillLogoData;
        default:
            console.log("error in filling data")
            return -1;
    } 
}

module.exports = insertMethods;