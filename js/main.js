document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!navToggle || !navMenu) return;

  function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    if (!navMenu.classList.contains('active')) return;
    if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
      closeMenu();
    }
  });

  // Navbar scroll shadow
  const navbar = document.querySelector('.navbar');
  let ticking = false;

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

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

  // Track which sections currently overlap the trigger zone so that
  // scrolling back up correctly restores the previous active link.
  const activeSections = new Set();

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        activeSections.add(entry.target.id);
      } else {
        activeSections.delete(entry.target.id);
      }
    });

    // Among all intersecting sections, pick the last one in document order.
    // This is the furthest-down section whose content is in the trigger zone —
    // i.e. the section the user has most recently scrolled into.
    let activeId = null;
    sections.forEach(function (section) {
      if (activeSections.has(section.id)) {
        activeId = section.id;
      }
    });

    if (activeId) setActiveLink(activeId);
  }, {
    // Shrink the root by the navbar height at the top so content behind the
    // navbar never triggers. Clip the lower 66% so the trigger zone covers
    // only the upper third of the visible viewport — this fires reliably even
    // for sections taller than the viewport.
    rootMargin: '-72px 0px -66% 0px',
    threshold: 0
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // Scroll fade-in animations
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // Apply stagger delay to service cards
  document.querySelectorAll('.services-grid .animate-on-scroll').forEach(function (card, index) {
    card.style.transitionDelay = (index * 100) + 'ms';
  });

  // Apply stagger delay to case study cards
  document.querySelectorAll('.case-studies-grid .animate-on-scroll').forEach(function (card, index) {
    card.style.transitionDelay = (index * 150) + 'ms';
  });

  // Apply stagger delay to publication items
  document.querySelectorAll('.publications-list .animate-on-scroll').forEach(function (item, index) {
    item.style.transitionDelay = (index * 80) + 'ms';
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

  // Service card modals
  var openModal = null;

  function showModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    openModal = overlay;
    document.body.style.overflow = 'hidden';
    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function hideModal() {
    if (!openModal) return;
    var closing = openModal;
    var opener = closing._opener;
    openModal = null;
    document.body.style.overflow = '';
    closing.classList.add('modal-closing');
    setTimeout(function () {
      closing.setAttribute('hidden', '');
      closing.classList.remove('modal-closing');
    }, 200);
    if (opener) opener.focus();
  }

  document.querySelectorAll('.service-learn-more').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-modal');
      var overlay = document.getElementById(id);
      if (overlay) overlay._opener = btn;
      showModal(id);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.querySelector('.modal-close').addEventListener('click', hideModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hideModal();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openModal) hideModal();

    // Focus trapping within open modal
    if (e.key === 'Tab' && openModal) {
      var focusable = openModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
});
