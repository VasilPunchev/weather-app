const apiKey = "077908b4e974a81d38a11453150b056c";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
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

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
function updateDateTime() {
  const now = new Date();
  const formatted = now.toLocaleString();
  dateTimeElement.textContent = formatted;
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
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const weatherMain = data.weather[0].main;
  updateBackground(weatherMain);

  cityNameElement.textContent = city;
  descriptionElement.textContent = `Condition: ${description}`;
  temperatureElement.textContent = `Temperature: ${temperature}°C`;
  humidityElement.textContent = `Humidity: ${humidity}%`;
  windSpeedElement.textContent = `Wind: ${windSpeed} m/s`;
  weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIconElement.alt = description;

  weatherCard.classList.remove("hidden");
  
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}
function updateBackground(weatherMain) {
  document.body.classList.remove("sunny", "cloudy", "rainy", "snowy");

  if (weatherMain === "Clear") {
    document.body.classList.add("sunny");
  } else if (weatherMain === "Clouds") {
    document.body.classList.add("cloudy");
  } else if (weatherMain === "Rain") {
    document.body.classList.add("rainy");
  } else if (weatherMain === "Snow") {
    document.body.classList.add("snowy");
  }
}
