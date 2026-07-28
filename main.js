document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  document.querySelectorAll('[data-carousel]').forEach(root => {
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const track = root.querySelector('.carousel-track');
    const prevBtn = root.querySelector('.carousel-prev');
    const nextBtn = root.querySelector('.carousel-next');
    const pauseBtn = root.querySelector('.carousel-pause');
    const dots = Array.from(root.querySelectorAll('.carousel-dot'));
    if (!slides.length) return;

    let index = 0;
    let timer = null;
    let paused = false;

    function setSlide(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('active', idx === index));
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
    }

    function stopAuto() {
      window.clearInterval(timer);
      timer = null;
    }

    function startAuto() {
      stopAuto();
      if (paused) return;
      timer = window.setInterval(() => setSlide(index + 1), 5000);
    }

    function setPaused(next) {
      paused = next;
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', String(paused));
        pauseBtn.setAttribute('aria-label', paused ? 'Play automatic slideshow' : 'Pause automatic slideshow');
        pauseBtn.textContent = paused ? '▶' : '⏸';
      }
      if (paused) stopAuto();
      else startAuto();
    }

    prevBtn?.addEventListener('click', () => { setSlide(index - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { setSlide(index + 1); startAuto(); });
    dots.forEach((dot, idx) => dot.addEventListener('click', () => { setSlide(idx); startAuto(); }));
    pauseBtn?.addEventListener('click', () => setPaused(!paused));

    // WCAG 2.2.2: content that auto-updates must be pausable, including for
    // users who can't hover (keyboard/touch), so focus inside the carousel
    // pauses it the same way mouse hover does.
    if (track) {
      track.addEventListener('mouseenter', stopAuto);
      track.addEventListener('mouseleave', () => { if (!paused) startAuto(); });
      track.addEventListener('focusin', stopAuto);
      track.addEventListener('focusout', () => { if (!paused) startAuto(); });
    }

    setSlide(0);
    if (reducedMotion) setPaused(true);
    else startAuto();
  });

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
