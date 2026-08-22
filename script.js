(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const heroVisual = document.querySelector('[data-hero-visual]');
  const whatsappNumber = '60174201247';

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && mobileMenu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      mobileMenu.classList.remove('open');
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      if (open) return closeMenu();
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Close menu');
      mobileMenu.hidden = false;
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, { passive: true });
  }

  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.whatsapp-link').forEach((link) => {
    const url = new URL(link.href, window.location.href);
    const message = url.searchParams.get('text') || "Hi, I'm interested in getting a website built. Here's what I have in mind:";
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  });

  document.querySelectorAll('.context-whatsapp').forEach((link) => {
    const message = link.dataset.message;
    link.href = `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  });

  if (!reduced && heroVisual && window.matchMedia('(min-width: 1000px)').matches) {
    const browser = heroVisual.querySelector('.browser-main');
    let ticking = false;
    const updateHero = () => {
      ticking = false;
      const rect = heroVisual.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      if (browser) browser.style.transform = `rotate(${2.6 - p * 1.8}deg) translateY(${p * -8}px) scale(${1 + p * .012})`;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateHero);
    }, { passive: true });
    updateHero();
  }

  document.querySelectorAll('.accordion details').forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.accordion details').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    });
  });

  const form = document.getElementById('project-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (event) => {
      const required = [...form.querySelectorAll('[required]')];
      const invalid = required.find((field) => !field.checkValidity());
      required.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));
      if (invalid) {
        event.preventDefault();
        invalid.focus();
        if (status) status.textContent = 'Please complete the required fields before sending.';
        return;
      }
      if (status) status.textContent = 'Sending your enquiry…';
    });
    form.addEventListener('input', (event) => {
      event.target.removeAttribute('aria-invalid');
      if (status) status.textContent = 'Your enquiry will be sent directly to Akizen.';
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
