document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (event) {
    if (!navMenu.classList.contains('active')) return;
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Active nav link highlighting via Intersection Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = navMenu.querySelectorAll('a[href^="#"]');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // Scroll fade-in animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // Apply stagger delay to service cards
  document.querySelectorAll('.services-grid .animate-on-scroll').forEach(function (card, index) {
    card.style.transitionDelay = (index * 100) + 'ms';
  });

  const animationObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animatedElements.forEach(function (el) {
    animationObserver.observe(el);
  });
});
