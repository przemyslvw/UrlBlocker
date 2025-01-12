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
                // dodaj filter: blur(1.5rem);
                link.style.filter = "blur(1.5rem)";
            }
        });
    });
}

// Uruchom funkcję po załadowaniu strony
processLinks();
// Funkcja sprawdzająca linki w obrazkach
function processImageLinks() {
    chrome.storage.sync.get("urls", (data) => {
        const urls = data.urls || [];
        const localHtml = chrome.runtime.getURL("replacement.html");

        // Pobierz wszystkie obrazki na stronie
        const images = document.querySelectorAll("img");

        images.forEach((img) => {
            const src = img.src;

            // Sprawdź, czy URL znajduje się na liście
            if (urls.some(url => src.includes(url))) {
                console.log(`[URL Manager] Replacing image link: ${src} -> ${localHtml}`);
                
                // Podmień link na lokalny plik HTML
                img.src = localHtml;

                // (Opcjonalne) Dodaj dodatkowy styl, aby wyróżnić zmienione obrazki
                img.style.border = "2px solid red";
                // dodaj filter: blur(1.5rem);
                img.style.filter = "blur(1.5rem)";
            }
        });
    });
}

// Uruchom funkcję po załadowaniu strony
// Removed empty setInterval call
processImageLinks() 


// Funkcja sprawdzająca linki w iframe
function processIframeLinks() {
    const localHtml = chrome.runtime.getURL("replacement.html");

    // Pobierz wszystkie iframe na stronie
    const iframes = document.querySelectorAll("iframe");

    iframes.forEach((iframe) => {
        const src = iframe.src;

        console.log(`[URL Manager] Replacing iframe link: ${src} -> ${localHtml}`);
        
        // Podmień link na lokalny plik HTML
        iframe.src = localHtml;

        // (Opcjonalne) Dodaj dodatkowy styl, aby wyróżnić zmienione iframe
        iframe.style.border = "2px solid red";
        // dodaj filter: blur(1.5rem);
        iframe.style.filter = "blur(1.5rem)";
    });
}

// Uruchom funkcję po załadowaniu strony
processIframeLinks();
// Sprawdzaj linki, obrazki i iframe co trzy sekundy
setInterval(() => {
    processLinks();
    processImageLinks();
    processIframeLinks();
}, 3000);