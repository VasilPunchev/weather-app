let currentTimezoneOffset = null;

export function getCityTime(timezoneOffset) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + timezoneOffset * 1000);

  return cityTime;
}

export function updateDateTime(dateTimeElement) {
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

export function setTimezone(offset) {
  currentTimezoneOffset = offset;
}

export function displayWeather(data, elements, updateBackground) {
  const {
    cityNameElement,
    descriptionElement,
    temperatureElement,
    humidityElement,
    windSpeedElement,
    feelsLikeElement,
    weatherIconElement,
    weatherCard
  } = elements;

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

export function showError(message, errorElement, weatherCard) {
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}