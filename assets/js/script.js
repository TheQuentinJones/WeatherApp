var apiKey = "cea924180544dde5b612be105dafb515";
var searchButton = document.getElementById("search-button")
var inputEl = document.getElementById("city-search")



function displayWeather(lat, lon, nameCity, thisState, thisCountry) {

  console.log(lat, lon, nameCity, thisState, thisCountry)

  var secondUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
  fetch(secondUrl)
    .then(function (response) {

      // console.log(response);


      return response.json();

    }).then(function (veryNewData) {

      console.log(veryNewData)

      const cityEl = document.getElementById("current-weather")
      cityEl.innerHTML = ""

      const titleCityItem = document.createElement("h4")
      titleCityItem.setAttribute("class", "is-size-3")
      const tempItem = document.createElement("p")
      const windItem = document.createElement("p")
      const iconItem = document.createElement("img")
      const feelsLike = document.createElement("p")

      titleCityItem.textContent = nameCity + ", " + thisState + ", " + thisCountry + " (" + dayjs.unix(veryNewData.current.dt).format("MM/DD/YYYY") + ")"

      tempItem.textContent = "Current Temp: " + veryNewData.current.temp + " F"
      windItem.textContent = "Current Wind Speed: " + veryNewData.current.wind_speed + " MPH"
      iconItem.setAttribute("src", "https://openweathermap.org/img/wn/" + veryNewData.current.weather[0].icon + "@2x.png")
      feelsLike.textContent = "Currently Feels Like: " + veryNewData.current.feels_like + " F"

      cityEl.append(titleCityItem)
      cityEl.append(tempItem)
      cityEl.append(iconItem)
      cityEl.append(windItem)
      cityEl.append(feelsLike)

      var cardsEl = document.getElementById("weather-cards")
      cardsEl.setAttribute("class", "is-flex is-flex-direction-row is-flex-wrap-wrap mt-6")
      cardsEl.innerHTML = ""


      for (var i = 1; i <= 5; i++) {

        var cardEl = document.createElement("div")
        cardEl.setAttribute("class", "card p-4 mt-2 mr-4")
        var cardTitleEl = document.createElement("p")
        var cardPtag = document.createElement("p")
        var cardPtag2 = document.createElement("p")
        var cardPtag3 = document.createElement("h5")
        var cardIcon = document.createElement("img")

        cardTitleEl.textContent = "Temp: " + veryNewData.daily[i].temp.day + " F"
        cardPtag.textContent = "Wind Speed: " + veryNewData.daily[i].wind_speed + " MPH"
        cardPtag2.textContent = "Feels Like: " + veryNewData.daily[i].feels_like.day + " F"
        cardPtag3.textContent = "Date: (" + dayjs.unix(veryNewData.daily[i].dt).format("MM/DD/YY") + ")"
        cardIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + veryNewData.daily[i].weather[0].icon + "@2x.png")

        console.log(veryNewData.daily[0].temp.day)

        cardsEl.append(cardEl)
        cardEl.append(cardPtag3)
        cardEl.append(cardTitleEl)
        cardEl.append(cardIcon)
        cardEl.append(cardPtag)
        cardEl.append(cardPtag2)

      }
      inputEl.value = ""
    })

}


function weatherApi() {

  var cityName = inputEl.value

  var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    }).then(function (data) {

      console.log(data)
      var itExists = isValueInLocalStorage(data[0].name)

      if (!itExists) {

        if (localStorage.length <= 0) {

          var cities = []
          cities.push(data[0].name)
          var cityArray = JSON.stringify(cities)
          localStorage.setItem("cities", cityArray)

        } else {

          var cities = JSON.parse(localStorage.getItem("cities"))
          cities.push(data[0].name)
          var cityArray = JSON.stringify(cities)
          localStorage.setItem("cities", cityArray)

        }

        var buttonUlEL = document.querySelector(".button-ul")
        var liEntry = document.createElement("li")
        var button = document.createElement("button")
        // var deleteButton = document.createElement("button")

        button.setAttribute("class", "button is-black is-normal mt-1 is-fullwidth")
        button.setAttribute("id", data[0].name)
        button.setAttribute("onclick", "clickedWeatherApi(this.id)")
        button.textContent = data[0].name

        // deleteButton.setAttribute("class" , "button is-small mt-1 ml-1 is-danger")
        // deleteButton.setAttribute("id", data[0].name)
        // deleteButton.setAttribute("onClick", "removeCity(this.id)")
        // deleteButton.textContent = "X"

        buttonUlEL.append(liEntry)
        liEntry.append(button)
        // liEntry.append(deleteButton)

      }

      var thisCountry = data[0].country
      var thisState = data[0].state
      var nameCity = data[0].name
      var lat = data[0].lat
      var lon = data[0].lon

      console.log(cities)

      displayWeather(lat, lon, nameCity, thisState, thisCountry)

    })



}

$("#search-button").on("click", weatherApi)

function clickedWeatherApi(cityName) {

  var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    }).then(function (data) {

      console.log(data)

      var thisCountry = data[0].country
      var thisState = data[0].state
      var nameCity = data[0].name
      var lat = data[0].lat
      var lon = data[0].lon

      console.log(JSON.parse(localStorage.getItem("cities")))

      displayWeather(lat, lon, nameCity, thisState, thisCountry)

    })



}

//  function to create buttons on page refresh

function buttonCreate() {
  if (localStorage.length > 0) {
    var cityArray = JSON.parse(localStorage.getItem("cities"))

    var buttonUlEL = document.querySelector(".button-ul")

    console.log(cityArray)

    for (var i = 0; i < cityArray.length; i++) {

      var liEntry = document.createElement("li")
      var button = document.createElement("button")

      button.setAttribute("class", "button is-black is-normal is-fullwidth mt-1")
      button.setAttribute("id", cityArray[i])
      button.setAttribute("onclick", "clickedWeatherApi(this.id)")
      button.textContent = cityArray[i]

      buttonUlEL.append(liEntry)
      liEntry.append(button)

    }
  }
}

buttonCreate()

// function to check if a city is already in localStorage

function isValueInLocalStorage(value) {
  if (localStorage.length > 0) {
    var cityArray = JSON.parse(localStorage.getItem("cities"))

    for (let i = 0; i < cityArray.length; i++) {

      const storedValue = cityArray[i];
      if (storedValue.toLowerCase() === value.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}

// function to remove the city button

removeCity = (city) => {

  const cityArray = JSON.parse(localStorage.getItem("cities"))

  cityArray.forEach(cityName => console.log(cityName))

  newCityArray = cityArray.filter(cityName => cityName !== city)

  console.log(newCityArray)

  localStorage.setItem("cities", JSON.stringify(newCityArray))

  location.reload()

}

