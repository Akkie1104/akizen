(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const desktopMotion = window.matchMedia('(min-width: 901px)').matches;
  const header = document.querySelector('[data-header]');
  const transition = document.querySelector('[data-hero-transition]');
  const heroCopy = document.querySelector('[data-hero-copy]');
  const deviceWrap = document.querySelector('[data-hero-device]');
  const laptopLid = document.querySelector('.laptop-lid');
  const transitionCopy = document.querySelector('[data-transition-copy]');
  const heroFoot = document.querySelector('[data-hero-foot]');
  const steps = [...document.querySelectorAll('[data-transition-step]')];
  const screenTitle = document.querySelector('[data-screen-title]');
  const screenStatus = document.querySelector('[data-screen-status]');
  const screenDetail = document.querySelector('[data-screen-detail]');

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const range = (v, start, end) => clamp((v - start) / (end - start));
  const smooth = (v) => v * v * (3 - 2 * v);
  const states = [
    ['Capture the signal.', 'Enquiry captured', 'Everything starts in one reliable place.'],
    ['Let the system move it.', 'Flow triggered', 'The right data moves and the next action happens automatically.'],
    ['See what matters.', 'System clear', 'One useful view replaces another place to check.']
  ];

  if (deviceWrap) deviceWrap.style.perspectiveOrigin = '50% 72%';
  if (laptopLid && desktopMotion && !reduced) laptopLid.style.transform = 'rotateX(-46deg)';

  let ticking = false;
  const update = () => {
    ticking = false;
    header?.classList.toggle('scrolled', window.scrollY > 16);
    if (!transition || reduced || !desktopMotion) return;

    const rect = transition.getBoundingClientRect();
    const distance = Math.max(1, transition.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / distance);

    const fadeHero = smooth(range(p, .08, .38));
    const open = smooth(range(p, .05, .48));
    const shift = smooth(range(p, .42, .82));
    const revealCopy = smooth(range(p, .48, .76));

    if (heroCopy) {
      heroCopy.style.opacity = String(1 - fadeHero);
      heroCopy.style.transform = `translate3d(0,${-28 * fadeHero}px,0)`;
      heroCopy.style.pointerEvents = fadeHero > .85 ? 'none' : '';
    }
    if (heroFoot) heroFoot.style.opacity = String(1 - smooth(range(p, .06, .3)));

    // The hinge is the lower edge of the display. A negative X rotation makes
    // the lid lean away from the viewer, then resolve to 0deg as it opens.
    if (laptopLid) laptopLid.style.transform = `rotateX(${-46 * (1 - open)}deg)`;

    if (deviceWrap) {
      const x = -34 * shift;
      const scale = 1 + .08 * open;
      deviceWrap.style.transform = `translate3d(${x}%,0,0) scale(${scale})`;
    }
    if (transitionCopy) {
      transitionCopy.style.opacity = String(revealCopy);
      transitionCopy.style.transform = `translateY(-42%) translateX(${34 * (1 - revealCopy)}px)`;
      transitionCopy.style.pointerEvents = revealCopy > .8 ? 'auto' : 'none';
    }

    const stateIndex = p < .6 ? 0 : p < .78 ? 1 : 2;
    steps.forEach((step, index) => step.classList.toggle('active', index === stateIndex));
    const [title, status, detail] = states[stateIndex];
    if (screenTitle) screenTitle.innerHTML = title;
    if (screenStatus) screenStatus.textContent = status;
    if (screenDetail) screenDetail.textContent = detail;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (!reduced && finePointer) {
    document.querySelectorAll('[data-glow-card]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  const form = document.getElementById('project-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = [...form.querySelectorAll('[required]')];
      const invalid = fields.find((field) => !field.checkValidity());
      fields.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));
      if (invalid) return invalid.focus();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Project enquiry from ${data.get('name')}`);
      const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nProject:\n${data.get('message')}`);
      location.href = `mailto:hello@akizen.my?subject=${subject}&body=${body}`;
    });
    form.addEventListener('input', (event) => event.target.removeAttribute('aria-invalid'));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
