// teamdata.js
// Team data shared by the Softball, Equipment, My Team, and Reviews pages.
// New applications, gear requests, and reviews get saved in localStorage
// for now. Later this will save to MongoDB through Express instead.

// demo teams (same fields as the applications collection)
var teamApplications = [
    {
        applicationId: "APP-1001",
        teamName: "Buffalo Herd",
        managerName: "Marcus T.",
        managerEmail: "marcus@email.com",
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: 14,
        status: "approved",       // pending or approved
        submittedAt: "2026-09-02",
        leagueFee: 250,
        feePaid: false
    },
    {
        applicationId: "APP-1002",
        teamName: "Dust Devils",
        managerName: "Priya S.",
        managerEmail: "priya@email.com",
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: 12,
        status: "approved",
        submittedAt: "2026-08-28",
        leagueFee: 250,
        feePaid: true
    },
    {
        applicationId: "APP-1003",
        teamName: "Canyon Crushers",
        managerName: "Jordan R.",
        managerEmail: "jordan@email.com",
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: 11,
        status: "pending",
        submittedAt: "2026-10-12",
        leagueFee: 250,
        feePaid: false
    }
];

// demo gear requests (same fields as the rentals collection)
// applicationId connects each rental to a team
var gearRentals = [
    {
        rentalId: "RENT-2001",
        applicationId: "APP-1001",
        status: "approved",       // pending, approved, or fulfilled
        requestedAt: "2026-09-05",
        items: [
            { itemId: "bat", name: "Bats", size: null, quantity: 2, pricePerSeason: 20 },
            { itemId: "glove", name: "Gloves", size: "Left hand", quantity: 1, pricePerSeason: 25 },
            { itemId: "glove", name: "Gloves", size: "Right hand", quantity: 3, pricePerSeason: 25 },
            { itemId: "jersey", name: "Jerseys", size: "S", quantity: 2, pricePerSeason: 20 },
            { itemId: "jersey", name: "Jerseys", size: "M", quantity: 5, pricePerSeason: 20 },
            { itemId: "jersey", name: "Jerseys", size: "L", quantity: 4, pricePerSeason: 20 },
            { itemId: "jersey", name: "Jerseys", size: "XL", quantity: 3, pricePerSeason: 20 }
        ],
        gearPaid: false
    },
    {
        rentalId: "RENT-2002",
        applicationId: "APP-1002",
        status: "fulfilled",
        requestedAt: "2026-08-30",
        items: [
            { itemId: "jersey", name: "Jerseys", size: "M", quantity: 4, pricePerSeason: 20 },
            { itemId: "jersey", name: "Jerseys", size: "L", quantity: 5, pricePerSeason: 20 },
            { itemId: "jersey", name: "Jerseys", size: "XL", quantity: 3, pricePerSeason: 20 }
        ],
        gearPaid: true
    }
];

// names used to save each list in localStorage
var applicationsKey = "leagueline.applications";
var rentalsKey = "leagueline.rentals";
var reviewsKey = "leagueline.reviews";

// gets a saved list (empty list if nothing is saved yet)
// localStorage only holds text, so JSON.parse turns it back into an array
function loadSavedList(key) {
    var text = localStorage.getItem(key);
    if (text === null) {
        return [];
    }
    return JSON.parse(text);
}

// saves a list as text with JSON.stringify
function saveList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

// demo teams + teams saved in this browser
function getAllApplications() {
    var all = [];
    var saved = loadSavedList(applicationsKey);
    for (var i = 0; i < teamApplications.length; i++) {
        all.push(teamApplications[i]);
    }
    for (var j = 0; j < saved.length; j++) {
        all.push(saved[j]);
    }
    return all;
}

// demo rentals + rentals saved in this browser
function getAllRentals() {
    var all = [];
    var saved = loadSavedList(rentalsKey);
    for (var i = 0; i < gearRentals.length; i++) {
        all.push(gearRentals[i]);
    }
    for (var j = 0; j < saved.length; j++) {
        all.push(saved[j]);
    }
    return all;
}

function saveApplication(application) {
    var saved = loadSavedList(applicationsKey);
    saved.push(application);
    saveList(applicationsKey, saved);
}

function saveRental(rental) {
    var saved = loadSavedList(rentalsKey);
    saved.push(rental);
    saveList(rentalsKey, saved);
}

// finds a team by name AND email (used on My Team)
// toLowerCase so capital letters don't matter
function findApplication(teamName, email) {
    var applications = getAllApplications();
    for (var i = 0; i < applications.length; i++) {
        var app = applications[i];
        if (app.teamName.toLowerCase() === teamName.toLowerCase() &&
            app.managerEmail.toLowerCase() === email.toLowerCase()) {
            return app;
        }
    }
    return null;
}

// finds a team by name only (used on Softball and Equipment)
function findApplicationByTeamName(teamName) {
    var applications = getAllApplications();
    for (var i = 0; i < applications.length; i++) {
        if (applications[i].teamName.toLowerCase() === teamName.toLowerCase()) {
            return applications[i];
        }
    }
    return null;
}

// finds the gear request for a team, or null if they don't have one
function findRental(applicationId) {
    var rentals = getAllRentals();
    for (var i = 0; i < rentals.length; i++) {
        if (rentals[i].applicationId === applicationId) {
            return rentals[i];
        }
    }
    return null;
}

// today's date like "2026-10-15"
function todayText() {
    var now = new Date();
    var month = now.getMonth() + 1;   // getMonth starts at 0
    var day = now.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    return now.getFullYear() + "-" + month + "-" + day;
}
