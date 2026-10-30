// Shared behaviour for every page: mobile menu, sticky back bar offset,
// the home header turning solid past the hero, and the CrewCast video.
(function () {
  var nav = document.querySelector('nav.bar');
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.navlinks');
  var hero = document.querySelector('.hero');
  var open = false;

  // The back bar sticks just under the header, so it needs the header's height.
  function measureNav() {
    if (nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  }

  // On the home page the header is see-through over the hero, then solid.
  function updateNavBg() {
    if (!nav || !hero) return;
    var past = hero.getBoundingClientRect().bottom <= nav.offsetHeight;
    nav.style.background = past || open ? 'var(--paper)' : 'transparent';
  }

  if (btn && links) {
    btn.addEventListener('click', function () {
      open = !open;
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      var label = btn.querySelector('.menu-text');
      if (label) label.textContent = open ? 'Close' : 'Menu';
      measureNav();
      updateNavBg();
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video.autovid').forEach(function (v) {
    v.muted = true;
    if (reduce) {
      v.pause();
      v.controls = true;
    } else {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
  });

  measureNav();
  updateNavBg();

  // "Back to case studies" links to index.html#<case study>. Browsers jump there themselves,
  // but not when the password page swaps the page in, so jump again once fonts have settled.
  var target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    var jump = function () { target.scrollIntoView({ behavior: 'instant' }); };
    jump();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump);
  }

  window.addEventListener('resize', measureNav);
  window.addEventListener('scroll', updateNavBg, { passive: true });
})();
