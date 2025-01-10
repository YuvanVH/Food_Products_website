const apiUrl = 'https://avancera.app/cities/';
const newCityInput = document.getElementById('newCityInput');
const addNewCityButton = document.getElementById('addNewCityButton');
const cityList = document.getElementById('cityList');

addNewCityButton.addEventListener('click', addNewCity);

async function fetchAndDisplayCities() {
  try {
    const response = await fetch(apiUrl);
    const cities = await response.json();

    // Rensare
    cityList.innerHTML = '';

    // Loopar genom varje city och visar namn o population
    cities.forEach(city => {
      const cityDiv = createCityDiv(city);
      cityList.appendChild(cityDiv);
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

function createCityDiv(city) {
  const cityDiv = document.createElement('div');
  cityDiv.innerHTML = `
  <div id="cityContainer">
    <span>City: ${city.name}</span>
    <span>Population: ${city.population}</span>
    <button onclick="editPopulation('${city.id}', ${city.population}, '${city.name}')">Edit Population</button>
    <button onclick="deleteCity('${city.id}', '${city.name}')">Delete City</button>
    </div>
  `;
  return cityDiv;
}

// Loopar fetchen
fetchAndDisplayCities();

async function addNewCity() {
  const cityName = newCityInput.value;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: cityName, population: 0 }),
    });

    if (response.ok) {
      // Fetch visar felhantering av city
      fetchAndDisplayCities();
    } else {
      console.error('Error adding new city:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding new city:', error);
  }
}

async function editPopulation(cityId, currentPopulation, cityName) {
  const newPopulation = prompt(`Enter the new population for ${cityName}:`, currentPopulation);

  // kolla igenom den nya populationnen
  if (newPopulation === null || newPopulation.trim() === '') {
    console.error('Invalid population value');
    return;
  }

  console.log('Editing Population for City:', cityName, 'ID:', cityId);

  // Försök från nätet, lägger till population
  try {
    const response = await fetch(`${apiUrl}${cityId}?_=${new Date().getTime()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: cityId,
        name: cityName,
        population: parseInt(newPopulation, 10),
      }),
    });

    const responseBody = await response.text();

    if (response.ok) {
      // Fetch och visar uppdaterad ny city list
      fetchAndDisplayCities();
    } else {
      console.error('Error editing population:', response.statusText);
      console.error('Response Body:', responseBody);
    }
  } catch (error) {
    console.error('Error editing population:', error);
  }
}

async function deleteCity(cityId, cityName) {
  if (confirm(`Are you sure you want to delete ${cityName}?`)) {
    try {
      const response = await fetch(`${apiUrl}${cityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Fetch och visar uppdaterad ny city list
        fetchAndDisplayCities();
      } else {
        console.error('Error deleting city:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  }
}
// Visa eller dölj knappen baserat på scrollpositionen
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
  document.documentElement.scrollTop = 0; // För moderna webbläsare
}
