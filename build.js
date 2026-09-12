#!/usr/bin/env node
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync,
  copyFileSync, existsSync, cpSync, rmSync,
} from 'node:fs';
import { join, basename, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const PAGES = join(ROOT, '_pages');
const PARTIALS = join(ROOT, '_partials');
const ASSETS = join(ROOT, 'assets');
const DIST = join(ROOT, 'docs');
const SITE_URL = 'https://ondrapelikan.cz';

// === Menu strom — jediný zdroj pravdy pro levé rozklikávací menu ===
// type: 'group' (rozbaluje se, sama není stránka), 'page' (vlastní stránka bez rozbalení), 'link' (externí)
const MENU = [
  { type: 'group', slug: 'fotografie', label: 'Fotografie', items: [
    { type: 'page', slug: 'az-jelen-s-lani-utes-slani', label: 'Až jelen s laní útes slaní, 2010–2025' },
    { type: 'page', slug: 'moje-prvni-auto', label: 'Moje první auto, 2018' },
  ] },
  { type: 'group', slug: 'objekty', label: 'Objekty', items: [
    { type: 'page', slug: 'betonove-chleby', label: 'Betonové chleby, 2014–' },
    { type: 'page', slug: 'vodnanske-kure', label: 'Vodňanské kuře, 2015' },
    { type: 'page', slug: 'vanocni-svicinek', label: 'Vánoční svícínek, 2024' },
    { type: 'page', slug: 'hole', label: 'Hole, 2024–' },
  ] },
  { type: 'group', slug: 'poezie', label: 'Poezie', items: [
    { type: 'page', slug: 'ministerstvo-hub', label: 'Ministerstvo hub, 2026' },
    { type: 'page', slug: 'revolver-revue-141', label: 'Revolver Revue 141, 2025' },
    { type: 'page', slug: 'teletext-ct', label: 'Teletext ČT, 2024' },
    { type: 'page', slug: 'mac-brno-2026', label: 'MAČ Brno 2026' },
    { type: 'page', slug: 'matko-dej-mi-chlast', label: 'Matko dej mi chlast, 2026' },
    { type: 'page', slug: 'tohle-musis-udelat-co-nejdriv', label: 'Tohle musíš udělat co nejdřív, 2024' },
  ] },
  { type: 'page', slug: 'zvuk-a-performance', label: 'Zvuk a performance' },
  { type: 'page', slug: 'trinact-remesel', label: 'Třináct řemesel' },
  { type: 'page', slug: 'biografie', label: 'Bio' },
  { type: 'page', slug: 'kontakt', label: 'Kontakt' },
];

// Plochý, vždy rozbalený seznam (žádný accordion) — všechny top-level
// položky (ať už mají podpoložky, nebo jsou to rovnou stránky) mají stejný
// vizuální formát textu, viz reference marieladrova.com.
function renderMenu(nodes, activeSlug, depth = 0) {
  const levelClass = depth === 0 ? 'side-nav__top' : 'side-nav__sub';
  const li = nodes.map((node) => {
    if (node.type === 'link') {
      return `<li><a class="${levelClass}" href="${node.href}" target="_blank" rel="noopener">${node.label}</a></li>`;
    }
    if (node.type === 'group') {
      return `<li>
    <span class="${levelClass}">${node.label}</span>
    <ul>
${renderMenu(node.items, activeSlug, depth + 1)}
    </ul>
  </li>`;
    }
    // page
    const isActive = node.slug === activeSlug;
    return `<li><a class="${levelClass}" href="/${node.slug}/"${isActive ? ' aria-current="page"' : ''}>${node.label}</a></li>`;
  }).join('\n');
  return li;
}

function parseFrontMatter(src) {
  const m = src.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*([a-zA-Z][a-zA-Z0-9_-]*)\s*:\s*(.*?)\s*$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  return { meta, body: src.slice(m[0].length) };
}

function template(str, vars) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

// Náhled pro galerii — max. šířka 900px, přegenerováno přes sips a cachováno
// vedle originálu (assets/img/<slug>/thumbs/<soubor>.jpg). Originál se
// nechává netknutý, používá se jen pro lightbox (data-full).
const THUMB_MAX_WIDTH = 900;
let sipsAvailable = null;
function hasSips() {
  if (sipsAvailable === null) {
    try { execFileSync('sips', ['--version'], { stdio: 'ignore' }); sipsAvailable = true; }
    catch { sipsAvailable = false; }
  }
  return sipsAvailable;
}

function buildThumb(slug, file) {
  if (!hasSips()) return null;
  const srcPath = join(ASSETS, 'img', slug, file);
  const thumbDir = join(ASSETS, 'img', slug, 'thumbs');
  const thumbName = basename(file, extname(file)) + '.jpg';
  const thumbPath = join(thumbDir, thumbName);
  if (existsSync(thumbPath)) return thumbName;
  mkdirSync(thumbDir, { recursive: true });
  try {
    execFileSync('sips', [
      '-Z', String(THUMB_MAX_WIDTH),
      '-s', 'format', 'jpeg',
      '-s', 'formatOptions', '78',
      srcPath, '--out', thumbPath,
    ], { stdio: 'ignore' });
    return thumbName;
  } catch {
    return null;
  }
}

// Generuje <li> galerie z assets/img/<slug>/ — bere všechny obrázky ve složce
function buildGallery(slug, alt) {
  const dir = join(ASSETS, 'img', slug);
  if (!existsSync(dir)) return '';
  const imgExt = new Set(['.jpg', '.jpeg', '.png', '.heic']);
  const files = readdirSync(dir).filter(f => imgExt.has(extname(f).toLowerCase()));
  if (!files.length) return '';
  return files.map((f) => {
    const fullUrl = `/assets/img/${slug}/${encodeURIComponent(f)}`;
    const thumbName = buildThumb(slug, f);
    const thumbUrl = thumbName ? `/assets/img/${slug}/thumbs/${encodeURIComponent(thumbName)}` : fullUrl;
    return `      <li><button type="button" class="gallery__item" data-full="${fullUrl}"><img src="${thumbUrl}" alt="${alt}" loading="lazy" decoding="async"></button></li>`;
  }).join('\n');
}

// Náhled knihy — obálka (pokud je) + všechny stránky PDF rozklikané pomocí
// pdftoppm do assets/img/<slug>/nahled/
function buildBookPreview(slug, alt) {
  const baseDir = join(ASSETS, 'img', slug);
  const cover = ['cover.jpg', 'cover.png', 'cover_pelikan_ok.png']
    .find(f => existsSync(join(baseDir, f)));
  const dir = join(baseDir, 'nahled');
  const files = existsSync(dir)
    ? readdirSync(dir).filter(f => /\.(jpg|jpeg)$/i.test(f)).sort()
    : [];
  const items = [];
  if (cover) {
    const url = `/assets/img/${slug}/${encodeURIComponent(cover)}`;
    items.push(`      <li><button type="button" class="gallery__item" data-full="${url}"><img src="${url}" alt="${alt} — obálka" loading="lazy" decoding="async"></button></li>`);
  }
  files.forEach((f, i) => {
    const url = `/assets/img/${slug}/nahled/${encodeURIComponent(f)}`;
    items.push(`      <li><button type="button" class="gallery__item" data-full="${url}"><img src="${url}" alt="${alt} — strana ${i + 1}" loading="lazy" decoding="async"></button></li>`);
  });
  return items.join('\n');
}

// Placeholder galerie — pro díla bez dodaného materiálu
function buildPlaceholderGallery(count) {
  return Array.from({ length: count }, (_, i) =>
    `      <li class="gallery__item gallery__item--placeholder" aria-hidden="true"><span>${i + 1}</span></li>`
  ).join('\n');
}

// === Texty převzaté ze sesterského repa 13remesel (jediný zdroj pravdy, viz PRD §3) ===
const SISTER_REPO = join(ROOT, '..', '13remesel');

function poemFromTrinacteRemeslo() {
  const path = join(SISTER_REPO, 'texty', '03-trinacte-remeslo.md');
  if (!existsSync(path)) return '<p class="todo-note">Text se nepodařilo načíst z 13remesel/texty/03-trinacte-remeslo.md.</p>';
  const raw = readFileSync(path, 'utf8');
  const marker = '### Tohle musíš udělat co nejdřív';
  const idx = raw.indexOf(marker);
  const body = idx >= 0 ? raw.slice(idx + marker.length) : raw;
  const blocks = body.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  // Poslední blok je podpis autora — necháme ho zvlášť, zbytek jsou řádky
  // básně, na 13Ř sázené "vzdušně" (odstavec od odstavce), tady radši
  // v jednom bloku s <br> — jednoduché, těsné řádkování.
  const signature = blocks.pop();
  const lines = blocks.map(b => b.replace(/\*(.+?)\*/g, '<em>$1</em>')).join('<br>\n');
  const signatureHtml = signature ? `<p>${signature.replace(/\*(.+?)\*/g, '<em>$1</em>')}</p>` : '';
  return `<p>${lines}</p>\n${signatureHtml}`;
}

function poemLezTady() {
  const path = join(SISTER_REPO, '_pages', 'svatba.html');
  if (!existsSync(path)) return '<p class="todo-note">Text se nepodařilo načíst z 13remesel/_pages/svatba.html.</p>';
  const raw = readFileSync(path, 'utf8');
  const start = raw.indexOf('<p class="wedding__poem-title">');
  const end = raw.indexOf('<figure class="wedding__poem-photo">');
  if (start < 0 || end < 0) return '<p class="todo-note">Báseň se v 13remesel/_pages/svatba.html nepodařilo najít.</p>';
  return raw.slice(start, end).trim();
}

if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const head = readFileSync(join(PARTIALS, 'head.html'), 'utf8');
const header = readFileSync(join(PARTIALS, 'header.html'), 'utf8');
const footer = readFileSync(join(PARTIALS, 'footer.html'), 'utf8');

const pages = existsSync(PAGES)
  ? readdirSync(PAGES).filter(f => f.endsWith('.html'))
  : [];
const sitemap = [];

for (const file of pages) {
  const src = readFileSync(join(PAGES, file), 'utf8');
  const { meta, body } = parseFrontMatter(src);

  const slug = basename(file, '.html');
  const activeSlug = slug === 'index' ? (meta.activeSlug || '') : slug;

  const defaults = {
    title: 'Ondřej Pelikán',
    description: '',
    url: file === 'index.html' ? '/' : `/${slug}/`,
    robots: '',
    gallery: '',
  };
  const galleryCount = meta.placeholderCount ? parseInt(meta.placeholderCount, 10) : 0;
  const gallery = meta.bookPreviewSlug
    ? buildBookPreview(meta.bookPreviewSlug, meta.title || '')
    : meta.gallerySlug
    ? (buildGallery(meta.gallerySlug, meta.title || '') || buildPlaceholderGallery(galleryCount || 6))
    : '';
  const poem = slug === 'tohle-musis-udelat-co-nejdriv' ? poemFromTrinacteRemeslo()
    : slug === 'matko-dej-mi-chlast' ? poemLezTady()
    : '';
  const vars = { ...defaults, ...meta, gallery, poem };

  const navHtml = renderMenu(MENU, activeSlug);

  const html = [
    '<!doctype html>',
    '<html lang="cs">',
    '<head>',
    template(head, vars),
    '</head>',
    '<body>',
    header,
    '<div class="shell">',
    `<nav id="side-nav" class="side-nav" aria-label="Hlavní menu">`,
    `<ul>\n${navHtml}\n</ul>`,
    `</nav>`,
    '<main id="main">',
    template(body, vars),
    '</main>',
    '</div>',
    footer,
    '</body>',
    '</html>',
  ].join('\n');

  const outDir = file === 'index.html' ? DIST : join(DIST, slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);

  if (!vars.robots.includes('noindex')) sitemap.push(vars.url);
  console.log(`✓ ${vars.url.padEnd(36)} ${(html.length / 1024).toFixed(1)} KB`);
}

if (existsSync(ASSETS)) {
  cpSync(ASSETS, join(DIST, 'assets'), {
    recursive: true,
    filter: (src) => !src.endsWith('.DS_Store'),
  });
}

for (const f of ['404.html', 'favicon.ico', 'robots.txt', 'CNAME']) {
  if (existsSync(join(ROOT, f))) copyFileSync(join(ROOT, f), join(DIST, f));
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml);

console.log(`\nBuilt ${pages.length} page(s) → docs/`);
