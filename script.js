(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const heroVisual = document.querySelector('[data-hero-visual]');

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

  document.querySelectorAll('.context-whatsapp').forEach((link) => {
    const message = link.dataset.message;
    if (message) link.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
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
      event.preventDefault();
      const required = [...form.querySelectorAll('[required]')];
      const invalid = required.find((field) => !field.checkValidity());
      required.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));
      if (invalid) {
        invalid.focus();
        if (status) status.textContent = 'Please complete the required fields before sending.';
        return;
      }
      const data = new FormData(form);
      const subject = encodeURIComponent(`Akizen project enquiry — ${data.get('name')}`);
      const body = encodeURIComponent([
        `Name: ${data.get('name')}`,
        `Business / organisation: ${data.get('business') || 'Not provided'}`,
        `What they need: ${data.get('need')}`,
        `Current website: ${data.get('website') || 'Not provided'}`,
        `Contact: ${data.get('contact')}`,
        '',
        'Project details:',
        data.get('message')
      ].join('\n'));
      window.location.href = `mailto:hello@akizen.my?subject=${subject}&body=${body}`;
      if (status) status.textContent = "Got it. Your email app should open with the project details prepared.";
    });
    form.addEventListener('input', (event) => {
      event.target.removeAttribute('aria-invalid');
      if (status) status.textContent = 'This prepares an email to hello@akizen.my. Nothing is stored on this website.';
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
