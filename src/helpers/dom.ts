// Uniwersalne funkcje do manipulacji DOM i sprawdzania URL-i

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
