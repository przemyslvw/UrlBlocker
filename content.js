// Pobierz listę URL-i z chrome.storage
function getUrls(callback) {
    chrome.storage.sync.get("urls", (data) => {
        callback(data.urls || []);
    });
}

// Podmień link na lokalny plik HTML i dodaj styl
function replaceLink(element, localHtml, style) {
    element.href = localHtml;
    Object.assign(element.style, style);
}

// Podmień obrazek na lokalny plik HTML i dodaj styl
function replaceImage(element, localHtml, style) {
    element.src = localHtml;
    Object.assign(element.style, style);
}

// Podmień iframe na lokalny plik HTML i dodaj styl
function replaceIframe(element, localHtml, style) {
    element.src = localHtml;
    Object.assign(element.style, style);
}

// Przetwórz linki na stronie
function processLinks(urls, localHtml) {
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
        if (urls.some(url => link.href.includes(url))) {
            console.log(`[URL Manager] Found unwanted URL in link: ${link.href}`);
            console.log(`[URL Manager] Replacing link: ${link.href} -> ${localHtml}`);
            replaceLink(link, localHtml, { color: "red", fontWeight: "bold", filter: "blur(1.5rem)", height: "0px", width: "0px" });
            link.parentElement.style.filter = "blur(1.5rem)";
            link.parentElement.style.height = "0px";
            link.parentElement.style.width = "0px";
            link.remove();
        }
    });
}

// Przetwórz obrazki na stronie
function processImageLinks(urls, localHtml) {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
        if (urls.some(url => img.src.includes(url))) {
            console.log(`[URL Manager] Found unwanted URL in image: ${img.src}`);
            console.log(`[URL Manager] Replacing image link: ${img.src} -> ${localHtml}`);
            replaceImage(img, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        }
    });
}

// Przetwórz miniatury na ytube znacznik <ytd-thumbnail>
function processThumbnailLinks(localHtml) {
    const thumbnails = [
        ...document.querySelectorAll("ytd-thumbnail"),
        ...document.querySelectorAll("yt-thumbnail-view-model"),
        ...document.querySelectorAll("ytd-rich-shelf-renderer"),
        ...document.querySelectorAll("ytm-shorts-lockup-view-model"),
        ...document.querySelectorAll("yt-collection-thumbnail-view-model")
    ];
    thumbnails.forEach((thumbnail) => {
            console.log(`[URL Manager] Found unwanted URL in thumbnail: ${thumbnail.src}`);
            console.log(`[URL Manager] Replacing thumbnail link: ${thumbnail.src} -> ${localHtml}`);
            replaceImage(thumbnail, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
    });
}

// Przetwórz iframe na stronie
function processIframeLinks(localHtml) {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
        console.log(`[URL Manager] Found unwanted URL in iframe: ${iframe.src}`);
        console.log(`[URL Manager] Replacing iframe link: ${iframe.src} -> ${localHtml}`);
        replaceIframe(iframe, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
    });
}

// Uruchom funkcje przetwarzające po załadowaniu strony
function processAllLinks() {
    const localHtml = chrome.runtime.getURL("replacement.html");
    getUrls((urls) => {
        processLinks(urls, localHtml);
        processImageLinks(urls, localHtml);
        processIframeLinks(localHtml);
        processThumbnailLinks(localHtml);
    });
}

// Uruchom funkcje przetwarzające po załadowaniu strony
processAllLinks();

// Sprawdzaj linki, obrazki i iframe co trzy sekundy
setInterval(processAllLinks, 1000);
// Dodaj funkcjonalność do przetwarzania elementów wideo na stronie
function processVideoLinks(urls, localHtml) {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
        if (urls.some(url => video.src.includes(url))) {
            console.log(`[URL Manager] Found unwanted URL in video: ${video.src}`);
            console.log(`[URL Manager] Replacing video link: ${video.src} -> ${localHtml}`);
            replaceIframe(video, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        }
    });
}

// Uruchom funkcje przetwarzające po załadowaniu strony
// function processAllLinks() {
//     const localHtml = chrome.runtime.getURL("replacement.html");
//     getUrls((urls) => {
//         processLinks(urls, localHtml);
//         processImageLinks(urls, localHtml);
//         processIframeLinks(localHtml);
//         processVideoLinks(urls, localHtml);
//         // processThumbnailLinks(urls, localHtml);
//     });
// }