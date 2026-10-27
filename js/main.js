document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.querySelector('.pb-menu-button');
  const navMenu = document.getElementById('primary-nav');

  function setMenuOpen(isOpen) {
    navMenu.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  menuButton.addEventListener('click', function () {
    setMenuOpen(!navMenu.classList.contains('is-open'));
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (event) {
    if (!navMenu.classList.contains('is-open')) return;
    if (!navMenu.contains(event.target) && !menuButton.contains(event.target)) {
      closeMenu();
    }
  });

  // Escape closes the menu and returns focus to the menu button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  // Widening the window past the menu breakpoint (same query as components.css) closes the menu
  window.matchMedia('(max-width: 768px)').addEventListener('change', function (event) {
    if (!event.matches) closeMenu();
  });

  // Active nav link highlighting via Intersection Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = navMenu.querySelectorAll('a[href^="#"]');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
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

  // Service card modals
  var openModal = null;

  // components.css switches the fade off under reduced motion, so no animationend fires then
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function showModal(id) {
    var overlay = document.getElementById(id);
    if (!overlay) return;
    // Reopened during its closing fade: cancel the pending hide
    clearTimeout(overlay._hideTimer);
    overlay.classList.remove('is-closing');
    overlay.removeAttribute('hidden');
    overlay.classList.add('is-opening');
    if (reducedMotion.matches) overlay.classList.remove('is-opening');
    openModal = overlay;
    document.body.style.overflow = 'hidden';
    var closeBtn = overlay.querySelector('.pb-panel__close');
    if (closeBtn) closeBtn.focus();
  }

  function hideModal() {
    if (!openModal) return;
    var closing = openModal;
    var opener = closing._opener;
    openModal = null;
    document.body.style.overflow = '';
    closing.classList.remove('is-opening');
    closing.classList.add('is-closing');
    closing._hideTimer = setTimeout(function () {
      closing.setAttribute('hidden', '');
      closing.classList.remove('is-closing');
    }, reducedMotion.matches ? 0 : 150);
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

  document.querySelectorAll('.pb-overlay').forEach(function (overlay) {
    overlay.querySelector('.pb-panel__close').addEventListener('click', hideModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hideModal();
    });
    overlay.addEventListener('animationend', function (e) {
      if (e.target === overlay) overlay.classList.remove('is-opening');
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
      // Focus has left the panel (a click on its text drops focus to the body): bring it back in
      if (!openModal.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey) {
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
