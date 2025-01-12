// Pobierz listę URL-i i przetwórz stronę
function processLinks() {
    chrome.storage.sync.get("urls", (data) => {
        const urls = data.urls || [];
        const localHtml = chrome.runtime.getURL("replacement.html");

        // Pobierz wszystkie linki i obrazy na stronie
        const links = document.querySelectorAll("a, img");

        links.forEach((link) => {
            const href = link.href || link.src;

            // Sprawdź, czy URL znajduje się na liście
            if (urls.some(url => href.includes(url))) {
                console.log(`[URL Manager] Replacing link: ${href} -> ${localHtml}`);
                
                // Podmień link na lokalny plik HTML
                if (link.tagName.toLowerCase() === 'a') {
                    link.href = localHtml;
                } else if (link.tagName.toLowerCase() === 'img') {
                    link.src = localHtml;
                }

                // (Opcjonalne) Dodaj dodatkowy styl, aby wyróżnić zmienione linki
                link.style.color = "red";
                link.style.fontWeight = "bold";
            }
        });
    });
}

// Uruchom funkcję po załadowaniu strony
processLinks();

// Uruchom funkcję co 5 sekund
setInterval(processLinks, 5000);
