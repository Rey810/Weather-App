// hit the weather api
const API_KEY = "4341bfb4d351de693ffba36fee82fc49";
let cityName = "Pretoria";

// async/await weather fetch (without error catching)
async function fetchWeatherAsync() {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
  );
  const data = await response.json();
  console.dir("1", data);
}

fetchWeatherAsync();

// promise weather fetch (without error catching)
function fetchWeatherPromise() {
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => console.dir("2", data));
}

fetchWeatherPromise();
