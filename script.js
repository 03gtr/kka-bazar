/* ============================================================
   KKA BAZAR — Digital Brand Card
   Script: Page navigation, animations, reduced-motion, tel:
   ============================================================ */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  var slides = {
    home:    document.getElementById('slide-home'),
    discover:document.getElementById('slide-discover'),
    contact: document.getElementById('slide-contact')
  };

  var navItems = document.querySelectorAll('.nav-item');
  var menuBtn  = document.getElementById('menuBtn');

  var callBtn       = document.getElementById('callBtn');
  var locationBtn   = document.getElementById('locationBtn');
  var discoverBtn   = document.getElementById('discoverBtn');
  var offersBtn     = document.getElementById('offersBtn');
  var discoverBack  = document.getElementById('discoverBackBtn');
  var contactBack   = document.getElementById('contactBackBtn');
  var qrCtaBtn      = document.getElementById('qrCtaBtn');
  var callLink      = document.getElementById('callLink');

  // ---------- State ----------
  var currentPage = 'home';
  var isAnimating = false;

  // ---------- Helpers ----------
  function goTo(pageId) {
    if (pageId === currentPage || isAnimating) return;
    if (!slides[pageId]) return;

    isAnimating = true;

    // Hide all
    Object.keys(slides).forEach(function (key) {
      slides[key].classList.remove('active');
    });

    // Show target
    slides[pageId].classList.add('active');

    // Force reflow then re-trigger animation
    void slides[pageId].offsetWidth;
    slides[pageId].style.animation = 'none';
    void slides[pageId].offsetWidth;
    slides[pageId].style.animation = '';

    currentPage = pageId;

    // Update nav
    navItems.forEach(function (item) {
      var isActive = item.getAttribute('data-page') === pageId;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });

    // Scroll to top of the visible slide
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset lock after transition
    setTimeout(function () {
      isAnimating = false;
    }, 450);
  }

  // ---------- Menu button (mobile) ----------
  // OpensDiscover by default for simplicity; on narrow screens acts as "go home"
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      goTo('home');
    });
  }

  // ---------- Bottom nav ----------
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      goTo(item.getAttribute('data-page'));
    });
  });

  // ---------- Home action buttons ----------
  if (callBtn) {
    callBtn.addEventListener('click', function () {
      window.location.href = 'tel:+9647507927364';
    });
  }
  if (locationBtn) {
    locationBtn.addEventListener('click', function () {
      goTo('contact');
    });
  }
  if (discoverBtn) {
    discoverBtn.addEventListener('click', function () {
      goTo('discover');
    });
  }
  if (offersBtn) {
    offersBtn.addEventListener('click', function () {
      goTo('contact'); // offers section lives inside contact page
    });
  }

  // ---------- Back buttons ----------
  if (discoverBack) {
    discoverBack.addEventListener('click', function () {
      goTo('home');
    });
  }
  if (contactBack) {
    contactBack.addEventListener('click', function () {
      goTo('home');
    });
  }

  // ---------- QR CTA ----------
  if (qrCtaBtn) {
    qrCtaBtn.addEventListener('click', function () {
      // The QR is the user's physical scanning experience.
      // Button provides guidance. We can also pulse-shake to draw attention.
      var el = qrCtaBtn;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'qrCtaPulse 0.6s ease';
      setTimeout(function () {
        el.style.animation = '';
      }, 700);
    });
  }

  // Inject small keyframe for the pulse (if not present)
  if (!document.getElementById('qrPulseStyle')) {
    var style = document.createElement('style');
    style.id = 'qrPulseStyle';
    style.textContent =
      '@keyframes qrCtaPulse {' +
      '0%   { transform: scale(1);' +
      '        box-shadow: 0 4px 12px rgba(0,128,128,0.25); }' +
      '40%  { transform: scale(1.04);' +
      '        box-shadow: 0 8px 22px rgba(0,128,128,0.35); }' +
      '100% { transform: scale(1);' +
      '        box-shadow: 0 4px 12px rgba(0,128,128,0.25); }' +
      '}' +
      '@media (prefers-reduced-motion: reduce) {' +
      '@keyframes qrCtaPulse { from { transform: scale(1); } to { transform: scale(1); } }' +
      '}';
    document.head.appendChild(style);
  }

  // ---------- Call link (contact page) ----------
  if (callLink) {
    callLink.addEventListener('click', function (e) {
      // Let the native tel: handle it; prevent double navigation
      // but keep the handler for analytics/hooks if needed later.
    });
  }

  // ---------- Keyboard / a11y ----------
  document.addEventListener('keydown', function (e) {
    // ESC returns home
    if (e.key === 'Escape' && currentPage !== 'home') {
      goTo('home');
    }
    // Number shortcuts: 1=home, 2=discover, 3=contact
    if (e.key === '1') goTo('home');
    if (e.key === '2') goTo('discover');
    if (e.key === '3') goTo('contact');
  });

  // ---------- Touch feedback (no-op, visual via CSS) ----------
  // We rely on :active for press feedback.

  // ---------- Preconnect social origins (performance) ----------
  if (window.linkPreconnect) {
    var origins = [
      'https://www.instagram.com',
      'https://www.facebook.com',
      'https://snapchat.com',
      'https://www.tiktok.com',
      'https://iq-group.app'
    ];
    origins.forEach(function (url) {
      var link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // ---------- Reduced motion preference ----------
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    // Neutralize any entrance motion globally
    document.documentElement.style.setProperty('--motion-none', 'true');
  }
  prefersReduced.addEventListener('change', function (e) {
    document.documentElement.style.setProperty(
      '--motion-none',
      e.matches ? 'true' : 'false'
    );
  });

  // ---------- Phone number formatting in address bar ----------
  // Nothing needed; tel: links handle calls natively.

  // ---------- Expose a small API for in-page discovery ----------
  window.kkaBazar = {
    goTo: goTo,
    current: function () { return currentPage; }
  };

  // ---------- Boot ----------
  // Ensure home is active (it already has .active in HTML)
  // but if something removed it, restore.
  if (!slides.home.classList.contains('active')) {
    slides.home.classList.add('active');
  }

})();
