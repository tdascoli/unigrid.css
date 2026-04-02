/**
 * Unigrid Modal
 *
 * Opens/closes modals via data attributes.
 * Closes on backdrop click, close button, or Escape key.
 * Locks body scroll when open.
 *
 * Usage:
 *   <button data-ug-modal-open="my-modal">Open</button>
 *
 *   <div class="ug-modal" id="my-modal">
 *     <div class="ug-modal__backdrop" data-ug-modal-close></div>
 *     <div class="ug-modal__dialog">
 *       <div class="ug-modal__header">
 *         <h3 class="ug-modal__title">Title</h3>
 *         <button class="ug-modal__close" data-ug-modal-close>&times;</button>
 *       </div>
 *       <div class="ug-modal__body">Content</div>
 *       <div class="ug-modal__footer">
 *         <button class="ug-btn" data-ug-modal-close>Close</button>
 *       </div>
 *     </div>
 *   </div>
 */
(function () {
  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('ug-modal--open');
    document.body.classList.add('ug-modal-open');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('ug-modal--open');
    // Only unlock body if no other modals are open
    if (!document.querySelector('.ug-modal--open')) {
      document.body.classList.remove('ug-modal-open');
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.ug-modal--open').forEach(function (m) {
      m.classList.remove('ug-modal--open');
    });
    document.body.classList.remove('ug-modal-open');
  }

  function init() {
    // Open triggers
    document.addEventListener('click', function (e) {
      var openTrigger = e.target.closest('[data-ug-modal-open]');
      if (openTrigger) {
        e.preventDefault();
        openModal(openTrigger.getAttribute('data-ug-modal-open'));
        return;
      }

      // Close triggers
      var closeTrigger = e.target.closest('[data-ug-modal-close]');
      if (closeTrigger) {
        e.preventDefault();
        var modal = closeTrigger.closest('.ug-modal');
        closeModal(modal);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
