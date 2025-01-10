// Visa eller dölj knappen baserat på positionen från skärm
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var scrollToTopBtn = document.getElementById("scrollToTopBtn");

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

// Scrolla till toppen när knappen klickas
function scrollToTop() {
  document.body.scrollTop = 0; // För äldre webbläsare
  document.documentElement.scrollTop = 0; // För ny webbläsare
}
