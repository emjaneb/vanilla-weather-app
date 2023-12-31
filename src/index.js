function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
     <div class="forecast-day">${formatDay(forecastDay.time)}</div>
     <img src=${forecastDay.condition.icon_url} alt=${
          forecastDay.condition.icon
        } class="forecast-icon">
     <div class="forecast-temp">
     <span class="forecast-max">${Math.round(
       forecastDay.temperature.maximum
     )}°</span>
     <span class="forecast-min">${Math.round(
       forecastDay.temperature.minimum
     )}°</span>
     </div>
     </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coords) {
  let apiKey = "a6946fa02tb383o83fefbda1f7e7863a";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coords.longitude}&lat=${coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#current-icon");

  celsiusTemp = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(celsiusTemp);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "a6946fa02tb383o83fefbda1f7e7863a";
  let units = "metric";
  let currentApiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(currentApiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Melbourne");
