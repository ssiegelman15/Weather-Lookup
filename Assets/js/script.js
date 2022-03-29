var previousCities = []; 


function pullWeather (event) {
  // Sequence of events to clear page, store search result, and display weather pulled from Open Weather Map API
  event.preventDefault();
  clearPage();
  var citySearch = $("#cityInput").val();
  storeCity(citySearch);
  getWeather(citySearch);
}

function storeCity() {
  // Add search result to global histroy var and store search result locally
  previousCities.push(citySearch);
  localStorage.setItem("History", JSON.stringify(previousCities));
}

function clearPage() {

}

function getWeather(city) {
  // Create variables for both current weather & five day Open Weather Map API's
  var todayWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=979c8157697c1c8cdda4b522d2ef9ef9`;
  var fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=979c8157697c1c8cdda4b522d2ef9ef9`;
  
  $.ajax({
    url: todayWeather,
    method: 'GET',
}).then(function (response) {
  console.log(response);
}


$(".btn").on("click", pullWeather);