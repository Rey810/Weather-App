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

import { colors } from "./colors.js";

import getCountryCode from "./countryCode.js";
import menuControl from "./menuControl.js";
// add functionality to menu
menuControl("close", "menu", "menu-overlay");

// hit the weather api
const API_KEY = "4341bfb4d351de693ffba36fee82fc49";
const flickr_API_KEY = "1951625a765ba51695f0fe80993edb42";

export async function fetchFlickrPhoto(cityName) {
  try {
    const responseData = await fetch(
      `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickr_API_KEY}&tags=${cityName},iconic&tag_mode=all&sort=interestingness-desc&safe_search=1&content_type=1&media=photos&per_page=5&page=1&format=json&nojsoncallback=1`
    );
    const jsonData = await responseData.json();
    if (responseData.ok == true && jsonData.stat != "fail") {
      const photoArrayLength = jsonData.photos.photo.length;
      const photoData = jsonData.photos.photo[randomNumber(photoArrayLength)];
      const imageUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}_z.jpg`;
      console.log("image url", imageUrl);
      setBackgroundImage(imageUrl);
      return imageUrl;
    } else {
      throw new Error(responseDetails.message);
    }
  } catch (error) {
    console.log("Image fetch error", error);
    removeBgPhoto();
  }
}

function randomNumber(length) {
  return Math.floor(Math.random() * Math.floor(length - 1));
}

function removeBgPhoto() {
  console.log("Photo not found so here is some colour");
  heroImgContainer.style.backgroundImage = "none";
}

// async/await weather fetch

//fetchFlickrPhoto("cape town");

export async function fetchWeatherAsync(cityName, units) {
  // returns a resolved promise and sets it to response
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}`
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

  // city and country
  let { name: cityName } = response;
  let { country: countryCode } = response.sys;
  let countryName = getCountryCode(countryCode);
  console.log("country", country);

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
  console.log(cityName, tempObj, weatherSummary);
  // city name
  name.innerHTML = cityName;
  try {
    console.log(typeof countryName);
    country.innerHTML = countryName;
  } catch (err) {
    console.log(err);
  }

  // set background-colour according to weather name
  try {
    console.log("color value", colors[weatherSummary.weatherName]);
    hero.style.backgroundColor = colors[weatherSummary.weatherName];
  } catch (error) {
    console.log(error);
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
  console.log(err);
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
  console.log("sunrise time", sunriseTime);
  const sunrise = sunriseTime.toLocaleTimeString("en-za", options);

  const sunsetMilliseconds = sunsetUnix * 1000;
  const sunsetTime = new Date(sunsetMilliseconds);
  const sunset = sunsetTime.toLocaleTimeString("en-za", options);
  console.log("sunrise", sunrise, "sunset", sunset);
  return { sunrise, sunset };
}

function setBackgroundImage(url) {
  heroImgContainer.style.backgroundImage = "none";
  heroImgContainer.style.backgroundImage = `url(${url})`;
}

// returns a fulfilled promise with either a value of a responseDetails object or Error
//fetchWeatherAsync();
