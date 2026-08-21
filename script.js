(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress span');

  if (location.hash && /^#\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 20);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${max > 0 ? Math.min(100, y / max * 100) : 0}%`;
    }
  };
  updateScrollUI();
  addEventListener('scroll', updateScrollUI, { passive: true });

  if (!reduced && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  const flowBoard = document.querySelector('[data-flow-board]');
  const flowTitle = document.querySelector('[data-flow-title]');
  const flowCenter = document.querySelector('[data-flow-center]');
  const flowCaption = document.querySelector('[data-flow-caption]');
  const flowSteps = [...document.querySelectorAll('.flow-step')];
  const flowContent = {
    messy: ['Too many moving parts.', 'Manual', 'Information moves manually. Someone has to remember the next step.'],
    connected: ['The pieces start talking.', 'Connected', 'Data moves once, the right person is notified, and the next action happens automatically.'],
    clear: ['The work feels calmer.', 'Clear', 'The system becomes easier to understand, easier to trust and easier to maintain.']
  };

  const activateFlow = (state) => {
    if (!flowBoard || !flowContent[state]) return;
    flowBoard.classList.remove('state-messy', 'state-connected', 'state-clear');
    flowBoard.classList.add(`state-${state}`);
    const [title, center, caption] = flowContent[state];
    if (flowTitle) flowTitle.textContent = title;
    if (flowCenter) flowCenter.textContent = center;
    if (flowCaption) flowCaption.textContent = caption;
    flowSteps.forEach((step) => step.classList.toggle('active', step.dataset.flow === state));
  };
  activateFlow('messy');

  if ('IntersectionObserver' in window && flowSteps.length) {
    const flowObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.dataset.flow) activateFlow(visible.target.dataset.flow);
    }, { threshold: [.45,.65,.85], rootMargin: '-18% 0px -35% 0px' });
    flowSteps.forEach((step) => flowObserver.observe(step));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt-root]').forEach((root) => {
      root.addEventListener('pointermove', (event) => {
        const r = root.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - .5;
        const y = (event.clientY - r.top) / r.height - .5;
        const depthNodes = root.querySelectorAll('[data-depth]');
        if (depthNodes.length) {
          depthNodes.forEach((node) => {
            const d = Number(node.dataset.depth || 1);
            node.style.transform = `translate3d(${x*d*8}px,${y*d*7}px,0) rotateX(${y*-1.2}deg) rotateY(${x*1.5}deg)`;
          });
        } else {
          root.style.transform = `rotateX(${y*-1.1}deg) rotateY(${x*1.6}deg)`;
        }
      });
      root.addEventListener('pointerleave', () => {
        root.querySelectorAll('[data-depth]').forEach((node) => node.style.transform = '');
        root.style.transform = '';
      });
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();