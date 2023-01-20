CREATE TABLE IF NOT EXISTS `user` (
  `user_record_id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `user_id` INT NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`user_record_id`)
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `credit_card` (
  `card_record_id` INT NOT NULL AUTO_INCREMENT,
  `card_id` DECIMAL(16) NOT NULL UNIQUE,
  `card_brand` VARCHAR(45) NOT NULL,
  `card_issuer` VARCHAR(45) NOT NULL,
  `credit_limit` INT NOT NULL,
  `expiration_date` DATE NOT NULL,
  `user_id` INT,
  PRIMARY KEY (`card_record_id`),
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `subscription` (
  `subs_record_id` INT NOT NULL AUTO_INCREMENT,
  `subscription_id` DECIMAL(16) NOT NULL UNIQUE,
  `card_id` DECIMAL(16),
  `subscription_name` VARCHAR(45) NOT NULL,
  `autopay_plan_name` VARCHAR(45) NOT NULL,
  `autopay_type` VARCHAR(45) NOT NULL,
  `next_billing_date` DATE NOT NULL,
  `amount_to_pay` FLOAT(16) UNSIGNED NOT NULL,
  `logo_id` INT NOT NULL,
  `sub_category_id` DECIMAL(16) NOT NULL UNIQUE,
  `sub_pay_id` DECIMAL(16) NOT NULL,
  PRIMARY KEY (`subs_record_id`),
  CONSTRAINT `card_id`
    FOREIGN KEY (`card_id`)
    REFERENCES `credit_card` (`card_id`)
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `logos` (
  `logo_record_id` INT NOT NULL AUTO_INCREMENT,
  `logo_sub_id` DECIMAL(16) NOT NULL UNIQUE,
  `subscription_logo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`logo_record_id`),
  CONSTRAINT `logo_sub_id`
    FOREIGN KEY (`logo_sub_id`)
    REFERENCES `subscription` (`subscription_id`)
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Payment` (
  `payment_record_id` INT NOT NULL AUTO_INCREMENT,
  `payment_id` DECIMAL(16) NOT NULL,
  `pay_sub_id` DECIMAL(16) NOT NULL,
  `receipt_id` DECIMAL(16) NOT NULL UNIQUE,
  `payment_date` DATE NOT NULL,
  `payment_amount` FLOAT(16) UNSIGNED NOT NULL,
  PRIMARY KEY (`payment_record_id`),
  CONSTRAINT `pay_sub_id` 
    FOREIGN KEY (`pay_sub_id`)
    REFERENCES `subscription` (`subscription_id`)
)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `Category` (
  `cat_record_id` INT NOT NULL AUTO_INCREMENT,
  `cat_sub_id` DECIMAL(16) NOT NULL,
  `first_category` VARCHAR(45) NULL,
  `second_category` VARCHAR(45) NULL,
  `third_category` VARCHAR(45) NULL,
  PRIMARY KEY (`cat_record_id`),
  CONSTRAINT `cat_sub_id` 
    FOREIGN KEY (`cat_sub_id`)
    REFERENCES `subscription` (`subscription_id`)
)
ENGINE = InnoDB;


