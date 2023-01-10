class Views{
    constructor() {
        this.emptyCardsView = document.querySelector('#add_card_empty')
        this.cardAddingView = document.querySelector('#add_card_filling')
        this.myCardsView = document.querySelector('#card_added')

    }
}

class Elements{
    constructor() {
        this.signInButton = document.querySelector('#signInButton')
        this.fieldWarningText = document.querySelectorAll('.fieldWarning');
        this.nameField = document.querySelector('input[type="text"]');
        this.passwordField = document.querySelector('input[type="password"]')
    }

    resetElements() {
        this.fieldWarningText.forEach(text => {
            text.style.display = 'none';
            text.innerHTML = "";
        });

        this.nameField.value = "";

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
                "taken":"This email is already taken. Sign in?"
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

window.addEventListener("load", () => {
    
    let checker = new PatternChecker();
    let elem = new Elements();
    elem.resetElements();
    elem.displayWarnings();


    elem.signInButton.addEventListener('click', () => {


        let emailValid = false;
        let passwordValid = false;
        
       
        let emailValue = document.getElementById('email_field').value;
        let passwordValue = document.getElementById('password_field').value;
        
        elem.clearWarnings();

        if(emailValue.length === 0) {
            checker.attachWarning('emailSignUpWarning','empty','signUp')
            elem.makeFieldAlertState('email_field')
        }
        else {
            if(checker.checkValidEmail(emailValue)) {
                elem.clearAlertState('email_field')
                emailValid = true;
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

        

        if(emailValid && passwordValid) 
            {
                document.getElementById('signInLink').href = './my_cards.html'
                document.getElementById('signInLink').target = '_self'
            }


    })
     
})
