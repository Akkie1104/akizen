(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress span');

  if (location.hash && /^#\//.test(location.hash)) {
    history.replaceState(null, '', location.pathname + location.search);
  }

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
    }
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt-root]').forEach((root) => {
      root.addEventListener('pointermove', (event) => {
        const rect = root.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        root.querySelectorAll('[data-depth]').forEach((node) => {
          const depth = Number(node.dataset.depth || 1);
          node.style.transform = `translate3d(${nx * depth * 10}px, ${ny * depth * 8}px, 0) rotateX(${ny * -2}deg) rotateY(${nx * 2}deg)`;
        });
        const browser = root.classList.contains('browser-demo') ? root : null;
        if (browser) browser.style.transform = `rotateX(${ny * -2}deg) rotateY(${nx * 3}deg)`;
      });
      root.addEventListener('pointerleave', () => {
        root.querySelectorAll('[data-depth]').forEach((node) => node.style.transform = '');
        if (root.classList.contains('browser-demo')) root.style.transform = '';
      });
    });

    document.querySelectorAll('[data-parallax]').forEach((node) => {
      window.addEventListener('scroll', () => {
        const rect = node.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const offset = Math.max(-18, Math.min(18, center * -0.025));
        node.style.transform = `translateY(${offset}px) rotate(${node.classList.contains('automation-art') ? '-1' : '1'}deg)`;
      }, { passive: true });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
