   const apiKey = "YOUR_API_KEY";
   
   export async function fetchWeatherByCity(city) {
     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
   
     const response = await fetch(url);
     const data = await response.json();
   
     return data;
   }
   
   export async function fetchWeatherByCoords(lat, lon) {
     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
   
     const response = await fetch(url);
     const data = await response.json();
   
     return data;
   }   