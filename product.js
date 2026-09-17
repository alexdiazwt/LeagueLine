// product.js
// this handles the softball page - shows spots left and lets someone apply for a spot on the team

var maxTeams = 12;
var registeredTeams = 8;

// spots left = max minus however many are already signed up
function calculateSpotsRemaining(max, registered) {
    var remaining = max - registered;
    if (remaining > 0) {
        return remaining;
    } else {
        return 0;
    }
}

// puts the "spots remaining" text on the page
function updateSpotsDisplay() {
    var spots = calculateSpotsRemaining(maxTeams, registeredTeams);
    var el = document.getElementById("spotsLeft");
    el.innerHTML = spots + " of " + maxTeams + " team spots remaining this season";
}

// runs when someone clicks Apply Now
function handleRegistrationSubmit() {
    var teamNameInput = document.getElementById("teamName");
    var emailInput = document.getElementById("managerEmail");
    var teamSizeInput = document.getElementById("teamSize");
    var resultBox = document.getElementById("registrationResult");

    var teamName = teamNameInput.value;
    var email = emailInput.value;
    var teamSize = teamSizeInput.value;
    var spotsLeft = calculateSpotsRemaining(maxTeams, registeredTeams);

    // all 3 fields need something in them
    if (teamName === "" || email === "" || teamSize === "") {
        alert("Please fill in your team name, email, and team size.");
        return;
    }

    // no more spots = no more applying
    if (spotsLeft <= 0) {
        alert("Sorry, this league is full. Check back next season!");
        return;
    }

    // confirm - true if they hit ok, false if cancel
    var proceed = confirm("Submit \"" + teamName + "\"'s application for the Fall Softball League?");
    if (proceed === false) {
        return;
    }

    // not touching registeredTeams here since applying isn't the same
    // as actually getting a spot yet
    resultBox.className = "success";
    resultBox.innerHTML = "<strong>Thanks, " + teamName + "!</strong> We got your " + teamSize + "-player roster - we'll confirm your spot by email at " + email + ".";

    teamNameInput.value = "";
    emailInput.value = "";
    teamSizeInput.value = "";
}