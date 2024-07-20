document.addEventListener("DOMContentLoaded", function() {
    const weatherBtn = document.getElementById("weather-btn");
    const lastCityBtn = document.getElementById("last-city-btn");
    const cityInput = document.getElementById("city");
    const windDirMap = {
        "N": "С",
        "NNE": "ССВ",
        "NE": "СВ",
        "ENE": "ВСВ",
        "E": "В",
        "ESE": "ВЮВ",
        "SE": "ЮВ",
        "SSE": "ЮЮВ",
        "S": "Ю",
        "SSW": "ЮЮЗ",
        "SW": "ЮЗ",
        "WSW": "ЗЮЗ",
        "W": "З",
        "WNW": "ЗСЗ",
        "NW": "СЗ",
        "NNW": "ССЗ"
    };
    let currentFocus = -1;

    weatherBtn.addEventListener("click", handleSearch);
    lastCityBtn.addEventListener("click", handleLastCity);
    cityInput.addEventListener("input", handleInput);
    cityInput.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleShortcut);

    function handleSearch() {
        const city = cityInput.value;
        if (city) {
            fetchWeatherData(`/api/weather?city=${encodeURIComponent(city)}`);
        }
    }

    function handleLastCity() {
        const city = lastCityBtn.innerText;
        fetchWeatherData(`/api/weather?city=${encodeURIComponent(city)}`);
    }

    function handleInput() {
        const query = this.value;

        if (query.length <= 2) {
            closeAllLists();
            return false;
        }

        fetch(`/api/complete?q=${query}`)
            .then(response => response.json())
            .then(data => {
                closeAllLists();
                renderSuggestions(data);
            });
    }

    function handleKeydown(e) {
        const autocompleteList = document.getElementById("autocomplete-list");
        if (autocompleteList) {
            let items = autocompleteList.getElementsByTagName("div");
            if (e.key === "ArrowDown") {
                currentFocus++;
                addActive(items);
            } else if (e.key === "ArrowUp") {
                currentFocus--;
                addActive(items);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (currentFocus > -1 && items) {
                    items[currentFocus].click();
                }
            }
        }
    }

    function handleShortcut(e) {
        if (e.key === "/") {
            e.preventDefault();
            cityInput.focus();
        }
    }

    function handleClickOutside(e) {
        if (e.target !== cityInput) {
            closeAllLists();
        }
    }

    function renderSuggestions(data) {
        const autocompleteList = document.getElementById("autocomplete-list");
        autocompleteList.hidden = false;

        data.forEach(item => {
            const suggestion = document.createElement("div");
            suggestion.innerHTML = `<strong>${item.name}</strong> - ${item.region}, ${item.country}`;
            suggestion.innerHTML += `<input type="hidden" value="${item.name}">`;
            suggestion.innerHTML += `<input type="hidden" value="/api/weather?city=${item.name}">`;

            suggestion.addEventListener("click", function() {
                const selectedCity = this.getElementsByTagName("input")[0].value;
                const redirectUrl = this.getElementsByTagName("input")[1].value;
                cityInput.value = selectedCity;
                fetchWeatherData(redirectUrl);
                closeAllLists();
            });
            autocompleteList.appendChild(suggestion);
        });
    }

    function addActive(items) {
        if (!items) return false;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists() {
        const autocompleteList = document.getElementById("autocomplete-list");
        while (autocompleteList.firstChild) {
            autocompleteList.removeChild(autocompleteList.firstChild);
        }
        currentFocus = -1;
        autocompleteList.hidden = true;
    }

    function fetchWeatherData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayWeatherInfo(data);
            });
    }

    function displayWeatherInfo(data) {
        const weatherInfo = document.getElementById("weather-info");
        const windDirection = windDirMap[data.current.wind_dir] || data.current.wind_dir;

        const localTimeEpoch = data.location.localtime_epoch * 1000;
        const localTime = new Date(localTimeEpoch);

        const formattedTime = localTime.toLocaleString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
        });

        document.getElementById("location-name").innerText = `${data.location.name}, ${data.location.country}`;
        document.getElementById("location-time").innerText = formattedTime;
        document.getElementById("weather-icon").src = data.current.condition.icon;
        document.getElementById("temperature").innerText = `Температура: ${data.current.temp_c}°C`;
        document.getElementById("condition").innerText = `Состояние: ${data.current.condition.text}`;
        document.getElementById("wind").innerText = `Ветер: ${data.current.wind_kph} км/ч ${windDirection}`;

        renderWeeklyForecast(data.forecast.forecastday);
        weatherInfo.classList.remove("hidden");
    }

    function renderWeeklyForecast(forecastDays) {
        const weeklyForecast = document.getElementById("weekly-forecast");
        weeklyForecast.innerHTML = "";

        forecastDays.forEach(day => {
            const dayForecast = document.createElement("div");
            dayForecast.classList.add("day-forecast");

            const date = new Date(day.date);
            const options = { weekday: "long", month: "long", day: "numeric" };
            const formattedDate = date.toLocaleDateString("ru-RU", options);

            dayForecast.innerHTML = `
                <div class="date">${formattedDate}</div>
                <img src="${day.day.condition.icon}" alt="Weather icon">
                <div class="temp">${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</div>
                <div class="condition">${day.day.condition.text}</div>
            `;

            weeklyForecast.appendChild(dayForecast);
        });
    }
});
