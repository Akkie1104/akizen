(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const header = document.querySelector('[data-header]');

  if (location.hash && /^#\//.test(location.hash)) {
    history.replaceState(null, '', location.pathname + location.search);
  }

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (!reduced && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
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

  const flowBoard = document.querySelector('[data-flow-board]');
  const flowTitle = document.querySelector('[data-flow-title]');
  const flowCenter = document.querySelector('[data-flow-center]');
  const flowCaption = document.querySelector('[data-flow-caption]');
  const flowSteps = [...document.querySelectorAll('.flow-step')];

  const flowContent = {
    messy: {
      title: 'Too many moving parts.',
      center: 'Manual',
      caption: 'Information moves manually. Someone has to remember the next step.'
    },
    connected: {
      title: 'The pieces start talking.',
      center: 'Connected',
      caption: 'Information moves once, the right person is notified, and the next action becomes automatic.'
    },
    clear: {
      title: 'The work feels calmer.',
      center: 'Clear',
      caption: 'The workflow becomes easier to understand, easier to trust and easier to maintain.'
    }
  };

  const activateFlow = (state) => {
    const content = flowContent[state];
    if (!flowBoard || !content) return;

    flowBoard.classList.remove('state-messy', 'state-connected', 'state-clear');
    flowBoard.classList.add(`state-${state}`);
    if (flowTitle) flowTitle.textContent = content.title;
    if (flowCenter) flowCenter.textContent = content.center;
    if (flowCaption) flowCaption.textContent = content.caption;

    flowSteps.forEach((step) => {
      const active = step.dataset.flow === state;
      step.classList.toggle('active', active);
      step.setAttribute('aria-pressed', String(active));
    });
  };

  flowSteps.forEach((step) => {
    step.setAttribute('aria-pressed', 'false');
    step.addEventListener('click', () => activateFlow(step.dataset.flow));
  });
  activateFlow('messy');

  if (!reduced && 'IntersectionObserver' in window && flowSteps.length) {
    const flowObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.dataset.flow) activateFlow(visible.target.dataset.flow);
    }, { threshold: [0.45, 0.65, 0.85], rootMargin: '-18% 0px -35% 0px' });
    flowSteps.forEach((step) => flowObserver.observe(step));
  }

  if (!reduced && finePointer) {
    document.querySelectorAll('[data-tilt-root]').forEach((root) => {
      root.addEventListener('pointermove', (event) => {
        const rect = root.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const browser = root.querySelector('.showcase-browser');
        if (browser) browser.style.transform = `rotateX(${y * -1.2}deg) rotateY(${x * 1.7}deg) rotate(1deg)`;
      });
      root.addEventListener('pointerleave', () => {
        const browser = root.querySelector('.showcase-browser');
        if (browser) browser.style.transform = '';
      });
    });
  }

  const form = document.getElementById('project-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const requiredFields = [...form.querySelectorAll('[required]')];
      let valid = true;

      requiredFields.forEach((field) => {
        const fieldValid = field.checkValidity();
        field.setAttribute('aria-invalid', String(!fieldValid));
        if (!fieldValid) valid = false;
      });

      if (!valid) {
        requiredFields.find((field) => !field.checkValidity())?.focus();
        return;
      }

      const data = new FormData(form);
      const subject = encodeURIComponent(`Project enquiry from ${data.get('name')}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nWhat I want to improve:\n${data.get('need')}`
      );
      window.location.href = `mailto:hello@akizen.my?subject=${subject}&body=${body}`;
    });

    form.addEventListener('input', (event) => {
      if (event.target.matches('input,textarea')) event.target.removeAttribute('aria-invalid');
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
