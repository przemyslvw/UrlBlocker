import { processElements, throttle } from "./helpers/dom";
import './helpers/redirect';

// Pobierz listę URL-i z chrome.storage
function getUrls(callback: (urls: string[]) => void): void {
    chrome.storage.sync.get("urls", (data: { urls?: string[] }) => {
        callback(data.urls || []);
    });
}

// Przetwórz miniatury YouTube (nie mają src, ale można je zamazać)
function processThumbnails(localHtml: string, style: Partial<CSSStyleDeclaration> = {}): void {
    [
        "ytd-thumbnail",
        "yt-thumbnail-view-model",
        "ytd-rich-shelf-renderer",
        "ytm-shorts-lockup-view-model",
        "yt-collection-thumbnail-view-model"
    ].forEach(selector => {
        document.querySelectorAll<HTMLElement>(selector).forEach(thumbnail => {
            Object.assign(thumbnail.style, style);
        });
    });
}

// Główna funkcja przetwarzająca
// Lista domen do whitelisty (nie wykonuj kodu na tych stronach)
const WHITELIST: string[] = [
    "mail.google.com",
    "majdak.online"
];

function isWhitelisted(): boolean {
    return WHITELIST.some(domain => window.location.hostname.includes(domain));
}

function processAllLinks(): void {
    if (isWhitelisted()) return;
    const localHtml = chrome.runtime.getURL("replacement.html");
    getUrls((urls) => {
        processElements("a", "href", urls, localHtml, { color: "red", fontWeight: "bold", filter: "blur(1.5rem)", height: "0px", width: "0px" }, true);
        processElements("img", "src", urls, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        processElements("iframe", "src", urls, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        processElements("video", "src", urls, localHtml, { border: "2px solid red", filter: "blur(1.5rem)", height: "0px", width: "0px" });
        chrome.storage.sync.get('thumbnailsEnabled', (data: { thumbnailsEnabled?: boolean }) => {
            if (data.thumbnailsEnabled !== false) {
                processThumbnails(localHtml, { filter: "blur(1.5rem)", height: "0px", width: "0px", border: "2px solid red" });
            }
        });
    });
}

const throttledProcessAllLinks: () => void = throttle(processAllLinks, 1000);

// Na starcie
throttledProcessAllLinks();

// Nasłuchiwanie zmian DOM
const observer: MutationObserver = new MutationObserver((): void => {
  throttledProcessAllLinks();
});

observer.observe(document.body, { childList: true, subtree: true, attributes: true });
