// nav.js - small script to toggle mobile nav
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('mobileToggle');
  const body = document.body;
  const links = Array.from(document.querySelectorAll('.nav-links a, .mobile-nav a'));

  // default closed
  body.classList.remove('mobile-menu-open');
  body.classList.add('mobile-menu-closed');

  toggle && toggle.addEventListener('click', function () {
    const open = body.classList.contains('mobile-menu-open');
    body.classList.toggle('mobile-menu-open', !open);
    body.classList.toggle('mobile-menu-closed', open);
    // toggle aria-expanded
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
  });

  // Close mobile menu when clicking a nav link (for single page navigation feel)
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (body.classList.contains('mobile-menu-open')) {
        body.classList.remove('mobile-menu-open');
        body.classList.add('mobile-menu-closed');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
