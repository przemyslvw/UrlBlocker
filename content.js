// Pobierz listę URL-i i przetwórz stronę
function processLinks() {
    chrome.storage.sync.get("urls", (data) => {
        const urls = data.urls || [];
        const localHtml = chrome.runtime.getURL("replacement.html");

        // Pobierz wszystkie linki na stronie
        const links = document.querySelectorAll("a");

        links.forEach((link) => {
            const href = link.href;

            // Sprawdź, czy URL znajduje się na liście
            if (urls.some(url => href.includes(url))) {
                console.log(`[URL Manager] Replacing link: ${href} -> ${localHtml}`);
                
                // Podmień link na lokalny plik HTML
                link.href = localHtml;

                // (Opcjonalne) Dodaj dodatkowy styl, aby wyróżnić zmienione linki
                link.style.color = "red";
                link.style.fontWeight = "bold";
            }
        });
    });
}

// Uruchom funkcję po załadowaniu strony
processLinks();
