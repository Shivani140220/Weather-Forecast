const searchBox = document.getElementById('search');

searchBox.addEventListener('input', debounce(fetchSuggestions, 300));

async function fetchSuggestions() {
    const query = searchBox.value;
    if (query.length < 3) return;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    displaySuggestions(data.list);
}

function displaySuggestions(suggestions) {
    const suggestionBox = document.createElement('div');
    suggestionBox.classList.add('suggestions');

    suggestions.forEach((suggestion) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = suggestion.name;
        suggestionItem.onclick = () => {
            searchBox.value = suggestion.name;
            fetchWeather();
        };
        suggestionBox.appendChild(suggestionItem);
    });

    const existingSuggestionBox = document.querySelector('.suggestions');
    if (existingSuggestionBox) existingSuggestionBox.remove();

    document.body.appendChild(suggestionBox);
}

function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

async function fetchWeather() {
    const searchValue = document.getElementById('search').value;
    if (!searchValue) return alert('Please enter a city or zip code.');

    weatherInfo.classList.add('loading');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    weatherInfo.classList.remove('loading');

    if (response.status !== 200) return alert('City not found. Please try again.');

    displayWeather(data);
}
