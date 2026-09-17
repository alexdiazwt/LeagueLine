// LeagueLine - nav.js
// Highlights which page is currently active in the header nav.

// Takes the id of the current page's nav link as an argument.
function highlightTab(tabId) {
    var tab = document.getElementById(tabId);
    tab.style.textDecoration = "underline";
    tab.style.fontWeight = "bold";
}