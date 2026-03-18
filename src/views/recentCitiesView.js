export function renderRecentCities({
  cities,
  container,
  clearBtn,
  onSelectCity,
  onRemoveCity
}) {
  container.innerHTML = "";

  if (cities.length === 0) {
    clearBtn.classList.add("hidden");
  } else {
    clearBtn.classList.remove("hidden");
  }

  cities.forEach(city => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("recent-city");

    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", () => {
      onSelectCity(city);
    });

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-city");

    removeBtn.addEventListener("click", e => {
      e.stopPropagation();
      onRemoveCity(city);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(removeBtn);

    container.appendChild(wrapper);
  });
}