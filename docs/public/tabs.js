(() => {
  (function() {
    function init() {
      document.addEventListener("click", function(e) {
        var link = e.target.closest("[data-ug-tab]");
        if (!link) return;
        var tabs = link.closest(".ug-tabs");
        if (!tabs) return;
        var target = link.getAttribute("data-ug-tab");
        tabs.querySelectorAll(".ug-tabs__link").forEach(function(l) {
          l.classList.remove("ug-tabs__link--active");
        });
        tabs.querySelectorAll(".ug-tabs__panel").forEach(function(p) {
          p.classList.remove("ug-tabs__panel--active");
        });
        link.classList.add("ug-tabs__link--active");
        var panel = tabs.querySelector('[data-ug-panel="' + target + '"]');
        if (panel) {
          panel.classList.add("ug-tabs__panel--active");
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
