(() => {
  (function() {
    function openModal(id) {
      var modal = document.getElementById(id);
      if (!modal) return;
      modal.classList.add("ug-modal--open");
      document.body.classList.add("ug-modal-open");
    }
    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove("ug-modal--open");
      if (!document.querySelector(".ug-modal--open")) {
        document.body.classList.remove("ug-modal-open");
      }
    }
    function closeAllModals() {
      document.querySelectorAll(".ug-modal--open").forEach(function(m) {
        m.classList.remove("ug-modal--open");
      });
      document.body.classList.remove("ug-modal-open");
    }
    function init() {
      document.addEventListener("click", function(e) {
        var openTrigger = e.target.closest("[data-ug-modal-open]");
        if (openTrigger) {
          e.preventDefault();
          openModal(openTrigger.getAttribute("data-ug-modal-open"));
          return;
        }
        var closeTrigger = e.target.closest("[data-ug-modal-close]");
        if (closeTrigger) {
          e.preventDefault();
          var modal = closeTrigger.closest(".ug-modal");
          closeModal(modal);
        }
      });
      document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
          closeAllModals();
        }
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
})();
