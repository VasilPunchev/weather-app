import {
  getRecentCities,
  saveRecentCity,
  removeRecentCity,
  clearRecentCities
} from "./storage.js";

import {
  fetchWeatherByCity,
  fetchWeatherByCoords
} from "./weatherService.js";

import {
  displayWeather,
  showError,
  updateDateTime,
  setTimezone
} from "./views/weatherView.js";

import { elements } from "./views/domElements.js";
import { renderRecentCities } from "./views/recentCitiesView.js";
import { updateBackground } from "./background.js";
import "./theme.js";


elements.searchBtn.addEventListener("click", getWeather);
elements.locationBtn.addEventListener("click", getWeatherByLocation);
elements.clearCitiesBtn.addEventListener("click", handleClearAll);

elements.cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});


updateDateTime(elements.dateTimeElement);
setInterval(() => updateDateTime(elements.dateTimeElement), 1000);



async function getWeather() {
  const city = elements.cityInput.value.trim();

  if (!city) {
    showError(
      "Please enter a city name.",
      elements.errorMessage,
      elements.weatherCard
    );
    return;
  }

  elements.loading.classList.remove("hidden");
  elements.errorMessage.classList.add("hidden");
  elements.weatherCard.classList.add("hidden");

  try {
    const data = await fetchWeatherByCity(city);

    elements.loading.classList.add("hidden");

    if (data.cod !== 200) {
      showError(
        "City not found or API key is not active yet.",
        elements.errorMessage,
        elements.weatherCard
      );
      return;
    }

    displayWeather(
      data,
      {
        cityNameElement: elements.cityNameElement,
        descriptionElement: elements.descriptionElement,
        temperatureElement: elements.temperatureElement,
        humidityElement: elements.humidityElement,
        windSpeedElement: elements.windSpeedElement,
        feelsLikeElement: elements.feelsLikeElement,
        weatherIconElement: elements.weatherIconElement,
        weatherCard: elements.weatherCard
      },
      updateBackground
    );
    elements.weatherCard.classList.remove("hidden");
    elements.weatherCard.classList.add("fade-in");

     setTimeout(() => {
      elements.weatherCard.classList.remove("fade-in");
     }, 350);

    setTimezone(data.timezone);
    updateDateTime(elements.dateTimeElement);

    elements.cityInput.value = "";
    saveRecentCity(data.name);
    updateRecentCitiesUI();
  } catch (error) {
    elements.loading.classList.add("hidden");
    showError(
      "Something went wrong. Please try again.",
      elements.errorMessage,
      elements.weatherCard
    );
    console.log(error);
  }
}

function updateRecentCitiesUI() {
  const cities = getRecentCities();

  renderRecentCities({
    cities,
    container: elements.recentCitiesElement,
    clearBtn: elements.clearCitiesBtn,
    onSelectCity: city => {
      elements.cityInput.value = city;
      getWeather();
    },
    onRemoveCity: city => {
      removeRecentCity(city);
      updateRecentCitiesUI();
    }
  });
}



function handleClearAll() {
  clearRecentCities();

  elements.recentCitiesElement.innerHTML = "";
  elements.clearCitiesBtn.classList.add("hidden");

  elements.cityInput.value = "";
  elements.errorMessage.classList.add("hidden");
  elements.loading.classList.add("hidden");
  elements.weatherCard.classList.add("fade-out");

  setTimeout(() => {
    elements.weatherCard.classList.add("hidden");
    elements.weatherCard.classList.remove("fade-out");
  }, 300);

  const weatherBg = document.getElementById("weather-bg");

  if (weatherBg) {
    weatherBg.classList.remove(
      "sunny",
      "cloudy",
      "rainy",
      "snowy",
      "night",
      "cloudy-night"
    );
  }
}
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError(
      "Geolocation is not supported.",
      elements.errorMessage,
      elements.weatherCard
    );
    return;
  }

  elements.loading.classList.remove("hidden");
  elements.errorMessage.classList.add("hidden");
  elements.weatherCard.classList.add("hidden");

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const data = await fetchWeatherByCoords(lat, lon);

        elements.loading.classList.add("hidden");

        if (data.cod !== 200) {
          showError(
            "Could not fetch weather for your location.",
            elements.errorMessage,
            elements.weatherCard
          );
          return;
        }

        displayWeather(
          data,
          {
            cityNameElement: elements.cityNameElement,
            descriptionElement: elements.descriptionElement,
            temperatureElement: elements.temperatureElement,
            humidityElement: elements.humidityElement,
            windSpeedElement: elements.windSpeedElement,
            feelsLikeElement: elements.feelsLikeElement,
            weatherIconElement: elements.weatherIconElement,
            weatherCard: elements.weatherCard
          },
          updateBackground
        );

        setTimezone(data.timezone);
        updateDateTime(elements.dateTimeElement);

        saveRecentCity(data.name);
        updateRecentCitiesUI();
      } catch (error) {
        elements.loading.classList.add("hidden");
        showError(
          "Something went wrong.",
          elements.errorMessage,
          elements.weatherCard
        );
        console.log(error);
      }
    },
    function () {
      elements.loading.classList.add("hidden");
      showError(
        "Location access was denied.",
        elements.errorMessage,
        elements.weatherCard
      );
    }
  );
}

updateRecentCitiesUI();