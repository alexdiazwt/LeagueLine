// faq.js - FAQ and contact page

// click a question to open or close its answer
// this = the question button, its parent is the .faq-item box
function toggleAnswer() {
    var item = this.parentElement;
    item.classList.toggle("open");   // adds "open" if it's not there, removes it if it is
}

var questions = document.querySelectorAll(".faq-question");
for (var i = 0; i < questions.length; i++) {
    questions[i].addEventListener("click", toggleAnswer);
}

// contact form
var minMessageLength = 10;

var contactName = document.getElementById("contactName");
var contactEmail = document.getElementById("contactEmail");
var contactTopic = document.getElementById("contactTopic");
var contactMessage = document.getElementById("contactMessage");
var contactBtn = document.getElementById("contactBtn");
var contactResult = document.getElementById("contactResult");

// green message if isSuccess is true, red if false
function showContactMessage(text, isSuccess) {
    contactResult.textContent = text;
    if (isSuccess) {
        contactResult.className = "message message-success";
    } else {
        contactResult.className = "message message-error";
    }
}

// same email check as the softball page
function looksLikeEmail(email) {
    var atPosition = email.indexOf("@");
    var dotPosition = email.lastIndexOf(".");
    return atPosition >= 1 && dotPosition >= atPosition + 2;
}

// click event on Send Message
function handleContactSubmit() {
    var name = contactName.value.trim();
    var email = contactEmail.value.trim();
    var message = contactMessage.value.trim();
    var topic = contactTopic.value;

    if (name === "" || email === "" || message === "") {
        showContactMessage("Please fill in your name, email, and message.", false);
        return;
    }
    if (looksLikeEmail(email) === false) {
        showContactMessage("Please enter a valid email, like manager@email.com.", false);
        return;
    }
    if (message.length < minMessageLength) {
        showContactMessage("Please write at least " + minMessageLength + " characters so we know how to help.", false);
        return;
    }

    showContactMessage("Thanks, " + name + "! We got your " + topic + " question and will reply to " + email + " within 1 business day.", true);

    contactName.value = "";
    contactEmail.value = "";
    contactMessage.value = "";
    contactTopic.value = "league";
}

contactBtn.addEventListener("click", handleContactSubmit);
