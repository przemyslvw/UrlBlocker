
# UrlBlocker

![Icon](img/icon_transparent_128x128.png)

- Wtyczka pozwala na blokowanie stron dodanych do listy
- zdjęcia z danym urlem
- Docelowo będzie też blokować zapytania typu GET


## Propozycje refaktoryzacji

1. Przepisanie background.js na TypeScript
  * Zmień nazwę na background.ts i przenieś do builda Vite.
2. Wydzielenie helpers/dom.ts
  * Przenieś uniwersalne funkcje z content.ts do helpers/dom.ts, aby kod był bardziej modularny.
3. Zoptymalizuj setInterval
  * Jeśli nie jest konieczne odświeżanie co sekundę, rozważ throttle/debounce.
4. Automatyzacja manifest.json
  * Rozważ użycie vite-plugin-web-extension lub podobnego pluginu.
5. Przegląd typów
  * Upewnij się, że wszystkie funkcje/funkcje pomocnicze mają jawnie zadeklarowane typy.
6. Sprawdzenie builda
  * Upewnij się, że do dist trafiają tylko niezbędne pliki.
