class Views{
    constructor() {
        this.emptyCardsView = document.querySelector('#add_card_empty')
        this.cardAddingView = document.querySelector('#add_card_filling')
        this.myCardsView = document.querySelector('#card_added')

        this.canvasViews = document.querySelectorAll('.canvas')
    
    
    
    }
    switchToView(viewID) {
        let targetView = document.getElementById(viewID)

        this.canvasViews.forEach(view => {
            if(targetView === view) {
                view.setAttribute("style","visibility: 'visible'")
                view.setAttribute("style","display: 'flex'")
            }
            else {
                view.setAttribute("style","visibility: 'collapse'")
                view.setAttribute("style","display: none")
            }
        })
    }
}

class Elements{
    constructor() {
        this.myCardsPageButton = document.querySelector('#myCards')
        this.fieldWarningText = document.querySelectorAll('.fieldWarning');
        this.textFields = document.querySelectorAll('input[type="text"]');
    
        this.profileMenu = document.querySelector('.profileMenu');
        this.menuOption = document.querySelectorAll('.menuOption')
        this.userButton = document.querySelector('#userButton');
        
        this.addNewCardButton = document.querySelectorAll('.add_new_card_button')
        this.cardNumberField = document.querySelector('#card_number_to_insert')
        this.cardConfirmButton = document.querySelector('#cardConfirmButton')

        this.exprirationMonth = document.querySelector('#expiration_month');
        this.expirationYear = document.querySelector('#expiration_year');

        this.menuOption.forEach(option => {
            option.addEventListener('mouseenter', () => {
                option.setAttribute('style', 'background-color : var(--clr-link)')
            })
            
            option.addEventListener('mouseleave', () => {
                option.setAttribute('style', 'background-color : white')
            })
        })

        this.userButton.addEventListener('click', () => {
            let profileMenu = document.querySelector('.profileMenu');
            profileMenu.style.display = profileMenu.style.display === 'none'? 'flex' : 'none';
        })

        this.cardNumberField.addEventListener('input', (event) => {
            let input = (this.cardNumberField.value).toString();
            let inputWithoutDashes = input.replaceAll('-', '');
            console.log(event.key)
            //console.log(inputWithoutDashes)

            //place a dash every four numbers except after the last four numbers
            if(inputWithoutDashes.length % 4 === 0 && 
                inputWithoutDashes.length > 0 &&
                inputWithoutDashes.length < 16)
                this.cardNumberField.value += '-'
        })

        
    }

    

    resetElements() {
        this.fieldWarningText.forEach(text => {
            text.style.display = 'none';
            text.innerHTML = "";
        });

        this.textFields.forEach(field => {
            field.value = "";
        })

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

    renderCardHolder(data) {
        let cardBrandText = document.createElement('span')
        cardBrandText.className = "registeredCardBrand"
        cardBrandText.id = cardBrandText.className + '_' + data.card_record_id;
        cardBrandText.innerHTML = data.card_brand

        let cardNumber = document.createElement('span');
        cardNumber.className = "registeredCardNumber";
        cardNumber.id = cardNumber.className + '_' + data.card_record_id;
        cardNumber.innerHTML = data.card_id//((data.card_id).toString).replace(/.{4}/g, '$&-').slice(0,-1);

        let cardNumberContainer = document.createElement('div')
        cardNumberContainer.appendChild(cardBrandText)
        cardNumberContainer.appendChild(cardNumber)

        let cardNumberLabel = document.createElement('span')
        cardNumberLabel.innerHTML = "Card Number";

        let cardNumberSection = document.createElement('div')
        cardNumberSection.className = "cardNumberSection";

        cardNumberSection.appendChild(cardNumberLabel);
        cardNumberSection.appendChild(cardNumberContainer);

        let cardExpirationLabel = document.createElement('span')
        cardExpirationLabel.innerHTML = "Expiration";

        let registeredExpirationDate = document.createElement('span')
        registeredExpirationDate.className = "registeredExpirationDate"
        registeredExpirationDate.id = registeredExpirationDate.className + '_' + data.card_record_id;
        registeredExpirationDate.innerHTML = data.expiration_date

        let cardExpirationSection = document.createElement('div')
        cardExpirationSection.className = "cardExpirationSection"

        cardExpirationSection.appendChild(cardExpirationLabel)
        cardExpirationSection.appendChild(registeredExpirationDate);

        let detailAnchor = document.createElement('a')
        detailAnchor.innerHTML = "Details";

        let userCard = document.createElement('div')
        userCard.className = "userCard"

        userCard.appendChild(cardNumberSection)
        userCard.appendChild(cardExpirationSection)
        userCard.appendChild(detailAnchor)

        let item = document.createElement('li')
        item.id = "card_" + data.card_record_id

        item.appendChild(userCard)

        let list = document.querySelector('#cardList')
        list.appendChild(item)
    }
}

class PatternChecker {
    constructor() {
        this.invalidPatternResponses = {
            "empty": {
                "card":"Please provide a card number",
                "date":"Please provide a valid expiration date"
            },
            "card": {
                "invalid":"Your card number is not valid",
                "charLimit":"Your card should have only 16 numbers"
            },
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

    checkValidCardNumber(string) {
        let cardRegex = new RegExp(/^([0-9]{4}\-[0-9]{4}\-[0-9]{4}\-[0-9]{4}){1}$/,'g')
    
        if(cardRegex.test(string)) {  
            console.log("name is valid");
            return true;
        } 
        else {
            console.log('invalid name')
            return false;
        }
    }

    checkValidExpiryDate(month, year) {
     
    }

}

class InfoValidator  {
    async addNewCard(id) {
        try{
            let response = await fetch(`http://localhost:3000/cards/`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    card_id: dataPacket.card_id,
                    card_brand: "Mastercard",
                    card_issuer: "Chase",
                    credit_limit: 2000,
                    expiration_date: "2022-12-14",
                    user_id: 1
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
    let elem = new Elements();
    let validator = new InfoValidator();
    elem.resetElements();
    elem.displayWarnings();
    elem.profileMenu.style.display = 'none';

    let views = new Views();
    views.switchToView('add_card_filling')
    
    let sampleData = {
        card_record_id: 1,
        card_id: 4567891011121314,
        expiration_date: "2023/03",
        card_brand: "Visa"
    }

    // elem.renderCardHolder(sampleData)
    elem.addNewCardButton.forEach(button => {
        button.addEventListener('click', () => {
            views.switchToView('add_card_filling')
        })
    })

    elem.cardConfirmButton.addEventListener('click', () => {
        let cardFieldValue = elem.cardNumberField.value;
        let expMonthValue = elem.exprirationMonth.value;
        let expYearValue = elem.expirationYear.value;
        // let expirationMonthValue = elem.
        let cardNumFormatValid = false;
        let expirationDateValid = false;
        let informationIsValid = false;

        elem.clearWarnings();
        
        /*if(checker.checkFieldEmpty("#card_number_to_insert"))
            console.log('empty field')
        else()*/

        if(cardFieldValue.length === 0) {
            checker.attachWarning('cardWarning','empty','card')
            elem.makeFieldAlertState('card_number_to_insert')
        }
        else {
            if(checker.checkValidCardNumber(cardFieldValue)) {
                {
                    if(validator.addNewCard(cardFieldValue))
                    
                    elem.clearAlertState('card_number_to_insert')
                    cardNumFormatValid = true;
                }
            }
            else {
                checker.attachWarning('cardWarning','card','invalid')
                elem.makeFieldAlertState('card_number_to_insert')
            }
        }

        if(expMonthValue === "" || expYearValue === "") {
            checker.attachWarning('expirationDateWarning','empty','date')
            
            if(expMonthValue === "")
                elem.makeFieldAlertState('expiration_month')

            if(expYearValue === "")
                elem.makeFieldAlertState('expiration_year')
        }
        else {
            if(checker.checkValidExpiryDate(expMonthValue, expYearValue))
                expirationDateValid = true;
            else {
                checker.attachWarning('expirationDateWarning','date_expired')
                elem.makeFieldAlertState('expiration_month')
                elem.makeFieldAlertState('expiration_year')
            }
        }

    })

     
})

