// API_KEY is NOT declared here: it comes from config.js (git-ignored), loaded first.
// Never paste your key into this file.
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

async function getWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    try {
        showLoading();
        hideError();

        const response = await fetch(url);

        // fetch does not reject on 404/401, so check response.ok
        if (!response.ok) {
            if (response.status === 404) throw new Error("City not found. Check the spelling and try again.");
            if (response.status === 401) throw new Error("API key not valid yet: new keys can take up to 2 hours to activate");
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        displayWeather(data);
        saveToHistory(data.name);

    } catch (err) {
        // fetch itself rejects (TypeError) only when there is no network at all
        showError(err.name === "TypeError" ? "Network error: check your internet connection" : err.message);
    } finally {
        hideLoading();
    }
}

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

function showLoading() {
    loading.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

function hideError() {
    error.classList.add("hidden");
}

function readHistory() {
    try {
        const recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        return Array.isArray(recent) ? recent : [];
    } catch (err) {
        return [];
    }
}

function saveToHistory(city) {
    // Newest first, no duplicates, keep only the last 5
    const recent = readHistory().filter((c) => c.toLowerCase() !== city.toLowerCase());
    recent.unshift(city);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_HISTORY)));
    } catch (err) {
        // storage blocked or full: the app still works without history
    }
    loadHistory();
}

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

// Event Listeners (submit covers both the button and the Enter key)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Initialize
loadHistory();
