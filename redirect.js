chrome.storage.sync.get("urls", ({ urls = [] }) => {
    const currentUrl = window.location.href;

    // Sprawdź, czy bieżący URL znajduje się na liście
    if (urls.some(url => currentUrl.includes(url))) {
        console.log(`[URL Manager] Redirecting: ${currentUrl} -> replacement.html`);
        
        // Przekierowanie do lokalnego pliku HTML
        window.location.href = chrome.runtime.getURL("replacement.html");
    }
});
