// equipment.js - equipment rental page
// builds the item cards, updates "Your Request" and the total while typing,
// and saves the gear request

// same fields as the equipment collection in MongoDB
var equipmentItems = [
    {
        itemId: "bat",
        name: "Bats",
        sport: "softball",
        pricePerSeason: 20,
        quantityAvailable: 15,
        isAvailable: true,
        details: "Aluminum slow-pitch bats, 34 inch. Grip tape included.",
        sizes: null,                  // null = no sizes
        imageUrl: "images/equip-bat.png"
    },
    {
        itemId: "glove",
        name: "Gloves",
        sport: "softball",
        pricePerSeason: 25,
        quantityAvailable: 20,
        isAvailable: true,
        details: "12 inch fielding gloves.",
        sizes: ["Left hand", "Right hand"],
        imageUrl: "images/equip-glove.png"
    },
    {
        itemId: "jersey",
        name: "Jerseys",
        sport: "softball",
        pricePerSeason: 20,
        quantityAvailable: 40,
        isAvailable: true,
        details: "Numbered team jerseys. Price also covers replacing any that are lost or damaged.",
        sizes: ["S", "M", "L", "XL", "2XL"],
        imageUrl: "images/equip-jersey.png"
    },
    {
        itemId: "catcher-gear",
        name: "Catcher's Gear Set",
        sport: "softball",
        pricePerSeason: 35,
        quantityAvailable: 0,
        isAvailable: false,
        details: "Helmet, chest protector, and shin guards.",
        sizes: null,
        imageUrl: "images/equip-catcher-gear.png"
    }
];

var equipmentList = document.getElementById("equipmentList");
var orderSummary = document.getElementById("orderSummary");
var rentalTotal = document.getElementById("rentalTotal");
var rentalTeamName = document.getElementById("rentalTeamName");
var reserveBtn = document.getElementById("reserveBtn");
var rentalMessage = document.getElementById("rentalMessage");

// updateTotal() keeps these up to date
var currentTotal = 0;
var currentItemCount = 0;
var quantitiesValid = true;
var currentLines = [];   // one line for each item (and size) picked

// 20 -> "$20.00"
function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

// green message if isSuccess is true, red if false
function showMessage(text, isSuccess) {
    rentalMessage.textContent = text;
    if (isSuccess) {
        rentalMessage.className = "message message-success";
    } else {
        rentalMessage.className = "message message-error";
    }
}

// id of a quantity box: qty-bat for items without sizes,
// qty-jersey-0, qty-jersey-1... for each size
function getInputId(item, sizeNumber) {
    if (item.sizes === null) {
        return "qty-" + item.itemId;
    }
    return "qty-" + item.itemId + "-" + sizeNumber;
}

// one quantity box, or one small box for each size
function buildQuantityInputs(item, disabledText) {
    if (item.sizes === null) {
        return '<label for="' + getInputId(item, 0) + '">Quantity</label>' +
            '<input type="number" class="qty-input" id="' + getInputId(item, 0) + '" min="0" value="0"' + disabledText + ">";
    }

    var html = '<p class="size-label">Quantity by size</p><div class="size-grid">';
    for (var i = 0; i < item.sizes.length; i++) {
        html = html +
            '<div class="size-field">' +
                '<label for="' + getInputId(item, i) + '">' + item.sizes[i] + "</label>" +
                '<input type="number" class="qty-input" id="' + getInputId(item, i) + '" min="0" value="0"' + disabledText + ">" +
            "</div>";
    }
    return html + "</div>";
}

// HTML for one item card: photo on top, then the info
function buildItemCard(item) {
    var stockText = item.quantityAvailable + " available this season";
    var stockClass = "stock";
    var disabledText = "";
    if (item.isAvailable === false) {
        stockText = "Out of stock this season";
        stockClass = "stock stock-out";
        disabledText = " disabled";
    }

    return '<div class="equipment-card">' +
            '<img src="' + item.imageUrl + '" alt="' + item.name + '" class="equipment-photo">' +
            '<div class="equipment-info">' +
                "<h3>" + item.name + "</h3>" +
                '<p class="item-price">' + formatMoney(item.pricePerSeason) + ' <span class="meta">each, for the season</span></p>' +
                '<p class="' + stockClass + '">' + stockText + "</p>" +
                '<p class="item-details meta">' + item.details + "</p>" +
                buildQuantityInputs(item, disabledText) +
            "</div>" +
        "</div>";
}

function renderEquipment() {
    var html = "";
    for (var i = 0; i < equipmentItems.length; i++) {
        html = html + buildItemCard(equipmentItems[i]);
    }
    equipmentList.innerHTML = html;
}

// shows what's picked in the "Your Request" box
function renderOrderSummary() {
    if (currentLines.length === 0) {
        orderSummary.innerHTML = '<li class="meta">Nothing added yet. Type a quantity on any item.</li>';
        return;
    }
    var html = "";
    for (var i = 0; i < currentLines.length; i++) {
        var line = currentLines[i];
        var label = line.name;
        if (line.size !== null) {
            label = label + " (" + line.size + ")";
        }
        html = html + "<li><span>" + line.quantity + " x " + label + "</span><span>" +
            formatMoney(line.quantity * line.pricePerSeason) + "</span></li>";
    }
    orderSummary.innerHTML = html;
}

// checks one quantity box, adds it to the lines if it's more than 0
// returns the number typed, or -1 if it's not a whole number 0 or more
function readQuantity(item, sizeNumber, lines) {
    var input = document.getElementById(getInputId(item, sizeNumber));
    var qty = Number(input.value);   // input value is a string

    if (Number.isInteger(qty) === false || qty < 0) {
        input.classList.add("input-error");
        return -1;
    }
    input.classList.remove("input-error");

    if (qty > 0) {
        var size = null;
        if (item.sizes !== null) {
            size = item.sizes[sizeNumber];
        }
        lines.push({ itemId: item.itemId, name: item.name, size: size, quantity: qty, pricePerSeason: item.pricePerSeason });
    }
    return qty;
}

// input event - runs every time a quantity changes
function updateTotal() {
    var total = 0;
    var itemCount = 0;
    var allValid = true;
    var problemText = "";
    var lines = [];

    for (var i = 0; i < equipmentItems.length; i++) {
        var item = equipmentItems[i];
        var itemQty = 0;
        var itemValid = true;

        // how many boxes this item has (1, or one per size)
        var boxCount = 1;
        if (item.sizes !== null) {
            boxCount = item.sizes.length;
        }

        for (var j = 0; j < boxCount; j++) {
            var qty = readQuantity(item, j, lines);
            if (qty === -1) {
                itemValid = false;
                problemText = item.name + ": enter whole numbers of 0 or more.";
            } else {
                itemQty = itemQty + qty;
            }
        }

        // all sizes together can't be more than what's in stock
        if (itemValid && itemQty > item.quantityAvailable) {
            itemValid = false;
            problemText = item.name + ": only " + item.quantityAvailable + " available this season.";
            for (var k = 0; k < boxCount; k++) {
                document.getElementById(getInputId(item, k)).classList.add("input-error");
            }
        }

        if (itemValid) {
            total = total + itemQty * item.pricePerSeason;
            itemCount = itemCount + itemQty;
        } else {
            allValid = false;
        }
    }

    currentTotal = total;
    currentItemCount = itemCount;
    quantitiesValid = allValid;
    currentLines = lines;

    rentalTotal.textContent = formatMoney(total);
    renderOrderSummary();

    if (allValid) {
        rentalMessage.className = "message";   // hide old error
    } else {
        showMessage(problemText, false);
    }
}

// mouseenter / mouseleave - show or hide the item details
function showDetails() {
    this.classList.add("show-details");
}

function hideDetails() {
    this.classList.remove("show-details");
}

// click event on Request Gear
function handleReserveClick() {
    var teamName = rentalTeamName.value.trim();

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

    // the team has to apply first
    var application = findApplicationByTeamName(teamName);
    if (application === null) {
        showMessage("We couldn't find a league application for \"" + teamName + "\". Apply on the Softball page first, using the same team name.", false);
        return;
    }
    if (findRental(application.applicationId) !== null) {
        showMessage(application.teamName + " already has a gear request. You can check its status on the My Team page.", false);
        return;
    }

    // same fields as the rentals collection
    var rental = {
        rentalId: "RENT-" + (getAllRentals().length + 2001),
        applicationId: application.applicationId,
        status: "pending",
        requestedAt: todayText(),
        items: currentLines,
        gearPaid: false
    };
    saveRental(rental);

    var savedCount = currentItemCount;
    var savedTotal = currentTotal;

    // reset the form
    var allInputs = document.querySelectorAll(".qty-input");
    for (var i = 0; i < allInputs.length; i++) {
        allInputs[i].value = 0;
    }
    rentalTeamName.value = "";
    updateTotal();

    showMessage("Thanks, " + application.teamName + "! We got your request for " + savedCount +
        " item(s), " + formatMoney(savedTotal) + " for the season. Track it on the My Team page.", true);
}

// build the cards first, then add the listeners to them
renderEquipment();
renderOrderSummary();

var cards = document.querySelectorAll(".equipment-card");
for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("mouseenter", showDetails);
    cards[i].addEventListener("mouseleave", hideDetails);
}

var qtyInputs = document.querySelectorAll(".qty-input");
for (var j = 0; j < qtyInputs.length; j++) {
    qtyInputs[j].addEventListener("input", updateTotal);
}

reserveBtn.addEventListener("click", handleReserveClick);
