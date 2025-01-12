const urlInput = document.getElementById('urlInput');
const addUrlButton = document.getElementById('addUrlButton');
const urlList = document.getElementById('urlList');

// Załaduj URL-e z pamięci
function loadUrls() {
    chrome.storage.sync.get('urls', (data) => {
        const urls = data.urls || [];
        urlList.innerHTML = '';
        urls.forEach((url, index) => {
            const li = document.createElement('li');
            li.textContent = url;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Usuń';
            removeButton.addEventListener('click', () => removeUrl(index));

            li.appendChild(removeButton);
            urlList.appendChild(li);
        });
    });
}

// Dodaj URL do listy
function addUrl() {
    const newUrl = urlInput.value.trim();
    if (!newUrl) return;

    chrome.storage.sync.get('urls', (data) => {
        const urls = data.urls || [];
        urls.push(newUrl);
        chrome.storage.sync.set({ urls }, () => {
            urlInput.value = '';
            loadUrls();
        });
    });
}

// Usuń URL z listy
function removeUrl(index) {
    chrome.storage.sync.get('urls', (data) => {
        const urls = data.urls || [];
        urls.splice(index, 1);
        chrome.storage.sync.set({ urls }, loadUrls);
    });
}

// Nasłuchiwacze zdarzeń
addUrlButton.addEventListener('click', addUrl);

// Początkowe załadowanie
loadUrls();

// Losowe powitanie
function showRandomGreeting() {
    const greetings = [
        "Witaj!", 
        "Cześć!", 
        "Miłego dnia!", 
        "Hej!", 
        "Jak się masz?", 
        "Dzień dobry!", 
        "Witamy ponownie!", 
        "Miło Cię widzieć!", 
        "Jak leci?", 
        "Co słychać?"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const greetingDiv = document.getElementById("greeting");
    greetingDiv.textContent = randomGreeting;
}

// Wywołanie powitania po załadowaniu popupu
showRandomGreeting();

