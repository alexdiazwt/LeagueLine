// equipment.js
// Equipment rental page:
//   1. builds the item cards from the equipmentItems list
//   2. mouseenter / mouseleave  -> shows or hides each item's details
//   3. input (typing a quantity) -> updates the season total live
//   4. click (Request Gear)      -> checks everything and confirms the request

// ---------------------------------------------------------------
// DATA
// Each object uses the same field names and data types as a document
// in the MongoDB "equipment" collection (see mongo/equipment-seed.js).
// Later, this list can come from the database instead of being typed here.
// ---------------------------------------------------------------
const equipmentItems = [
    {
        itemId: "bat",                  // string
        name: "Bats",                   // string
        sport: "softball",              // string
        pricePerSeason: 20,             // number
        quantityAvailable: 15,          // number
        isAvailable: true,              // Boolean
        details: "Aluminum slow-pitch bats, 34 inch. Grip tape included.",
        sizes: null                     // null = no sizes for this item
    },
    {
        itemId: "glove",
        name: "Gloves",
        sport: "softball",
        pricePerSeason: 25,
        quantityAvailable: 20,
        isAvailable: true,
        details: "12 inch fielding gloves.",
        sizes: ["Left hand", "Right hand"]
    },
    {
        itemId: "jersey",
        name: "Jerseys",
        sport: "softball",
        pricePerSeason: 20,
        quantityAvailable: 40,
        isAvailable: true,
        details: "Numbered team jerseys. Price also covers replacing any that are lost or damaged.",
        sizes: ["S", "M", "L", "XL", "2XL"]
    },
    {
        itemId: "catcher-gear",
        name: "Catcher's Gear Set",
        sport: "softball",
        pricePerSeason: 35,
        quantityAvailable: 0,
        isAvailable: false,
        details: "Helmet, chest protector, and shin guards.",
        sizes: null
    }
];

// ---------------------------------------------------------------
// PAGE ELEMENTS (grabbed once, used by the functions below)
// ---------------------------------------------------------------
const equipmentList = document.getElementById("equipmentList");
const rentalTotal = document.getElementById("rentalTotal");
const rentalTeamName = document.getElementById("rentalTeamName");
const reserveBtn = document.getElementById("reserveBtn");
const rentalMessage = document.getElementById("rentalMessage");

// Current state of the order. updateTotal() keeps these up to date.
let currentTotal = 0;          // number: dollars
let currentItemCount = 0;      // number: how many pieces of gear
let quantitiesValid = true;    // Boolean: false if any quantity box is wrong

// ---------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------

// 20 -> "$20.00"
function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

// Shows a message box under the button. isSuccess is a Boolean:
// true = green box, false = red box.
function showMessage(text, isSuccess) {
    rentalMessage.textContent = text;
    if (isSuccess) {
        rentalMessage.className = "message message-success";
    } else {
        rentalMessage.className = "message message-error";
    }
}

// Builds the HTML for one item card.
function buildItemCard(item) {
    let stockText;
    if (item.isAvailable) {
        stockText = item.quantityAvailable + " available this season";
    } else {
        stockText = "Out of stock this season";
    }

    let sizesText = "";
    if (item.sizes !== null) {
        sizesText = "<br>Options: " + item.sizes.join(", ");
    }

    // disabled on the input if the item can't be rented
    let disabledText = "";
    if (item.isAvailable === false) {
        disabledText = " disabled";
    }

    return (
        '<div class="review equipment-card">' +
            "<p><strong>" + item.name + "</strong></p>" +
            '<p class="meta">' + formatMoney(item.pricePerSeason) + " each, for the season</p>" +
            '<p class="item-details meta">' + item.details + sizesText + "<br><em>" + stockText + "</em></p>" +
            '<label for="qty-' + item.itemId + '">Quantity</label>' +
            '<input type="number" class="qty-input" id="qty-' + item.itemId + '"' +
            ' min="0" max="' + item.quantityAvailable + '" value="0"' + disabledText + ">" +
        "</div>"
    );
}

// Puts every item card on the page.
function renderEquipment() {
    let html = "";
    for (let i = 0; i < equipmentItems.length; i++) {
        html = html + buildItemCard(equipmentItems[i]);
    }
    equipmentList.innerHTML = html;
}

// Reads every quantity box, checks it, and updates the total.
function updateTotal() {
    let total = 0;
    let itemCount = 0;
    let allValid = true;
    let problemText = "";

    for (let i = 0; i < equipmentItems.length; i++) {
        const item = equipmentItems[i];
        const input = document.getElementById("qty-" + item.itemId);

        // input.value is always a STRING ("3"), so turn it into a number
        const qty = Number(input.value);

        const isWholeNumber = Number.isInteger(qty);
        const inRange = qty >= 0 && qty <= item.quantityAvailable;

        if (isWholeNumber && inRange) {
            input.classList.remove("input-error");
            total = total + qty * item.pricePerSeason;
            itemCount = itemCount + qty;
        } else {
            input.classList.add("input-error");
            allValid = false;
            problemText = item.name + ": enter a whole number from 0 to " + item.quantityAvailable + ".";
        }
    }

    currentTotal = total;
    currentItemCount = itemCount;
    quantitiesValid = allValid;

    rentalTotal.textContent = formatMoney(total);

    if (allValid) {
        rentalMessage.className = "message";      // hide any old error
    } else {
        showMessage(problemText, false);
    }
}

// ---------------------------------------------------------------
// EVENT HANDLERS
// ---------------------------------------------------------------

// mouseenter: "this" is the card the mouse just moved onto
function showDetails() {
    this.classList.add("show-details");
}

// mouseleave: hide the details again
function hideDetails() {
    this.classList.remove("show-details");
}

// click on Request Gear
function handleReserveClick() {
    const teamName = rentalTeamName.value.trim();   // trim() removes spaces at the ends

    if (teamName === "") {
        showMessage("Please enter your team name.", false);
        return;
    }
    if (quantitiesValid === false) {
        showMessage("Please fix the highlighted quantity first.", false);
        return;
    }
    if (currentItemCount === 0) {
        showMessage("Add at least one item before requesting gear.", false);
        return;
    }

    showMessage(
        "Thanks, " + teamName + "! We got your request for " + currentItemCount +
        " item(s), " + formatMoney(currentTotal) + " for the season. We'll email you when it's ready to pick up.",
        true
    );

    // reset the form
    const qtyInputs = document.querySelectorAll(".qty-input");
    for (let i = 0; i < qtyInputs.length; i++) {
        qtyInputs[i].value = 0;
    }
    rentalTeamName.value = "";
    currentTotal = 0;
    currentItemCount = 0;
    rentalTotal.textContent = formatMoney(0);
}

// ---------------------------------------------------------------
// START-UP: build the page, then attach the listeners
// (the cards must exist before listeners can be attached to them)
// ---------------------------------------------------------------
renderEquipment();

const cards = document.querySelectorAll(".equipment-card");
for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("mouseenter", showDetails);
    cards[i].addEventListener("mouseleave", hideDetails);
}

const qtyInputs = document.querySelectorAll(".qty-input");
for (let i = 0; i < qtyInputs.length; i++) {
    qtyInputs[i].addEventListener("input", updateTotal);
}

reserveBtn.addEventListener("click", handleReserveClick);
