var previousCities = []; 


function pullWeather (event) {
  event.preventDefault();
  clearPage();
  var citySearch = $("#cityInput").val();
  storeCity(citySearch);
  getWeather(citySearch);
}

function storeCity() {
  previousCities.push(citySearch);
  localStorage.setItem("History", JSON.stringify(previousCities));
}

function clearPage() {

}

function getWeather() {

}


$(".btn").on("click", pullWeather);