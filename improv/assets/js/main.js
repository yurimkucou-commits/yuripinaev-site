
const modal = document.querySelector('[data-review-modal]');
const modalImg = modal?.querySelector('img');
const closeBtn = modal?.querySelector('[data-review-close]');

document.querySelectorAll('[data-review-src]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!modal || !modalImg) return;
    modalImg.src = btn.dataset.reviewSrc;
    modalImg.alt = btn.dataset.reviewAlt || 'Оригинал отзыва';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});
function closeModal(){
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalImg?.removeAttribute('src');
}
closeBtn?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// v1.7 — scroll reveal + subtle desktop parallax
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -7% 0px'
    });
    revealItems.forEach(el => observer.observe(el));
  }

  const parallax = document.querySelector('[data-parallax-hero]');
  if (!parallax || reduceMotion) return;

  let ticking = false;
  const updateParallax = () => {
    ticking = false;
    if (window.innerWidth < 901) {
      parallax.style.setProperty('--hero-parallax', '0px');
      return;
    }
    const rect = parallax.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    if (rect.bottom < 0 || rect.top > vh) return;
    const progress = (vh - rect.top) / (vh + rect.height);
    const offset = Math.max(-16, Math.min(16, (progress - .5) * 32));
    parallax.style.setProperty('--hero-parallax', `${offset.toFixed(1)}px`);
  };

  const requestTick = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  };
  updateParallax();
  window.addEventListener('scroll', requestTick, {passive:true});
  window.addEventListener('resize', requestTick, {passive:true});
})();
