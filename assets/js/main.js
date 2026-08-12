/* ==========================================================================
   Elite Auto Spa — main.js
   Handles: header scroll state, mobile navigation drawer, scroll reveal,
   quote modal open/close, current-year stamp, page-visibility pausing.
   Progressive enhancement: the site is fully usable without this file.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------------
     1. Sticky header: add a class once the user scrolls a little.
        Uses a passive listener + rAF throttle to stay cheap.
  ---------------------------------------------------------------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var ticking = false;
    var setHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
      ticking = false;
    };
    setHeaderState();
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(setHeaderState);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------------
     2. Mobile navigation drawer
  ---------------------------------------------------------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.style.removeProperty("overflow");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });

    // Close when a link inside the drawer is clicked
    mobileNav.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (link) closeMobileNav();
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
  }

  /* ----------------------------------------------------------------
     3. Scroll reveal via IntersectionObserver (opacity/transform only)
  ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ----------------------------------------------------------------
     4. Quote modal open/close + basic focus management
  ---------------------------------------------------------------- */
  var modal = document.querySelector("[data-quote-modal]");
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeMobileNav();
    // Focus the first focusable control in the dialog
    var focusable = modal.querySelector(
      "input, select, textarea, button, [tabindex]"
    );
    if (focusable) window.setTimeout(function () { focusable.focus(); }, 60);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.removeProperty("overflow");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Any element with [data-open-quote] opens the modal.
  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open-quote]");
    if (opener) {
      e.preventDefault();
      openModal();
      return;
    }
    var closer = e.target.closest("[data-close-quote]");
    if (closer) {
      e.preventDefault();
      closeModal();
    }
  });

  if (modal) {
    // Click on the backdrop (outside the dialog) closes it
    modal.addEventListener("mousedown", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
      // Simple focus trap
      if (e.key === "Tab" && modal.classList.contains("is-open")) {
        trapFocus(e);
      }
    });
  }

  function trapFocus(e) {
    var focusables = modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Expose modal controls for quote-form.js
  window.EliteQuoteModal = { open: openModal, close: closeModal, el: modal };

  /* ----------------------------------------------------------------
     5. Stamp current year in footer(s)
  ---------------------------------------------------------------- */
  var yearEls = document.querySelectorAll("[data-year]");
  var year = String(new Date().getFullYear());
  yearEls.forEach(function (el) {
    el.textContent = year;
  });

  /* ----------------------------------------------------------------
     6. Pause CSS animations when the tab is hidden (perf/battery)
  ---------------------------------------------------------------- */
  document.addEventListener("visibilitychange", function () {
    document.documentElement.style.setProperty(
      "--play-state",
      document.hidden ? "paused" : "running"
    );
    // Pause any playing videos when hidden
    if (document.hidden) {
      document.querySelectorAll("video").forEach(function (v) {
        if (!v.paused) v.pause();
      });
    }
  });
})();
