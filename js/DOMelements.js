import { fetchWeatherAsync, fetchFlickrPhoto, toggleLoader } from "./index.js";
import { getCountryCode } from "./countryCode.js";
// search button and array of divs with data
let button = document.querySelector("#citySearchButton");
export let dataDivs = [...document.querySelectorAll(".data")];

// adds search button event handler
button.addEventListener("click", () => {
  toggleLoader();
  let searchQuery = document.querySelector("#cityNameInput").value;
  let infoArray = searchQuery.split(",");
  let nameOfCity = infoArray[0];
  // city name without the space in front of the name
  let nameOfCountry = infoArray[infoArray.length - 1].replace(" ", "");
  let countryCode = getCountryCode(nameOfCountry);
  let query = `${nameOfCity},${countryCode}`;

  let units = getUnit();

  //clear search
  document.querySelector("#cityNameInput").value = "";
  // fetches the weather data
  fetchWeatherAsync(query, units);
  // fetches the city photo
  fetchFlickrPhoto(nameOfCity);
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
  let searchQuery = document.querySelector("#cityNameInput").value;
  let units = e.target.value;
  if (searchQuery !== "") {
    resetData(dataDivs);
    fetchWeatherAsync(searchQuery, units);
    // run the query again
  }
}

function menuToggle(menuID) {
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
export let heroImgContainer = document.querySelector(".hero-img-container");
