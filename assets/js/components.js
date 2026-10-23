/* ==========================================================================
   Elite Auto Spa — components.js
   Before/after slider, animated stat counters. Progressive enhancement:
   without JS the slider shows the "after" image and stats show final values.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------
     1. Before / after slider. The range input drives --pos; it is the
        real control, so keyboard, touch, and screen readers just work.
  ---------------------------------------------------------------- */
  document.querySelectorAll("[data-compare]").forEach(function (box) {
    var range = box.querySelector("input[type='range']");
    if (!range) return;

    function update() {
      box.style.setProperty("--pos", range.value + "%");
      range.setAttribute("aria-valuetext", range.value + "% after photo shown");
    }
    range.addEventListener("input", update);
    update();

    // One-time hint nudge when first scrolled into view.
    if (!reduceMotion && "IntersectionObserver" in window) {
      var hinted = false;
      new IntersectionObserver(function (entries, obs) {
        if (hinted || !entries[0].isIntersecting) return;
        hinted = true;
        obs.disconnect();
        box.classList.add("is-hinting");
        window.setTimeout(function () { box.classList.remove("is-hinting"); }, 1600);
      }, { threshold: 0.6 }).observe(box);
    }
  });

  /* ----------------------------------------------------------------
     2. Count-up numbers: <span data-count-to="6421" data-suffix="+">
  ---------------------------------------------------------------- */
  var counters = document.querySelectorAll("[data-count-to]");

  function format(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function setFinal(el) {
    el.textContent = format(Number(el.getAttribute("data-count-to"))) + (el.getAttribute("data-suffix") || "");
  }

  function run(el) {
    var target = Number(el.getAttribute("data-count-to"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(target * eased) + suffix;
      if (t < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach(setFinal);
  } else {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) {
      el.textContent = "0" + (el.getAttribute("data-suffix") || "");
      counterObserver.observe(el);
    });
  }
})();
