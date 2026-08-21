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
  const themeToggle = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme, persist = true) => {
    const isDark = theme === 'dark';
    if (isDark) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggle.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    }

    if (themeMeta) themeMeta.setAttribute('content', isDark ? '#060607' : '#f7f5f0');

    if (persist) {
      try { localStorage.setItem('akizen-theme', isDark ? 'dark' : 'light'); } catch (_) {}
    }
  };

  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

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

  const refreshRevealAnimations = (page) => {
    const elements = page.querySelectorAll('.reveal');
    elements.forEach((el) => {
      el.classList.remove('visible');
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
    });
  };

  const renderRoute = ({ focus = false, scroll = true } = {}) => {
    const route = routeFromHash();
    const pages = document.querySelectorAll('.page-view');
    const navLinks = document.querySelectorAll('.nav-link[data-route]');

    pages.forEach((page) => {
      const active = page.dataset.page === route;
      page.classList.toggle('active', active);
      page.setAttribute('aria-hidden', String(!active));
      if (active) refreshRevealAnimations(page);
    });

    navLinks.forEach((link) => {
      const active = link.dataset.route === route;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    document.title = titles[route] || titles.home;
    closeMenu();

    if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus && pageContent) pageContent.focus({ preventScroll: true });
  };

  if (!location.hash || !/^#\/(home|services|work|about|contact)/i.test(location.hash)) {
    history.replaceState(null, '', '#/home');
  }

  window.addEventListener('hashchange', () => renderRoute({ focus: true, scroll: true }));
  renderRoute({ focus: false, scroll: false });

  document.querySelectorAll('.spa-link[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetRoute = link.dataset.route;
      if (!routes.includes(targetRoute)) return;
      const currentRoute = routeFromHash();

      if (targetRoute === currentRoute) {
        event.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        const firstInvalid = fields.find((field) => !field.checkValidity());
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      const subject = encodeURIComponent(`Free workflow audit request from ${data.get('name')}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nWorkflow bottleneck:\n${data.get('message')}`
      );
      window.location.href = `mailto:hello@akizen.my?subject=${subject}&body=${body}`;
    });

    form.addEventListener('input', (event) => {
      if (event.target.matches('input,textarea')) event.target.removeAttribute('aria-invalid');
    });
  }

  if (window.matchMedia('(pointer:fine)').matches) {
    const card = document.querySelector('.logo-card');
    window.addEventListener('pointermove', (event) => {
      if (!card) return;
      const homePage = document.querySelector('[data-page="home"]');
      if (!homePage || !homePage.classList.contains('active')) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 7;
      const y = (event.clientY / window.innerHeight - 0.5) * -7;
      card.style.transform = `rotate(-5deg) rotateY(${x}deg) rotateX(${y}deg)`;
    }, { passive: true });
  }
})();