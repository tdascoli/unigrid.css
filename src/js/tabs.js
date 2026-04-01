/**
 * Unigrid Tabs
 *
 * Switches active tab link and panel on click.
 * Auto-initializes on DOMContentLoaded.
 *
 * Usage:
 *   <div class="ug-tabs" data-ug-tabs>
 *     <ul class="ug-tabs__nav">
 *       <li class="ug-tabs__item">
 *         <button class="ug-tabs__link ug-tabs__link--active" data-ug-tab="tab1">Tab 1</button>
 *       </li>
 *     </ul>
 *     <div class="ug-tabs__content">
 *       <div class="ug-tabs__panel ug-tabs__panel--active" data-ug-panel="tab1">...</div>
 *     </div>
 *   </div>
 */
(function () {
  function init() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-ug-tab]');
      if (!link) return;

      var tabs = link.closest('.ug-tabs');
      if (!tabs) return;

      var target = link.getAttribute('data-ug-tab');

      // Deactivate all links
      tabs.querySelectorAll('.ug-tabs__link').forEach(function (l) {
        l.classList.remove('ug-tabs__link--active');
      });

      // Deactivate all panels
      tabs.querySelectorAll('.ug-tabs__panel').forEach(function (p) {
        p.classList.remove('ug-tabs__panel--active');
      });

      // Activate clicked link
      link.classList.add('ug-tabs__link--active');

      // Activate matching panel
      var panel = tabs.querySelector('[data-ug-panel="' + target + '"]');
      if (panel) {
        panel.classList.add('ug-tabs__panel--active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
