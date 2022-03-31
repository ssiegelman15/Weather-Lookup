// Setting JS variables
var cityDisplay = $('#cityDisplay');
var futureDay = $('.futureDay');
var cityInput = $('#cityInput');
var uvText = $('#uvText');
var uvIndex = $('#uvIndex');
var tempEl = $('.temp');
var windEl = $('.wind');
var humidityEl = $('.humidity');
var buttonEl = $('.btn');
var searchHistory = $('.searchHistory');

var previousCities = [];
setPrevious();

// Create buttons based on stored historical searches.
function showHistory() {
  for (i=0; i<previousCities.length & i<7; i++) {
    var historyBtnEl = $("<button>");
    historyBtnEl.addClass("btn btn-primary btn-history mt-3 ml-4 w-100");
    var historyBtnText = previousCities[i];
    historyBtnEl.text(historyBtnText.substr(0,1).toUpperCase()+historyBtnText.substr(1));
    searchHistory.append(historyBtnEl);
    // clearPage();
    historyBtnEl.on("click", pullHistoricalWeather);
  }
}

function setPrevious() {
  retrievedCities = localStorage.getItem("Searches");
  if (retrievedCities != null) {
    previousCities = JSON.parse(retrievedCities);
    console.log("history", previousCities);
    showHistory();
    return previousCities;
  }
}

function pullWeather(event) {
  // Sequence of events to clear page, store search result, and display weather pulled from Open Weather Map API
  
  event.preventDefault();
  clearPage();
  var citySearch = cityInput.val();
  finalCityText = citySearch.trim();
  storeCity(finalCityText);
  getWeather(finalCityText);
  showHistory();
}

function pullHistoricalWeather(event) {
  // Sequence of events to clear page and display weather pulled from Open Weather Map API based on button clicked
  event.preventDefault();
  clearPage();
  var citySearch = event.target.innerText;
  finalCityText = citySearch.trim()
  // storeCity(finalCityText);
  getWeather(finalCityText);
  showHistory();
}

function storeCity(finalCityText) {
  // Add search result to global histroy var and store search result locally
  previousCities.splice(0, 0, finalCityText);
  console.log("added", previousCities)
  localStorage.setItem("Searches", JSON.stringify(previousCities));
}

// Clears previous five day forecast results when new search is made
function clearPage() {
  futureDay.empty();
  searchHistory.empty();
}

function getWeather(city) {
  // Create variables for both current weather & five day Open Weather Map API's
  var todayWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=979c8157697c1c8cdda4b522d2ef9ef9`;
  var fiveDayForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=979c8157697c1c8cdda4b522d2ef9ef9`;

  // Pull data and display today's weather
  $.ajax({
    url: todayWeather,
    method: 'GET',
  }).then(function (response) {
    var todayDate = moment().format("M/DD/YYYY");
    cityName = response.name;
    cityDisplay.text(cityName + " " + todayDate);
    // Add weather icon to first line of results
    var iconCode = response.weather[0].icon;
    var weatherIcon = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    var img = $("<img>");
    img.attr("src", weatherIcon);
    img.appendTo(cityDisplay);

    var temp = response.main.temp;
    var wind = response.wind.speed;
    var humidity = response.main.humidity;
    tempEl.text("Temp: " + temp + String.fromCharCode(176) + "F");
    windEl.text("Wind: " + wind + " MPH");
    humidityEl.text("Humditiy: " + humidity + "%");

    var latitude = response.coord.lat;
    var longitude = response.coord.lon;
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=mintutely,hourly,alerts&cnt=47&appid=979c8157697c1c8cdda4b522d2ef9ef9`;

    $.ajax({
      url: oneCall,
      method: 'GET'
    }).then(function (oneCallResults) {
      uvText.text("UV Index: ");
      uvIndex.text(oneCallResults.current.uvi);
      if (oneCallResults.current.uvi <= 2) {
        uvIndex.attr("class", "low");
      } else if (oneCallResults.current.uvi <= 5) {
        uvIndex.attr("class", "moderate");
      } else if (oneCallResults.current.uvi <= 7) {
        uvIndex.attr("class", "high");
      } else {
        uvIndex.attr("class", "veryHigh");
      }
    })

  })

  // Pull data and display five day weather outlook
  $.ajax({
    url: fiveDayForecast,
    method: 'GET'
  }).then(function (response) {

    // function to ensure 5 day forecast starts at next day noon
    var i = 0;
    //  || moment(response.list[j].dt_txt).format('HH') != 12) unsure if i should get this specific, but this would give temp at noon every day...
    for (j = 0; j <= 8; j++) {
      if (moment(response.list[j].dt_txt).format('M/D/YYYY') == moment().format('M/D/YYYY')) {
        continue
      } else {
        i += j;
        break
      }
    }

    var allDays = ["day1", "day2", "day3", "day4", "day5"]
    // Somehow work logic in to make for loop run exactly five times while potentially having i start at 11
    for (i; i <= 39; i += 8) {
      var dateOutlook = allDays[Math.floor(i / 8)];
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


// $('.btn-history').on("click", pullHistoricalWeather);
buttonEl.on("click", pullWeather);