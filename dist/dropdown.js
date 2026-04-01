(() => {
  (function() {
    function init() {
      document.addEventListener("click", function(e) {
        var trigger = e.target.closest(".ug-dropdown__trigger");
        document.querySelectorAll(".ug-dropdown--open").forEach(function(dd) {
          if (!trigger || dd !== trigger.closest(".ug-dropdown")) {
            dd.classList.remove("ug-dropdown--open");
          }
        });
        if (trigger) {
          var dropdown = trigger.closest(".ug-dropdown");
          if (dropdown) {
            dropdown.classList.toggle("ug-dropdown--open");
          }
        }
      });
      document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
          document.querySelectorAll(".ug-dropdown--open").forEach(function(dd) {
            dd.classList.remove("ug-dropdown--open");
          });
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
