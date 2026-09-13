# PRD — ondrapelikan.cz (portfolio, statický web)

**Verze:** 0.2 (web live, deploy hotový)
**Autor projektu:** Ondřej Pelikán
**Datum:** 2026-08-30, aktualizováno 2026-09-13

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
| 6 | Menu | ~~Vlevo, rozklikávací (accordion)~~ → **změněno při realizaci**: plochý, vždy rozbalený seznam vlevo (kategorie i díla stejný formát textu, dle marieladrova.com), na mobilu schovaný za hamburgerem — viz §2 |
| 7 | Pořadí obsahu na stránce díla | Nejdřív úvodní text (pokud existuje), pak až fotka/video |
| 8 | Framework | Žádný — vanilla HTML/CSS/JS jako 13Ř (zero-framework, zero-deps) |

---

## 1. Cíl

Portfolio web Ondřeje Pelikána — fotografie, objekty, poezie, zvuk/performance — s odkazem na `trinactremesel.cz` (řemeslná/výdělečná větev). Čistá, klidná prezentace autorské tvorby, bez komerčního tlaku.

## 2. Information architecture — menu vlevo (skutečný stav)

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
  ├─ MAČ Brno 2026 (několik básní na jedné stránce, jen některé titulkované)
  ├─ Matko dej mi chlast, 2026
  └─ Tohle musíš udělat co nejdřív, 2024
Zvuk a performance
Třináct řemesel  (vlastní stránka s fotkou + textem + odkazem na trinactremesel.cz)
Biografie
Kontakt
```

Mimo menu (neveřejné, `noindex`, čeká na spuštění k vernisáži): **Vše zdarma hned!** na `/vse/` — po spuštění přejmenovat na `/vse-zdarma-hned/` a zařadit do Poezie, viz §4.

*(Zkoušená a zase smazaná: „Mezi stromy fest, Milevsko 2026" — celý přepis autorského čtení, na přání odstraněno bez náhrady.)*

### Menu — jak to skutečně funguje (jiné než původní zadání níže)

Původní zadání chtělo rozklikávací accordion (`<details>/<summary>`, bez JS). Při realizaci se to změnilo na **plochý, vždy rozbalený seznam** — kategorie i jednotlivá díla mají na top-levelu stejný vizuální formát textu (viz reference marieladrova.com), žádné sbalování na desktopu.

| Aspekt | Skutečnost |
|---|---|
| Desktop (≥900px) | Menu vlevo natrvalo vidět, nic se nesbaluje, žádný accordion |
| Mobil (<900px) | Menu schované, v headeru hamburger (`.nav-toggle`) — klik ho zobrazí jako blok nad obsahem, klik na odkaz/Escape/druhý klik ho zavře |
| Aktuální stránka | `aria-current="page"`, zvýrazněná tučně/černě |
| Klik na položku | Klasický odkaz, plný page load, žádné AJAX/SPA |

**Implementace:** `MENU` pole v `build.js` je jediný zdroj pravdy pro strom (viz `renderMenu()`), do HTML se render í jako plochý `<ul>`/`<li>`. Mobilní toggle je malý vanilla JS blok v `assets/js/main.js` (`nav-toggle` + `#side-nav.is-open`), CSS schovává `.side-nav` pod 900px dokud nemá třídu `is-open`.

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
- **MAČ Brno 2026** — sbírka básní o venkově (nahrazuje dřívější Venkov/Město/Rodina). Zdroj: `MAČ brno 2026.pages`. **Jedna stránka** (ne podpoložky) — několik básní pod sebou oddělených jen odstupem (`.poem + .poem`), jen tři z nich mají vlastní název (*Významný strom*, *Řádnej grunt je základ vsi*, *Řešil jsem to už s fízlama*, styl nadpisu `.poem-title` — stejný jako „Lež tady" u Matko dej mi chlast), zbytek jsou netitulkované kratší básně/haiku.
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

## 4. Vše zdarma hned! — Galerie Výhybka (rozpracováno)

Literární intervence na LED obrazovku v obchodní zóně v Milevsku, říjen–listopad 2026, ve spolupráci s Galerií Výhybka (`galerie.vyhybka.art`). QR kód z reklamy vede na `/vse-zdarma-hned/`.

- Zdroj `_pages/vse.html` — zatím na neveřejné URL `/vse/` (`robots: noindex`, mimo `MENU`), kvůli konzultaci s kurátorkou před spuštěním.
- Text + logo Galerie Výhybka (prolinkované, `assets/img/vse-zdarma-hned/logo/`) + odkaz na jejich FB hotové. Poděkování je až pod fotkami.
- Galerie 4 fotek zatím jen placeholdery (`placeholderCount: 4`) — fotky ještě nedodané, po vložení do `assets/img/vse-zdarma-hned/` (mimo `logo/`) se automaticky zobrazí místo placeholderů.
- **K vernisáži** (polovina října, datum se ladí): přejmenovat `vse.html` → `vse-zdarma-hned.html`, přidat do `MENU` (Poezie) v `build.js`, odebrat `robots: noindex`.

---

## 5. Otevřené otázky

1. Chybí materiál: Vodňanské kuře, Hole.
2. Video soubory (`.mov`) potřebují kompresi/transkód (H.264/WebM) — vyřešeno, viz §6.
3. Přesný layout stránky díla (grid vs. jedna fotka pod druhou) — zatím jen „galerie stejná jako na 13ř".
4. Fotky pro „Vše zdarma hned!" (4 ks) — zatím nedodané, viz §4.
5. Datum vernisáže Galerie Výhybka (polovina října 2026) — zatím se ladí, spuštění `/vse-zdarma-hned/` na něj čeká.

---

## 6. Tech stack

Stejně jako `13remesel`: vanilla HTML/CSS/JS, žádný framework, žádné závislosti. Font, gallery+lightbox komponenta a `build.js` (partials + front-matter) přebrané a upravené (ostré rohy, `.wedding-gallery` → `.gallery`).

**Stav (2026-09-13): web běží naživo na `www.ondrapelikan.cz`, 18 stránek.**

- `npm run build` → generuje `docs/`
- `npm run serve` → lokální náhled (pozor na kolizi portu 8000 s `13remesel` — používat jiný port, např. 8001)
- Skutečné fotky nasazené: Až jelen s laní útes slaní (102), Moje první auto (29), Betonové chleby (11 — nevytříděno)
- Placeholdery: Vodňanské kuře, Hole, Třináct řemesel (titulní foto), Vše zdarma hned! (4 fotky — viz §4)
- Texty **Matko dej mi chlast** (báseň *Lež tady*) a **Tohle musíš udělat co nejdřív** se v `build.js` natahují přímo ze souborů v `13remesel` (`texty/03-trinacte-remeslo.md`, `_pages/svatba.html`) — jediný zdroj pravdy, žádné ruční kopírování. Pozor: build ondrapelikan.cz proto závisí na tom, že repo `13remesel` leží vedle (`../13remesel`).
- Videa zkomprimovaná (ffmpeg, H.264/AAC, `-movflags +faststart`): `zvuk a performance.mov` 68→15 MB, `IMG_5951.mov` 158→26 MB (škálováno na 1280 px šířky), `vanocni-svicinek` 66→13 MB. Originální `.mov` v `assets/` nahrazeny `.mp4`, zdrojové soubory v kořeni projektu nedotčené.
- Homepage má nad titulní fotkou blok o předprodeji knihy **Ministerstvo hub** na Donio (text + `<iframe>` widget, `#donio.cz/widget2/41628`).
- **Mobilní menu:** hamburger v headeru (viz §2) — na mobilu se dřív muselo scrollovat přes celé rozbalené menu, než začal obsah.

### Deploy a hosting

- **Repo:** [github.com/koci-sabachova/ondrapelikan](https://github.com/koci-sabachova/ondrapelikan) (public), commit dělá Claude, **push dělá Kateřina**.
- **GitHub Actions** (`.github/workflows/deploy.yml`) při každém pushi na `main`:
  - checkne si i `13remesel` jako sesterský adresář (kvůli `poemFromTrinacteRemeslo`/`poemLezTady`),
  - nasadí `docs/` na **GitHub Pages** (`koci-sabachova.github.io/ondrapelikan/`, jen záložní/staging URL),
  - nasadí `docs/` přes **FTP na Forpsi** (`ftpx.forpsi.com`, secret `FTP_PASSWORD`, incrementální sync přes `.ftp-deploy-sync-state.json`) — to je skutečný `www.ondrapelikan.cz`.
- **Forpsi hosting:** `Webhosting Easy` (expirace 12.08.2027). FTP účet musel mít vypnuté geo/IP omezení přístupu (jinak GitHub Actions runner z ciziny dostával `530`).
- **SSL:** zdarma vydaný DV certifikát (`*.ondrapelikan.cz`) přes Forpsi (Webhosting → SSL certifikát → Spravovat), + zapnutý automatický HTTPS redirect. Aktivováno 2026-09-13.
- **DNS:** správa u Forpsi (`ns.forpsi.*`), apex `ondrapelikan.cz` → 301 na `www.ondrapelikan.cz`.
- **GA4:** vlastní measurement ID `G-W8RHCTDS6S` v `_partials/head.html` (jiné než `trinactremesel.cz`).
