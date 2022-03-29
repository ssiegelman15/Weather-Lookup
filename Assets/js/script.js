var cityDisplay = $('#cityDisplay');
var futureDay = $('.futureDay');
var cityInput = $('#cityInput');
var uvText = $('#uvText');
var uvIndex = $('#uvIndex');

var previousCities = [];

function capitalize(word) {
  // Separate city by spaces and capitalize both words in city name.
  return word.toUpperCase() + word.slice(1);
}

function pullWeather(event) {
  // Sequence of events to clear page, store search result, and display weather pulled from Open Weather Map API
  event.preventDefault();
  clearPage();
  var citySearch = $(cityInput).val();
  cityText=capitalize(citySearch);
  finalCityText = cityText.trim();
  storeCity(finalCityText);
  getWeather(finalCityText);
}

function storeCity(finalCityText) {
  // Add search result to global histroy var and store search result locally
  previousCities.push(finalCityText);
  localStorage.setItem("History", JSON.stringify(previousCities));
}

// Clears previous five day forecast results when new search is made
function clearPage() {
  $(futureDay).empty();
}

function getWeather(city) {
  // Create variables for both current weather & five day Open Weather Map API's
  var todayDate = moment().format("M/DD/YYYY");
  cityDisplay.text(cityText + " " + todayDate);
  var todayWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityText}&units=imperial&appid=979c8157697c1c8cdda4b522d2ef9ef9`;
  var fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${cityText}&units=imperial&appid=979c8157697c1c8cdda4b522d2ef9ef9`;

  // Pull data and display today's weather
  $.ajax({
    url: todayWeather,
    method: 'GET',
  }).then(function (response) {
    // Add weather icon to first line of results
    var iconCode = response.weather[0].icon;
    var weatherIcon = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    var img = $("<img>");
    img.attr("src", weatherIcon);
    img.appendTo(cityDisplay);

    var temp = response.main.temp;
    var wind = response.wind.speed;
    var humidity = response.main.humidity;
    $(".temp").text("Temp: " + temp + String.fromCharCode(176) + "F");
    $(".wind").text("Wind: " + wind + " MPH");
    $(".humidity").text("Humditiy: " + humidity + "%");

    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=mintutely,hourly,daily,alerts&appid=979c8157697c1c8cdda4b522d2ef9ef9`;

    $.ajax({
      url: oneCall,
      method: 'GET'
    }).then(function (oneCallResults) {
      $(uvText).text("UV Index: ");
      $(uvIndex).text(oneCallResults.current.uvi);
      if (oneCallResults.current.uvi <= 2) {
        $(uvIndex).attr("class", "low");
      } else if (oneCallResults.current.uvi <= 5) {
        $(uvIndex).attr("class", "moderate");
      } else if (oneCallResults.current.uvi <= 7) {
        $(uvIndex).attr("class", "high");
      } else {
        $(uvIndex).attr("class", "veryHigh");
      }
    })

  })

  // Pull data and display five day weather outlook

  $.ajax({
    url: fiveDayForecast,
    method: 'GET'
  }).then(function (response) {
    console.log(response);
    var allDays = ["day1", "day2", "day3", "day4", "day5"]
    for (i = 0; i <= allDays.length * 8; i += 8) {
      var dateOutlook = allDays[i / 8];
      var dateElement = $("<li>");
      var dateElementText = moment(response.list[i].dt_txt).format('M/D/YYYY');
      dateElement.text(dateElementText);
      var tempElement = $("<li>");
      tempElement.text("Temp: " + response.list[i].main.temp + String.fromCharCode(176) + "F");
      var windElement = $("<li>");
      windElement.text("Wind: " + response.list[i].wind.speed + " MPH");
      var humidityElement = $("<li>");
      humidityElement.text("Humidity: " + response.list[i].main.humidity + "%");
      var iconElement = $("<img>");
      var iconCode = response.list[i].weather[0].icon;
      var iconImage = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
      iconElement.attr("src", iconImage);
      $("#" + dateOutlook).append(dateElement);
      $("#" + dateOutlook).append(iconElement);
      $("#" + dateOutlook).append(tempElement);
      $("#" + dateOutlook).append(windElement);
      $("#" + dateOutlook).append(humidityElement);
    }
  })

}

$(".btn").on("click", pullWeather);