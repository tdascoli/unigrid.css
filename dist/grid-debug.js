(() => {
  (function() {
    "use strict";
    var TRIGGER_ID = "ug-grid-debug";
    var STYLE_ID = "ug-grid-debug-style";
    function init() {
      var trigger = document.getElementById(TRIGGER_ID);
      if (!trigger) return;
      if (trigger.dataset.ugGridDebugMounted === "1") return;
      trigger.dataset.ugGridDebugMounted = "1";
      ensureLeadingVar();
      injectStyles();
      mountToolbar();
    }
    function ensureLeadingVar() {
      var root = document.documentElement;
      var current = getComputedStyle(root).getPropertyValue("--ug-leading").trim();
      if (!current) {
        root.style.setProperty("--ug-leading", "1.625rem");
      }
    }
    function injectStyles() {
      if (document.getElementById(STYLE_ID)) return;
      var css = [
        ".ug-gd-toolbar{position:fixed;bottom:16px;right:16px;z-index:100000;",
        "display:flex;gap:4px;padding:4px;background:#1a1a1a;color:#fff;",
        "font:700 11px/1 Inter,system-ui,sans-serif;letter-spacing:.05em;",
        "text-transform:uppercase;box-shadow:0 2px 12px rgba(0,0,0,.3)}",
        ".ug-gd-toolbar__btn{background:none;border:1px solid rgba(255,255,255,.3);",
        "color:inherit;padding:6px 10px;cursor:pointer;font:inherit;",
        "letter-spacing:inherit;text-transform:inherit}",
        ".ug-gd-toolbar__btn:hover{background:rgba(255,255,255,.1)}",
        ".ug-gd-toolbar__btn--active{background:#fff;color:#1a1a1a;border-color:#fff}",
        // Horizontal rhythm overlay
        ".ug-gd-hgrid{position:absolute;top:0;left:0;right:0;pointer-events:none;",
        "z-index:99998}",
        ".ug-gd-hgrid--single{background-image:linear-gradient(to bottom,",
        "hsla(200,100%,50%,.35) 1px,transparent 1px);",
        "background-position:left top;background-repeat:repeat;",
        "background-size:100% var(--ug-leading)}",
        ".ug-gd-hgrid--double{background-image:linear-gradient(to bottom,",
        "hsla(200,100%,50%,.35) 1px,transparent 1px,",
        "transparent calc(var(--ug-leading) * .5),",
        "hsla(200,100%,50%,.18) calc(var(--ug-leading) * .5),",
        "transparent calc(var(--ug-leading) * .5 + 1px),",
        "transparent var(--ug-leading));",
        "background-position:left top;background-repeat:repeat;",
        "background-size:100% var(--ug-leading)}",
        // Vertical 12-column overlay
        ".ug-gd-vgrid{position:fixed;inset:0;pointer-events:none;z-index:99999;",
        "display:grid;grid-template-columns:repeat(12,1fr);",
        "gap:var(--ug-leading);padding:0 calc(var(--ug-leading) * 1.5)}",
        ".ug-gd-vgrid>div{background:hsla(350,80%,50%,.08);",
        "outline:1px solid hsla(350,80%,50%,.25)}",
        // Margin debug: outline children of common layout blocks
        "body.ug-gd-margins .container>*,body.ug-gd-margins .container-fluid>*,",
        "body.ug-gd-margins .row>*,body.ug-gd-margins .grid>*,",
        "body.ug-gd-margins .ug-container>*,body.ug-gd-margins .ug-grid>*,",
        "body.ug-gd-margins .ug-broadside>*,body.ug-gd-margins .ug-prose>*,",
        "body.ug-gd-margins .ug-section>*,body.ug-gd-margins main>*,",
        "body.ug-gd-margins section>*,body.ug-gd-margins article>*{",
        "outline:1px solid hsla(210,80%,60%,.5)!important;",
        "background-color:hsla(210,80%,60%,.04)!important}"
      ].join("");
      var style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = css;
      document.head.appendChild(style);
    }
    function mountToolbar() {
      var bar = document.createElement("div");
      bar.className = "ug-gd-toolbar";
      bar.appendChild(makeButton("Margins: Off", cycleMargins));
      bar.appendChild(makeButton("H-Grid: Off", cycleHGrid));
      bar.appendChild(makeButton("V-Grid: Off", cycleVGrid));
      document.body.appendChild(bar);
    }
    function makeButton(label, handler) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ug-gd-toolbar__btn";
      btn.textContent = label;
      btn.addEventListener("click", function() {
        handler(btn);
      });
      return btn;
    }
    function cycleMargins(btn) {
      var on = document.body.classList.toggle("ug-gd-margins");
      btn.textContent = on ? "Margins: On" : "Margins: Off";
      btn.classList.toggle("ug-gd-toolbar__btn--active", on);
    }
    var hgridState = 0;
    var hgridEl = null;
    var hgridObserver = null;
    function cycleHGrid(btn) {
      hgridState = (hgridState + 1) % 3;
      if (hgridState === 0) {
        removeHGrid();
        btn.textContent = "H-Grid: Off";
        btn.classList.remove("ug-gd-toolbar__btn--active");
        return;
      }
      if (!hgridEl) {
        hgridEl = document.createElement("div");
        hgridEl.className = "ug-gd-hgrid";
        document.body.appendChild(hgridEl);
        syncHGridHeight();
        if (typeof ResizeObserver !== "undefined") {
          hgridObserver = new ResizeObserver(syncHGridHeight);
          hgridObserver.observe(document.documentElement);
        }
        window.addEventListener("resize", syncHGridHeight);
      }
      hgridEl.classList.toggle("ug-gd-hgrid--single", hgridState === 1);
      hgridEl.classList.toggle("ug-gd-hgrid--double", hgridState === 2);
      btn.textContent = hgridState === 1 ? "H-Grid: Single" : "H-Grid: Double";
      btn.classList.add("ug-gd-toolbar__btn--active");
    }
    function syncHGridHeight() {
      if (!hgridEl) return;
      hgridEl.style.height = document.documentElement.scrollHeight + "px";
    }
    function removeHGrid() {
      if (hgridObserver) {
        hgridObserver.disconnect();
        hgridObserver = null;
      }
      window.removeEventListener("resize", syncHGridHeight);
      if (hgridEl) {
        hgridEl.remove();
        hgridEl = null;
      }
    }
    var vgridEl = null;
    function cycleVGrid(btn) {
      if (vgridEl) {
        vgridEl.remove();
        vgridEl = null;
        btn.textContent = "V-Grid: Off";
        btn.classList.remove("ug-gd-toolbar__btn--active");
        return;
      }
      vgridEl = document.createElement("div");
      vgridEl.className = "ug-gd-vgrid";
      for (var i = 0; i < 12; i++) vgridEl.appendChild(document.createElement("div"));
      document.body.appendChild(vgridEl);
      btn.textContent = "V-Grid: On";
      btn.classList.add("ug-gd-toolbar__btn--active");
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
})();
