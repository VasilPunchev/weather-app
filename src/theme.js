const toggle = document.getElementById("theme-toggle");

let savedTheme = localStorage.getItem("theme");


if (!savedTheme) {
  savedTheme = "dark";
}


document.body.classList.add(`${savedTheme}-mode`);


toggle.checked = savedTheme === "dark";

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  }
});