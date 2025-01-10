document.addEventListener('DOMContentLoaded', function () {
  const likedSearchList = document.getElementById('likedSearchList');
  const likedSearches = JSON.parse(localStorage.getItem('likedSearches')) || [];

  createChart(likedSearches);
  populateLikedList(likedSearches);
});

// Funktion för att få fram ett chart på gillade söktermar/sökningar (ej klar men fungerade)
/* CHART.JS */
function createChart(likedSearches) {
  const ctx = document.getElementById('likeChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: likedSearches,
      datasets: [{
        label: 'Amount of Searches',
        data: likedSearches.map(searchTerm => countLikes(searchTerm)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    },
  });
}

function countLikes(searchTerm) {
  const likedSearches = JSON.parse(localStorage.getItem('likedSearches')) || [];
  return likedSearches.filter(likedSearch => likedSearch === searchTerm).length;
}

function populateLikedList(likedSearches) {
  const likedSearchList = document.getElementById('likedSearchList');

  likedSearches.forEach(searchTerm => {
    const listItem = document.createElement('li');
    listItem.textContent = searchTerm;
    likedSearchList.appendChild(listItem);
  });
}

//skoll funktionen
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var scrollToTopBtn = document.getElementById("scrollToTopBtn");
  var likedSearchList = document.getElementById("likedSearchList");

  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopBtn.style.display = "block";
    likedSearchList.style.marginTop = "40px";
  } else {
    scrollToTopBtn.style.display = "none";
    likedSearchList.style.marginTop = "0";
  }
}
