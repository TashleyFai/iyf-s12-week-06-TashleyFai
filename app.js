const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-btn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const weatherInfo = document.getElementById("weather-info");
const historyList = document.getElementById("history-list");

// Search for weather when the button is clicked
searchButton.addEventListener("click", getWeather);

// Also search when Enter is pressed
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

// Get weather information from the API
async function getWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    loading.classList.remove("hidden");
    errorMessage.textContent = "";
    weatherInfo.style.display = "none";

    try {
        if (typeof API_KEY === "undefined" || API_KEY === "") {
            throw new Error("API key is missing. Please add your OpenWeatherMap API key.");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found or weather data unavailable.");
        }

        const data = await response.json();

        displayWeather(data);
        saveToHistory(data.name);

    } catch (error) {
        showError(error.message);
    } finally {
        loading.classList.add("hidden");
    }
}

// Display the weather information
function displayWeather(data) {
    document.getElementById("city-name").textContent =
        data.name + ", " + data.sys.country;

    document.getElementById("temperature").textContent =
        Math.round(data.main.temp) + "°C";

    document.getElementById("description").textContent =
        data.weather[0].description;

    document.getElementById("feels-like").textContent =
        Math.round(data.main.feels_like) + "°C";

    document.getElementById("humidity").textContent =
        data.main.humidity + "%";

    document.getElementById("wind").textContent =
        data.wind.speed + " m/s";

    document.getElementById("pressure").textContent =
        data.main.pressure + " hPa";

    const iconCode = data.weather[0].icon;

    document.getElementById("weather-icon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    weatherInfo.style.display = "block";
}

// Display an error message
function showError(message) {
    errorMessage.textContent = message;
}

// Save the last five city searches
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    history = history.filter(item => item !== city);
    history.unshift(city);
    history = history.slice(0, 5);

    localStorage.setItem("weatherHistory", JSON.stringify(history));

    loadHistory();
}

// Display saved searches
function loadHistory() {
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    historyList.innerHTML = "";

    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;

        li.addEventListener("click", function() {
            cityInput.value = city;
            getWeather();
        });

        historyList.appendChild(li);
    });
}

// Load previous searches when the page opens
loadHistory();
