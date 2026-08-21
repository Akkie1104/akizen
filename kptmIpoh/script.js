import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

if (!reduceMotion) {
  animate('.motion-item', {
    opacity: { from: 0, to: 1 },
    y: { from: 28, to: 0 },
    duration: 850,
    delay: stagger(110),
    ease: 'outExpo'
  });

  animate('.image-one', {
    opacity: { from: 0, to: 1 },
    x: { from: 45, to: 0 },
    rotate: { from: 7, to: 2.2 },
    scale: { from: .94, to: 1 },
    duration: 1100,
    delay: 260,
    ease: 'outExpo'
  });

  animate('.image-two', {
    opacity: { from: 0, to: 1 },
    x: { from: -35, to: 0 },
    y: { from: 30, to: 0 },
    rotate: { from: -10, to: -5 },
    duration: 1050,
    delay: 430,
    ease: 'outExpo'
  });

  animate('.stage-note', {
    opacity: { from: 0, to: 1 },
    scale: { from: .9, to: 1 },
    duration: 700,
    delay: stagger(130, { start: 760 }),
    ease: 'outBack'
  });

  animate('.scribble', {
    opacity: { from: 0, to: 1 },
    scale: { from: .82, to: 1 },
    duration: 750,
    delay: 950,
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
        opacity: { from: 0, to: 1 },
        y: { from: 34, to: 0 },
        duration: 850,
        ease: 'outExpo'
      });
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .14 });

  document.querySelectorAll('.reveal-section').forEach(section => {
    section.style.opacity = '0';
    revealObserver.observe(section);
  });

  const cardObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
    if (!visible.length) return;
    animate(visible, {
      opacity: { from: 0, to: 1 },
      y: { from: 30, to: 0 },
      scale: { from: .97, to: 1 },
      duration: 760,
      delay: stagger(85),
      ease: 'outExpo'
    });
    visible.forEach(card => cardObserver.unobserve(card));
  }, { threshold: .12 });

  document.querySelectorAll('.program-card').forEach(card => {
    card.style.opacity = '0';
    cardObserver.observe(card);
  });

  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-stage');
  if (hero && stage && matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - .5) * 12;
      const y = (event.clientY / window.innerHeight - .5) * 10;
      animate(stage, { x, y, duration: 650, ease: 'outExpo' });
    });
    hero.addEventListener('pointerleave', () => {
      animate(stage, { x: 0, y: 0, duration: 800, ease: 'outExpo' });
    });
  }
}