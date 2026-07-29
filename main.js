document.addEventListener('DOMContentLoaded', () => {
  const scrollReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => scrollReveal.observe(el));

  const menuToggle = document.getElementById('menu-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
  }

  // Reservation date field shouldn't offer dates before today.
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().slice(0, 10);
  }

  // The reservation form posts natively to the Formspree endpoint configured
  // in contact.html — no fetch/AJAX, so it keeps working even if this script
  // fails to load. This just adds a "sending" status for better feedback and
  // guards against double submits.
  const reservationForm = document.querySelector('.reservation-form');
  if (reservationForm) {
    const status = reservationForm.querySelector('[data-form-status]');
    const submitBtn = reservationForm.querySelector('button[type="submit"]');
    reservationForm.addEventListener('submit', () => {
      if (status) {
        status.hidden = false;
        status.classList.remove('is-error');
        status.classList.add('is-success');
        status.textContent = 'Sending your request…';
      }
      if (submitBtn) submitBtn.disabled = true;
    });
  }
});
