# PRD — ondrapelikan.cz (portfolio, statický web)

**Verze:** 0.1 (první průchod ze `texty web.pages`)
**Autor projektu:** Ondřej Pelikán
**Datum:** 2026-08-30

## Zdroje

- `texty web.pages` — zadání + veškeré popisky děl (exportováno, viz níže)
- Reference: [marieladrova.com](https://marieladrova.com), [eliskaperglerova.cz](https://www.eliskaperglerova.cz) — **rozklikávací menu vlevo** (čeká se na podrobný rozbor od Kateřiny)
- Reference: [kristofkintera.com/home.htm](https://kristofkintera.com/home.htm) — vizuální umělec, objekty
- Sesterský projekt `~/GitHub/13remesel` (trinactremesel.cz) — **zdroj fontu, loga, galerie**

---

## Zamčená rozhodnutí (ze zadání)

| # | Téma | Volba |
|---|---|---|
| 1 | Typografie | **Poppins** — přebrat 1:1 z 13Ř (`assets/css/fonts.css`, self-hosted woff2) |
| 2 | Barvy | **Achromatická paleta** — pozadí bílé, text tmavě šedý, aktivní/vybraná položka menu a logo **černě**. Žádná barva navíc. |
| 3 | Rohy fotek | **Ostré, bez zaoblení** — `border-radius: 0` (rozdíl oproti 13Ř, kde je `var(--radius-lg)` — zde vědomě vypnout) |
| 4 | Galerie | Převzít komponentu z 13Ř (`.wedding-gallery` grid + `#lightbox` s šipkami a focus trapem z `assets/js/main.js`), přejmenovat obecně (např. `.gallery`), zachovat chování |
| 5 | Hlavička | Žádná hero fotka/vizuál v headeru — čistý styl. Logo vlevo nahoře: „Ondřej Pelikán", **Ondřej** jako horní index (`<sup>`) |
| 6 | Menu | Vlevo, rozklikávací (accordion) — kategorie s odrážkou se rozbaluje na jednotlivá díla |
| 7 | Pořadí obsahu na stránce díla | Nejdřív úvodní text (pokud existuje), pak až fotka/video |
| 8 | Framework | Žádný — vanilla HTML/CSS/JS jako 13Ř (zero-framework, zero-deps) |

---

## 1. Cíl

Portfolio web Ondřeje Pelikána — fotografie, objekty, poezie, zvuk/performance — s odkazem na `trinactremesel.cz` (řemeslná/výdělečná větev). Čistá, klidná prezentace autorské tvorby, bez komerčního tlaku.

## 2. Information architecture — rozklikávací menu vlevo

```
Fotografie
  ├─ Až jelen s laní útes slaní, 2010–2025
  └─ Moje první auto, 2018
Objekty
  ├─ Betonové chleby, 2014–
  ├─ Vodňanské kuře, 2015
  ├─ Vánoční svícínek, 2024
  └─ Hole, 2024–
Poezie
  ├─ Ministerstvo hub, 2026
  ├─ Revolver Revue 141, 2025
  ├─ Teletext ČT, 2024
  ├─ MAČ Brno 2026
  │   ├─ Významný strom
  │   ├─ Řádnej grunt je základ vsi
  │   ├─ Řešil jsem to už s fízlama
  │   └─ Kratší básně (6 netitulkovaných básní spojených do jedné stránky)
  ├─ Matko dej mi chlast, 2026
  └─ Tohle musíš udělat co nejdřív, 2024
Zvuk a performance
Třináct řemesel  (vlastní stránka s fotkou + textem + odkazem na trinactremesel.cz)
Biografie
Kontakt
```

Vybraná položka (aktuální stránka/dílo) = černě, ostatní tmavě šedě. Jen kategorie s podpoložkami se rozbalují; „Zvuk a performance" a „Biografie" jsou rovnou samostatné stránky bez rozbalení.

### Chování menu (UX rozhodnutí)

| Aspekt | Volba | Proč |
|---|---|---|
| Klik na kategorii | Jen toggluje rozbalení/sbalení, nenaviguje nikam (kategorie sama není stránka) | Kategorie je jen nadpis skupiny, ne obsah |
| Kolik kategorií otevřených | Accordion — otevřením jedné se ostatní zavřou | Drží menu krátké a přehledné, hlavně s vnořením MAČ Brno 2026 |
| Aktuální stránka | Kategorie, ve které leží otevřená stránka, je při načtení rovnou rozbalená (server/staticky vyrenderované, ne až po JS) | Funguje i bez JS, nebliká to |
| Animace | Plynulý height transition ~180ms, `prefers-reduced-motion` vypne animaci | Jemné, ne rušivé |
| Vizuální indikátor | Malá šipka/chevron u kategorie, rotuje o 90° při rozbalení | Jasně říká „tady jde něco rozkliknout" |
| Klik na položku díla | Klasický odkaz, plný page load (žádný AJAX/SPA routing) | Konzistentní se zero-deps přístupem, funguje i bez JS |
| Mobil | Nad obsahem lišta s tlačítkem „Menu", po kliknutí se rozbalí stejný accordion přes celou šířku | Levý sloupec se na mobilu nevejde |

**Implementováno bez JS** — menu je čisté `<details>/<summary>`, accordion na top-levelu řeší nativní `<details name="side-nav-top">` (browser sám zavře ostatní). Mobilní "Menu" tlačítko je taky jen `<details>` s CSS override na desktopu. Žádný `menu.js` není potřeba.

## 3. Obsah po sekcích

### Fotografie

**Až jelen s laní útes slaní, 2010–2025**
> Autorská kniha vydaná v počtu jednoho kusu, fotografie z barevného negativu 35mm.
Zdroj fotek: `až jelen s laní útes slaní/` (102 souborů, hotovo — jen roztřídit pořadí).

**Moje první auto, 2018**
> Dokumentace vozidel a prostředí studentských kolejí v Praze. Fotografie z barevného negativu 35mm.
Zdroj: `moje první auto/` (29 souborů, hotovo).

### Objekty

**Betonové chleby, 2014–**
> Od roku 2014 Ondřej formuje a odlévá betonové chleby a jiné pečivo. To dále užívá k rituálním účelům. Zakopává je na významných místech, při cestách po USA odléval místní pečivo a házel ho do řek… Po vytvoření kruhu ze zakopaných chlebů kolem své vesnice k němu přišla jeho budoucí žena. Do chlebů občas zalévá poselství dalším generacím.
Zdroj: `betonový chleby/` (11 souborů — mix fotek/skenů, chce probrat výběr).

**Vodňanské kuře, 2015**
> Odlitek mraženého kuřete za 90 Kč vznikl na cizí rezidenci v Egon Schiele Art Centru v roce 2015.
Zdroj fotek: **chybí složka** — nedodáno.

**Vánoční svícínek, 2024**
> Úvodní dílo ze série zpracování spotřební elektroniky.
Zdroj: `vánoční svícínek/` (1 foto + 1 video) — **hotovo, obsah se neřeší dál**. Foto a video stejně široké pod sebou.

**Hole, 2024–**
> Z různých dřevin různé hole. Kolekci kraluje hůl z divizny velkokvěté. Hole pro svědky svatby, hole pro hříšníky svatby, hůl hospodářská (1 m dlouhá), hůl poutnická a mnoho dalších.
Zdroj: **chybí složka** — nedodáno.

### Poezie

- **Ministerstvo hub, 2026** — autorská kniha napůl poezie, napůl fotografie, vychází na podzim 2026. Zdroj: `Ministerstvo hub/` (návrh PDF + cover, 2 soubory).
- **Revolver Revue 141, 2025** — zdroj: `Revolver revue 141_Pelikan.pdf`.
- **Teletext ČT, 2024** — zdroj: pravděpodobně `poezie teletext.png`.
- **MAČ Brno 2026** — sbírka básní o venkově (nahrazuje dřívější Venkov/Město/Rodina). Zdroj: `MAČ brno 2026.pages`. Rozbaluje se v menu na 4 podpoložky:
  - *Významný strom*, *Řádnej grunt je základ vsi*, *Řešil jsem to už s fízlama* — každá vlastní stránka
  - *Kratší básně* — 6 netitulkovaných básní (3 z úvodu + 3 ze závěru dokumentu, oddělené `+++`) spojené na jednu společnou stránku
- **Matko dej mi chlast, 2026** — *„to si vezmeš ze svatebního webu i tu fotku pod to"* → převzít text+fotku z `13remesel/svatba/`.
- **Tohle musíš udělat co nejdřív, 2024** — *„taky z 13Ř"* → báseň už je na `trinactremesel.cz/trinacte-remeslo/` (`13remesel/texty/03-trinacte-remeslo.md`), znovupoužít.

### Zvuk a performance
> Masážní stroj Redor 3 a husí krky bijící o mikrovlnku na vaťáku. Bicí nástroj pro mobilizaci lidu.
Layout: **dvě videa vedle sebe**. Zdroj: `zvuk a performance.mov` (68 MB) + `IMG_5951.mov` (158 MB) — obě potřebují kompresi/transkód pro web.

### Třináct řemesel
Titulní fotka (Ondřej na židli) z 13Ř + text: *„Při umění člověk odpočívá, tímhle se člověk živí"* + odkaz na `trinactremesel.cz`. Zdroj fotky: v `13remesel` repu (dohledat přesný soubor).

### Kontakt
- Telefon: 776 700 801
- Adresa: Jižní Čechy 1
- E-mail: ondrej@trinactremesel.cz

### Biografie
> \*1988 Praha Košíře
> 2004 zakládá recesistické sdružení Český svaz Plezeeru
> 2008 maturuje na SPŠ Grafické v Hellichově ulici
> Od té doby fotí a svítí, stěhuje se na venkov a zpět a na venkov.
> 2016 vstupuje do rodinného života na vsi.
> Od 2024 píše poezii a věnuje se více objektům než fotografii.
> 2025 přijímá řemesla a začíná dělat kurzy všeho.

---

## 5. Otevřené otázky

1. Chybí materiál: Vodňanské kuře, Hole.
2. Video soubory (`.mov`) potřebují kompresi/transkód (H.264/WebM) — neřešeno v zadání.
3. Přesný layout stránky díla (grid vs. jedna fotka pod druhou) — zatím jen „galerie stejná jako na 13ř".

---

## 6. Tech stack

Stejně jako `13remesel`: vanilla HTML/CSS/JS, žádný framework, žádné závislosti. Font, gallery+lightbox komponenta a `build.js` (partials + front-matter) přebrané a upravené (ostré rohy, `.wedding-gallery` → `.gallery`).

**Stav (2026-08-30):** kostra je postavená a buildí se, 20 stránek, menu z §2 kompletní.

- `npm run build` → generuje `docs/`
- `npm run serve` → lokální náhled na `localhost:8000`
- Skutečné fotky nasazené: Až jelen s laní útes slaní (102), Moje první auto (29), Betonové chleby (11 — nevytříděno)
- Placeholdery: Vodňanské kuře, Hole, Třináct řemesel (titulní foto)
- Texty **Matko dej mi chlast** (báseň *Lež tady*) a **Tohle musíš udělat co nejdřív** se v `build.js` natahují přímo ze souborů v `13remesel` (`texty/03-trinacte-remeslo.md`, `_pages/svatba.html`) — jediný zdroj pravdy, žádné ruční kopírování. Pozor: build ondrapelikan.cz proto závisí na tom, že repo `13remesel` leží vedle (`../13remesel`).
- Videa zkomprimovaná (ffmpeg, H.264/AAC, `-movflags +faststart`): `zvuk a performance.mov` 68→15 MB, `IMG_5951.mov` 158→26 MB (škálováno na 1280 px šířky), `vanocni-svicinek` 66→13 MB. Originální `.mov` v `assets/` nahrazeny `.mp4`, zdrojové soubory v kořeni projektu nedotčené.
