(() => {
  // src/js/dropdown.js
  (function() {
    function init() {
      document.addEventListener("click", function(e) {
        var trigger = e.target.closest(".ug-dropdown__trigger");
        if (trigger) {
          e.preventDefault();
        }
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

  // src/js/tabs.js
  (function() {
    function init() {
      document.addEventListener("click", function(e) {
        var link = e.target.closest("[data-ug-tab]");
        if (!link) return;
        e.preventDefault();
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

  // src/js/scrollspy.js
  (function() {
    function init() {
      document.querySelectorAll("[data-ug-scrollspy]").forEach(function(nav) {
        var links = nav.querySelectorAll(".ug-scrollspy__link, [data-ug-spy]");
        if (!links.length) return;
        var offset = parseInt(nav.getAttribute("data-ug-scrollspy-offset") || "100", 10);
        var activeClass = nav.getAttribute("data-ug-scrollspy-class") || "ug-scrollspy__link--active";
        var targets = [];
        links.forEach(function(link) {
          var href = link.getAttribute("href");
          if (!href || href.charAt(0) !== "#") return;
          var target = document.querySelector(href);
          if (target) {
            targets.push({ link, target });
          }
        });
        if (!targets.length) return;
        var visibleSections = /* @__PURE__ */ new Set();
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              visibleSections.add(entry.target.id);
            } else {
              visibleSections.delete(entry.target.id);
            }
          });
          var activeId = null;
          for (var i = 0; i < targets.length; i++) {
            if (visibleSections.has(targets[i].target.id)) {
              activeId = targets[i].target.id;
              break;
            }
          }
          targets.forEach(function(item) {
            if (item.target.id === activeId) {
              item.link.classList.add(activeClass);
            } else {
              item.link.classList.remove(activeClass);
            }
          });
        }, {
          rootMargin: "-" + offset + "px 0px -50% 0px",
          threshold: 0
        });
        targets.forEach(function(item) {
          observer.observe(item.target);
        });
      });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
})();
