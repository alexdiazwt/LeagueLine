// product.js
// this handles the softball page - shows spots left and lets someone apply for a spot on the team
// HW3: the Apply button now uses addEventListener, the team size box checks itself
// while you type, and messages show on the page instead of in alert() popups.

var maxTeams = 12;
var registeredTeams = 8;

var minPlayers = 10;
var maxPlayers = 20;

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

// shows a green (isSuccess = true) or red (isSuccess = false) message under the button
function showRegistrationMessage(text, isSuccess) {
    var resultBox = document.getElementById("registrationResult");
    resultBox.textContent = text;
    if (isSuccess) {
        resultBox.className = "message message-success";
    } else {
        resultBox.className = "message message-error";
    }
}

// true if the team size is a whole number between minPlayers and maxPlayers
function isValidTeamSize(sizeText) {
    var size = Number(sizeText);       // the input gives us a string, turn it into a number
    return sizeText !== "" && Number.isInteger(size) && size >= minPlayers && size <= maxPlayers;
}

// runs on every keystroke in the Team Size box (the "input" event)
function handleTeamSizeInput() {
    var teamSizeInput = document.getElementById("teamSize");
    var hint = document.getElementById("teamSizeHint");
    var sizeText = teamSizeInput.value;

    if (sizeText === "") {
        hint.textContent = "Teams need " + minPlayers + " to " + maxPlayers + " players.";
        hint.className = "hint";
        teamSizeInput.classList.remove("input-error");
    } else if (isValidTeamSize(sizeText)) {
        hint.textContent = "Looks good - " + sizeText + " players.";
        hint.className = "hint hint-ok";
        teamSizeInput.classList.remove("input-error");
    } else {
        hint.textContent = "Team size must be a whole number from " + minPlayers + " to " + maxPlayers + ".";
        hint.className = "hint hint-error";
        teamSizeInput.classList.add("input-error");
    }
}

// runs when someone clicks Apply Now
function handleRegistrationSubmit() {
    var teamNameInput = document.getElementById("teamName");
    var emailInput = document.getElementById("managerEmail");
    var teamSizeInput = document.getElementById("teamSize");

    var teamName = teamNameInput.value.trim();
    var email = emailInput.value.trim();
    var teamSize = teamSizeInput.value;
    var spotsLeft = calculateSpotsRemaining(maxTeams, registeredTeams);

    // all 3 fields need something in them
    if (teamName === "" || email === "" || teamSize === "") {
        showRegistrationMessage("Please fill in your team name, email, and team size.", false);
        return;
    }

    // basic email check - just makes sure it has an @ and a dot after it
    var atPosition = email.indexOf("@");
    var dotPosition = email.lastIndexOf(".");
    if (atPosition < 1 || dotPosition < atPosition + 2) {
        showRegistrationMessage("Please enter a valid email, like manager@email.com.", false);
        return;
    }

    if (isValidTeamSize(teamSize) === false) {
        showRegistrationMessage("Team size must be from " + minPlayers + " to " + maxPlayers + " players.", false);
        return;
    }

    // no more spots = no more applying
    if (spotsLeft <= 0) {
        showRegistrationMessage("Sorry, this league is full. Check back next season!", false);
        return;
    }

    // confirm - true if they hit ok, false if cancel
    var proceed = confirm("Submit \"" + teamName + "\"'s application for the Fall Softball League?");
    if (proceed === false) {
        return;
    }

    // not touching registeredTeams here since applying isn't the same
    // as actually getting a spot yet
    showRegistrationMessage(
        "Thanks, " + teamName + "! We got your " + teamSize + "-player roster - we'll confirm your spot by email at " + email + ".",
        true
    );

    teamNameInput.value = "";
    emailInput.value = "";
    teamSizeInput.value = "";
    handleTeamSizeInput();   // resets the hint text back to normal
}

// attach the listeners
document.getElementById("teamSize").addEventListener("input", handleTeamSizeInput);
document.getElementById("applyBtn").addEventListener("click", handleRegistrationSubmit);

// keyboard event: pressing Enter in any of the 3 form boxes submits the application,
// the same as clicking Apply Now. "event" is the event object the browser passes in -
// event.key is a string naming the key that was pressed ("Enter", "a", "Escape", ...).
function handleEnterKey(event) {
    if (event.key === "Enter") {
        handleRegistrationSubmit();
    }
}

document.getElementById("teamName").addEventListener("keydown", handleEnterKey);
document.getElementById("managerEmail").addEventListener("keydown", handleEnterKey);
document.getElementById("teamSize").addEventListener("keydown", handleEnterKey);
