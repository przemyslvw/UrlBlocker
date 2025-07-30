import { processElements, throttle } from "./helpers/dom";
import './helpers/redirect';

type UrlsCallback = (urls: string[]) => void;

const WHITELIST = [
    "mail.google.com",
    "majdak.online"
];

const YT_THUMBNAIL_SELECTORS = [
    "ytd-thumbnail",
    "yt-thumbnail-view-model",
    "ytd-ad-slot-renderer",
    "ytm-media-item-thumbnail",
    "ytd-rich-section-renderer",
    "ytm-compact-video-renderer-thumbnail",
    "ytd-rich-shelf-renderer",
    "ytm-shorts-lockup-view-model",
    "yt-collection-thumbnail-view-model"
];

const AD_SELECTORS = [
    ".ad-container"
];

const BLUR_STYLE: Partial<CSSStyleDeclaration> = {
    filter: "blur(1.5rem)",
    height: "0px",
    width: "0px",
    border: "2px solid red"
};

const LINK_STYLE: Partial<CSSStyleDeclaration> = {
    color: "red",
    fontWeight: "bold",
    ...BLUR_STYLE
};

const AD_STYLE: Partial<CSSStyleDeclaration> = {
    height: "0px",
    width: "0px",
    minHeight: "0px",
    minWidth: "0px"
};

function getUrls(callback: UrlsCallback): void {
    chrome.storage.sync.get("urls", ({ urls = [] }) => callback(urls));
}

function isWhitelisted(): boolean {
    return WHITELIST.some(domain => window.location.hostname.includes(domain));
}

function processThumbnails(style: Partial<CSSStyleDeclaration>): void {
    YT_THUMBNAIL_SELECTORS.forEach(selector => {
        document.querySelectorAll<HTMLElement>(selector).forEach(el => {
            Object.assign(el.style, style);
        });
    });
}

function processAds(style: Partial<CSSStyleDeclaration>): void {
    AD_SELECTORS.forEach(selector => {
        document.querySelectorAll<HTMLElement>(selector).forEach(ad => {
            Object.assign(ad.style, style);
        });
    });
}

function processAllLinks(): void {
    if (isWhitelisted()) return;

    getUrls(urls => {
        processElements("a", "href", urls, LINK_STYLE, true);
        ["img", "iframe", "video"].forEach(tag =>
            processElements(tag, "src", urls, BLUR_STYLE)
        );

        chrome.storage.sync.get('thumbnailsEnabled', ({ thumbnailsEnabled }) => {
            if (thumbnailsEnabled !== false) {
                processThumbnails(BLUR_STYLE);
            }
        });

        processAds(AD_STYLE);
    });
}

const throttledProcessAllLinks = throttle(processAllLinks, 1000);

throttledProcessAllLinks();

const observer = new MutationObserver(throttledProcessAllLinks);
observer.observe(document.body, { childList: true, subtree: true, attributes: true });
