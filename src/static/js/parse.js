let catsList = []
let currentItems = []

const menuBlock = document.querySelector('.menu__wrapper .menu-block-header ul.menu__list')
const itemsBlock = document.querySelector('section.menu__wrapper .menu-block-content')

const parseCategories = () => {
    catsList.forEach((item, index) => {
        let newMenuItem

        if (index === 0) {
            newMenuItem = `
                <li class="menu__list-item active" data-id="${item.itemId}">${item.itemName}</li>
            `
        } else {
            newMenuItem = `
                <li class="menu__list-item" data-id="${item.itemId}">${item.itemName}</li>
            `
        }

        menuBlock.innerHTML += newMenuItem
    })
}

const parseItems = () => {
    currentItems.forEach(item => {
        let compItem = ``

        item.composition.forEach(compose => {
            compItem += `<li class="consist-item">${compose}</li>`
        })


        let newItem = `
            <div class="menu-item" data-order-id="${item.id}" style="background-image: url(${item.image})">
                <div class="menu-item__info">
                  <div class="name">${item.name}</div>
                  <div class="hidden_info">
                    <ul class="consist">
                      ${compItem}
                    </ul>
                    <div class="rate">
                      <div class="star active"></div>
                      <div class="star active"></div>
                      <div class="star active"></div>
                      <div class="star active"></div>
                      <div class="star"></div>
                    </div>
                  </div>
                  <div class="buy-inf">
                    <div class="about">
                      <div class="w">${item.weight} / ${item.amount} шт.</div>
                      <div class="price">${item.cost} ₽</div>
                    </div>
                    <div class="button green button-sm">Заказать</div>
                  </div>
                </div>
              </div>
        `

        itemsBlock.innerHTML += newItem
    })
}

const connect = async function () {
    let url = 'https://br-yalta.ru/categories'

    let response = await fetch(url)

    if (response.ok) {
        let json = await response.json()

        json.forEach(item => {
            let cat = new Object({
                itemId: item.id,
                itemName: item.name
            })
            catsList.push(cat)
        })
    } else {
        alert("Ошибка HTTP: " + response.status)
    }
}

const uploadItem = async function(itemId) {
    let url = 'https://br-yalta.ru/products?category_id=' + itemId

    let response = await fetch(url)

    if (response.ok) {
        let jsonItems = await response.json()

        jsonItems.forEach(item => {
            let itemObject = new Object({
                id: item.id,
                name: item.name,
                amount: item.amount,
                weight: item.weight,
                cost: item.cost,
                image: item.image,
                composition: item.composition
            })

            currentItems.push(itemObject)
        })
    }
}

uploadItem(3).then( () => {
    parseItems()
})

connect().then( () => {
    parseCategories()

    document.querySelectorAll('section.menu__wrapper  ul.menu__list li.menu__list-item').forEach(menuItem => {
        menuItem.addEventListener('click', () => {
            if (document.querySelector('section.menu__wrapper  ul.menu__list li.menu__list-item.active')) {
                document.querySelector('section.menu__wrapper  ul.menu__list li.menu__list-item.active').classList.remove('active')
            }

            currentItems = []

            menuItem.classList.add('active')
            let thisId = menuItem.getAttribute('data-id')
            itemsBlock.innerHTML = ``

            uploadItem(thisId).then( () => {
                parseItems()
            })
        })
    })
})