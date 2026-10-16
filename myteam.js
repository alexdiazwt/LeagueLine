// myteam.js - My Team page
// a manager looks up their team and sees their application status,
// their gear request status, and what they still owe
// (team data and the find functions are in teamdata.js)

// steps for the status trackers, in order
var applicationSteps = [
    { value: "pending", label: "Submitted" },
    { value: "approved", label: "Approved" }
];

var rentalSteps = [
    { value: "pending", label: "Requested" },
    { value: "approved", label: "Ready for pickup" },
    { value: "fulfilled", label: "Picked up" }
];

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var lookupTeamName = document.getElementById("lookupTeamName");
var lookupEmail = document.getElementById("lookupEmail");
var lookupBtn = document.getElementById("lookupBtn");
var lookupMessage = document.getElementById("lookupMessage");
var teamResult = document.getElementById("teamResult");

// 670 -> "$670.00"
function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

// "2026-09-02" -> "Sep 2, 2026"
function formatDate(dateText) {
    var parts = dateText.split("-");   // ["2026", "09", "02"]
    var month = monthNames[Number(parts[1]) - 1];
    return month + " " + Number(parts[2]) + ", " + parts[0];
}

function showLookupError(text) {
    lookupMessage.textContent = text;
    lookupMessage.className = "message message-error";
}

// quantity x price for every item in the rental
function calculateGearTotal(rental) {
    var total = 0;
    for (var i = 0; i < rental.items.length; i++) {
        total = total + rental.items[i].quantity * rental.items[i].pricePerSeason;
    }
    return total;
}

// row of status steps - finished steps are "done", the current one is "current"
function buildTracker(steps, currentStatus) {
    var currentIndex = 0;
    for (var i = 0; i < steps.length; i++) {
        if (steps[i].value === currentStatus) {
            currentIndex = i;
        }
    }

    var html = '<div class="tracker">';
    for (var j = 0; j < steps.length; j++) {
        var stepClass = "track-step";
        if (j < currentIndex) {
            stepClass = "track-step done";
        } else if (j === currentIndex) {
            stepClass = "track-step current";
        }
        html = html + '<div class="' + stepClass + '">' + steps[j].label + "</div>";
    }
    return html + "</div>";
}

function buildApplicationSection(app) {
    var statusText = "We're reviewing your application. Expect an email within 3 business days.";
    if (app.status === "approved") {
        statusText = "Your team has a spot in the league. See you on the field!";
    }

    return '<div class="box">' +
            "<h2>" + app.teamName + "</h2>" +
            '<p class="meta">' + app.leagueName + ", " + app.teamSize + " players, managed by " + app.managerName + "</p>" +
            "<h3>League Application</h3>" +
            buildTracker(applicationSteps, app.status) +
            "<p>" + statusText + "</p>" +
            '<p class="meta">Submitted ' + formatDate(app.submittedAt) + "</p>" +
        "</div>";
}

function buildRentalSection(rental) {
    if (rental === null) {
        return '<div class="box">' +
                "<h2>Gear Request</h2>" +
                "<p>No gear requested yet. If your team needs bats, gloves, or jerseys, you can rent them for the season.</p>" +
                '<a class="btn-link" href="equipment.html">Rent Equipment</a>' +
            "</div>";
    }

    var statusText = "We're checking stock for your request.";
    if (rental.status === "approved") {
        statusText = "Your gear is ready. Pick it up at the Rec Park equipment shed before your first game.";
    } else if (rental.status === "fulfilled") {
        statusText = "Your team has its gear. Please return it after the final game.";
    }

    var rows = "";
    for (var i = 0; i < rental.items.length; i++) {
        var item = rental.items[i];
        var sizeText = "One size";   // bats don't have sizes
        if (item.size) {
            sizeText = item.size;
        }
        rows = rows + "<tr>" +
            "<td>" + item.name + "</td>" +
            "<td>" + sizeText + "</td>" +
            "<td>" + item.quantity + "</td>" +
            "<td>" + formatMoney(item.pricePerSeason) + "</td>" +
            "<td>" + formatMoney(item.quantity * item.pricePerSeason) + "</td>" +
            "</tr>";
    }

    return '<div class="box">' +
            "<h2>Gear Request</h2>" +
            buildTracker(rentalSteps, rental.status) +
            "<p>" + statusText + "</p>" +
            '<table class="data-table">' +
                "<tr><th>Item</th><th>Size</th><th>Qty</th><th>Each</th><th>Subtotal</th></tr>" +
                rows +
            "</table>" +
            '<p class="meta">Requested ' + formatDate(rental.requestedAt) + "</p>" +
        "</div>";
}

// nothing is due until the team is approved
function buildBalanceSection(app, rental) {
    var feeText;
    var feeDue = 0;
    if (app.status !== "approved") {
        feeText = "Due after approval";
    } else if (app.feePaid) {
        feeText = "Paid";
    } else {
        feeText = formatMoney(app.leagueFee);
        feeDue = app.leagueFee;
    }

    var gearText = "No gear requested";
    var gearDue = 0;
    if (rental !== null) {
        if (rental.gearPaid) {
            gearText = "Paid";
        } else if (app.status !== "approved") {
            gearText = formatMoney(calculateGearTotal(rental)) + " (due after approval)";
        } else {
            gearDue = calculateGearTotal(rental);
            gearText = formatMoney(gearDue);
        }
    }

    var balance = feeDue + gearDue;

    var note = "Nothing due right now.";
    if (balance > 0) {
        note = 'Pay at the Rec Park front desk before your first game. <a href="faq.html#payment">Payment options</a>';
    }

    return '<div class="box">' +
            "<h2>Season Balance</h2>" +
            '<table class="data-table">' +
                "<tr><td>League fee</td><td>" + feeText + "</td></tr>" +
                "<tr><td>Gear rental</td><td>" + gearText + "</td></tr>" +
                '<tr class="total-row"><td>Balance due</td><td>' + formatMoney(balance) + "</td></tr>" +
            "</table>" +
            '<p class="meta">' + note + "</p>" +
        "</div>";
}

// click event on Check Status (or Enter)
function handleLookup() {
    var teamName = lookupTeamName.value.trim();
    var email = lookupEmail.value.trim();

    if (teamName === "" || email === "") {
        showLookupError("Please enter your team name and manager email.");
        teamResult.innerHTML = "";
        return;
    }

    var app = findApplication(teamName, email);
    if (app === null) {
        showLookupError("We couldn't find an application for that team name and email. Check the spelling, or apply on the Softball page.");
        teamResult.innerHTML = "";
        return;
    }

    lookupMessage.className = "message";   // hide old error
    var rental = findRental(app.applicationId);

    teamResult.innerHTML = buildApplicationSection(app) + buildRentalSection(rental) + buildBalanceSection(app, rental);
}

function handleLookupEnter(event) {
    if (event.key === "Enter") {
        handleLookup();
    }
}

lookupBtn.addEventListener("click", handleLookup);
lookupTeamName.addEventListener("keydown", handleLookupEnter);
lookupEmail.addEventListener("keydown", handleLookupEnter);
