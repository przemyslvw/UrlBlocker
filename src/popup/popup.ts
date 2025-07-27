const urlInput: HTMLInputElement | null = document.getElementById('urlInput') as HTMLInputElement | null;
const addUrlButton: HTMLButtonElement | null = document.getElementById('addUrlButton') as HTMLButtonElement | null;
const urlList: HTMLUListElement | null = document.getElementById('urlList') as HTMLUListElement | null;

// Załaduj URL-e z pamięci
function loadUrls(): void {
    if (!urlList) return;
    chrome.storage.sync.get('urls', (data: { urls?: string[] }) => {
        const urls: string[] = data.urls || [];
        urlList.innerHTML = '';
        urls.forEach((url: string, index: number): void => {
            const li = document.createElement('li');
            li.textContent = url;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Usuń';
            removeButton.addEventListener('click', (): void => removeUrl(index));

            li.appendChild(removeButton);
            urlList.appendChild(li);
        });
    });
}

// Obsługa ukrywania miniatur
const toggleThumbnails: HTMLInputElement | null = document.getElementById('toggleThumbnails') as HTMLInputElement | null;

if (toggleThumbnails) {
  // Ustaw stan z pamięci
  chrome.storage.sync.get('thumbnailsEnabled', (data: { thumbnailsEnabled?: boolean }) => {
    toggleThumbnails.checked = data.thumbnailsEnabled !== false; // domyślnie włączone
  });

  // Obsługa zmiany
  toggleThumbnails.addEventListener('change', (): void => {
    chrome.storage.sync.set({ thumbnailsEnabled: toggleThumbnails.checked });
  });
}

// Dodaj URL do listy
function addUrl(): void {
    if (!urlInput) return;
    const newUrl: string = urlInput.value.trim();
    if (!newUrl) return;

    chrome.storage.sync.get('urls', (data: { urls?: string[] }) => {
        const urls: string[] = data.urls || [];
        urls.push(newUrl);
        chrome.storage.sync.set({ urls }, (): void => {
            if (urlInput) urlInput.value = '';
            loadUrls();
        });
    });
}

// Usuń URL z listy
function removeUrl(index: number): void {
    chrome.storage.sync.get('urls', (data: { urls?: string[] }) => {
        const urls: string[] = data.urls || [];
        urls.splice(index, 1);
        chrome.storage.sync.set({ urls }, loadUrls);
    });
}

// Nasłuchiwacze zdarzeń
if (addUrlButton) {
    addUrlButton.addEventListener('click', (event: MouseEvent): void => addUrl());
}

// Początkowe załadowanie
loadUrls();

// Losowe powitanie
function showRandomGreeting(): void {
    const greetings: string[] = [
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
    const randomGreeting: string = greetings[Math.floor(Math.random() * greetings.length)];
    const greetingDiv = document.getElementById("greeting");
    if (greetingDiv) greetingDiv.textContent = randomGreeting;
}

// Ustaw powitanie i numer wersji w footerze po załadowaniu DOM

document.addEventListener('DOMContentLoaded', (): void => {
  showRandomGreeting();
  const versionSpan: HTMLElement | null = document.getElementById('version');
  if (versionSpan && typeof __APP_VERSION__ !== 'undefined') {
    versionSpan.textContent = __APP_VERSION__;
  }
});

