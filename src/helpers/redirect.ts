// Typ przechowujący listę blokowanych adresów URL pobieranych z chrome.storage
// Może być rozszerzony w przyszłości o inne pola
//
type UrlsStorage = { urls?: string[] };

// Funkcja sprawdzająca, czy aktualny adres URL powinien zostać przekierowany
// Zwraca true, jeśli którykolwiek z blokowanych adresów znajduje się w aktualnym URL
function shouldRedirect(currentUrl: string, blockedUrls: string[]): boolean {
    return blockedUrls.some(url => currentUrl.includes(url));
}

// Funkcja nadpisująca zawartość strony komunikatem o blokadzie
function blockPage(): void {
    document.documentElement.innerHTML = `
        <head>
            <title>Zablokowano stronę</title>
            <meta charset='utf-8'>
            <style>
                body { display: flex; height: 100vh; align-items: center; justify-content: center; background: #fffbe7; color: #222; font-family: sans-serif; }
                .block-message { font-size: 2rem; border: 2px solid #e57373; background: #fff0f0; padding: 2em 3em; border-radius: 16px; box-shadow: 0 2px 12px #0001; }
            </style>
        </head>
        <body>
            <div class="block-message">Dostęp do tej strony został <b>zablokowany</b> przez UrlBlocker.</div>
        </body>
    `;
}


// Funkcja asynchroniczna pobierająca listę blokowanych adresów URL z chrome.storage
// Zwraca Promise z tablicą stringów
async function getBlockedUrls(): Promise<string[]> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("urls", (result: UrlsStorage) => {
            resolve(result.urls ?? []);
        });
    });
}

// Główna funkcja obsługująca logikę przekierowania
// 1. Pobiera aktualny adres URL
// 2. Pobiera listę blokowanych adresów
// 3. Sprawdza, czy przekierować
// 4. Jeśli tak, wykonuje przekierowanie
async function handleRedirect() {
    const currentUrl = window.location.href;
    const blockedUrls = await getBlockedUrls();
    if (shouldRedirect(currentUrl, blockedUrls)) {
        blockPage();
    }
}

// Wywołanie głównej funkcji po załadowaniu skryptu
handleRedirect();
