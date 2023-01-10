
class Elements{
    constructor() {
        
    
        this.profileMenu = document.querySelector('.profileMenu');
        this.menuOption = document.querySelectorAll('.menuOption')
        this.userButton = document.querySelector('#userButton');

        this.categoryMap = new Map()
        this.categoryMap.set("Productivity", "productivityTag")
        this.categoryMap.set("Creativity", "creativityTag")
        this.categoryMap.set("Family", "familyTag")
        this.categoryMap.set("Entertainment", "entertainmentTag")
        this.categoryMap.set("Food", "foodTag")
        this.categoryMap.set("Education", "educationTag")
        this.categoryMap.set("Communication", "communicationTag")

        this.currentData;

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

    
    renderProductAndPrice(data) {
        /*Renders: icons, name and tags */

        let productCategories = document.createElement('div')
        productCategories.className = "productCategories"

        if(data.first_category != null) {
            let tag = document.createElement('span')
            tag.innerHTML = data.first_category
            tag.className = this.categoryMap.get(data.first_category)
            productCategories.appendChild(tag)
        }

        if(data.second_category != null) {
            let tag = document.createElement('span')
            tag.innerHTML = data.second_category
            tag.className = this.categoryMap.get(data.second_category)
            productCategories.appendChild(tag)
        }

        if(data.third_category != null) {
            let tag = document.createElement('span')
            tag.innerHTML = data.third_category
            tag.className = this.categoryMap.get(data.third_category)
            productCategories.appendChild(tag)
        }

        let titleSpan = document.createElement('span')
        titleSpan.innerHTML = data.subscription_name

        let brandAndCategories = document.createElement('div')
        brandAndCategories.className = "brandAndCategories"

        brandAndCategories.appendChild(titleSpan)
        brandAndCategories.appendChild(productCategories)

        let icon = document.createElement('img')
        icon.src = `${data.subscription_logo}`
        icon.alt = "product icon"

        let productInfo = document.createElement('div')
        productInfo.className = "productInfo"

        productInfo.appendChild(icon)
        productInfo.appendChild(brandAndCategories)

        let price = document.createElement('span')
        price.innerHTML = '$' + `${data.amount_to_pay}`;

        let brandPriceAndInfo = document.createElement('div')
        brandPriceAndInfo.className = "brandAndPriceInfo"

        brandPriceAndInfo.appendChild(productInfo)
        brandPriceAndInfo.appendChild(price)

        return brandPriceAndInfo;
    }

    
    renderSubscriptionDetails(data) {
        /*renders: autopay_plan_name autopay type */
        let nameField = document.createElement('span')
        nameField.innerHTML = "Name: "

        let typeField = document.createElement('span')
        typeField.innerHTML = "Type: "

        let periodField = document.createElement('span')
        periodField.innerHTML = "Period: "

        let billingField = document.createElement('span')
        billingField.innerHTML = "Next billing on: "

        let nameValue = document.createElement('span');
        nameValue.innerHTML = data.autopay_plan_name;

        let typeValue = document.createElement('span');
        typeValue.innerHTML = "Recurring"

        let periodValue = document.createElement('span')
        periodValue.innerHTML = data.autopay_type;

        let billingValue = document.createElement('span')
        billingValue.innerHTML = `${data.next_billing_date}`.substring(0,10);

        let cell_1 = document.createElement('td')
        cell_1.appendChild(nameField)
        cell_1.appendChild(nameValue)

        let cell_2 = document.createElement('td')
        cell_2.appendChild(typeField);
        cell_2.appendChild(typeValue);

        let cell_3 = document.createElement('td')
        cell_3.colSpan = "2"
        cell_3.appendChild(periodField);
        cell_3.appendChild(periodValue)

        let cell_4 = document.createElement('td')
        cell_4.colSpan = "2"
        cell_4.appendChild(billingField)
        cell_4.appendChild(billingValue)

        let row_1 = document.createElement('tr')
        let row_2 = document.createElement('tr')
        let row_3 = document.createElement('tr')

        row_1.appendChild(cell_1)
        row_1.appendChild(cell_2)
        row_2.appendChild(cell_3)
        row_3.appendChild(cell_4)

        let table = document.createElement('table')
        table.appendChild(row_1)
        table.appendChild(row_2)
        table.appendChild(row_3)

        let subDetails = document.createElement('div')
        subDetails.className = "subscriptionDetails"
        subDetails.appendChild(table)

        return subDetails;
    }

    renderDetailLink(data) {
        /*renders: compact mode tags and details link*/
        let compactCategoryIndicator = document.createElement('div')
        compactCategoryIndicator.className = "productCategoryIndicator"

        let anchor = document.createElement('a')
        anchor.href = ""
        anchor.innerHTML = "Details ->"

        let cardDetailLink = document.createElement('div')
        cardDetailLink.className = "cardDetailsLink"

        cardDetailLink.appendChild(compactCategoryIndicator);
        cardDetailLink.appendChild(anchor);

        return cardDetailLink;
    }

    renderSubscriptionCard(data) {
        let subCard = document.createElement('div')
        subCard.className = "subsCard"
        subCard.id = "card_" + data.subs_record_id

        let brandInfo = this.renderProductAndPrice(data)
        let tableInfo = this.renderSubscriptionDetails(data)
        let productLinks = this.renderDetailLink(data) 

        subCard.appendChild(brandInfo)
        subCard.appendChild(tableInfo)
        subCard.appendChild(productLinks)

        document.querySelector('.subsWrapper').appendChild(subCard)
    }

    async reloadSubscriptions(user_id, elem) {

        let response = await fetch(`http://localhost:3000/subscriptions/${user_id}`, {
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
            console.log('data packet is ', data)
            if(data.err)
            {
                console.log("error")
                //return data
            }
            else {
                for(let i = 0; i < data.length; i++)
                    this.renderSubscriptionCard(data[i])
                
                elem.currentData = data
                return elem.currentData
            } 
            
        });
        return response

    }
}

window.addEventListener("load", () => {

    let elem = new Elements();
    let myData = elem.reloadSubscriptions(1, elem);
    console.log('mydatais ',elem.currentData)

    // let sampleData = {
    //     subs_record_id: 1,
    //     autopay_plan_name: 'Business',
    //     autopay_type: 'Monthly',
    //     next_billing_date: '10.12.2022',
    //     amount_to_pay: "$82.49",
    //     first_category: 'Productivity',
    //     second_category: 'Creativity',
    //     subscription_name: 'Adobe Creative Cloud',
    //     subscription_logo: "./img/adobe_icon.svg"
    // }
    
    //elem.renderSubscriptionCard(sampleData)
    let profileMenu = document.querySelector('.profileMenu');
    profileMenu.style.display = 'none';

    let userButton = document.querySelector('#userButton');
    let menuOption = document.querySelectorAll('.menuOption')

    userButton.addEventListener('click', () => {
        profileMenu.style.display = profileMenu.style.display === 'none'? 'flex' : 'none';
    })

    menuOption.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.setAttribute('style', 'background-color : var(--clr-link)')
        })
        
        option.addEventListener('mouseleave', () => {
            option.setAttribute('style', 'background-color : white')
        })
    })

     
})

