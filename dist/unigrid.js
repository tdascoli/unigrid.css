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
          if (dd.closest(".docs-example__preview")) return;
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

  // src/js/modal.js
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

  // src/js/icons.js
  var ugIcons = [
    {
      name: "github",
      viewBox: "0 0 24 24",
      svg: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>'
    },
    {
      name: "npm",
      viewBox: "0 0 24 24",
      svg: '<path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/>'
    },
    {
      name: "bootstrap",
      viewBox: "0 0 24 24",
      svg: '<path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186C2.602 3.636 3.615 2.438 4.985 2.438h14.032c1.37 0 2.382 1.198 2.337 2.498-.043 1.249.013 2.867.42 4.186.408 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z"/>'
    }
  ];
  if (typeof window !== "undefined") {
    window.ugIcons = ugIcons;
  }
  function initIcons() {
    if (typeof document === "undefined") return;
    var existing = document.getElementById("ug-icon-sprite");
    if (existing) existing.remove();
    var ns = "http://www.w3.org/2000/svg";
    var sprite = document.createElementNS(ns, "svg");
    sprite.setAttribute("id", "ug-icon-sprite");
    sprite.setAttribute("xmlns", ns);
    sprite.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
    sprite.setAttribute("aria-hidden", "true");
    for (var i = 0; i < ugIcons.length; i++) {
      var icon = ugIcons[i];
      var symbol = document.createElementNS(ns, "symbol");
      symbol.setAttribute("id", "ug-icon-" + icon.name);
      symbol.setAttribute("viewBox", icon.viewBox || "0 0 24 24");
      symbol.innerHTML = icon.svg;
      sprite.appendChild(symbol);
    }
    document.body.insertBefore(sprite, document.body.firstChild);
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initIcons);
    } else {
      initIcons();
    }
  }
})();
