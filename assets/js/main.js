// Performance Case Study — main.js
// Loaded with defer; no IIFE, no DOMContentLoaded needed.
// ES2020+: const/let, optional chaining, arrow functions, template literals only.

// ─── 0. Non-blocking Font Load ────────────────────────────────────────────
// The media="print"/onload trick requires script-src 'unsafe-inline' in CSP.
// JS injection is the CSP-safe equivalent — same non-blocking behaviour.
(() => {
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
})();

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// ─── 1. Mobile Nav Toggle ──────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navMenu   = document.querySelector('.nav-links');

navToggle?.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isExpanded));
  navToggle.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
  navMenu?.classList.toggle('nav-links--open');
});

// Close on anchor link click (navigate to section)
navMenu?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('nav-links--open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation menu');
  });
});

// Close on Escape — return focus to toggle button (WCAG 2.5.3)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu?.classList.contains('nav-links--open')) {
    navMenu.classList.remove('nav-links--open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation menu');
    navToggle?.focus();
  }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navMenu?.classList.contains('nav-links--open') &&
    !navMenu.contains(e.target) &&
    !navToggle?.contains(e.target)
  ) {
    navMenu.classList.remove('nav-links--open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation menu');
  }
});

// ─── 2. Scroll Reveal ─────────────────────────────────────────────────────
if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    revealObserver.observe(el);
  });
} else {
  // Reduced motion: reveal immediately without animation
  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    el.classList.add('revealed');
  });
}

// ─── 3. Score Counter Animation ───────────────────────────────────────────
const animateCounter = (el) => {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1300;
  const start    = performance.now();

  const easeOutCubic = (t) => 1 - (1 - t) ** 3;

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOutCubic(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (!prefersReducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-target]').forEach((el) => {
    counterObserver.observe(el);
  });
} else {
  // Reduced motion: set final value immediately
  document.querySelectorAll('[data-target]').forEach((el) => {
    el.textContent = el.dataset.target;
  });
}

// ─── 4. SVG Gauge Animation ───────────────────────────────────────────────
const CIRCUMFERENCE = 314.16; // 2π × r(50)

const animateGauge = (arcEl) => {
  const score        = parseInt(arcEl.dataset.score, 10);
  const targetOffset = CIRCUMFERENCE * (1 - score / 100);
  const duration     = 1400;
  const start        = performance.now();

  const easeOutCubic = (t) => 1 - (1 - t) ** 3;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const current  = CIRCUMFERENCE + (targetOffset - CIRCUMFERENCE) * easeOutCubic(progress);
    arcEl.setAttribute('stroke-dashoffset', current);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (!prefersReducedMotion) {
  // Observe the parent <figure> (an HTML element) rather than the SVG <circle>
  // directly — IntersectionObserver does not reliably fire for SVG child elements
  // on iOS Safari, which is why every style/WAAPI approach appeared broken.
  const gaugeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const arcEl = entry.target.querySelector('.gauge-arc[data-score]');
          if (arcEl) animateGauge(arcEl);
          gaugeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.gauge-figure').forEach((fig) => {
    gaugeObserver.observe(fig);
  });
} else {
  // Reduced motion: set final state instantly
  document.querySelectorAll('.gauge-arc[data-score]').forEach((arcEl) => {
    arcEl.setAttribute('stroke-dashoffset', CIRCUMFERENCE * (1 - parseInt(arcEl.dataset.score, 10) / 100));
  });
}

// ─── 5. Active Nav Link via IntersectionObserver ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => { link.removeAttribute('aria-current'); });
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          activeLink?.setAttribute('aria-current', 'page');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => { sectionObserver.observe(section); });
}
