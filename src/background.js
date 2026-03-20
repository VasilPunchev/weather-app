export function updateBackground(weatherMain, isDay) {
  const weatherBg = document.getElementById("weather-bg");

  weatherBg.classList.remove(
    "sunny",
    "cloudy",
    "rainy",
    "snowy",
    "night",
    "cloudy-night"
  );

  let weatherClass = "";

  if (weatherMain === "Clear") {
    weatherClass = isDay ? "sunny" : "night";
  } else if (weatherMain === "Clouds") {
    weatherClass = isDay ? "cloudy" : "cloudy-night";
  } else if (weatherMain === "Rain") {
    weatherClass = "rainy";
  } else if (weatherMain === "Snow") {
    weatherClass = "snowy";
  }

  if (weatherClass) {
    weatherBg.classList.add(weatherClass);
  }
}