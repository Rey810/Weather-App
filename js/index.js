import {
  name,
  country,
  date,
  descr,
  icon,
  //weathName,
  //feelsLike,
  humid,
  wind,
  //press,
  temp,
  tempMax,
  tempMin,
  sunrise,
  sunset,
  hero,
  heroImgContainer,
  dataDivs,
} from "./DOMelements.js";
//import { colors } from "./colors.js";
import { getCountryName } from "./countryCode.js";
import menuControl from "./menuControl.js";

// add functionality to menu
menuControl("close", "menu", "menu-overlay");

// add initial data upon site load
// fetches the weather data
window.onload = () => {
  fetchWeatherAsync("Cape Town, ZA", "metric");
  toggleLoader();
};

export async function fetchFlickrPhoto(cityName) {
  try {
    // the js object containing the city name
    const cityData = { cityName: `${cityName}` };
    const responseData = await fetch(
      "https://cloudfare-flickr810.reythedev.workers.dev",
      {
        mode: "cors",
        method: "POST",
        //stringify takes a JS object and transforms it into a json string
        body: JSON.stringify(cityData),
      }
    );
    console.log("flickr-response", responseData);
    const jsonData = await responseData.json();
    console.log("JSON photo data", jsonData);
    if (responseData.ok == true && jsonData.stat != "fail") {
      const imageURL = formatURL(jsonData);
      setBackgroundImage(imageURL);
    } else {
      throw new Error(responseDetails.message);
    }
  } catch (error) {
    console.log("Image fetch error", error);
    placeholderBackground();
  }
}

function randomNumber(length) {
  return Math.floor(Math.random() * Math.floor(length - 1));
}

function placeholderBackground() {
  console.log("Photo not found so here is a placeholder");
  heroImgContainer.style.backgroundImage = `url(./Images/placeholder.jpg)`;
  toggleLoader();
}

// async/await weather fetch

//fetchFlickrPhoto("cape town");

export async function fetchWeatherAsync(queryName, units) {
  // returns a resolved promise and sets it to response
  const weatherRequest = {
    cityName: `${queryName}`,
    units: `${units}`,
  };

  const response = await fetch(
    "https://cloudfare-weather810.reythedev.workers.dev",
    {
      method: "POST",
      //stringify takes a JS object and transforms it into a json string
      body: JSON.stringify(weatherRequest),
    }
  );

  // responseDetails is declared here so that it can be passed onto useData
  // or inspected for error messages
  // It takes the response stream and parses it as json
  let responseDetails = await response.json();
  try {
    if (response.ok == true) {
      // returning in an async function is the same as resolving a promise so here it resolves to the responseDetails
      let weatherObjects = await destructureData(responseDetails);
      // empties the innerHTML of the data divs
      resetData(dataDivs);
      populateDOM(weatherObjects);
      return responseDetails;
    } else {
      throw new Error(responseDetails.message);
    }
  } catch (error) {
    handleError(error);
    return error;
  }
}

function destructureData(response) {
  // the response data is destructured into variables
  // variables then saved in cityName, weather and temperature objects

  // unix time stamp from response data
  let { dt: unixDate } = response;
  let weatherDate = formatDate(unixDate);

  // city and country
  let { name: cityName } = response;
  let { country: countryCode } = response.sys;
  let countryName = getCountryName(countryCode);
  // destructure response data into weather variables
  let {
    description,
    icon: weatherIcon,
    main: weatherName,
  } = response.weather[0];

  let weatherSummary = { weatherDate, description, weatherIcon, weatherName };
  console.log("weather summary", weatherSummary);
  //destructure response data into temp variables
  let {
    feels_like,
    humidity,
    pressure,
    temp,
    temp_max,
    temp_min,
  } = response.main;

  // wind speed from response data (wind object)
  let { speed: wind } = response.wind;

  // add temp variables to a tempObj
  let tempObj = {
    feels_like,
    humidity,
    pressure,
    wind,
    temp,
    temp_max,
    temp_min,
  };

  // sunrise and sunset data
  let { sunrise: sunriseUnix, sunset: sunsetUnix } = response.sys;
  let sunInfo = formatTime(sunriseUnix, sunsetUnix);

  return { cityName, countryName, weatherSummary, tempObj, sunInfo };
}

function populateDOM(weatherObjects) {
  let {
    cityName,
    countryName,
    tempObj,
    weatherSummary,
    sunInfo,
  } = weatherObjects;

  // city name
  name.innerHTML = cityName;
  try {
    country.innerHTML = countryName;
  } catch (err) {
    console.log(err);
  }

  // weather summary
  date.innerHTML = weatherSummary.weatherDate;
  descr.innerHTML = weatherSummary.weatherName;

  let darkIcon = darkenIcon(weatherSummary.weatherIcon);
  icon.src = `http://openweathermap.org/img/wn/${darkIcon}.png`;
  //weathName.innerHTML = weatherSummary.weatherName;

  // temperature readings
  //.innerHTML = tempObj.feels_like;
  humid.innerHTML = `${tempObj.humidity} %`;
  wind.innerHTML = `${Math.floor(tempObj.wind)} km/h`;
  //press.innerHTML = tempObj.pressure;
  temp.innerHTML = `${Math.floor(tempObj.temp)}&deg;`;
  tempMax.innerHTML = `${Math.floor(tempObj.temp_max)}&deg;`;
  tempMin.innerHTML = `${Math.floor(tempObj.temp_min)}&deg;`;

  // sun info
  sunrise.innerHTML = sunInfo.sunrise;
  sunset.innerHTML = sunInfo.sunset;
}

function handleError(err) {
  alert("City not found");
}

function darkenIcon(iconCode) {
  const icon = iconCode;
  const darkenedIcon = icon.replace("d", "n");
  return darkenedIcon;
}

export function resetData(htmlDivs) {
  htmlDivs.map((div) => (div.innerHTML = ""));
}

function formatDate(unixDate) {
  const milliseconds = unixDate * 1000;
  const newDate = new Date(milliseconds);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const finalDate = newDate.toLocaleDateString("en-za", options);
  return finalDate;
}

function formatTime(sunriseUnix, sunsetUnix) {
  const options = { hour: "numeric", minute: "numeric" };

  const sunriseMilliseconds = sunriseUnix * 1000;
  const sunriseTime = new Date(sunriseMilliseconds);
  const sunrise = sunriseTime.toLocaleTimeString("en-za", options);

  const sunsetMilliseconds = sunsetUnix * 1000;
  const sunsetTime = new Date(sunsetMilliseconds);
  const sunset = sunsetTime.toLocaleTimeString("en-za", options);
  return { sunrise, sunset };
}

function formatURL(jsonData) {
  const photoArrayLength = jsonData.photos.photo.length;
  const photoData = jsonData.photos.photo[randomNumber(photoArrayLength)];
  const imageUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}_c.jpg`;
  console.log("image url", imageUrl);
  return imageUrl;
}

function setBackgroundImage(url) {
  let img = new Image();
  img.src = url;
  img.onload = function () {
    toggleLoader();
  };
  heroImgContainer.style.backgroundImage = "none";
  heroImgContainer.style.backgroundImage = `url(${img.src}`;
}

export function toggleLoader() {
  const body = document.body;
  body.classList.toggle("loaded");
}

// returns a fulfilled promise with either a value of a responseDetails object or Error
//fetchWeatherAsync();

// PLACES AUTOCOMPLETE
export let placesAutocomplete = places({
  appId: "plD80CGT2YTX",
  apiKey: "b7ceba1bc9a11872d4a8202f6c3b9698",
  container: document.querySelector("#cityNameInput"),
}).configure({ type: "city" });
