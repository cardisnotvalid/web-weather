document.addEventListener("DOMContentLoaded", function() {
    const cityInput = document.getElementById("city");
    let currentFocus = -1;

    cityInput.addEventListener("input", handleInput);
    cityInput.addEventListener("keydown", handleKeydown);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleShortcut);

    function handleInput() {
        const query = this.value;

        if (query.length <= 2) {
            closeAllLists();
            return false;
        }

        fetch(`/complete?q=${query}`)
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

        data.forEach(item => {
            const suggestion = document.createElement("div");
            suggestion.innerHTML = `<strong>${item.name}</strong> - ${item.region}, ${item.country}`;
            suggestion.innerHTML += `<input type='hidden' value='${item.name}'>`;
            suggestion.innerHTML += `<input type='hidden' value='/weather?city=${item.name}'>`;

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
        document.getElementById("location-name").innerText = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById("location-time").innerText = `Местное время: ${data.location.localtime}`;
        document.getElementById("weather-icon").src = data.current.condition.icon;
        document.getElementById("temperature").innerText = `Температура: ${data.current.temp_c}°C`;
        document.getElementById("condition").innerText = `Погодные условия: ${data.current.condition.text}`;
        document.getElementById("wind").innerText = `Ветер: ${data.current.wind_kph} км/ч ${data.current.wind_dir}`;
        weatherInfo.classList.remove("hidden");
    }
});
