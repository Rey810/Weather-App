import { fetchWeatherAsync } from "./index.js";
import { resetData } from "./index.js";

// search button and array of divs with data
let button = document.querySelector("#citySearchButton");
let dataDivs = [...document.querySelectorAll(".data")];

// adds search button event handler
button.addEventListener("click", () => {
  let searchQuery = document.querySelector("#cityNameInput").value;
  let units = getUnit();
  // empties the innerHTML of the data divs
  resetData(dataDivs);
  // fetches the weather data
  fetchWeatherAsync(searchQuery, units);
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
  resetData(dataDivs);
  fetchWeatherAsync(searchQuery, units);
  // run the query again
}

export let name = document.querySelector(".cityName");
export let descr = document.querySelector(".description");
export let icon = document.querySelector(".weatherIcon");
export let weathName = document.querySelector(".weatherName");
export let feelsLike = document.querySelector(".feels_like");
export let humid = document.querySelector(".humidity");
export let press = document.querySelector(".pressure");
export let temp = document.querySelector(".temp");
export let tempMax = document.querySelector(".temp_max");
export let tempMin = document.querySelector(".temp_min");
