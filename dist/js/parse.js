let catsList = [];
let currentItems = [];

let cartInfo = {
  items: [],
  cost: 0,
  weight: 0,
};

const menuBlock = document.querySelector(
  ".menu__wrapper .menu-block-header ul.menu__list"
);
const itemsBlock = document.querySelector(
  "section.menu__wrapper .menu-block-content"
);

function byField(field) {
  return (a, b) => (a[field] > b[field] ? 1 : -1);
}

function byFieldAnother(field) {
  return (a, b) => (a[field] > b[field] ? -1 : 1);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function setCookie(name, options) {
  document.cookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(options);
}

function addCartToCookie() {
  let cartOptions = {};

  if (document.querySelectorAll(".cart-block__items-elem").length) {
    document.querySelectorAll(".cart-block__items-elem").forEach((cartItem) => {
      let thisName = cartItem.getAttribute("data-cart-id");

      cartOptions[thisName] = {
        id: Number(cartItem.getAttribute("data-cart-id")),
        image: cartItem.querySelector(".elem-img").getAttribute("style"),
        name: cartItem.querySelector(".name").textContent,
        weight: Number(
          cartItem.querySelector(".elem-info .weight").textContent.split(" ")[0]
        ),
        amount: Number(cartItem.querySelector(".count").textContent),
        cost: Number(cartItem.querySelector(".elem-cost .value").textContent),
      };
    });
  }

  let thisJsonString = JSON.stringify(cartOptions);
  setCookie("cartBlock", thisJsonString);
}

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

let sortIncrease = true;

const parseCategories = () => {
  if (menuBlock) {
    catsList.forEach((item, index) => {
      let newMenuItem;

      if (index === 0) {
        newMenuItem = `
                <li class="menu__list-item active" data-id="${item.itemId}">${item.itemName}</li>
            `;
      } else {
        newMenuItem = `
                <li class="menu__list-item" data-id="${item.itemId}">${item.itemName}</li>
            `;
      }

      menuBlock.innerHTML += newMenuItem;
    });
  }
};

const parseItems = (increase) => {
  if (itemsBlock) {
    if (!increase) {
      currentItems.sort(byFieldAnother("cost"));
    } else {
      currentItems.sort(byField("cost"));
    }

    itemsBlock.innerHTML = ``;

    currentItems.forEach((item) => {
      let compItem = ``;

      item.composition.forEach((compose) => {
        compItem += `<li class="consist-item">${compose}</li>`;
      });

      let starRate = getRandomInt(4, 6);

      let newItem;

      if (starRate === 4) {
        newItem = `
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
                      <div class="w">${item.weight}г. / ${item.amount}шт.</div>
                      <div class="price">${item.cost} ₽</div>
                    </div>
                    <div class="button green button-sm">Заказать</div>
                  </div>
                </div>
              </div>
        `;
      } else {
        newItem = `
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
                      <div class="star active"></div>
                    </div>
                  </div>
                  <div class="buy-inf">
                    <div class="about">
                      <div class="w">${item.weight}г. / ${item.amount}шт.</div>
                      <div class="price">${item.cost} ₽</div>
                    </div>
                    <div class="button green button-sm">Заказать</div>
                  </div>
                </div>
              </div>
        `;
      }

      itemsBlock.innerHTML += newItem;
    });

    itemsBlock.querySelectorAll(".menu-item").forEach((item) => {
      let thisOrdId = item.getAttribute("data-order-id");

      item
        .querySelector(".button.green.button-sm")
        .addEventListener("click", () => {
          addToCart(thisOrdId);
        });
    });
  }
};

const connect = async function () {
  let url = "https://br-yalta.ru/categories";

  let response = await fetch(url);

  if (response.ok) {
    let json = await response.json();

    json.forEach((item) => {
      let cat = new Object({
        itemId: item.id,
        itemName: item.name,
      });
      catsList.push(cat);
    });
  } else {
    alert("Ошибка HTTP: " + response.status);
  }
};

const uploadItem = async function (itemId) {
  let url = "https://br-yalta.ru/products?category_id=" + itemId;

  let response = await fetch(url);

  if (response.ok) {
    let jsonItems = await response.json();

    jsonItems.forEach((item) => {
      let itemObject = new Object({
        id: item.id,
        name: item.name,
        amount: item.amount,
        weight: item.weight,
        cost: item.cost,
        image: item.image,
        composition: item.composition,
      });

      currentItems.push(itemObject);
    });
  }
};

connect().then(() => {
  parseCategories();

  document
    .querySelectorAll("section.menu__wrapper  ul.menu__list li.menu__list-item")
    .forEach((menuItem) => {
      menuItem.addEventListener("click", () => {
        if (!menuItem.classList.contains("active")) {
          if (
            document.querySelector(
              "section.menu__wrapper  ul.menu__list li.menu__list-item.active"
            )
          ) {
            document
              .querySelector(
                "section.menu__wrapper  ul.menu__list li.menu__list-item.active"
              )
              .classList.remove("active");
          }

          currentItems = [];

          menuItem.classList.add("active");
          let thisId = menuItem.getAttribute("data-id");

          uploadItem(thisId).then(() => {
            parseItems(sortIncrease);
          });
        }
      });
    });
});

uploadItem(1).then(() => {
  parseItems(sortIncrease);
});

document
  .querySelectorAll(
    ".menu-block-header  ul.menu__filters li.menu__filters-item.sort"
  )
  .forEach((item) => {
    item.addEventListener("click", () => {
      if (!item.classList.contains("active")) {
        if (
          document.querySelector(
            ".menu-block-header  ul.menu__filters li.menu__filters-item.sort.active"
          )
        ) {
          document
            .querySelector(
              ".menu-block-header  ul.menu__filters li.menu__filters-item.sort.active"
            )
            .classList.remove("active");
        }

        item.classList.add("active");

        sortIncrease = item.classList.contains("increase");

        parseItems(sortIncrease);
      }
    });
  });

// Cart logic

const cartItemsBlock = document.querySelector(
  ".cart__wrapper .cart-block__items"
);
const countOfOrds = document.querySelector(
  ".cart__wrapper .cart__open .count-of-ord"
);

const allWeight = document.querySelector(
  ".cart__wrapper .cart-block__items-cost .weight span.value"
);
const allPrice = document.querySelector(
  ".cart__wrapper .cart-block__items-cost .price span.value"
);

const priceWeightBlock = document.querySelector(
  ".cart__wrapper .cart-block__items-cost"
);
const acceptButton = document.querySelector(".cart__wrapper a.cart-accept");
const clearButton = document.querySelector(".cart__wrapper a.cart-clean");
const cartEmpty = document.querySelector(".cart__wrapper .cart-block__empty");

checkCostWeight();

function addToCart(idOfC) {
  let finded = false;

  currentItems.forEach((cartItem) => {
    if (Number(cartItem.id) === Number(idOfC)) {
      document
        .querySelector(".cart__wrapper .cart__added-to-ct")
        .classList.add("opened");

      setTimeout(() => {
        document
          .querySelector(".cart__wrapper .cart__added-to-ct")
          .classList.remove("opened");
      }, 6000);

      let haveItem = false;

      cartInfo.items.forEach((item) => {
        if (Number(item.id) === Number(idOfC)) {
          haveItem = true;

          item.amount++;

          document
            .querySelectorAll(
              ".cart__wrapper .cart-block__items .cart-block__items-elem"
            )
            .forEach((cartElem) => {
              if (
                Number(cartElem.getAttribute("data-cart-id")) === Number(idOfC)
              ) {
                if (
                  cartElem.querySelector(".count").classList.contains("closed")
                ) {
                  cartElem.querySelector(".count").classList.remove("closed");
                }

                let thisCount =
                  Number(cartElem.querySelector(".count").textContent) + 1;

                cartElem.querySelector(
                  ".count"
                ).textContent = thisCount.toString();
              }
            });
        }
      });

      if (!haveItem) {
        let cartObj = new Object({
          id: cartItem.id,
          name: cartItem.name,
          amount: 1,
          weight: cartItem.weight,
          cost: cartItem.cost,
          image: cartItem.image,
        });

        cartInfo.items.push(cartObj);

        let newCartBlock = `
                    <div class="cart-block__items-elem" data-cart-id="${cartItem.id}">
                        <div class="elem-img" style="background-image: url('${cartItem.image}')">
                          <div class="count closed">1</div>
                        </div>
                        <div class="elem-info">
                          <div class="name">${cartItem.name}</div>
                          <div class="weight">${cartItem.weight} г.</div>
                        </div>
                        <div class="elem-cost"><span class="value">${cartItem.cost}</span><span class="rub"> ₽</span></div>
                        <div class="elem-inc__block">
                          <div class="elem-inc-arr increase"></div>
                          <div class="elem-inc-arr decrease"></div>
                        </div>
                        <div class="elem-delete"></div>
                    </div>
                `;

        cartItemsBlock.innerHTML += newCartBlock;
        cartItemsBlock.scrollTop = document.querySelector(
          ".cart__wrapper .cart-block__items"
        ).scrollHeight;
      }

      let countOfCart = calcCartLength();

      countOfOrds.textContent = countOfCart.toString();

      if (countOfCart < 1) {
        countOfOrds.classList.add("closed");
      } else {
        countOfOrds.classList.remove("closed");
      }

      if (cartInfo.items.length) {
        countOfOrds.classList.remove("closed");
      } else {
        countOfOrds.classList.add("closed");
      }

      cartInfo.cost += cartItem.cost;
      cartInfo.weight += cartItem.weight;

      allWeight.textContent = cartInfo.weight;
      allPrice.textContent = cartInfo.cost;

      checkCostWeight();

      finded = true;

      addCartToCookie();
    }
  });

  if (!finded) {
    cartInfo.items.forEach((cartItem) => {
      if (Number(cartItem.id) === Number(idOfC)) {
        document
          .querySelector(".cart__wrapper .cart__added-to-ct")
          .classList.add("opened");

        setTimeout(() => {
          document
            .querySelector(".cart__wrapper .cart__added-to-ct")
            .classList.remove("opened");
        }, 6000);

        cartInfo.items.forEach((item) => {
          if (Number(item.id) === Number(idOfC)) {
            item.amount++;

            document
              .querySelectorAll(
                ".cart__wrapper .cart-block__items .cart-block__items-elem"
              )
              .forEach((cartElem) => {
                if (
                  Number(cartElem.getAttribute("data-cart-id")) ===
                  Number(idOfC)
                ) {
                  if (
                    cartElem
                      .querySelector(".count")
                      .classList.contains("closed")
                  ) {
                    cartElem.querySelector(".count").classList.remove("closed");
                  }

                  let thisCount =
                    Number(cartElem.querySelector(".count").textContent) + 1;

                  cartElem.querySelector(
                    ".count"
                  ).textContent = thisCount.toString();
                }
              });
          }
        });

        let countOfCart = calcCartLength();

        countOfOrds.textContent = countOfCart.toString();

        if (countOfCart < 1) {
          countOfOrds.classList.add("closed");
        } else {
          countOfOrds.classList.remove("closed");
        }

        if (cartInfo.items.length) {
          countOfOrds.classList.remove("closed");
        } else {
          countOfOrds.classList.add("closed");
        }

        cartInfo.cost += cartItem.cost;
        cartInfo.weight += cartItem.weight;

        allWeight.textContent = cartInfo.weight;
        allPrice.textContent = cartInfo.cost;

        checkCostWeight();

        addCartToCookie();
      }
    });
  }
}

function removeFromCt(idOfC) {
  cartInfo.items.forEach((cartItem) => {
    if (Number(cartItem.id) === Number(idOfC)) {
      cartInfo.cost -= cartItem.cost * cartItem.amount;
      cartInfo.weight -= cartItem.weight * cartItem.amount;

      allWeight.textContent = cartInfo.weight;
      allPrice.textContent = cartInfo.cost;

      cartInfo.items.forEach((item, index) => {
        if (Number(item.id) === Number(idOfC)) {
          cartInfo.items.splice(index, 1);
        }
      });

      let countOfCart = calcCartLength();

      countOfOrds.textContent = countOfCart.toString();

      if (countOfCart < 1) {
        countOfOrds.classList.add("closed");
      } else {
        countOfOrds.classList.remove("closed");
      }

      checkCostWeight();

      addCartToCookie();
    }
  });
}

function checkCostWeight() {
  if (cartInfo.cost === 0) {
    priceWeightBlock.classList.add("closed");
    acceptButton.classList.add("closed");
    clearButton.classList.add("closed");

    cartEmpty.classList.remove("closed");
  } else {
    priceWeightBlock.classList.remove("closed");
    acceptButton.classList.remove("closed");
    clearButton.classList.remove("closed");

    cartEmpty.classList.add("closed");
  }
}

function deleteAllCart() {
  cartInfo = {
    items: [],
    cost: 0,
    weight: 0,
  };

  document
    .querySelectorAll(
      ".cart__wrapper .cart-block__items .cart-block__items-elem"
    )
    .forEach((item) => item.remove());

  let countOfCart = calcCartLength();

  countOfOrds.textContent = countOfCart.toString();

  if (countOfCart < 1) {
    countOfOrds.classList.add("closed");
  } else {
    countOfOrds.classList.remove("closed");
  }

  checkCostWeight();

  addCartToCookie();
}

function calcCartLength() {
  let count = 0;

  cartInfo.items.forEach((item) => {
    count += Number(item.amount);
  });

  return count;
}

document.querySelector(".cart-block__items").addEventListener("click", (e) => {
  let target = e.target;

  if (target.className === "elem-delete") {
    let thisId = target.parentElement.getAttribute("data-cart-id");

    target.parentElement.remove();

    removeFromCt(thisId);
  }

  if (target.className === "elem-inc-arr increase") {
    let elem = target.parentElement.parentElement;
    let elemId = elem.getAttribute("data-cart-id");

    addToCart(elemId);
  }

  if (target.className === "elem-inc-arr decrease") {
    let elem = target.parentElement.parentElement;
    let elemId = Number(elem.getAttribute("data-cart-id"));

    let elemCost = Number(elem.querySelector(".elem-cost .value").textContent);
    let elemWeight = Number(
      elem.querySelector(".elem-info .weight").textContent.replace(/[^\d]/g, "")
    );

    let countOfThis = Number(elem.querySelector(".count").textContent);

    if (countOfThis === 1) {
      removeFromCt(elemId);

      elem.remove();
    } else if (countOfThis === 2) {
      elem.querySelector(".count").textContent = (countOfThis - 1).toString();
      elem.querySelector(".count").classList.add("closed");

      cartInfo.items.forEach((cartItem) => {
        if (Number(cartItem.id) === Number(elemId)) {
          cartItem.amount--;
        }
      });

      cartInfo.weight -= elemWeight;
      cartInfo.cost -= elemCost;

      allWeight.textContent = cartInfo.weight;
      allPrice.textContent = cartInfo.cost;
    } else {
      elem.querySelector(".count").textContent = (countOfThis - 1).toString();

      cartInfo.items.forEach((cartItem) => {
        if (Number(cartItem.id) === Number(elemId)) {
          cartItem.amount--;
        }
      });

      cartInfo.weight -= elemWeight;
      cartInfo.cost -= elemCost;

      allWeight.textContent = cartInfo.weight;
      allPrice.textContent = cartInfo.cost;
    }

    let countOfCart = calcCartLength();

    countOfOrds.textContent = countOfCart.toString();

    if (countOfCart < 1) {
      countOfOrds.classList.add("closed");
    } else {
      countOfOrds.classList.remove("closed");
    }

    if (cartInfo.items.length) {
      countOfOrds.classList.remove("closed");
    } else {
      countOfOrds.classList.add("closed");
    }

    addCartToCookie();
  }
});

document
  .querySelector(".cart__wrapper .cart__open")
  .addEventListener("click", () => {
    document
      .querySelector(".cart__wrapper .cart-block")
      .classList.toggle("closed");
  });

document
  .querySelector(".cart__wrapper .cart-block .cart-block-close")
  .addEventListener("click", () => {
    document
      .querySelector(".cart__wrapper .cart-block")
      .classList.add("closed");
  });

document
  .querySelector(".cart__wrapper .cart-block a.cart-continue")
  .addEventListener("click", (e) => {
    if (document.querySelector(".menu-block-content")) {
      e.preventDefault();
      document
        .querySelector(".cart__wrapper .cart-block")
        .classList.add("closed");
    }
  });

clearButton.addEventListener("click", (e) => {
  e.preventDefault();

  deleteAllCart();
});

// --> Cart logic

function checkCartForAmount() {
  let allCartElems = document.querySelectorAll(".cart-block__items-elem");

  if (allCartElems.length) {
    allCartElems.forEach((cartElem) => {
      if (Number(cartElem.querySelector(".count").textContent) > 1) {
        cartElem.querySelector(".count").classList.remove("closed");
      }
    });
  }
}

if (getCookie("cartBlock")) {
  for (let key in JSON.parse(getCookie("cartBlock"))) {
    cartInfo.items.push(JSON.parse(getCookie("cartBlock"))[key]);
  }

  cartInfo.items.forEach((item) => {
    let newCartBlock = `
            <div class="cart-block__items-elem" data-cart-id="${item.id}">
                <div class="elem-img" style="${item.image}">
                  <div class="count closed">${item.amount}</div>
                </div>
                <div class="elem-info">
                  <div class="name">${item.name}</div>
                  <div class="weight">${item.weight} г.</div>
                </div>
                <div class="elem-cost"><span class="value">${item.cost}</span><span class="rub"> ₽</span></div>
                <div class="elem-inc__block">
                  <div class="elem-inc-arr increase"></div>
                  <div class="elem-inc-arr decrease"></div>
                </div>
                <div class="elem-delete"></div>
            </div>
        `;

    cartItemsBlock.innerHTML += newCartBlock;
    cartItemsBlock.scrollTop = document.querySelector(
      ".cart__wrapper .cart-block__items"
    ).scrollHeight;

    let countOfCart = calcCartLength();

    countOfOrds.textContent = countOfCart.toString();

    if (countOfCart < 1) {
      countOfOrds.classList.add("closed");
    } else {
      countOfOrds.classList.remove("closed");
    }

    if (cartInfo.items.length) {
      countOfOrds.classList.remove("closed");
    } else {
      countOfOrds.classList.add("closed");
    }

    cartInfo.cost += item.cost * item.amount;
    cartInfo.weight += item.weight * item.amount;

    allWeight.textContent = cartInfo.weight;
    allPrice.textContent = cartInfo.cost;

    checkCostWeight();
  });

  checkCartForAmount();
}

// Оформление заказа

const acceptWrapper = document.querySelector(".cart__accept");

const closeAccepting = document.getElementById("closeAccept");
const checkNumBtn = document.getElementById("checkNumber");
const numberField = document.getElementById("numberField");
const myAdresField = document.getElementById("myAdress");

let old = 0;

const inp = numberField.querySelector("input");

inp.oninput = function () {
  let curLen = inp.value.length;

  if (curLen < old) {
    old--;
    return;
  }

  if (curLen === 1) inp.value = "+" + inp.value + " (";

  if (curLen === 7) inp.value = inp.value + ") ";

  if (curLen === 12) inp.value = inp.value + "-";

  if (curLen === 15) inp.value = inp.value + "-";

  if (curLen > 18) inp.value = inp.value.substring(0, inp.value.length - 1);

  old++;
};

const newAddress = document.getElementById("newAdress");
let userFinded = false;
let isBySelf = false;
let adresFinded = false;

const closeWrapperAccept = () => {
  acceptWrapper.classList.add("closed");
};

const reloadPage = () => {
  location.reload()
}

const checkAllFields = () => {
  let allFull = true;
  let adrsFromSelect = false;

  let cannotFind = [];

  let dataOfOrder = {};

  document.querySelectorAll(".cart__accept-field").forEach((fieldItem) => {
    let thisName = fieldItem.dataset.formType;
    let value = fieldItem.querySelector("input")
      ? fieldItem.querySelector("input").value
      : false;

    if (thisName) {
      switch (thisName) {
        case "phone":
          if (value) {
            dataOfOrder.phoneNumber = value.replace("+", "");
          } else {
            allFull = false;
            cannotFind.push("Номер телефона");
          }
          break;
        case "name":
          if (value) {
            dataOfOrder.userName = value;
          } else {
            allFull = false;
            cannotFind.push("Имя");
          }
          break;
        case "birthday":
          if (!userFinded) {
            if (value) {
              dataOfOrder.birthday = value;
            } else {
              allFull = false;
              cannotFind.push("Дата рождения");
            }
          }
          break;
        case "delivery-to":
          if (!isBySelf) {
            if (value) {
              dataOfOrder.deliveryTo = fieldItem.querySelector(
                ".active"
              ).dataset.deliveryId;
              adrsFromSelect = true;
            } else {
              adrsFromSelect = false;
            }
          } else {
            dataOfOrder.bySelf = true;
          }
          break;
        case "district":
          if (!isBySelf && !adrsFromSelect) {
            if (value) {
              dataOfOrder.district = value;
            } else {
              allFull = false;
              cannotFind.push("Район");
            }
          }
          break;
        case "street":
          if (!isBySelf && !adrsFromSelect) {
            if (value) {
              dataOfOrder.street = value;
            } else {
              allFull = false;
              cannotFind.push("Улица");
            }
          }
          break;
        case "house":
          if (!isBySelf && !adrsFromSelect) {
            if (value) {
              dataOfOrder.house = value;
            } else {
              allFull = false;
              cannotFind.push("Номер дома");
            }
          }
          break;
        case "flat":
          if (!isBySelf && !adrsFromSelect) {
            if (value) {
              dataOfOrder.flat = value;
            } else {
              allFull = false;
              cannotFind.push("Номер кваритры");
            }
          }
          break;
        case "comment":
          if (!isBySelf) {
            dataOfOrder.comment = value;
          }
          break;
      }
    }
  });

  return allFull
    ? { isAll: allFull, dataOfOrder }
    : { isAll: allFull, cannotFind };
};

const checkNumber = async function () {
  let number = numberField
    .querySelector("input")
    .value.replace(" ", "")
    .replace("+", "")
    .replace(" ", "")
    .replace("(", "")
    .replace(")", "")
    .replace("-", "")
    .replace(" ", "")
    .replace("-", "");

  if (number.length) {
    let url = `https://br-yalta.ru/order/getClientInfo?token=123523&phone=${number}`;

    let response = await fetch(url);
    document.querySelector(".hidden-final").classList.remove("hidden-final");

    if (response.ok) {
      document
        .querySelector(".cart__accept-number-btns")
        .classList.add("hidden");

      let userInfo = await response.json();

      if (userInfo) {
        let userName = userInfo.client.name;
        let addressList = userInfo.addresses;

        userFinded = true;

        const userNameField = document.getElementById("userName");

        userNameField.value = userName;

        numberField.querySelector("input").setAttribute("readonly", "readonly");

        if (addressList.length) {
          adresFinded = true;

          myAdresField
            .querySelectorAll(".popup__list .popup__list-item")
            .forEach((item) => item.remove());

          addressList.forEach((adress) => {
            let field = `<div class="popup__list-item" data-delivery-id="${adress.id}">${adress.country}, ${adress.city}, ${adress.district}. ${adress.street}, ${adress.house}, кв. ${adress.flat}</div>`;

            myAdresField
              .querySelector(".popup__list")
              .insertAdjacentHTML("beforeend", field);
          });
          myAdresField.classList.remove("hidden-my");
        } else {
          myAdresField.classList.add("hidden-my");
        }

        document
          .querySelectorAll(".hideIfFinded")
          .forEach((item) => item.classList.add("hidden"));

        document
          .querySelectorAll(".hidden-default")
          .forEach((item) => item.classList.remove("hidden-default"));
        return userInfo.client;
      } else {
        newAddress.classList.add("hidden");
        document
          .querySelector(".cart__accept-fields")
          .classList.remove("hidden-sec");
      }

      document
        .querySelectorAll(".hidden-default")
        .forEach((item) => item.classList.remove("hidden-default"));
    } else {
      alert("Ошибка сервера. Повторите попытку позже");
      userFinded = false;
    }
  } else {
    document.querySelector(".cart__accept-block").reportValidity();
  }
};
const sendOrder = async function (
  userFinded,
  name,
  phone,
  delivery,
  comment,
  isSelf,
  district,
  street,
  house,
  flat,
  birthday
) {
  let arr = [];

  cartInfo.items.forEach((elem) => {
    if (elem.amount > 1) {
      for (let i = 0; i < elem.amount; i++) {
        arr.push(elem.id);
      }
    } else {
      arr.push(elem.id);
    }
  });

  console.log(arr);

  if (arr.length) {
    const orders = JSON.stringify(arr);

    let phoneNumber = phone
      .replace(" ", "")
      .replace("+", "")
      .replace(" ", "")
      .replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "")
      .replace("-", "");

    let client;

    if (userFinded) {
      client = JSON.stringify({ phone: phoneNumber });
    } else {
      client = JSON.stringify({
        phone: phoneNumber,
        name: name,
        birthday: birthday,
      });
    }

    let deliver;

    if (isSelf) {
      deliver = JSON.stringify({
        delivery_type: "Самовывоз",
        comment: comment ? comment : "",
      });
    } else if (delivery) {
      deliver = JSON.stringify({
        delivery_type: "Доставка",
        address_id: delivery,
        comment: comment ? comment : "",
      });
    } else {
      deliver = JSON.stringify({
        delivery_type: "Доставка",
        district: district,
        street: street,
        house: house,
        flat: flat,
        comment: comment ? comment : "",
      });
    }

    const url = `https://br-yalta.ru/order/create?token=1234&order=${orders}&client=${client}&delivery=${deliver}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
    xhr.send()
  
    closeWrapperAccept()
    document.querySelector('.order-result-sending__wrapper').classList.remove('closed')
    
    setTimeout(() => {
      deleteAllCart();
      reloadPage()
    }, 3000)
  } else {
    alert("Ваша корзина пуста");
  }
};

document
  .querySelector(".cart__accept-field.wth-popup")
  .addEventListener("click", (e) => {
    let target = e.target;

    if (
      target.closest("input") &&
      target.parentElement.querySelector(".popup__list")
    ) {
      target.parentElement
        .querySelector(".popup__list")
        .classList.toggle("closed");
    }

    if (target.closest(".popup__list-item")) {
      let thisText = target.closest(".popup__list-item").textContent;

      if (
        target.closest(".popup__list").querySelector(".popup__list-item.active")
      ) {
        target
          .closest(".popup__list")
          .querySelector(".popup__list-item.active")
          .classList.remove("active");
      }
      target.closest(".popup__list-item").classList.add("active");

      target
        .closest(".cart__accept-field")
        .querySelector("input").value = thisText;
      target.closest(".popup__list").classList.add("closed");
    }
  });

document.addEventListener("click", (e) => {
  let target = e.target;

  let isActive = !document
    .querySelector(".cart__accept-field.wth-popup .popup__list")
    .classList.contains("closed");
  let isOutside = !document
    .querySelector(".cart__accept-field.wth-popup .popup__list")
    .contains(target);
  let isInput = document
    .querySelector(".cart__accept-field.wth-popup")
    .contains(target);

  if (isActive && isOutside && !isInput) {
    document
      .querySelector(".cart__accept-field.wth-popup .popup__list")
      .classList.add("closed");
  }
});

document
  .querySelectorAll(".cart__accept-field-delivery-type-item")
  .forEach((item) => {
    item.addEventListener("click", () => {
      if (
        document.querySelector(".cart__accept-field-delivery-type-item.active")
      ) {
        document
          .querySelector(".cart__accept-field-delivery-type-item.active")
          .classList.remove("active");
      }

      item.classList.add("active");

      if (item.classList.contains("self")) {
        isBySelf = true;
        document
          .querySelectorAll(".selfHide")
          .forEach((item) => item.classList.add("hidden"));
        if (document.querySelector(".hidden-final")) {
          document
            .querySelector(".hidden-final")
            .classList.remove("hidden-final");
        }
      } else {
        isBySelf = false;

        document
          .querySelectorAll(".selfHide")
          .forEach((item) => item.classList.remove("hidden"));

        if (!adresFinded) {
          document.getElementById("newAdress").classList.add("hidden-default");
        }

        if (document.querySelector(".hidden-final")) {
          document
            .querySelector(".hidden-final")
            .classList.remove("hidden-final");
        }
      }
    });
  });

newAddress.addEventListener("click", (e) => {
  e.preventDefault();
  newAddress.classList.add("hidden");
  document.querySelector(".cart__accept-fields").classList.remove("hidden-sec");
});

closeAccepting.addEventListener("click", (e) => {
  e.preventDefault();
  closeWrapperAccept();
});

checkNumBtn.addEventListener("click", (e) => {
  e.preventDefault();
  checkNumber().then((r) => {});
});

acceptButton.addEventListener("click", (e) => {
  e.preventDefault();
  acceptWrapper.classList.remove("closed");
});

document
  .querySelector(".cart__accept-block a.button.button-sm.green.bold")
  .addEventListener("click", (e) => {
    e.preventDefault();

    if (checkAllFields().isAll) {
      let data = checkAllFields().dataOfOrder;

      sendOrder(
        userFinded,
        data.userName,
        data.phoneNumber,
        data.deliveryTo,
        data.comment,
        data.bySelf,
        data.district,
        data.street,
        data.house,
        data.flat,
        data.birthday
      );
    } else {
      document.querySelector(".cart__accept-block").reportValidity();
    }
  });
