// confirmbox.js
// shows a Confirm / Cancel box on the page instead of the confirm() popup
// used on the softball form and the reviews form
//
// box          = the message div under the button
// questionText = the question to ask
// confirmLabel = text on the confirm button
// onConfirm    = function that only runs if they click confirm

function askToConfirm(box, questionText, confirmLabel, onConfirm) {
    box.className = "message message-confirm";
    box.innerHTML = "";

    var question = document.createElement("p");
    question.textContent = questionText;

    var confirmButton = document.createElement("button");
    confirmButton.type = "button";
    confirmButton.textContent = confirmLabel;

    var cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "btn-plain";
    cancelButton.textContent = "Cancel";

    confirmButton.addEventListener("click", function () {
        onConfirm();
    });

    // cancel hides the box and leaves the form alone
    cancelButton.addEventListener("click", function () {
        box.className = "message";
        box.textContent = "";
    });

    box.appendChild(question);
    box.appendChild(confirmButton);
    box.appendChild(cancelButton);
}
