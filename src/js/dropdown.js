/**
 * Unigrid Dropdown
 *
 * Toggles .ug-dropdown--open on click.
 * Closes all dropdowns when clicking outside.
 * Auto-initializes on DOMContentLoaded.
 */
(function () {
  function init() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.ug-dropdown__trigger');

      if (trigger) {
        e.preventDefault();
      }

      // Close all other dropdowns (skip those inside .docs-example__preview)
      document.querySelectorAll('.ug-dropdown--open').forEach(function (dd) {
        if (dd.closest('.docs-example__preview')) return;
        if (!trigger || dd !== trigger.closest('.ug-dropdown')) {
          dd.classList.remove('ug-dropdown--open');
        }
      });

      // Toggle clicked dropdown
      if (trigger) {
        var dropdown = trigger.closest('.ug-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('ug-dropdown--open');
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.ug-dropdown--open').forEach(function (dd) {
          dd.classList.remove('ug-dropdown--open');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
