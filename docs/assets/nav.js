/* Matchwork mobile menu (PRD 3.4): close the details.mw-menu panel on link tap,
   outside tap (including the scrim) and scroll; keep aria-expanded in sync. ES5, no deps. */
(function () {
  function init() {
    var menu = document.querySelector('details.mw-menu');
    if (!menu) { return; }
    var summary = menu.querySelector('summary');
    var openedAt = 0;
    function sync() {
      if (summary) { summary.setAttribute('aria-expanded', menu.open ? 'true' : 'false'); }
      if (menu.open) { openedAt = window.pageYOffset || document.documentElement.scrollTop || 0; }
    }
    sync();
    menu.addEventListener('toggle', sync);
    document.addEventListener('click', function (e) {
      if (!menu.open) { return; }
      var t = e.target;
      // A tap on the scrim (details::before) targets the details element itself.
      if (t === menu || !menu.contains(t)) { menu.open = false; return; }
      while (t && t !== menu) {
        if (t.tagName === 'A') { menu.open = false; return; }
        t = t.parentNode;
      }
    });
    window.addEventListener('scroll', function () {
      if (!menu.open) { return; }
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (Math.abs(y - openedAt) > 50) { menu.open = false; }
    }, { passive: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
