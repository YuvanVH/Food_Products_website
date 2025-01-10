// Hitta HTML-elementen till script
const searchInput = document.getElementById('search');
const fetchButton = document.getElementById('search-button');
const backButton = document.getElementById('back-button');
const nextButton = document.getElementById('next-button');
const showAllButton = document.getElementById('showAllProducts');
const likeSearchButton = document.getElementById('likeSearchButton');

let showLessButton;

const productName = document.getElementById('product-name');
const productIngredients = document.getElementById('product-ingredients');
const categories = document.getElementById('categories');
const productImage = document.getElementById('product-image');
const pageInfo = document.getElementById('page-info');
const container2 = document.getElementById('container2');
const showAllInfo = document.getElementById('showAllInfo');

// Skapa en variabel för att lagra den "aktuella" sidan för produkter
let currentPage = 1;
// Skapa en variabel för sidstorlek
const pageSize = 10;
// Skapa en array för att lagra produkter
let products = [];

let showingAll = false;

showAllButton.addEventListener('click', () => {
  showingAll = !showingAll;

  if (showingAll) {
    showAllUI();
    container2.scrollIntoView({ behavior: 'smooth' });
    if (showLessButton) showLessButton.style.display = 'block';
    showAllButton.style.display = 'none';
  } else {
    updateUI();
    showLessButton.style.display = 'block';
    showAllButton.style.display = 'none';
  }
}); function handleSearchEvent() {
  console.log("handleSearchEvent() called");
  performSearch();
}

searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    console.log("Enter key pressed");
    performSearch();
  }
});
let searchTimeout; // Lägg till en variabel för timeout

function performSearch() {
  searchInProgress = true;
  console.log("performSearch() called");
  const searchTerm = searchInput.value;
  currentPage = 1;
  products.length = 0;
  fetchProducts(searchTerm);

  // Nollställ tidigare timeout om det finns
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Vänta på att sökresultaten läggs till i DOM innan du skrollar ner
  searchTimeout = setTimeout(() => {
    // Försök skrolla ner till sökresultaten
    if (container2) {
      container2.scrollIntoView({ behavior: 'smooth' });
      console.log("Scrolled to search results");
    } else {
      console.error("Container2 not defined.");
    }
    searchInProgress = false;
  }, 500); // Justera timeout efter behov
}

// Funktion för att visa alla produkter
function showAllUI() {
  showAllInfo.innerHTML = '<div id="info"></div>';

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productInfo = document.createElement('div');
    const productName = document.createElement('h2');
    const productIngredients = document.createElement('p');
    const productCategories = document.createElement('p');
    const productImage = document.createElement('img');
    const likeButton = document.createElement('button');
    likeButton.className = 'like-button';
    likeButton.dataset.productId = product.id;
    likeButton.textContent = 'Like';
    likeButton.onclick = () => likeProduct(product);
    productName.textContent = product.product_name;
    productIngredients.textContent = product.ingredients_text;
    productCategories.textContent = product.categories;
    if (product.selected_images && product.selected_images.front && product.selected_images.front.display) {
      const imageInfo = product.selected_images.front;
      let imageUrl;

      if (imageInfo.display && imageInfo.display.en) {
        imageUrl = imageInfo.display.en;
      } else if (imageInfo.display && imageInfo.display.se) {
        imageUrl = imageInfo.display.se;
      } else if (imageInfo.display && imageInfo.display.fr) {
        imageUrl = imageInfo.display.fr;
      } else if (imageInfo.display && imageInfo.display.es) {
        imageUrl = imageInfo.display.es;
      } else {
        imageUrl = '';
      }

      productImage.src = imageUrl;
    } else {
      productImage.src = '';
    }

    productInfo.appendChild(productName);
    productInfo.appendChild(productIngredients);
    productInfo.appendChild(productCategories);
    productInfo.appendChild(productImage);
    showAllInfo.appendChild(productInfo);
  }

  showLessButton = document.createElement('button');
  showLessButton.textContent = 'Show less';
  showLessButton.id = 'showLessButton';
  showLessButton.addEventListener('click', () => {
    showingAll = false;
    updateUI();
    currentPage = 1;
    showLessButton.style.display = 'none';
    showAllButton.style.display = 'block';
  });

  showAllInfo.appendChild(showLessButton);

  container2.scrollIntoView({ behavior: 'smooth' });
}

function updateUI() {
  const product = products[currentPage - 1];
  productName.textContent = product.product_name;
  productIngredients.textContent = product.ingredients_text;

  // Uppdatera kategorin i "categories" elementet
  categories.textContent = product.categories;

  if (product.selected_images && product.selected_images.front && product.selected_images.front.display) {
    const imageInfo = product.selected_images.front;
    let imageUrl;

    if (imageInfo.display && imageInfo.display.en) {
      imageUrl = imageInfo.display.en;
    } else if (imageInfo.display && imageInfo.display.se) {
      imageUrl = imageInfo.display.se;
    } else if (imageInfo.display && imageInfo.display.fr) {
      imageUrl = imageInfo.display.fr;
    } else if (imageInfo.display && imageInfo.display.es) {
      imageUrl = imageInfo.display.es;
    } else {
      imageUrl = '';
    }

    productImage.src = imageUrl;
  } else {
    productImage.src = '';
  }

  backButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === products.length;
  pageInfo.textContent = `Page ${currentPage} of ${products.length}`;
  console.log("antal" + products.length)

  container2.scrollIntoView({ behavior: 'smooth' });
}

nextButton.addEventListener('click', () => {
  if (currentPage < products.length) {
    currentPage++;
    updateUI();
  }
});

backButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updateUI();
  }
});

fetchButton.addEventListener('click', () => {
  performSearch();
});

function performSearch() {
  const searchTerm = searchInput.value;
  currentPage = 1;
  products.length = 0;
  fetchProducts(searchTerm);
}

// Scrolla-funktion
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

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function fetchProducts(searchTerm) {
  products = [];

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&page_size=${pageSize}&page=${currentPage}&json=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      if (data !== null && data.products !== null && data.products.length > 0) {
        products.push(...data.products);
        pageInfo.textContent = `Page ${currentPage} of ${data.page_count}`;

        if (showingAll) {
          showAllUI();
        } else {
          updateUI();
        }

        backButton.style.display = 'block';
        nextButton.style.display = 'block';
      } else {
        productName.textContent = 'No product was found for the search';
        productIngredients.textContent = '';
        categories.textContent = '';
        productImage.src = '';
        pageInfo.textContent = '';
      }

      document.querySelector('#info').style = "display:block";
      document.querySelector('#container2').style = "display:block";
    })
    .catch(error => {
      console.error(error);
      productName.textContent = 'Something went wrong with the search';
      productIngredients.textContent = 'error';
      categories.textContent = 'error';
      productImage.src = 'error';
      pageInfo.textContent = '';
    });
}

function likeProduct(button) {
  const productId = button.dataset.productId;
  const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];

  if (!likedProducts.includes(productId)) {
    likedProducts.push(productId);
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
    updateLikeButtonAppearance(productId, true);

    console.log(`Product with ID ${productId} has been added to liked products.`);
  } else {
    const updatedLikedProducts = likedProducts.filter(id => id !== productId);
    localStorage.setItem('likedProducts', JSON.stringify(updatedLikedProducts));
    updateLikeButtonAppearance(productId, false);

    console.log(`Product with ID ${productId} has been removed from liked products.`);
  }
}
function updateLikeButtonAppearance(productId, isLiked) {
  const likeButton = document.querySelector(`[data-product-id="${productId}"]`);

  if (likeButton) {
    likeButton.textContent = isLiked ? 'Liked' : 'Like';
    likeButton.classList.toggle('liked', isLiked);
  }
}

// Eventlyssnare för "Like search" knappen
likeSearchButton.addEventListener('click', () => {
  likeSearch();
});

// Funktion för att gilla hela sökningen!
/* WEBSTORAGE */
function likeSearch() {
  const searchTerm = searchInput.value;
  const likedSearches = JSON.parse(localStorage.getItem('likedSearches')) || [];

  if (!likedSearches.includes(searchTerm)) {
    likedSearches.push(searchTerm);
    localStorage.setItem('likedSearches', JSON.stringify(likedSearches));

    console.log(`Search term "${searchTerm}" has been added to liked searches.`);

    // Uppdatera knappens text och stil när gillningen är klar
    updateLikeButtonStyle(true);
  } else {
    // TAR BPRT sökningen från gillade sökningar
    const updatedLikedSearches = likedSearches.filter(term => term !== searchTerm);
    localStorage.setItem('likedSearches', JSON.stringify(updatedLikedSearches));

    console.log(`Search term "${searchTerm}" has been removed from liked searches.`);

    // uppdatera knappens text och stil när ogillningen är klar
    updateLikeButtonStyle(false);
  }
}

// Funktion för att uppdatera knappens stil baserat på gilla eller inte
function updateLikeButtonStyle(isLiked) {
  likeSearchButton.textContent = isLiked ? 'Liked Search Saved' : 'Like Search';
  likeSearchButton.style.backgroundColor = isLiked ? 'green' : '';
  likeSearchButton.style.color = isLiked ? 'white' : '';
}
// Hitta HTML-elementet för knappen
const goToLikeChartButton = document.getElementById('goToLikeChartButton');

// Lägg till en eventlistner för klick event.
goToLikeChartButton.addEventListener('click', () => {
  // Leder användaren till likeChart.html
  window.location.href = 'likeChart.html';
});
