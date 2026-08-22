(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
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
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  const previewRoot = document.querySelector('[data-hero-preview]');
  if (previewRoot) {
    const browser = previewRoot.querySelector('[data-preview-browser]');
    const screen = previewRoot.querySelector('[data-preview-screen]');
    const fields = {
      url: previewRoot.querySelector('[data-preview-url]'),
      brand: previewRoot.querySelector('[data-preview-brand]'),
      meta: previewRoot.querySelector('[data-preview-meta]'),
      kicker: previewRoot.querySelector('[data-preview-kicker]'),
      title: previewRoot.querySelector('[data-preview-title]'),
      copy: previewRoot.querySelector('[data-preview-copy]'),
      label: previewRoot.querySelector('[data-preview-label]'),
      count: previewRoot.querySelector('[data-preview-count]'),
      name: previewRoot.querySelector('[data-preview-name]')
    };

    const projects = [
      {
        className: 'preview-northline', url: 'northline.studio', brand: 'NORTHLINE', meta: 'Advisory · Malaysia',
        kicker: 'STRATEGIC ADVISORY', title: 'Clarity for decisions that matter.',
        copy: 'Practical thinking for organisations navigating change, risk and opportunity.',
        label: 'Professional services concept', count: '01 / 03', name: 'Northline Advisory'
      },
      {
        className: 'preview-hush', url: 'hushcoffee.my', brand: 'HUSH', meta: 'Coffee · Ipoh',
        kicker: 'LOCAL BUSINESS', title: 'Slow mornings. Good coffee.',
        copy: 'A warmer digital experience built around atmosphere, menu discovery and a simple visit.',
        label: 'Local business demo', count: '02 / 03', name: 'Hush Coffee'
      },
      {
        className: 'preview-room', url: 'room01.campaign', brand: 'ROOM / 01', meta: 'Campaign · Concept',
        kicker: 'ONE OFFER · ONE ACTION', title: 'Make room for what matters.',
        copy: 'A focused campaign page with a single message, a single audience and a clear next move.',
        label: 'Landing page concept', count: '03 / 03', name: 'Room / 01'
      }
    ];

    let active = 0;
    const renderProject = (index) => {
      const project = projects[index];
      browser?.classList.add('is-changing');
      window.setTimeout(() => {
        if (screen) screen.className = `preview-screen ${project.className}`;
        Object.entries(fields).forEach(([key, node]) => {
          if (node) node.textContent = project[key];
        });
        browser?.classList.remove('is-changing');
      }, reduced ? 0 : 260);
    };

    if (!reduced) {
      window.setInterval(() => {
        active = (active + 1) % projects.length;
        renderProject(active);
      }, 4800);

      if (window.matchMedia('(pointer:fine)').matches) {
        previewRoot.addEventListener('pointermove', (event) => {
          const rect = previewRoot.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          if (browser) browser.style.transform = `rotate(${1.6 + x * 1.8}deg) translate(${x * 8}px, ${y * 8}px)`;
        });
        previewRoot.addEventListener('pointerleave', () => {
          if (browser) browser.style.transform = '';
        });
      }
    }
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
