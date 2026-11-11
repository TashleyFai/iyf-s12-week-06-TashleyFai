// API_KEY comes from config.js, which is loaded before this file.
// Never put your API key directly in this file.
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const STORAGE_KEY = "recent";
const MAX_HISTORY = 5;

// DOM Elements
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const weatherDisplay = document.getElementById("weather-display");
const searchHistory = document.getElementById("search-history");

// Elements to update
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

// Get weather information
async function getWeather(city) {
    try {
        showLoading();
        hideError();

        // Check whether the API key exists
        if (typeof API_KEY === "undefined" || !API_KEY) {
            throw new Error("API key is missing. Please configure your API key.");
        }

        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        // Check for HTTP errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling and try again.");
            }

            if (response.status === 401) {
                throw new Error("API key is not valid yet. New keys can take up to 2 hours to activate.");
            }

            throw new Error("Failed to fetch weather data.");
        }

        const data = await response.json();

        displayWeather(data);
        saveToHistory(data.name);

    } catch (err) {
        showError(
            err.name === "TypeError"
                ? "Network error: check your internet connection."
                : err.message
        );
    } finally {
        hideLoading();
    }
}

// Display weather information
function displayWeather(data) {
    const info = data.weather[0];

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${info.icon}@2x.png`;
    weatherIcon.alt = info.description;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = info.description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;

    weatherDisplay.classList.remove("hidden");
}

// Show loading indicator
function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

// Hide loading indicator
function hideLoading() {
    loading.classList.add("hidden");
}

// Display error messages
function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

// Hide error messages
function hideError() {
    error.classList.add("hidden");
}

// Read saved search history safely
function readHistory() {
    try {
        const recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        return Array.isArray(recent) ? recent : [];
    } catch (err) {
        return [];
    }
}

// Save the last five searches
function saveToHistory(city) {
    const recent = readHistory().filter(
        (c) => c.toLowerCase() !== city.toLowerCase()
    );

    recent.unshift(city);

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(recent.slice(0, MAX_HISTORY))
        );
    } catch (err) {
        // The app can still work if storage is unavailable.
    }

    loadHistory();
}

// Display recent searches
function loadHistory() {
    const recent = readHistory();
    searchHistory.innerHTML = "";

    recent.forEach((city) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");

        btn.type = "button";
        btn.textContent = city;

        btn.addEventListener("click", () => {
            cityInput.value = city;
            getWeather(city);
        });

        li.appendChild(btn);
        searchHistory.appendChild(li);
    });
}

// Handle form submission (button and Enter key)
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Load previous searches when the page opens
loadHistory();
