/* ============================================================
   FÁBIO GRISANTI PARRUCCHIERI — Script
   Vanilla JS — No frameworks
   ============================================================ */

(function () {
  'use strict';
  document.documentElement.classList.add('js-anim');

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    toggleBackTop();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav .navbar__link');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- INTERSECTION OBSERVER — FADE IN ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ---------- BACK TO TOP ---------- */
  const backTop = document.querySelector('.back-top');

  function toggleBackTop() {
    if (!backTop) return;
    if (window.scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }

  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- SERVICE CARDS MICRO-INTERACTION ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.boxShadow = 'none';
    });
  });

  /* ---------- SERVICES CAROUSEL ---------- */
  const servicesCarousel = document.querySelector('[data-services-carousel]');

  if (servicesCarousel) {
    const viewport = servicesCarousel.querySelector('[data-services-viewport]');
    const track = servicesCarousel.querySelector('[data-services-track]');
    const prevBtn = servicesCarousel.querySelector('.services-nav--prev');
    const nextBtn = servicesCarousel.querySelector('.services-nav--next');

    if (viewport && track) {
      let isAnimating = false;
      let autoplayTimer = null;
      let autoplayResumeTimer = null;
      let touchStartX = 0;
      let touchStartY = 0;
      const clickDuration = 300;
      const autoplayDuration = 600;
      const autoplayInterval = 4500;
      const autoplayResumeDelay = 400;
      const swipeThreshold = 40;
      const isTouchDevice =
        window.matchMedia('(hover: none), (pointer: coarse)').matches ||
        'ontouchstart' in window;

      const getCards = () => Array.from(track.querySelectorAll('.service-card'));

      const disableSnap = () => {
        viewport.style.scrollSnapType = 'none';
        viewport.style.scrollBehavior = 'auto';
      };

      const restoreSnap = () => {
        viewport.style.scrollSnapType = '';
        viewport.style.scrollBehavior = '';
      };

      const getStep = () => {
        const first = track.querySelector('.service-card');
        if (!first) return viewport.clientWidth;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.gap || style.columnGap || '16') || 16;
        return first.getBoundingClientRect().width + gap;
      };

      const animateTo = (targetScroll, durationMs, onDone) => {
        const startLeft = viewport.scrollLeft;
        const delta = targetScroll - startLeft;
        if (Math.abs(delta) < 1) {
          if (onDone) onDone();
          return;
        }
        const startTime = performance.now();
        const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

        const frame = (now) => {
          const progress = Math.min(1, (now - startTime) / durationMs);
          viewport.scrollLeft = startLeft + (delta * easeInOut(progress));
          if (progress < 1) {
            requestAnimationFrame(frame);
          } else {
            if (onDone) onDone();
          }
        };

        requestAnimationFrame(frame);
      };

      const stepScrollRight = (mode = 'click') => {
        if (getCards().length <= 1 || isAnimating) return;
        isAnimating = true;
        const step = getStep();
        const duration = mode === 'autoplay' ? autoplayDuration : clickDuration;
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        const target = Math.min(viewport.scrollLeft + step, maxScroll);

        disableSnap();
        animateTo(target, duration, () => {
          if (viewport.scrollLeft >= maxScroll - 2) {
            const first = track.querySelector('.service-card');
            if (first) {
              track.appendChild(first);
              viewport.scrollLeft = Math.max(0, viewport.scrollLeft - step);
            }
          }
          restoreSnap();
          isAnimating = false;
        });
      };

      const stepScrollLeft = (mode = 'click') => {
        if (getCards().length <= 1 || isAnimating) return;
        isAnimating = true;
        const step = getStep();
        const duration = mode === 'autoplay' ? autoplayDuration : clickDuration;

        if (viewport.scrollLeft <= 2) {
          const last = track.lastElementChild;
          if (last) {
            track.insertBefore(last, track.firstChild);
            viewport.scrollLeft = viewport.scrollLeft + step;
          }
        }

        const target = Math.max(0, viewport.scrollLeft - step);
        disableSnap();
        animateTo(target, duration, () => {
          restoreSnap();
          isAnimating = false;
        });
      };

      const stopAutoplay = () => {
        if (!autoplayTimer) return;
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      };

      const startAutoplay = () => {
        if (isTouchDevice) return;
        if (getCards().length <= 1 || autoplayTimer) return;
        autoplayTimer = window.setInterval(() => {
          stepScrollRight('autoplay');
        }, autoplayInterval);
      };

      const pauseAutoplayThenResume = () => {
        stopAutoplay();
        if (autoplayResumeTimer) {
          window.clearTimeout(autoplayResumeTimer);
          autoplayResumeTimer = null;
        }
        autoplayResumeTimer = window.setTimeout(() => {
          autoplayResumeTimer = null;
          startAutoplay();
        }, autoplayResumeDelay);
      };

      const runWhenFree = (action) => {
        const run = () => {
          if (isAnimating) {
            setTimeout(run, 50);
            return;
          }
          action();
        };
        run();
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          pauseAutoplayThenResume();
          runWhenFree(() => stepScrollLeft('click'));
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          pauseAutoplayThenResume();
          runWhenFree(() => stepScrollRight('click'));
        });
      }

      viewport.addEventListener('touchstart', (event) => {
        const touch = event.changedTouches?.[0];
        if (!touch) return;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        pauseAutoplayThenResume();
      }, { passive: true });

      viewport.addEventListener('touchend', (event) => {
        const touch = event.changedTouches?.[0];
        if (!touch) return;
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        if (deltaX < 0) {
          runWhenFree(() => stepScrollRight('click'));
          return;
        }
        runWhenFree(() => stepScrollLeft('click'));
      }, { passive: true });

      const initCarousel = () => {
        viewport.scrollLeft = 0;
      };

      window.addEventListener('resize', () => {
        if (getCards().length <= 1) return;
        stopAutoplay();
        initCarousel();
        startAutoplay();
      });

      if (prevBtn) prevBtn.disabled = getCards().length <= 1;
      if (nextBtn) nextBtn.disabled = getCards().length <= 1;

      if (getCards().length > 1) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initCarousel, 100);
            startAutoplay();
          });
        } else {
          setTimeout(initCarousel, 100);
          startAutoplay();
        }
      }
    }
  }

  /* ---------- INIT ---------- */
  handleScroll();

})();
