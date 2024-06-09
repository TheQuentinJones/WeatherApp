const apiKey = "cea924180544dde5b612be105dafb515";
const searchButton = document.getElementById("search-button")
const inputEl = document.getElementById("city-search")

// second half of API call to get weather data

const displayWeather = (lat, lon, nameCity, thisState, thisCountry) => {

  // console.log(lat, lon, nameCity, thisState, thisCountry)

  const secondUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  fetch(secondUrl)
    .then(function (response) {

      return response.json();

    }).then(function (veryNewData) {

      currentDayCardCreate(veryNewData, nameCity, thisState, thisCountry)

      fiveDayCardCreate(veryNewData)

      inputEl.value = ``
    })

}

// function to show today's weather at the top

const currentDayCardCreate = (veryNewData, nameCity, thisState, thisCountry) => {

  let cityEl = document.getElementById(`current-weather`)
  cityEl.innerHTML = ``

  let titleCityItem = document.createElement("h4")
  titleCityItem.setAttribute("class", "is-size-3")
  let tempItem = document.createElement("p")
  let windItem = document.createElement("p")
  let iconItem = document.createElement("img")
  let feelsLike = document.createElement("p")

  titleCityItem.textContent = `${nameCity}, ${thisState}, ${thisCountry} (${dayjs.unix(veryNewData.current.dt).format("MM/DD/YYYY")})`

  tempItem.textContent = `Current Temp: ${veryNewData.current.temp} F`
  windItem.textContent = `Current Wind Speed: ${veryNewData.current.wind_speed} MPH`
  iconItem.setAttribute(`src`, `https://openweathermap.org/img/wn/${veryNewData.current.weather[0].icon}@2x.png`)
  feelsLike.textContent = `Currently Feels Like: ${veryNewData.current.feels_like} F`

  cityEl.append(titleCityItem, tempItem, iconItem, windItem, feelsLike)

}

// function to create the cards to show the 5 day forecast

const fiveDayCardCreate = (veryNewData) => {

  let cardsEl = document.getElementById(`weather-cards`)
  cardsEl.setAttribute(`class`, `is-flex is-flex-direction-row is-flex-wrap-wrap mt-6`)
  cardsEl.innerHTML = ``

  for (let i = 1; i <= 5; i++) {

    let cardEl = document.createElement("div")
    cardEl.setAttribute("class", "card p-4 mt-2 mr-4")
    let cardTitleEl = document.createElement("p")
    let cardPtag = document.createElement("p")
    let cardPtag2 = document.createElement("p")
    let cardPtag3 = document.createElement("h5")
    let cardIcon = document.createElement("img")

    cardTitleEl.textContent = `Temp: ${veryNewData.daily[i].temp.day} F`
    cardPtag.textContent = `Wind Speed: ${veryNewData.daily[i].wind_speed} MPH`
    cardPtag2.textContent = `Feels Like: ${veryNewData.daily[i].feels_like.day} F`
    cardPtag3.textContent = `Date: (${dayjs.unix(veryNewData.daily[i].dt).format("MM/DD/YY")})`
    cardIcon.setAttribute(`src`, `https://openweathermap.org/img/wn/${veryNewData.daily[i].weather[0].icon}@2x.png`)

    cardsEl.append(cardEl)
    cardEl.append(cardPtag3, cardTitleEl, cardIcon, cardPtag, cardPtag2)

  }

}

// first half of API to get lat and lon for second half

const weatherApi = () => {

  let cityName = inputEl.value

  let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;


  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    }).then(function (data) {

      addNewButtonToList(data)

      let thisCountry = data[0].country
      let thisState = data[0].state
      let nameCity = data[0].name
      let lat = data[0].lat
      let lon = data[0].lon

      displayWeather(lat, lon, nameCity, thisState, thisCountry)

    })

}

// add (or not) new city button

const addNewButtonToList = (data) => {

  let itExists = isValueInLocalStorage(data[0].name)

  if (!itExists) {

    if (localStorage.getItem("cities") == null) {

      let cities = []
      cities.push(data[0].name)
      let cityArray = JSON.stringify(cities)
      localStorage.setItem("cities", cityArray)

    } else {

      let cities = JSON.parse(localStorage.getItem("cities"))
      cities.push(data[0].name)
      let cityArray = JSON.stringify(cities)
      localStorage.setItem("cities", cityArray)

    }

    let buttonUlEL = document.querySelector(".button-ul")
    let liEntry = document.createElement("li")
    let button = document.createElement("button")

    button.setAttribute("class", "button is-black is-normal mt-1 is-fullwidth")
    button.setAttribute("id", data[0].name)
    button.setAttribute("onclick", "clickedWeatherApi(this.id)")
    button.textContent = data[0].name

    buttonUlEL.append(liEntry)
    liEntry.append(button)

  }

}

// button to call API when the search has input and button is clicked

$("#search-button").on("click", weatherApi)

// function to call API when city button is clicked

const clickedWeatherApi = (cityName) => {

  let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    }).then(function (data) {

      console.log(data)

      let thisCountry = data[0].country
      let thisState = data[0].state
      let nameCity = data[0].name
      let lat = data[0].lat
      let lon = data[0].lon

      console.log(JSON.parse(localStorage.getItem("cities")))

      displayWeather(lat, lon, nameCity, thisState, thisCountry)

    })
}

//  function to create buttons on page refresh

const buttonCreate = () => {
  if (localStorage.getItem("cities") != null) {
    let cityArray = JSON.parse(localStorage.getItem("cities"))

    let buttonUlEL = document.querySelector(".button-ul")

    console.log(cityArray)

    for (let i = 0; i < cityArray.length; i++) {

      let liEntry = document.createElement("li")
      let button = document.createElement("button")

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

const isValueInLocalStorage = (value) => {
  if (localStorage.getItem("cities") != null) {
    let cityArray = JSON.parse(localStorage.getItem("cities"))

    if(cityArray.includes(value)){
      return true;
    }

    return false;
  }
}

// function to remove the city button

const removeCity = (city) => {

  let cityArray = JSON.parse(localStorage.getItem("cities"))

  cityArray.forEach(cityName => console.log(cityName))

  newCityArray = cityArray.filter(cityName => cityName !== city)

  console.log(newCityArray)

  localStorage.setItem("cities", JSON.stringify(newCityArray))

  location.reload()

}

