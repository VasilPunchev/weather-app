export function getRecentCities() {
  const saved = localStorage.getItem("recentCities");

  if (saved) {
    return JSON.parse(saved);
  }

  return [];
}

export function saveRecentCity(city) {
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

export function removeRecentCity(city) {
  let recentCities = getRecentCities();

  recentCities = recentCities.filter(c => c !== city);

  localStorage.setItem("recentCities", JSON.stringify(recentCities));
}

export function clearRecentCities() {
  localStorage.removeItem("recentCities");
}