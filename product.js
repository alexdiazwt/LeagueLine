// product.js - softball league page
// shows spots left, checks the application form, and saves the application

var maxTeams = 12;
var registeredTeams = 8;

var minPlayers = 10;
var maxPlayers = 20;

// spots left = max minus teams already signed up
function calculateSpotsRemaining(max, registered) {
    var remaining = max - registered;
    if (remaining > 0) {
        return remaining;
    } else {
        return 0;
    }
}

function updateSpotsDisplay() {
    var spots = calculateSpotsRemaining(maxTeams, registeredTeams);
    var el = document.getElementById("spotsLeft");
    el.innerHTML = spots + " of " + maxTeams + " team spots remaining this season";
}

// gets the softball league's numbers from MongoDB when the page opens
// (the numbers at the top stay as a backup if the server can't be reached)
async function loadLeague() {
    try {
        var response = await fetch("/api/leagues");
        var leagues = await response.json();
        for (var i = 0; i < leagues.length; i++) {
            if (leagues[i].leagueId === "softball-fall-2026") {
                maxTeams = leagues[i].maxTeams;
                registeredTeams = leagues[i].registeredTeams;
                minPlayers = leagues[i].minPlayers;
                maxPlayers = leagues[i].maxPlayers;
            }
        }
    } catch (error) {
        // keep the backup numbers
    }
    updateSpotsDisplay();
    handleTeamSizeInput();   // refresh the "Teams need X to Y players" hint
}

// green message if isSuccess is true, red if false
function showRegistrationMessage(text, isSuccess) {
    var resultBox = document.getElementById("registrationResult");
    resultBox.textContent = text;
    if (isSuccess) {
        resultBox.className = "message message-success";
    } else {
        resultBox.className = "message message-error";
    }
}

// team size has to be a whole number from 10 to 20
function isValidTeamSize(sizeText) {
    var size = Number(sizeText);   // input value is a string
    return sizeText !== "" && Number.isInteger(size) && size >= minPlayers && size <= maxPlayers;
}

// input event - checks team size while typing
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

// click event on Apply Now
function handleRegistrationSubmit() {
    var teamName = document.getElementById("teamName").value.trim();
    var managerName = document.getElementById("managerName").value.trim();
    var email = document.getElementById("managerEmail").value.trim();
    var teamSize = document.getElementById("teamSize").value;
    var spotsLeft = calculateSpotsRemaining(maxTeams, registeredTeams);

    if (teamName === "" || managerName === "" || email === "" || teamSize === "") {
        showRegistrationMessage("Please fill in your team name, manager name, email, and team size.", false);
        return;
    }

    // basic email check - needs an @ and a dot after it
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

    if (spotsLeft <= 0) {
        showRegistrationMessage("Sorry, this league is full. Check back next season!", false);
        return;
    }

    // confirm on the page (confirmbox.js)
    // saveTeamApplication only runs if they click Submit Application
    askToConfirm(
        document.getElementById("registrationResult"),
        "Submit " + teamName + "'s application (" + teamSize + " players) for the Fall 2026 Coed Softball League?",
        "Submit Application",
        function () {
            saveTeamApplication(teamName, managerName, email, teamSize);
        }
    );
}

// sends the application to the server after they confirm
async function saveTeamApplication(teamName, managerName, email, teamSize) {
    try {
        var response = await fetch("/api/applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                teamName: teamName,
                managerName: managerName,
                managerEmail: email,
                teamSize: teamSize
            })
        });
        var data = await response.json();

        // the server said no (bad data or name taken) - show its message
        if (response.ok === false) {
            showRegistrationMessage(data.error, false);
            return;
        }

        showRegistrationMessage(
            "Thanks, " + data.teamName + "! Application " + data.applicationId + " is pending, and we'll confirm your spot by email at " +
            data.managerEmail + ". Next step: rent any gear your team needs on the Equipment page. " +
            "You can check your status anytime on My Team - just enter your team name and email to see your application, gear, and balance.",
            true
        );

        document.getElementById("teamName").value = "";
        document.getElementById("managerName").value = "";
        document.getElementById("managerEmail").value = "";
        document.getElementById("teamSize").value = "";
        handleTeamSizeInput();
    } catch (error) {
        // the server is off or unreachable
        showRegistrationMessage("We couldn't reach LeagueLine right now. Please try again in a minute.", false);
    }
}

document.getElementById("teamSize").addEventListener("input", handleTeamSizeInput);
document.getElementById("applyBtn").addEventListener("click", handleRegistrationSubmit);

// pressing Enter in a form box works like clicking Apply Now
// preventDefault stops Enter from also clicking the confirm button
function handleEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        handleRegistrationSubmit();
    }
}

document.getElementById("teamName").addEventListener("keydown", handleEnterKey);
document.getElementById("managerName").addEventListener("keydown", handleEnterKey);
document.getElementById("managerEmail").addEventListener("keydown", handleEnterKey);
document.getElementById("teamSize").addEventListener("keydown", handleEnterKey);
