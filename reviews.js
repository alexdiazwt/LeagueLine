// reviews.js
// the 2 sample reviews are just written into reviews.html directly,
// this file only deals with a new one someone submits

// turns a rating like "4" into stars
function renderStars(rating) {
    if (rating === "5") {
        return "★★★★★";
    } else if (rating === "4") {
        return "★★★★☆";
    } else if (rating === "3") {
        return "★★★☆☆";
    } else if (rating === "2") {
        return "★★☆☆☆";
    } else {
        return "★☆☆☆☆";
    }
}

// puts together the name + stars + comment into one review
function buildReviewMessage(name, rating, comment) {
    var stars = renderStars(rating);
    return "<strong>" + name + "</strong> - <span class=\"stars\">" + stars + "</span><br>" + comment;
}

// runs when Submit Feedback gets clicked
function handleFeedbackSubmit() {
    var nameInput = document.getElementById("reviewerName");
    var ratingSelect = document.getElementById("reviewRating");
    var commentInput = document.getElementById("reviewComment");
    var newReviewBox = document.getElementById("newReview");

    var name = nameInput.value;
    var rating = ratingSelect.value;
    var comment = commentInput.value;

    if (name === "" || comment === "") {
        alert("Please enter your name and a comment.");
        return;
    }

    var proceed = confirm("Submit this feedback for " + name + "?");
    if (proceed === false) {
        return;
    }

    // add the new review right onto the page
    newReviewBox.innerHTML = buildReviewMessage(name, rating, comment);

    alert("Thanks for your feedback!");

    nameInput.value = "";
    commentInput.value = "";
}