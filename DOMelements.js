import { fetchWeatherAsync } from "./index.js";
import { resetData } from "./index.js";

let button = document.querySelector("#citySearchButton");

let dataDivs = [...document.querySelectorAll(".data")];

button.addEventListener("click", () => {
  let searchQuery = document.querySelector("#cityNameInput").value;
  resetData(dataDivs);
  fetchWeatherAsync(searchQuery);
});

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
