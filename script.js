(() => {
  const routes = ['home', 'services', 'work', 'about', 'contact'];
  const titles = {
    home: 'Akizen.my — Practical automation for small businesses',
    services: 'Services — Akizen.my',
    work: 'Solutions — Akizen.my',
    about: 'About — Akizen.my',
    contact: 'Free Workflow Audit — Akizen.my'
  };

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const pageContent = document.getElementById('page-content');
  const header = document.querySelector('[data-header]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const routeFromHash = () => {
    const value = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0].toLowerCase();
    return routes.includes(value) ? value : 'home';
  };

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  let revealObserver;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  }

  const prepareRevealAnimations = (page) => {
    page.querySelectorAll('.reveal').forEach((el) => {
      el.classList.remove('visible');
      if (prefersReducedMotion || !revealObserver) el.classList.add('visible');
      else {
        revealObserver.unobserve(el);
        revealObserver.observe(el);
      }
    });
  };

  const renderRoute = ({ focus = false, scroll = true } = {}) => {
    const route = routeFromHash();
    document.querySelectorAll('.page-view').forEach((page) => {
      const active = page.dataset.page === route;
      page.classList.toggle('active', active);
      page.setAttribute('aria-hidden', String(!active));
      if (active) prepareRevealAnimations(page);
    });

    document.querySelectorAll('.nav-link[data-route]').forEach((link) => {
      const active = link.dataset.route === route;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    document.title = titles[route] || titles.home;
    closeMenu();
    if (scroll) window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    if (focus && pageContent) pageContent.focus({ preventScroll: true });
  };

  if (!location.hash || !/^#\/(home|services|work|about|contact)/i.test(location.hash)) history.replaceState(null, '', '#/home');
  window.addEventListener('hashchange', () => renderRoute({ focus: true, scroll: true }));
  renderRoute({ focus: false, scroll: false });

  document.querySelectorAll('.spa-link[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetRoute = link.dataset.route;
      if (!routes.includes(targetRoute)) return;
      if (targetRoute === routeFromHash()) {
        event.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
  }

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('.details').forEach((section) => {
    const tabs = [...section.querySelectorAll('.details-tabs span')];
    const panels = [...section.querySelectorAll('.details-grid > div')];
    if (!tabs.length || tabs.length !== panels.length) return;

    const activate = (index) => {
      tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.setAttribute('role', 'button');
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('aria-pressed', String(i === index));
      });
      panels.forEach((panel, i) => panel.classList.toggle('active-detail', i === index));
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate(index);
        }
      });
    });
    activate(0);
  });

  if (!prefersReducedMotion && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.timeline-item,.project-row').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - .5) * -2;
        card.style.transform = `translateY(-5px) rotateX(${y}deg) rotateY(${x}deg)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll('input[required], textarea[required]')];
      let valid = true;
      fields.forEach((field) => {
        const fieldValid = field.checkValidity();
        field.setAttribute('aria-invalid', String(!fieldValid));
        if (!fieldValid) valid = false;
      });
      if (!valid) {
        fields.find((field) => !field.checkValidity())?.focus();
        return;
      }
      const data = new FormData(form);
      const subject = encodeURIComponent(`Free workflow audit request from ${data.get('name')}`);
      const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nWorkflow bottleneck:\n${data.get('message')}`);
      window.location.href = `mailto:hello@akizen.my?subject=${subject}&body=${body}`;
    });
    form.addEventListener('input', (event) => {
      if (event.target.matches('input,textarea')) event.target.removeAttribute('aria-invalid');
    });
  }
})();
