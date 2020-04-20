// hit the weather api
const API_KEY = "4341bfb4d351de693ffba36fee82fc49";
let cityName = "Petoria";

// async/await weather fetch
// this will return a promise
async function fetchWeatherAsync() {
  // returns a resolved promise and sets it to response
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
  );
  // responseDetails is declared here so that it can be passed onto useData
  // or inspected for error messages
  // It takes the response stream and parses it as json
  let responseDetails = await response.json();
  try {
    if (response.ok == true) {
      // returning in an async function is the same as resolving a promise so here it resolves to the responseDetails
      useData(responseDetails);
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

// returns a fulfilled promise with either a value of a responseDetails object or Error
fetchWeatherAsync();

function useData(response) {
  console.log("use data function response", response);
  // city name
  let { name: cityName } = response;
  console.log("name", cityName);
  //weather variables
  let {
    description,
    icon: weatherIcon,
    main: weatherName,
  } = response.weather[0];
  console.log(response.weather[0]);
  console.log(description, weatherIcon, weatherName);
  //temperature variables
  let {
    feels_like,
    humidity,
    pressure,
    temp,
    temp_max,
    temp_min,
  } = response.main;
  console.log(feels_like, humidity, pressure, temp, temp_max, temp_min);
}

function handleError(err) {
  console.log(err);
}
//weatherObj = data.weather;
//console.log("Weather data", weatherObj[0]);
//tempDataObj = data.main;
//console.log("Temperature Data Object", tempDataObj);

//// promise weather fetch (without error catching)
//function fetchWeatherPromise() {
//  fetch(
//    `http://api.openweathermap.org/data/2.5/weather?q=$//{cityName}&appid=${API_KEY}`
//  )
//    .then((response) => response.json())
//    .then((data) => console.dir("2", data));
//}
//
//fetchWeatherPromise();
