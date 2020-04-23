import { fetchWeatherAsync, fetchFlickrPhoto } from "./index.js";

// search button and array of divs with data
let button = document.querySelector("#citySearchButton");
export let dataDivs = [...document.querySelectorAll(".data")];

// adds search button event handler
button.addEventListener("click", () => {
  let searchQuery = document.querySelector("#cityNameInput").value;
  let units = getUnit();

  // fetches the weather data
  fetchWeatherAsync(searchQuery, units);
  // fetches the city photo
  fetchFlickrPhoto(searchQuery);
  menuToggle("menu-overlay");
});

// celcius
let metricButton = document.querySelector(".metric");
// fahrenheit
let imperialButton = document.querySelector(".imperial");
let unitsButtons = [metricButton, imperialButton];

function getUnit() {
  let units = unitsButtons.filter((input) => {
    if (input.checked) {
      return input;
    }
  })[0].value;
  return units;
}

// adds click listeners to the units buttons
unitsButtons.forEach((input) =>
  input.addEventListener("click", () => switchUnits(event))
);

// this should be refactored to do maths on the unit data as opposed to fetching new data
function switchUnits(e) {
  console.log(e.target.value);
  let searchQuery = document.querySelector("#cityNameInput").value;
  let units = e.target.value;
  if (searchQuery !== "") {
    resetData(dataDivs);
    fetchWeatherAsync(searchQuery, units);
    // run the query again
  }
}

function menuToggle(menuID) {
  console.info("Inside closeMenu");
  const menu = document.querySelector(`#${menuID}`);
  menu.classList.toggle("visible");
  menu.classList.toggle("hidden");
}

export let name = document.querySelector(".cityName");
export let country = document.querySelector(".country");
export let date = document.querySelector(".weatherDate");
export let descr = document.querySelector(".description");
export let icon = document.querySelector(".weather-icon");
export let weathName = document.querySelector(".weatherName");
export let feelsLike = document.querySelector(".feels_like");
export let humid = document.querySelector(".humidity");
export let press = document.querySelector(".pressure");
export let wind = document.querySelector(".wind");
export let temp = document.querySelector(".temp");
export let tempMax = document.querySelector(".temp_max");
export let tempMin = document.querySelector(".temp_min");
export let sunrise = document.querySelector(".sunrise");
export let sunset = document.querySelector(".sunset");

// hero container
export let hero = document.querySelector(".hero-container");
