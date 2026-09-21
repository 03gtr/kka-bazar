/* ================================================================
   KKA BAZAR — Digital Brand Card
   V3 Rebuild — Vanilla JS, zero dependencies
   ================================================================ */

(function () {
  'use strict';

  // ---- DOM refs ----
  const slides = {
    home:    document.getElementById('slide-home'),
    discover:document.getElementById('slide-discover'),
    contact: document.getElementById('slide-contact'),
  };

  const navItems = document.querySelectorAll('.nav-item');
  const menuBtn  = document.getElementById('menuBtn');
  const bottomNav = document.getElementById('bottomNav');

  const callCta     = document.getElementById('callCta');
  const locationBtn = document.getElementById('locationBtn');
  const discoverBtn = document.getElementById('discoverBtn');
  const offersBtn   = document.getElementById('offersBtn');

  const prevCategoryBtn = document.getElementById('prevCategoryBtn');
  const nextCategoryBtn = document.getElementById('nextCategoryBtn');
  const categoriesRail  = document.getElementById('categoriesRail');

  const phoneCard = document.getElementById('phoneCard');
  const igLink    = document.getElementById('igLink');
  const fbLink    = document.getElementById('fbLink');
  const snapLink  = document.getElementById('snapLink');
  const tiktokLink= document.getElementById('tiktokLink');

  // ---- State ----
  let currentSlide = 'home';
  let isTransitioning = false;
  let splashTimer = null;

  // ---- Splash screen ----
  const splash = document.getElementById('splash');
  splashTimer = setTimeout(function () {
    splash.classList.add('hidden');
    setTimeout(function () { splash.style.display = 'none'; }, 500);
  }, 800);

  // ---- Slide management ----
  function goToSlide(slideId, instant) {
    if (isTransitioning || slideId === currentSlide) return;
    const target = slides[slideId];
    if (!target) return;

    isTransitioning = true;

    // Remove active from all
    Object.values(slides).forEach(function (s) { s.classList.remove('active'); });

    // Apply active to target
    target.classList.add('active');

    // Force reflow then animate
    if (!instant) {
      void target.offsetWidth;
      target.style.animation = 'none';
      void target.offsetWidth;
      target.style.animation = '';
    }

    currentSlide = slideId;

    // Update nav
    navItems.forEach(function (item) {
      const isActive = item.getAttribute('data-slide') === slideId;
      item.classList.toggle('active', isActive);
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });

    // Scroll to top of slide
    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });

    setTimeout(function () { isTransitioning = false; }, instant ? 0 : 500);
  }

  // ---- Bottom nav navigation ----
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      goToSlide(item.getAttribute('data-slide'));
    });
  });

  // ---- Menu button (mobile) - scrolls to top ----
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- CTA buttons ----
  if (callCta) {
    callCta.addEventListener('click', function (e) {
      // Let the tel: href handle it
    });
  }

  if (locationBtn) {
    locationBtn.addEventListener('click', function () {
      goToSlide('contact');
    });
  }

  if (discoverBtn) {
    discoverBtn.addEventListener('click', function () {
      goToSlide('discover');
    });
  }

  if (offersBtn) {
    offersBtn.addEventListener('click', function () {
      goToSlide('contact');
    });
  }

  // ---- Categories rail navigation ----
  if (prevCategoryBtn && categoriesRail) {
    prevCategoryBtn.addEventListener('click', function () {
      const scrollAmount = categoriesRail.clientWidth * 0.75;
      categoriesRail.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  if (nextCategoryBtn && categoriesRail) {
    nextCategoryBtn.addEventListener('click', function () {
      const scrollAmount = categoriesRail.clientWidth * 0.75;
      categoriesRail.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Also allow swipe on the rail (touch-based)
  if (categoriesRail) {
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    categoriesRail.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isSwiping = true;
    }, { passive: true });

    categoriesRail.addEventListener('touchmove', function (e) {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    categoriesRail.addEventListener('touchend', function () {
      if (!isSwiping) return;
      const diff = startX - currentX;
      const threshold = 40;
      if (Math.abs(diff) > threshold) {
        const scrollAmount = categoriesRail.clientWidth * 0.6;
        categoriesRail.scrollBy({
          left: diff > 0 ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      }
      isSwiping = false;
    }, { passive: true });
  }

  // ---- Keyboard navigation ----
  document.addEventListener('keydown', function (e) {
    if (e.key === '1') goToSlide('home');
    if (e.key === '2') goToSlide('discover');
    if (e.key === '3') goToSlide('contact');
    if (e.key === 'Escape') {
      if (currentSlide !== 'home') goToSlide('home');
    }
    if (e.key === 'ArrowRight' && currentSlide === 'discover' && categoriesRail) {
      const scrollAmount = categoriesRail.clientWidth * 0.6;
      categoriesRail.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    if (e.key === 'ArrowLeft' && currentSlide === 'discover' && categoriesRail) {
      const scrollAmount = categoriesRail.clientWidth * 0.6;
      categoriesRail.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  });

  // ---- Magnetic CTA effect (subtle) ----
  function addMagneticEffect(el, strength) {
    if (!el || !window.matchMedia('(hover: hover)').matches) return;
    strength = strength || 8;

    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width * strength;
      const deltaY = (e.clientY - centerY) / rect.height * strength;
      el.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  }

  // Apply to main CTAs on home
  const homeCtas = document.querySelectorAll('#slide-home .cta-item');
  homeCtas.forEach(function (cta) {
    addMagneticEffect(cta, 6);
  });

  // ---- Smooth scroll for discover rail ----
  if (categoriesRail) {
    categoriesRail.addEventListener('scroll', function () {
      // Update button states if needed
    });
  }

  // ---- Preconnect social origins (performance) ----
  function preconnectOrigins() {
    const origins = [
      'https://www.instagram.com',
      'https://www.facebook.com',
      'https://snapchat.com',
      'https://www.tiktok.com',
      'https://iq-group.app'
    ];
    origins.forEach(function (url) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  preconnectOrigins();

  // ---- Expose for debugging ----
  window.kkaBazar = {
    goToSlide: goToSlide,
    current: function () { return currentSlide; }
  };

  // ---- Init: ensure home is active ----
  if (!slides.home.classList.contains('active')) {
    slides.home.classList.add('active');
  }

})();
