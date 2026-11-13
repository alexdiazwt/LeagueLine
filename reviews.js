// reviews.js - reviews page
// star preview, character counter, star breakdown bars, and adding new reviews
// new reviews are saved in MongoDB through POST /api/reviews, and all reviews are loaded through GET /api/reviews

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

// sends the review to the server after they confirm
async function postReview(name, rating, comment) {
    try {
        var response = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewerName: name, rating: rating, comment: comment })
        });
        var data = await response.json();

        if (response.ok === false) {
            showFeedbackMessage(data.error, false);
            return;
        }

        document.getElementById("reviewList").appendChild(buildReviewElement(data.reviewerName, data.rating, data.comment));
        updateRatingSummary();
        showFeedbackMessage("Thanks for your feedback, " + data.reviewerName + "! Your review is now posted for other managers to see.", true);

        document.getElementById("reviewerName").value = "";
        document.getElementById("reviewComment").value = "";
        document.getElementById("reviewRating").value = "5";
        handleRatingChange();
        handleCommentInput();
    } catch (error) {
        showFeedbackMessage("We couldn't reach LeagueLine right now. Please try again in a minute.", false);
    }
}

// loads every review from MongoDB when the page opens
async function loadReviews() {
    var list = document.getElementById("reviewList");
    try {
        var response = await fetch("/api/reviews");
        var reviews = await response.json();

        list.innerHTML = "";   // remove "Loading reviews..."
        for (var i = 0; i < reviews.length; i++) {
            list.appendChild(buildReviewElement(reviews[i].reviewerName, reviews[i].rating, reviews[i].comment));
        }
        updateRatingSummary();
    } catch (error) {
        list.innerHTML = "<p class=\"meta\">Reviews couldn't load right now. Please refresh the page.</p>";
    }
}

document.getElementById("reviewRating").addEventListener("change", handleRatingChange);
document.getElementById("reviewComment").addEventListener("input", handleCommentInput);
document.getElementById("submitFeedbackBtn").addEventListener("click", handleFeedbackSubmit);

// when the page loads
loadReviews();
handleRatingChange();
handleCommentInput();
