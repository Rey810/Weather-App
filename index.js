import {
  name,
  descr,
  icon,
  weathName,
  feelsLike,
  humid,
  press,
  temp,
  tempMax,
  tempMin,
} from "./DOMelements.js";

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

  // This needs to be manipulated into a human readable format
  let { dt: unixDate } = response;
  console.log(unixDate);
  // city name
  let { name: cityName } = response;

  //weather variables
  let {
    description,
    icon: weatherIcon,
    main: weatherName,
  } = response.weather[0];

  let weatherSummary = { description, weatherIcon, weatherName };

  let {
    feels_like,
    humidity,
    pressure,
    temp,
    temp_max,
    temp_min,
  } = response.main;

  let tempObj = {
    feels_like,
    humidity,
    pressure,
    temp,
    temp_max,
    temp_min,
  };

  return { cityName, weatherSummary, tempObj };
}

function populateDOM(weatherObjects) {
  let { cityName, tempObj, weatherSummary } = weatherObjects;
  console.log(cityName, tempObj, weatherSummary);
  // city name
  name.innerHTML = cityName;

  // weather summary
  descr.innerHTML = weatherSummary.description;
  icon.innerHTML = weatherSummary.weatherIcon;
  weathName.innerHTML = weatherSummary.weatherName;

  // temperature readings
  feelsLike.innerHTML = tempObj.feels_like;
  humid.innerHTML = tempObj.humidity;
  press.innerHTML = tempObj.pressure;
  temp.innerHTML = tempObj.temp;
  tempMax.innerHTML = tempObj.temp_max;
  tempMin.innerHTML = tempObj.temp_min;
}

function handleError(err) {
  console.log(err);
}

export function resetData(htmlDivs) {
  htmlDivs.map((div) => (div.innerHTML = ""));
}

// returns a fulfilled promise with either a value of a responseDetails object or Error
//fetchWeatherAsync();
