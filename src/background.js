export function updateBackground(weatherMain, isDay) {
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