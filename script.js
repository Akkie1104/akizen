(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const desktopMotion = window.matchMedia('(min-width: 901px)').matches;
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('[data-hero]');
  const heroCopy = hero?.querySelector('.hero-copy');
  const heroDemo = hero?.querySelector('.hero-demo');
  const heroFoot = hero?.querySelector('.hero-foot');
  const story = document.querySelector('[data-device-story]');
  const scene = document.querySelector('[data-device-scene]');
  const progressBar = document.querySelector('[data-story-progress]');
  const storySteps = [...document.querySelectorAll('[data-story-step]')];
  const screenTitle = document.querySelector('[data-screen-title]');
  const screenStatus = document.querySelector('[data-screen-status]');
  const screenDetail = document.querySelector('[data-screen-detail]');

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const ease = (value) => value * value * (3 - 2 * value);

  const storyStates = [
    ['Capture the signal.', 'Enquiry captured', 'Everything starts in one reliable place.'],
    ['Let the system move it.', 'Flow triggered', 'The right data moves and the next action happens automatically.'],
    ['See what matters.', 'System clear', 'The team gets one useful view instead of another place to check.']
  ];

  let ticking = false;
  const updateScrollScene = () => {
    ticking = false;
    header?.classList.toggle('scrolled', window.scrollY > 16);

    if (!reduced && desktopMotion && hero) {
      const heroRect = hero.getBoundingClientRect();
      const heroExit = clamp((-heroRect.top) / Math.max(1, heroRect.height * .72));
      const fade = ease(range(heroExit, .42, .92));
      if (heroCopy) {
        heroCopy.style.opacity = String(1 - fade * .88);
        heroCopy.style.transform = `translate3d(0,${fade * -34}px,0)`;
      }
      if (heroDemo) {
        heroDemo.style.opacity = String(1 - fade * .72);
        heroDemo.style.transform = `translate3d(0,${fade * -18}px,0) scale(${1 - fade * .035})`;
      }
      if (heroFoot) heroFoot.style.opacity = String(1 - fade);
    }

    if (!story || !scene || reduced || !desktopMotion) return;

    const rect = story.getBoundingClientRect();
    const distance = Math.max(1, rect.height - window.innerHeight);
    const p = clamp(-rect.top / distance);
    const open = ease(range(p, .02, .42));
    const shift = ease(range(p, .48, .78));
    const copy = ease(range(p, .52, .76));

    scene.style.setProperty('--p', p.toFixed(4));
    scene.style.setProperty('--open', open.toFixed(4));
    scene.style.setProperty('--shift', shift.toFixed(4));
    scene.style.setProperty('--copy', copy.toFixed(4));
    if (progressBar) progressBar.style.width = `${p * 100}%`;

    const activeIndex = p < .58 ? 0 : p < .78 ? 1 : 2;
    storySteps.forEach((step, index) => step.classList.toggle('active', index === activeIndex));
    const [title, status, detail] = storyStates[activeIndex];
    if (screenTitle) screenTitle.textContent = title;
    if (screenStatus) screenStatus.textContent = status;
    if (screenDetail) screenDetail.textContent = detail;
  };

  const requestScrollUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollScene);
  };

  updateScrollScene();
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });

  if (!reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
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
      const fields = [...form.querySelectorAll('[required]')];
      const invalid = fields.find((field) => !field.checkValidity());
      if (invalid) {
        event.preventDefault();
        fields.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));
        invalid.focus();
        return;
      }
      event.preventDefault();
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
