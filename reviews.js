// reviews.js - reviews page
// star preview, character counter, star breakdown bars, and adding new reviews
// new reviews are saved in localStorage so they stay after a refresh

var minCommentLength = 20;
var maxCommentLength = 300;   // same as maxlength on the textarea

// 4 -> "★★★★☆"
function renderStars(rating) {
    var stars = "";
    for (var i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars = stars + "★";
        } else {
            stars = stars + "☆";
        }
    }
    return stars;
}

// average of every review's data-rating, plus how many of each star
function updateRatingSummary() {
    var reviews = document.querySelectorAll("#reviewList .review");
    var total = 0;
    var counts = [0, 0, 0, 0, 0, 0];   // counts[5] = number of 5 star reviews (counts[0] not used)

    for (var i = 0; i < reviews.length; i++) {
        var rating = Number(reviews[i].dataset.rating);
        total = total + rating;
        counts[rating] = counts[rating] + 1;
    }

    updateRatingBreakdown(counts, reviews.length);

    var summary = document.getElementById("ratingSummary");
    if (reviews.length === 0) {
        summary.textContent = "No reviews yet.";
        return;
    }

    var average = total / reviews.length;
    summary.textContent = "Average rating: " + average.toFixed(1) + " out of 5 (" + reviews.length + " reviews)";
}

// one bar for each star level, 5 down to 1
// the bar width is set with the style property
function updateRatingBreakdown(counts, reviewCount) {
    var breakdown = document.getElementById("ratingBreakdown");
    breakdown.innerHTML = "";

    for (var stars = 5; stars >= 1; stars--) {
        var percent = 0;
        if (reviewCount > 0) {
            percent = Math.round((counts[stars] / reviewCount) * 100);
        }

        var row = document.createElement("div");
        row.className = "rating-row";

        var label = document.createElement("span");
        label.className = "rating-label";
        label.textContent = stars + " star";

        var track = document.createElement("span");
        track.className = "rating-track";
        var fill = document.createElement("span");
        fill.className = "rating-fill";
        fill.style.width = percent + "%";
        track.appendChild(fill);

        var count = document.createElement("span");
        count.className = "rating-count";
        count.textContent = counts[stars];

        row.appendChild(label);
        row.appendChild(track);
        row.appendChild(count);
        breakdown.appendChild(row);
    }
}

// change event on the rating dropdown
function handleRatingChange() {
    var rating = Number(document.getElementById("reviewRating").value);
    document.getElementById("starPreview").textContent = renderStars(rating);
}

// input event on the comment box
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

// green message if isSuccess is true, red if false
function showFeedbackMessage(text, isSuccess) {
    var box = document.getElementById("feedbackMessage");
    box.textContent = text;
    if (isSuccess) {
        box.className = "message message-success";
    } else {
        box.className = "message message-error";
    }
}

// makes a new review block
// textContent so whatever someone types shows as plain text
function buildReviewElement(name, rating, comment) {
    var reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    reviewDiv.dataset.rating = rating;   // data-rating="4"

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

// click event on Submit Feedback
function handleFeedbackSubmit() {
    var name = document.getElementById("reviewerName").value.trim();
    var rating = Number(document.getElementById("reviewRating").value);
    var comment = document.getElementById("reviewComment").value.trim();

    if (name === "") {
        showFeedbackMessage("Please enter your name.", false);
        return;
    }
    if (comment.length < minCommentLength) {
        showFeedbackMessage("Please write at least " + minCommentLength + " characters about your season.", false);
        return;
    }

    // confirm on the page (confirmbox.js)
    // postReview only runs if they click Post Review
    askToConfirm(
        document.getElementById("feedbackMessage"),
        "Post this " + rating + "-star review as " + name + "?",
        "Post Review",
        function () {
            postReview(name, rating, comment);
        }
    );
}

// saves the review after they confirm
function postReview(name, rating, comment) {
    // same fields as the reviews collection
    var savedReviews = loadSavedList(reviewsKey);
    savedReviews.push({
        reviewerName: name,
        rating: rating,
        leagueId: "softball-fall-2026",
        comment: comment,
        createdAt: todayText()
    });
    saveList(reviewsKey, savedReviews);

    document.getElementById("reviewList").appendChild(buildReviewElement(name, rating, comment));
    updateRatingSummary();

    showFeedbackMessage("Thanks for your feedback, " + name + "!", true);

    document.getElementById("reviewerName").value = "";
    document.getElementById("reviewComment").value = "";
    document.getElementById("reviewRating").value = "5";
    handleRatingChange();
    handleCommentInput();
}

// adds the reviews saved in this browser after the two on the page
function showSavedReviews() {
    var savedReviews = loadSavedList(reviewsKey);
    var list = document.getElementById("reviewList");
    for (var i = 0; i < savedReviews.length; i++) {
        var review = savedReviews[i];
        list.appendChild(buildReviewElement(review.reviewerName, review.rating, review.comment));
    }
}

document.getElementById("reviewRating").addEventListener("change", handleRatingChange);
document.getElementById("reviewComment").addEventListener("input", handleCommentInput);
document.getElementById("submitFeedbackBtn").addEventListener("click", handleFeedbackSubmit);

// when the page loads
showSavedReviews();
updateRatingSummary();
handleRatingChange();
handleCommentInput();
