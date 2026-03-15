const apiKey = "YOUR_API_KEY";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const locationBtn = document.getElementById("location-btn");
const clearCitiesBtn = document.getElementById("clear-cities");
const errorMessage = document.getElementById("error-message");
const weatherCard = document.getElementById("weather-card");
const loading = document.getElementById("loading");
const dateTimeElement = document.getElementById("date-time");

const cityNameElement = document.getElementById("city-name");
const weatherIconElement = document.getElementById("weather-icon");
const descriptionElement = document.getElementById("description");
const temperatureElement = document.getElementById("temperature");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const feelsLikeElement = document.getElementById("feels-like");
const recentCitiesElement = document.getElementById("recent-cities");

let currentTimezoneOffset = null;

searchBtn.addEventListener("click", getWeather);
locationBtn.addEventListener("click", getWeatherByLocation);
clearCitiesBtn.addEventListener("click", clearRecentCities);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

function getCityTime(timezoneOffset) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + timezoneOffset * 1000);

  return cityTime;
}

function updateDateTime() {
  if (currentTimezoneOffset === null) {
    dateTimeElement.textContent = "";
    return;
  }

  const cityTime = getCityTime(currentTimezoneOffset);

  const weekday = cityTime.toLocaleDateString("en-US", {
    weekday: "long"
  });

  const time = cityTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  dateTimeElement.textContent = `${weekday} • ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  weatherCard.classList.add("hidden");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    loading.classList.add("hidden");

    if (data.cod !== 200) {
      showError("City not found or API key is not active yet.");
      return;
    }

    displayWeather(data);
    cityInput.value = "";
    saveRecentCity(data.name);
    renderRecentCities();
  } catch (error) {
    loading.classList.add("hidden");
    showError("Something went wrong. Please try again.");
    console.log(error);
  }
}

function displayWeather(data) {
  const city = data.name;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const feelsLike = data.main.feels_like;
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const weatherMain = data.weather[0].main;

  const now = Math.floor(Date.now() / 1000);
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const isDay = now >= sunrise && now < sunset;

  updateBackground(weatherMain, isDay);

  currentTimezoneOffset = data.timezone;
  updateDateTime();

  cityNameElement.textContent = city;
  descriptionElement.textContent = `Condition: ${description}`;
  temperatureElement.textContent = `${Math.round(temperature)}°`;
  humidityElement.textContent = `💧 Humidity: ${humidity}%`;
  windSpeedElement.textContent = `🌬 Wind: ${windSpeed} m/s`;
  feelsLikeElement.textContent = `🌡 Feels like: ${Math.round(feelsLike)}°C`;

  weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconElement.alt = description;

  weatherCard.classList.remove("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function getRecentCities() {
  const saved = localStorage.getItem("recentCities");

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

function saveRecentCity(city) {
  let recentCities = getRecentCities();

  recentCities = recentCities.filter(
    c => c.toLowerCase() !== city.toLowerCase()
  );

  recentCities.unshift(city);

  if (recentCities.length > 5) {
    recentCities = recentCities.slice(0, 5);
  }

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
}

function removeRecentCity(city) {
  let recentCities = getRecentCities();

  recentCities = recentCities.filter(c => c !== city);

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  renderRecentCities();
}

function clearRecentCities() {
  localStorage.removeItem("recentCities");
  renderRecentCities();
}

function renderRecentCities() {
  const recentCities = getRecentCities();
  recentCitiesElement.innerHTML = "";

  if (recentCities.length === 0) {
    clearCitiesBtn.classList.add("hidden");
  } else {
    clearCitiesBtn.classList.remove("hidden");
  }

  recentCities.forEach(city => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("recent-city");

    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", function () {
      cityInput.value = city;
      getWeather();
    });

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-city");

    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      removeRecentCity(city);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(removeBtn);

    recentCitiesElement.appendChild(wrapper);
  });
}

function getWeatherByLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported.");
    return;
  }

  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  weatherCard.classList.add("hidden");

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        loading.classList.add("hidden");

        if (data.cod !== 200) {
          showError("Could not fetch weather for your location.");
          return;
        }

        displayWeather(data);
        saveRecentCity(data.name);
        renderRecentCities();
      } catch (error) {
        loading.classList.add("hidden");
        showError("Something went wrong.");
        console.log(error);
      }
    },
    function () {
      loading.classList.add("hidden");
      showError("Location access was denied.");
    }
  );
}

function updateBackground(weatherMain, isDay) {
  if (weatherMain === "Clear") {
    document.body.className = isDay ? "sunny" : "night";
  } else if (weatherMain === "Clouds") {
    document.body.className = isDay ? "cloudy" : "cloudy-night";
  } else if (weatherMain === "Rain") {
    document.body.className = "rainy";
  } else if (weatherMain === "Snow") {
    document.body.className = "snowy";
  } else {
    document.body.className = "";
  }
}

renderRecentCities();