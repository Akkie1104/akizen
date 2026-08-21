(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const header = document.querySelector('[data-header]');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

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
