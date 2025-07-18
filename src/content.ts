// Pobierz listę URL-i z chrome.storage
function getUrls(callback: (urls: string[]) => void): void {
    chrome.storage.sync.get("urls", (data: { urls?: string[] }) => {
        callback(data.urls || []);
    });
}

// Uniwersalna funkcja do podmiany atrybutu i stylu elementu
function replaceElement(element: HTMLElement, attr: string, localHtml: string, style: Partial<CSSStyleDeclaration> = {}): void {
    if (attr) (element as any)[attr] = localHtml;
    Object.assign(element.style, style);
}

// Sprawdź, czy element zawiera niechciany URL
function hasUnwantedUrl(element: HTMLElement, attr: string, urls: string[]): boolean {
    return urls.some(url => ((element as any)[attr] || "").includes(url));
}

// Przetwórz elementy na stronie
function processElements(
    selector: string,
    attr: string,
    urls: string[],
    localHtml: string,
    style: Partial<CSSStyleDeclaration> = {},
    remove = false
): void {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (hasUnwantedUrl(el, attr, urls)) {
            console.log(`[URL Manager] Found unwanted URL in ${selector}: ${(el as any)[attr]}`);
            console.log(`[URL Manager] Replacing: ${(el as any)[attr]} -> ${localHtml}`);
            replaceElement(el, attr, localHtml, style);
            if (remove && el.parentElement) el.remove();
        }
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
const WHITELIST = [
    "mail.google.com",
    "majdak.online"
];

function isWhitelisted(): boolean {
    return WHITELIST.some(domain => window.location.hostname.includes(domain));
}

function processAllLinks() {
    if (isWhitelisted()) return;
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
