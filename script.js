(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktopMotion = window.matchMedia('(min-width: 901px)');
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;

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
      address: previewRoot.querySelector('[data-preview-address]'),
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
      { className:'preview-northline',url:'northline.studio',address:'northline.studio',brand:'NORTHLINE',meta:'Advisory · Malaysia',kicker:'STRATEGIC ADVISORY',title:'Clarity for decisions that matter.',copy:'Practical thinking for organisations navigating change, risk and opportunity.',label:'Professional services concept',count:'01 / 03',name:'Northline Advisory' },
      { className:'preview-hush',url:'hushcoffee.my',address:'hushcoffee.my',brand:'HUSH',meta:'Coffee · Ipoh',kicker:'LOCAL BUSINESS',title:'Slow mornings. Good coffee.',copy:'A warmer digital experience built around atmosphere, menu discovery and a simple visit.',label:'Local business demo',count:'02 / 03',name:'Hush Coffee' },
      { className:'preview-room',url:'room01.campaign',address:'room01.campaign',brand:'ROOM / 01',meta:'Campaign · Concept',kicker:'ONE OFFER · ONE ACTION',title:'Make room for what matters.',copy:'A focused campaign page with a single message, a single audience and a clear next move.',label:'Landing page concept',count:'03 / 03',name:'Room / 01' }
    ];

    let active = 0;
    const renderProject = (index) => {
      const project = projects[index];
      browser?.classList.add('is-changing');
      window.setTimeout(() => {
        if (screen) screen.className = `preview-screen ${project.className}`;
        Object.entries(fields).forEach(([key, node]) => { if (node) node.textContent = project[key]; });
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
          if (browser) browser.style.transform = `rotate(${1.1 + x * 1.2}deg) translate(${x * 7}px, ${y * 7}px)`;
        });
        previewRoot.addEventListener('pointerleave', () => { if (browser) browser.style.transform = ''; });
      }
    }
  }

  const serviceStory = document.querySelector('[data-service-story]');
  const serviceTabs = [...document.querySelectorAll('[data-service-tab]')];
  const serviceDemo = document.querySelector('[data-service-demo]');
  const serviceScreen = document.querySelector('[data-story-screen]');
  const serviceFields = serviceDemo ? {
    url: serviceDemo.querySelector('[data-story-url]'),
    brand: serviceDemo.querySelector('[data-story-brand]'),
    meta: serviceDemo.querySelector('[data-story-meta]'),
    kicker: serviceDemo.querySelector('[data-story-kicker]'),
    title: serviceDemo.querySelector('[data-story-title]'),
    copy: serviceDemo.querySelector('[data-story-copy]'),
    foot: serviceDemo.querySelector('[data-story-foot]'),
    count: serviceDemo.querySelector('[data-story-count]'),
    captionTitle: serviceDemo.querySelector('[data-story-caption-title]')
  } : {};

  const serviceScenes = [
    {
      url:'yourbusiness.my', brand:'YOUR BUSINESS', meta:'Business website', kicker:'TRUST · CLARITY · CONTACT',
      title:'A proper place for your business online.', copy:'Clear services, credible presentation and a simple path for customers to contact you.',
      foot:'Built around what customers need to know', count:'01 · BUSINESS WEBSITE', captionTitle:'Build credibility from the first visit.',
      bg:'#e5e7df', ink:'#15302d', accent:'#1f5b52'
    },
    {
      url:'yourbusiness.my/new', brand:'YOUR BUSINESS', meta:'Website redesign', kicker:'BEFORE → AFTER',
      title:'Keep the business. Fix the experience.', copy:'A clearer structure, stronger visual system and better mobile experience without pretending your business is something else.',
      foot:'A redesign should solve, not decorate', count:'02 · WEBSITE REDESIGN', captionTitle:'Make an outdated site feel current again.',
      bg:'#ede5da', ink:'#2b2420', accent:'#e85a3a'
    },
    {
      url:'campaign.yourbusiness.my', brand:'ONE CAMPAIGN', meta:'Landing page', kicker:'ONE OFFER · ONE ACTION',
      title:'Remove everything that competes with the goal.', copy:'A focused page built around one audience, one message and one next step.',
      foot:'Less navigation. More direction.', count:'03 · LANDING PAGE', captionTitle:'Turn attention into one clear action.',
      bg:'#e85a3a', ink:'#fffaf4', accent:'#171716'
    }
  ];

  let renderedService = -1;
  const renderService = (index) => {
    if (index === renderedService || !serviceDemo) return;
    renderedService = index;
    const scene = serviceScenes[index];
    Object.entries(serviceFields).forEach(([key, node]) => {
      if (!node || scene[key] === undefined) return;
      node.textContent = scene[key];
    });
    if (serviceScreen) {
      serviceScreen.style.setProperty('--story-bg', scene.bg);
      serviceScreen.style.setProperty('--story-ink', scene.ink);
    }
    serviceDemo.style.setProperty('--story-accent', scene.accent);
    serviceTabs.forEach((tab, tabIndex) => tab.classList.toggle('is-active', tabIndex === index));
  };
  renderService(0);

  const workStory = document.querySelector('[data-work-story]');
  const workRail = document.querySelector('[data-work-rail]');
  const workCards = [...document.querySelectorAll('.story-work-card')];
  const workIndex = document.querySelector('[data-work-index]');
  const workNames = ['Northline Advisory', 'Hush Coffee', 'Room / 01'];

  let ticking = false;
  const updateScrollStories = () => {
    ticking = false;
    if (reduced || !desktopMotion.matches) return;

    if (serviceStory && serviceDemo) {
      const rect = serviceStory.getBoundingClientRect();
      const scrollable = Math.max(1, serviceStory.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      const sceneFloat = progress * 3;
      const sceneIndex = Math.min(2, Math.floor(sceneFloat));
      const sceneLocal = sceneIndex === 2 ? clamp((progress - 2 / 3) * 3) : clamp(sceneFloat - sceneIndex);
      renderService(sceneIndex);

      serviceDemo.style.setProperty('--local-progress', sceneLocal.toFixed(4));
      serviceDemo.style.setProperty('--caption-progress', clamp(sceneLocal * 3).toFixed(4));
      serviceTabs.forEach((tab, index) => {
        const start = index / 3;
        const end = (index + 1) / 3;
        const tabProgress = clamp((progress - start) / (end - start));
        tab.style.setProperty('--tab-progress', tabProgress.toFixed(4));
      });
    }

    if (workStory && workRail && workCards.length) {
      const rect = workStory.getBoundingClientRect();
      const scrollable = Math.max(1, workStory.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      const shell = workRail.closest('.shell');
      const availableWidth = shell?.clientWidth || window.innerWidth;
      const travel = Math.max(0, workRail.scrollWidth - availableWidth);
      const railX = lerp(0, travel, progress);
      workRail.style.setProperty('--rail-x', railX.toFixed(2));
      workStory.style.setProperty('--work-progress', progress.toFixed(4));

      let nearest = 0;
      let nearestDistance = Infinity;
      workCards.forEach((card, index) => {
        const cardCenter = card.offsetLeft - railX + card.offsetWidth / 2;
        const viewportCenter = availableWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
        const normalized = clamp(distance / availableWidth, 0, 1);
        card.style.setProperty('--card-y', (normalized * 18).toFixed(2));
      });

      if (workIndex) workIndex.textContent = `0${nearest + 1} / 03 · ${workNames[nearest]}`;
    }
  };

  const requestStoryUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollStories);
  };

  if (!reduced) {
    window.addEventListener('scroll', requestStoryUpdate, { passive: true });
    window.addEventListener('resize', requestStoryUpdate, { passive: true });
    desktopMotion.addEventListener?.('change', requestStoryUpdate);
    requestStoryUpdate();
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();