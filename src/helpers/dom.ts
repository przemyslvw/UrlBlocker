// Uniwersalne funkcje do manipulacji DOM i sprawdzania URL-i

/**
 * Tworzy throttlowaną wersję funkcji (nie częściej niż co delay ms)
 */
export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: any[] | null = null;

  const throttled = function(this: any, ...args: any[]) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    } else {
      if (timeout) clearTimeout(timeout);
      pendingArgs = args;
      timeout = setTimeout(() => {
        last = Date.now();
        fn.apply(this, pendingArgs!);
        timeout = null;
      }, delay - (now - last));
    }
  } as T;
  return throttled;
}

/**
 * Podmienia atrybut i styl elementu
 */
export function replaceElement(
  element: HTMLElement,
  attr: string,
  localHtml: string,
  style: Partial<CSSStyleDeclaration> = {}
): void {
  if (attr) (element as any)[attr] = localHtml;
  Object.assign(element.style, style);
}

/**
 * Sprawdza, czy element zawiera niechciany URL
 */
export function hasUnwantedUrl(
  element: HTMLElement,
  attr: string,
  urls: string[]
): boolean {
  return urls.some(url => ((element as any)[attr] || "").includes(url));
}

/**
 * Przetwarza elementy na stronie
 */
export function processElements(
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
