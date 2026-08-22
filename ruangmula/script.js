const reveals = document.querySelectorAll('.reveal');
const sticky = document.getElementById('mobileSticky');
const contact = document.getElementById('contact');
const hero = document.querySelector('.hero');
const demoModal = document.getElementById('demoModal');
const modalClose = document.getElementById('modalClose');
const modalDone = document.getElementById('modalDone');
const demoButtons = document.querySelectorAll('.demo-whatsapp');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => revealObserver.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('visible'));
}

function updateSticky() {
  if (!sticky || !hero || !contact) return;
  const heroBottom = hero.getBoundingClientRect().bottom;
  const contactRect = contact.getBoundingClientRect();
  const contactVisible = contactRect.top < window.innerHeight && contactRect.bottom > 0;
  sticky.classList.toggle('show', heroBottom < 40 && !contactVisible);
}

window.addEventListener('scroll', updateSticky, { passive: true });
window.addEventListener('resize', updateSticky);
updateSticky();

function openDemoModal() {
  demoModal.classList.add('open');
  demoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeDemoModal() {
  demoModal.classList.remove('open');
  demoModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

demoButtons.forEach((button) => button.addEventListener('click', openDemoModal));
modalClose.addEventListener('click', closeDemoModal);
modalDone.addEventListener('click', closeDemoModal);
demoModal.addEventListener('click', (event) => {
  if (event.target === demoModal) closeDemoModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && demoModal.classList.contains('open')) closeDemoModal();
});

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});