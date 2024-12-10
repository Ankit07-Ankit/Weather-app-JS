const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherDetails = document.querySelector(".weather-details");
const searchCity = document.querySelector(".search-city");
const notFound = document.querySelector(".not-found");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValue = document.querySelector(".humidity-value");
const windValue = document.querySelector(".wind-value");
const weatherImg = document.querySelector(".weather-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastContainer = document.querySelector(".forecast-container");

const apiKey = "123dd35c64770adde11ac06c733649e2";

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
    }
})

cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
    }
})

async function getFatchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstrom.png'
    if (id <= 321) return 'drizzle.png'
    if (id <= 531) return 'rainy.png'
    if (id <= 622) return 'snowfall.png'
    if (id <= 781) return 'haze.png'
    if (id <= 800) return 'sunny.png'
    else return 'cloudy.png'
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFatchData('weather', city);
    
    if (weatherData.cod != 200) {
        showDisplay(notFound);
        return;
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main}],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + " ℃";
    humidityValue.textContent = humidity + " %";
    conditionTxt.textContent = main;
    currentDateTxt.textContent = getCurrentDate();
    windValue.textContent = speed + "M/s";
    weatherImg.src = `images/weather/${getWeatherIcon(id)}`;

    await updateForecastsInfo(city);
    showDisplay(weatherDetails);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFatchData('forecast', city);

    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];

    forecastContainer.innerHTML = '';

    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItmes(forecastWeather);
        }
    })
}

function updateForecastItmes(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date);
    const dateOption = {
        day: "2-digit",
        month: "short"
    }

    const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-date current-txt">${dateResult}</h5>
            <img src="images/weather/${getWeatherIcon(id)}" alt="" class="forecast-img">
            <h5 class="forecast-temp current-txt">${Math.round(temp)} ℃</h5>
        </div>
    `

    forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplay(section) {
    [weatherDetails, searchCity, notFound]
        .forEach(section => section.style.display = 'none');
    section.style.display ="flex";
}