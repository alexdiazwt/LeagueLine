// nav.js - underlines and bolds the link for the page you're on
// uses the style property to change the link's CSS

function highlightTab(tabId) {
    var tab = document.getElementById(tabId);
    tab.style.textDecoration = "underline";
    tab.style.fontWeight = "bold";
}
