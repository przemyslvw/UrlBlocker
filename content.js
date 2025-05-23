// Pobierz listę URL-i z chrome.storage
function getUrls(callback) {
    chrome.storage.sync.get("urls", (data) => {
        callback(data.urls || []);
    });
}

// Uniwersalna funkcja do podmiany atrybutu i stylu elementu
function replaceElement(element, attr, localHtml, style = {}) {
    if (attr) element[attr] = localHtml;
    Object.assign(element.style, style);
}

// Sprawdź, czy element zawiera niechciany URL
function hasUnwantedUrl(element, attr, urls) {
    return urls.some(url => (element[attr] || "").includes(url));
}

// Przetwórz elementy na stronie
function processElements(selector, attr, urls, localHtml, style = {}, remove = false) {
    document.querySelectorAll(selector).forEach((el) => {
        if (hasUnwantedUrl(el, attr, urls)) {
            console.log(`[URL Manager] Found unwanted URL in ${selector}: ${el[attr]}`);
            console.log(`[URL Manager] Replacing: ${el[attr]} -> ${localHtml}`);
            replaceElement(el, attr, localHtml, style);
            if (remove && el.parentElement) el.remove();
        }
    });
}

// Przetwórz miniatury YouTube (nie mają src, ale można je zamazać)
function processThumbnails(localHtml, style = {}) {
    [
        "ytd-thumbnail",
        "yt-thumbnail-view-model",
        "ytd-rich-shelf-renderer",
        "ytm-shorts-lockup-view-model",
        "yt-collection-thumbnail-view-model"
    ].forEach(selector => {
        document.querySelectorAll(selector).forEach(thumbnail => {
            Object.assign(thumbnail.style, style);
        });
    });
}

// Główna funkcja przetwarzająca
function processAllLinks() {
    const localHtml = chrome.runtime.getURL("replacement.html");
    getUrls((urls) => {
        processElements("a", "href", urls, localHtml, { color: "red", fontWeight: "bold", filter: "blur(1.5rem)", height: "0px", width: "0px" }, true);
        processElements("img", "src", urls, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        processElements("iframe", "src", urls, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        processElements("video", "src", urls, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        processThumbnails(localHtml, { filter: "blur(1.5rem)", height: "0px", width: "0px", border: "2px solid red" });
    });
}

processAllLinks();
setInterval(processAllLinks, 1000);
