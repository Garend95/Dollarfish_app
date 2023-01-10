//import * as myApp from "./api.js"


class Views{
    constructor() {
        this.emptyCardsView = document.querySelector('#add_card_empty')
        this.cardAddingView = document.querySelector('#add_card_filling')
        this.myCardsView = document.querySelector('#card_added')

    }
}

class Elements{
    constructor() {
        this.signUpButton = document.querySelector('#signUpButton')
        this.myCardsPageButton = document.querySelector('#myCards')
        this.fieldWarningText = document.querySelectorAll('.fieldWarning');
        this.nameFields = document.querySelectorAll('input[type="text"]');
        this.passwordField = document.querySelector('input[type="password"]')
    }

    resetElements() {
        this.fieldWarningText.forEach(text => {
            text.style.display = 'none';
            text.innerHTML = "";
        });

        this.nameFields.forEach(field => {
            field.value = "";
        })

        this.passwordField.value = "";
    }

    displayWarnings() {
        this.fieldWarningText.forEach(text => {
            if(text.style.display === 'none')
                text.style.display = 'inline';
        });
    }

    clearWarnings() 
    {
        let warnings = document.getElementsByClassName('fieldWarning')

        for (let i = 0; i < warnings.length; i++)
        {
            warnings.item(i).innerHTML = ""
        }
    }

    makeFieldAlertState(fieldID) {
        let fieldToAffect = document.getElementById(fieldID)
        fieldToAffect.setAttribute('style', 'border: 1.5px solid var(--clr-red)')
    }

    clearAlertState(fieldID) {
        let fieldToAffect = document.getElementById(fieldID)
        fieldToAffect.setAttribute('style', 'border: 1.5px solid var(--clr-white)')
    }
}



class PatternChecker {
    constructor() {
        this.invalidPatternResponses = {
            "empty": {
                "signUp":"All fields are mandatory for registry",
                "signIn":"Please fill in the email and password"
            },
            "name":"Names should have valid characters",
            "email": 
                    {
                "invalid":"Please provide a valid email address",
                "taken":"This email is associated with an existing account"
            },
            "password": {
                "length":"Must be at least 8 characters long",
                "capital":"Must have at least one capital and lowercase letter",
                "number":"Must have at least one number",
                "special":"Must have at least one special character"
            },
            "agreement":"You must agree to the Terms of use before signing up",
            "card":"Please insert a valid card number",
            "date_expired":"The card's date of expiry has past"
        }
    }

    attachWarning(warningID, key, valueKey = "") {
        let warningList = document.getElementById(warningID)
        let warningMessage = document.createElement('li');

        if(valueKey === "")
            warningMessage.innerHTML = this.invalidPatternResponses[key];
        else
            warningMessage.innerHTML = this.invalidPatternResponses[key][valueKey];

        warningList.appendChild(warningMessage)
    }

    checkFieldEmpty(fieldID) {
        let fieldToCheck = document.querySelector(fieldID);

        if(fieldToCheck.value.length === 0) {
            return true;
        }
        return false;
        
    }

    checkValidName(string) {
        let nameRegex = new RegExp(/^[A-Za-z][A-Za-z\'\-\.]+([\ A-Za-z][A-Za-z\'\-\.]+)*/,'g')
    
        if(nameRegex.test(string)) {  
            console.log("name is valid");
            return true;
        } 
        else {
            console.log('invalid name')
            return false;
        }
    }

    checkValidEmail(string) {
        let emailRegex = new RegExp(/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/,'g')
    
        if(emailRegex.test(string) && string.length <= 254) {
            console.log("email is valid")
            return true;
        }
        else {
            console.log('invalid email')
            return false;
        }
    }

    checkValidPassword(string) {
        //all around validation string
        let passRegex = new RegExp(/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/,'g')

        let lengthRegex = new RegExp(/^(.{0,7})$/,'g')
        let numberRegex = new RegExp(/^([^0-9]*)$/,'g')
        let capitalRegex = new RegExp(/^([^A-Z]*|[^a-z]*)$/,'g')
        let specialRegex = new RegExp(/^([a-zA-Z0-9]*)$/,'g')

        if(passRegex.test(string)) {
            console.log("invalid password")

            if(lengthRegex.test(string))
                this.attachWarning('passwordSignUpWarning','password','length')

            if(numberRegex.test(string))
                this.attachWarning('passwordSignUpWarning','password','number')

            if(capitalRegex.test(string))
                this.attachWarning('passwordSignUpWarning','password','capital')

            if(specialRegex.test(string))
                this.attachWarning('passwordSignUpWarning','password','special')

            return false;
            //attachWarning('passwordSignUpWarning','email','invalid')
        }
        else {
           console.log("valid Password")
           return true;
        }
    }

    


}

class InfoValidator {
    constructor() {
        this.emailInDatabase = false
    }
    
    async emailAlreadyExists (address, validator) {
        let response = await fetch(`http://localhost:3000/signup/${address}`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }

        })
        .then((response) => response.json())
        .then((data) => {
            if(data.result === "found")
                {console.log('data was found')
                validator.emailInDatabase = true;
                return true}
            else
                {console.log('data not found')
                validator.emailInDatabase = false;
                return false;}
        } );
        
        return response
    }

    async addNewUser(dataPacket) {
        try{
            let response = await fetch(`http://localhost:3000/signup/`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    first_name: dataPacket.first_name,
                    last_name: dataPacket.last_name,
                    email: dataPacket.email,
                    password: dataPacket.password
                })

            });
        }
        catch (error) {
            console.log(error)
        }
    }
}

window.addEventListener("load", () => {
    
    let checker = new PatternChecker();
    let validator = new InfoValidator();
    let elem = new Elements();
    elem.resetElements();
    elem.displayWarnings();

    //validator.EmailAlreadyExists('garend95@yahoo.com')
    //myApp.getLogin();



    elem.signUpButton.addEventListener('click', () => {

        let firstNameValid = false;
        let lastNameValid = false;
        let emailValid = false;
        let passwordValid = false;
        let infoValid = false;
        
        let firstNameValue = document.getElementById('first_name_field').value;
        let lastNameValue = document.getElementById('last_name_field').value;
        let emailValue = document.getElementById('email_field').value;
        let passwordValue = document.getElementById('password_field').value;
        let aggreementChecked = document.getElementById('agreement_mark').checked;
        
        let dataPacket = { first_name: firstNameValue,
                            last_name: lastNameValue,
                            email: emailValue,
                            password: passwordValue}


        elem.clearWarnings();
        //elem.clearWarnings();

        //if a field is not empty, we then check if it has a valid format
        if(firstNameValue.length === 0) {
            elem.makeFieldAlertState('first_name_field')
            checker.attachWarning('nameWarning','empty','signUp')
        }
        else {
            if(checker.checkValidName(firstNameValue)) {
                firstNameValid = true;
                elem.clearAlertState('first_name_field')
            }
            else {
                elem.makeFieldAlertState('first_name_field')
                checker.attachWarning('nameWarning','name')
            }
        }

        if(lastNameValue.length === 0) {
            checker.attachWarning('nameWarning','empty','signUp')
            elem.makeFieldAlertState('last_name_field')
        }
        else {
            if(checker.checkValidName(lastNameValue)) {
                lastNameValid = true;
                elem.clearAlertState('last_name_field')
            }
            else {
                elem.makeFieldAlertState('last_name_field')
                checker.attachWarning('nameWarning','name')
            }
        }

        if(emailValue.length === 0) {
            checker.attachWarning('emailSignUpWarning','empty','signUp')
            elem.makeFieldAlertState('email_field')
        }
        else {
            if(checker.checkValidEmail(emailValue))
            {   
                validator.emailAlreadyExists(emailValue, validator)
                if(validator.emailInDatabase){
                    elem.makeFieldAlertState('email_field')
                    checker.attachWarning('emailSignUpWarning','email','taken')
                }
                else
                {
                    elem.clearAlertState('email_field')
                    emailValid = true;
                    console.log("email is now valid")
                }
                
            }
            else {
                elem.makeFieldAlertState('email_field')
                checker.attachWarning('emailSignUpWarning','email','invalid')
            }
        }

        if(passwordValue.length === 0) {
            checker.attachWarning('passwordSignUpWarning','empty','signUp')
            elem.makeFieldAlertState('password_field')
        }
        else {
            if(checker.checkValidPassword(passwordValue)) {
                elem.clearAlertState('password_field')
                passwordValid = true;
            }
            else 
                elem.makeFieldAlertState('password_field')
        }

        if(!aggreementChecked)
            elem.makeFieldAlertState('agreement_mark')

        if(firstNameValid &&
            lastNameValid &&
            emailValid &&
            passwordValid &&
            aggreementChecked) 
            {
                validator.addNewUser(dataPacket)
                document.getElementById('signUpLink').href = './my_cards.html'
                document.getElementById('signUpLink').target = '_self'
            }


    })
     
})

