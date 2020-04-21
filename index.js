import {
  name,
  date,
  descr,
  icon,
  weathName,
  //feelsLike,
  humid,
  wind,
  //press,
  temp,
  tempMax,
  tempMin,
  sunrise,
  sunset,
} from "./DOMelements.js";

import menuControl from "./menuControl.js";
// add functionality to menu
menuControl("close", "menu", "menu-overlay");

// hit the weather api
const API_KEY = "4341bfb4d351de693ffba36fee82fc49";

// async/await weather fetch
// this will return a promise
export async function fetchWeatherAsync(cityName, units) {
  // returns a resolved promise and sets it to response
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`
  );
  // responseDetails is declared here so that it can be passed onto useData
  // or inspected for error messages
  // It takes the response stream and parses it as json
  let responseDetails = await response.json();
  try {
    if (response.ok == true) {
      // returning in an async function is the same as resolving a promise so here it resolves to the responseDetails
      let weatherObjects = destructureData(responseDetails);
      populateDOM(weatherObjects);
      return responseDetails;
    } else {
      throw new Error(responseDetails.message);
    }
  } catch (error) {
    console.log("I caught the error!");
    handleError(error);
    return error;
  }
}

function destructureData(response) {
  // the response data is destructured into variables
  // variables then saved in cityName, weather and temperature objects
  console.log(response);

  // unix time stamp from response data
  let { dt: unixDate } = response;
  let weatherDate = formatDate(unixDate);

  // city name
  let { name: cityName } = response;

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

  return { cityName, weatherSummary, tempObj, sunInfo };
}

function populateDOM(weatherObjects) {
  let { cityName, tempObj, weatherSummary, sunInfo } = weatherObjects;
  console.log(cityName, tempObj, weatherSummary);
  // city name
  name.innerHTML = cityName;

  // weather summary
  date.innerHTML = weatherSummary.weatherDate;
  descr.innerHTML = weatherSummary.description;
  icon.innerHTML = weatherSummary.weatherIcon;
  weathName.innerHTML = weatherSummary.weatherName;

  // temperature readings
  //.innerHTML = tempObj.feels_like;
  humid.innerHTML = tempObj.humidity;
  wind.innerHTML = tempObj.wind;
  //press.innerHTML = tempObj.pressure;
  temp.innerHTML = tempObj.temp;
  tempMax.innerHTML = Math.floor(tempObj.temp_max);
  tempMin.innerHTML = Math.floor(tempObj.temp_min);

  // sun info
  sunrise.innerHTML = sunInfo.sunrise;
  sunset.innerHTML = sunInfo.sunset;
}

function handleError(err) {
  console.log(err);
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
  console.log(sunrise, sunset);
  return { sunrise, sunset };
}

// returns a fulfilled promise with either a value of a responseDetails object or Error
//fetchWeatherAsync();
