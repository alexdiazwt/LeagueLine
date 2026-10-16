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

    // no two teams with the same name
    if (findApplicationByTeamName(teamName) !== null) {
        showRegistrationMessage("A team named \"" + teamName + "\" has already applied. Check its status on the My Team page, or pick a different name.", false);
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

// saves the application after they confirm
function saveTeamApplication(teamName, managerName, email, teamSize) {
    // new id after the last one, like APP-1004
    var newId = "APP-" + (getAllApplications().length + 1001);

    // same fields as the applications collection
    var application = {
        applicationId: newId,
        teamName: teamName,
        managerName: managerName,
        managerEmail: email,
        leagueId: "softball-fall-2026",
        leagueName: "Fall 2026 Coed Softball League",
        teamSize: Number(teamSize),
        status: "pending",
        submittedAt: todayText(),
        leagueFee: 250,
        feePaid: false
    };

    saveApplication(application);

    // registeredTeams stays the same - applying isn't the same as getting a spot
    showRegistrationMessage(
        "Thanks, " + teamName + "! We got your " + teamSize + "-player roster - we'll confirm your spot by email at " + email +
        ". You can check your status anytime on the My Team page.",
        true
    );

    document.getElementById("teamName").value = "";
    document.getElementById("managerName").value = "";
    document.getElementById("managerEmail").value = "";
    document.getElementById("teamSize").value = "";
    handleTeamSizeInput();   // reset the hint text
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
