const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('img').forEach(img => {
  const markFailed = () => {
    img.hidden = true;
    const holder = img.closest('.hero-image, .campus-photo, .program-card');
    if (holder) holder.classList.add('image-fallback');
  };

  if (img.complete && img.naturalWidth === 0) markFailed();
  else img.addEventListener('error', markFailed, { once: true });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const selector = link.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

if (!reduceMotion) {
  enhanceWithAnime().catch(() => {
    document.documentElement.classList.add('motion-fallback');
  });
}

async function enhanceWithAnime() {
  const { animate, stagger } = await import('https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm');

  animate('.motion-item', {
    opacity: { from: 0, to: 1 },
    y: { from: 24, to: 0 },
    duration: 760,
    delay: stagger(90),
    ease: 'outExpo'
  });

  animate('.image-one', {
    opacity: { from: 0, to: 1 },
    x: { from: 36, to: 0 },
    rotate: { from: 6, to: 2.2 },
    scale: { from: .96, to: 1 },
    duration: 950,
    delay: 220,
    ease: 'outExpo'
  });

  animate('.image-two', {
    opacity: { from: 0, to: 1 },
    x: { from: -28, to: 0 },
    y: { from: 24, to: 0 },
    rotate: { from: -9, to: -5 },
    duration: 900,
    delay: 360,
    ease: 'outExpo'
  });

  animate('.stage-note, .scribble', {
    opacity: { from: 0, to: 1 },
    scale: { from: .94, to: 1 },
    duration: 620,
    delay: stagger(90, { start: 620 }),
    ease: 'outExpo'
  });

  animate('.ticker-track', {
    x: ['0%', '-50%'],
    duration: 28000,
    ease: 'linear',
    loop: true
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target, {
        opacity: { from: .35, to: 1 },
        y: { from: 22, to: 0 },
        duration: 700,
        ease: 'outExpo'
      });
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .1 });

  document.querySelectorAll('.reveal-section, .program-card').forEach(element => {
    revealObserver.observe(element);
  });

  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-stage');
  if (hero && stage && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 6;
      animate(stage, { x, y, duration: 500, ease: 'outExpo' });
    });
    hero.addEventListener('pointerleave', () => {
      animate(stage, { x: 0, y: 0, duration: 650, ease: 'outExpo' });
    });
  }
}