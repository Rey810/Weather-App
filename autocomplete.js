// PLACES
export let placesAutocomplete = places({
  appId: "plD80CGT2YTX",
  apiKey: "ea3585946e68c7bffe43e74f97d73b0c",
  container: document.querySelector("#cityNameInput"),
}).configure({ type: "city" });

console.log(placesAutocomplete.city);
