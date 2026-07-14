document.addEventListener('DOMContentLoaded', () => {
  const scrollReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
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

  const carouselRoots = document.querySelectorAll('[data-carousel]');
  carouselRoots.forEach(root => {
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const next = root.querySelector('.carousel-next');
    const prev = root.querySelector('.carousel-prev');
    const dots = Array.from(root.querySelectorAll('.carousel-dot'));
    let index = 0;
    let timer;

    function setSlide(newIndex) {
      index = (newIndex + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('active', idx === index));
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
    }

    function startAuto() {
      timer = window.setInterval(() => setSlide(index + 1), 5000);
    }

    function resetAuto() {
      window.clearInterval(timer);
      startAuto();
    }

    prev?.addEventListener('click', () => { setSlide(index - 1); resetAuto(); });
    next?.addEventListener('click', () => { setSlide(index + 1); resetAuto(); });
    dots.forEach((dot, idx) => dot.addEventListener('click', () => { setSlide(idx); resetAuto(); }));
    setSlide(0);
    startAuto();
  });
});
