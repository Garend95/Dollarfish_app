SELECT credit_card.user_id, credit_card.card_brand, subscription.subs_record_id,
subscription.autopay_plan_name, subscription.autopay_type, subscription.next_billing_date, 
     subscription.amount_to_pay, Category.first_category, Category.second_category, Category.third_category,
     subscription.subscription_name, logos.subscription_logo 
    FROM mydb.credit_card
    LEFT JOIN mydb.subscription
    ON credit_card.card_id = subscription.card_id
    INNER JOIN mydb.Category
    ON subscription.sub_category_id = Category.sub_id
    INNER JOIN mydb.logos
    ON subscription.logo_id = logos.subscription_id;