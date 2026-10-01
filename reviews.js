// reviews.js
// Reviews page:
//   change (rating dropdown)   -> star preview next to the label updates
//   input  (typing a comment)  -> live character counter
//   click  (Submit Feedback)   -> checks the form, adds the review to the list,
//                                 and recalculates the average rating

var minCommentLength = 20;
var maxCommentLength = 300;   // matches maxlength="300" on the textarea

// turns a rating number like 4 into "★★★★☆"
function renderStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

// averages the data-rating of every review in the list and shows it at the top
function updateRatingSummary() {
    var reviews = document.querySelectorAll("#reviewList .review");
    var total = 0;

    for (var i = 0; i < reviews.length; i++) {
        total = total + Number(reviews[i].dataset.rating);   // dataset.rating is a string
    }

    var summary = document.getElementById("ratingSummary");
    if (reviews.length === 0) {
        summary.textContent = "No reviews yet.";
        return;
    }

    var average = total / reviews.length;
    summary.textContent = "Average rating: " + average.toFixed(1) + " out of 5 (" + reviews.length + " reviews)";
}

// "change" event on the rating dropdown
function handleRatingChange() {
    var rating = Number(document.getElementById("reviewRating").value);
    document.getElementById("starPreview").textContent = renderStars(rating);
}

// "input" event on the comment box - runs on every keystroke
function handleCommentInput() {
    var length = document.getElementById("reviewComment").value.trim().length;
    var counter = document.getElementById("charCount");

    counter.textContent = length + " / " + maxCommentLength + " characters (at least " + minCommentLength + ")";

    if (length === 0) {
        counter.className = "hint";
    } else if (length < minCommentLength) {
        counter.className = "hint hint-error";
    } else {
        counter.className = "hint hint-ok";
    }
}

// green (isSuccess = true) or red (isSuccess = false) message under the button
function showFeedbackMessage(text, isSuccess) {
    var box = document.getElementById("feedbackMessage");
    box.textContent = text;
    if (isSuccess) {
        box.className = "message message-success";
    } else {
        box.className = "message message-error";
    }
}

// builds a new review block. textContent is used for the name and comment
// so anything a user types is shown as plain text, never run as HTML.
function buildReviewElement(name, rating, comment) {
    var reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    reviewDiv.dataset.rating = rating;          // becomes data-rating="4"

    var header = document.createElement("p");
    var nameTag = document.createElement("strong");
    nameTag.textContent = name;
    var starTag = document.createElement("span");
    starTag.className = "stars";
    starTag.textContent = renderStars(rating);
    header.appendChild(nameTag);
    header.appendChild(document.createTextNode(" - "));
    header.appendChild(starTag);

    var body = document.createElement("p");
    body.textContent = comment;

    reviewDiv.appendChild(header);
    reviewDiv.appendChild(body);
    return reviewDiv;
}

// "click" event on Submit Feedback
function handleFeedbackSubmit() {
    var nameInput = document.getElementById("reviewerName");
    var ratingSelect = document.getElementById("reviewRating");
    var commentInput = document.getElementById("reviewComment");

    var name = nameInput.value.trim();
    var rating = Number(ratingSelect.value);    // "4" -> 4
    var comment = commentInput.value.trim();

    if (name === "") {
        showFeedbackMessage("Please enter your name.", false);
        return;
    }
    if (comment.length < minCommentLength) {
        showFeedbackMessage("Please write at least " + minCommentLength + " characters about your season.", false);
        return;
    }

    var proceed = confirm("Submit this feedback for " + name + "?");
    if (proceed === false) {
        return;
    }

    // add the new review to the end of the list, then redo the average
    document.getElementById("reviewList").appendChild(buildReviewElement(name, rating, comment));
    updateRatingSummary();

    showFeedbackMessage("Thanks for your feedback, " + name + "!", true);

    nameInput.value = "";
    commentInput.value = "";
    ratingSelect.value = "5";
    handleRatingChange();
    handleCommentInput();
}

// attach the listeners
document.getElementById("reviewRating").addEventListener("change", handleRatingChange);
document.getElementById("reviewComment").addEventListener("input", handleCommentInput);
document.getElementById("submitFeedbackBtn").addEventListener("click", handleFeedbackSubmit);

// fill in the summary, star preview, and counter when the page first loads
updateRatingSummary();
handleRatingChange();
handleCommentInput();
