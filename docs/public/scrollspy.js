/**
 * Unigrid Scrollspy
 *
 * Highlights navigation links based on which section is currently
 * visible in the viewport using IntersectionObserver.
 *
 * Usage:
 *   <nav data-ug-scrollspy>
 *     <a class="ug-scrollspy__link" href="#intro">Intro</a>
 *     <a class="ug-scrollspy__link" href="#features">Features</a>
 *   </nav>
 *
 *   <section id="intro">...</section>
 *   <section id="features">...</section>
 *
 * Options (via data attributes on [data-ug-scrollspy]):
 *   data-ug-scrollspy-offset="100"   — top offset in px (default: 100)
 *   data-ug-scrollspy-class="custom" — active class (default: ug-scrollspy__link--active)
 */
(function () {
  function init() {
    document.querySelectorAll('[data-ug-scrollspy]').forEach(function (nav) {
      var links = nav.querySelectorAll('.ug-scrollspy__link, [data-ug-spy]');
      if (!links.length) return;

      var offset = parseInt(nav.getAttribute('data-ug-scrollspy-offset') || '100', 10);
      var activeClass = nav.getAttribute('data-ug-scrollspy-class') || 'ug-scrollspy__link--active';

      // Collect target sections
      var targets = [];
      links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        var target = document.querySelector(href);
        if (target) {
          targets.push({ link: link, target: target });
        }
      });

      if (!targets.length) return;

      // Track which sections are visible
      var visibleSections = new Set();

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        // Find the first visible section (in DOM order)
        var activeId = null;
        for (var i = 0; i < targets.length; i++) {
          if (visibleSections.has(targets[i].target.id)) {
            activeId = targets[i].target.id;
            break;
          }
        }

        // Update active states
        targets.forEach(function (item) {
          if (item.target.id === activeId) {
            item.link.classList.add(activeClass);
          } else {
            item.link.classList.remove(activeClass);
          }
        });
      }, {
        rootMargin: '-' + offset + 'px 0px -50% 0px',
        threshold: 0
      });

      targets.forEach(function (item) {
        observer.observe(item.target);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
