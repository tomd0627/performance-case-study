// BlueMorning Coffee — after-app.js
// Vanilla JS equivalent of the before page's jQuery usage.
// Loaded with defer — runs after HTML parses, never blocks the main thread.
// No jQuery, no external dependencies. Total size: < 1KB.

// ─── Mobile Nav Toggle ────────────────────────────────────────────────────────
const navToggle  = document.querySelector('.nav-toggle');
const headerNav  = document.querySelector('.header-nav');

const closeNav = () => {
  headerNav?.classList.remove('header-nav--open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open navigation menu');
};

navToggle?.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isExpanded));
  navToggle.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
  headerNav?.classList.toggle('header-nav--open');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && headerNav?.classList.contains('header-nav--open')) {
    closeNav();
    navToggle?.focus();
  }
});

document.addEventListener('click', (e) => {
  if (
    headerNav?.classList.contains('header-nav--open') &&
    !headerNav.contains(e.target) &&
    !navToggle?.contains(e.target)
  ) { closeNav(); }
});

headerNav?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', closeNav);
});

// ─── Nav scroll shadow — replaces the jQuery scroll handler from the before page.
// Uses IntersectionObserver instead of a scroll event listener,
// which avoids continuous main-thread work during scroll.
const headerSentinel = document.createElement('div');
headerSentinel.setAttribute('aria-hidden', 'true');
headerSentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
document.body.prepend(headerSentinel);

const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  const sentinelObserver = new IntersectionObserver(
    ([entry]) => {
      siteHeader.classList.toggle('header--scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  sentinelObserver.observe(headerSentinel);
}

// Nav hover highlight — replaces the jQuery $.hover() from the before page.
// This is what CSS :hover exists for, but demonstrated here for direct comparison.
// In the after page, this is handled purely by CSS; the JS below is kept
// only to illustrate the vanilla equivalent mentioned in the case study.
//
// Note: the actual hover styling in this demo is handled by CSS.
// document.querySelectorAll('nav a').forEach((link) => {
//   link.addEventListener('mouseenter', () => (link.style.color = '#F5A623'));
//   link.addEventListener('mouseleave', () => link.style.removeProperty('color'));
// });

// Form: prevent default submission (demo only — no server endpoint)
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  if (btn) {
    btn.textContent = 'Sent!';
    btn.disabled = true;
    btn.style.opacity = '0.7';
  }
});
