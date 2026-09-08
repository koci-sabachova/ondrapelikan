// Dynamic year in footer
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Anti-spam-bot e-mail: rekonstrukce mailto: za běhu z data-u + data-d
document.querySelectorAll('.js-mail').forEach((el) => {
  const u = el.dataset.u;
  const d = el.dataset.d;
  if (!u || !d) return;
  const email = u + '@' + d;
  el.setAttribute('href', 'mailto:' + email);
  el.textContent = email;
});

// Galerie — lightbox s navigací šipkami a focus trapem
// (menu vlevo je čisté <details>/<summary>, žádné JS nepotřebuje)
const galleryItems = document.querySelectorAll('.gallery__item[data-full]');
const lightbox = document.getElementById('lightbox');
if (galleryItems.length && lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxCounter = lightbox.querySelector('.lightbox__counter');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');
  const items = Array.from(galleryItems);
  let currentIndex = 0;
  let lastFocused = null;

  const show = (index) => {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector('img')?.alt || '';
    if (lightboxCounter && items.length > 1) {
      lightboxCounter.textContent = `${currentIndex + 1} z ${items.length}`;
    }
  };

  const open = (index, trigger) => {
    lastFocused = trigger;
    show(index);
    lightbox.hidden = false;
    btnClose.focus();
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lightboxImg.src = '';
    if (lastFocused) lastFocused.focus();
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => open(index, item));
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(currentIndex - 1));
  btnNext.addEventListener('click', () => show(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  const focusable = [btnPrev, btnNext, btnClose].filter(Boolean);

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(currentIndex - 1);
    else if (e.key === 'ArrowRight') show(currentIndex + 1);
    else if (e.key === 'Tab') {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
