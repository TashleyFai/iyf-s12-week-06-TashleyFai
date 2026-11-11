# Weather Dashboard

A weather app built for IYF Weekend Academy Season 12, Week 6 (Asynchronous JavaScript). It uses the fetch API with async/await and the OpenWeatherMap API.

## Live Demo

https://YOUR-USERNAME.github.io/iyf-s12-week-06-YOUR-USERNAME/

## Features

- Search a city with the button or the Enter key
- Shows city, icon, temperature (°C), description, feels like, humidity, wind and pressure
- Shows "Loading…" while fetching
- Clear messages for an unknown city or no internet connection
- Keeps the last 5 searches in localStorage; click one to search again

## How to Run

1. Clone the repo.
2. Get a free key at https://openweathermap.org/api (new keys can take up to 2 hours to activate).
3. Copy `config.example.js` to `config.js` and add your key inside the quotes.
4. Open `index.html` in your browser (or use Live Server in VS Code).

`config.js` is in `.gitignore`, so the key is never committed.

## How the key is kept out of Git

- The key only lives in `config.js` (git-ignored).
- On deploy, GitHub Actions writes `config.js` from the repository secret `OPENWEATHER_API_KEY`.

## Project Structure

- `index.html`, `styles.css`, `app.js`: the Weather Dashboard
- `config.example.js`: empty key template (committed)
- `.github/workflows/deploy.yml`: deploys to GitHub Pages
- `async-practice.js`: Lesson 11 practice
- `daily-challenges/`: the five daily challenges

## What I Learned

- Promises, async/await and try/catch for error handling
- fetch does not reject on a 404, so I check `response.ok`
- Saving and reading data with localStorage
- Keeping secrets out of Git
