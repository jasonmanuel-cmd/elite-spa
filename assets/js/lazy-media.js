/* ==========================================================================
   Elite Auto Spa — lazy-media.js
   Defers non-critical <video> hydration until the element is near the
   viewport, using IntersectionObserver. Respects prefers-reduced-motion
   and never autoplays large video on small screens by default.
   --------------------------------------------------------------------------
   Usage:
     <video data-lazy-video poster="/assets/images/hero-poster.webp"
            muted playsinline loop
            data-reduced-fallback="/assets/images/hero-poster.webp">
       <source data-src="/assets/video/hero.webm" type="video/webm">
       <source data-src="/assets/video/hero.mp4" type="video/mp4">
     </video>
   The real sources live in data-src and are only promoted to src when
   the video is about to enter the viewport.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Treat narrow screens as "mobile" — skip heavy autoplay video there.
  var isSmallScreen = window.matchMedia("(max-width: 720px)").matches;

  /* ------------------------------------------------------------------ */
  /* Lazy images: <img data-src="…" class="lazy-img">                    */
  /* Promotes data-src -> src near the viewport and fades in on load.    */
  /* ------------------------------------------------------------------ */
  var lazyImages = Array.prototype.slice.call(
    document.querySelectorAll("img[data-src]")
  );

  function hydrateImage(img) {
    if (img.dataset.hydrated === "true") return;
    img.dataset.hydrated = "true";

    function markLoaded() {
      img.classList.add("is-loaded");
    }
    if (img.complete && img.naturalWidth > 0) {
      // Already cached once src is set.
      img.addEventListener("load", markLoaded, { once: true });
    } else {
      img.addEventListener("load", markLoaded, { once: true });
      img.addEventListener("error", markLoaded, { once: true });
    }

    img.src = img.getAttribute("data-src");
    var srcset = img.getAttribute("data-srcset");
    if (srcset) img.srcset = srcset;
  }

  if (lazyImages.length) {
    if ("IntersectionObserver" in window) {
      var imgObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              hydrateImage(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "300px 0px" }
      );
      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    } else {
      lazyImages.forEach(hydrateImage);
    }
  }

  var lazyVideos = Array.prototype.slice.call(
    document.querySelectorAll("[data-lazy-video]")
  );

  if (!lazyVideos.length) return;

  function hydrateVideo(video) {
    // If the user prefers reduced motion, keep the poster image only.
    if (prefersReducedMotion) return;

    // On small screens, only hydrate when explicitly allowed.
    if (isSmallScreen && video.getAttribute("data-allow-mobile") !== "true") {
      return;
    }

    if (video.dataset.hydrated === "true") return;

    var sources = video.querySelectorAll("source[data-src]");
    sources.forEach(function (source) {
      source.src = source.getAttribute("data-src");
    });

    video.dataset.hydrated = "true";
    video.load();

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      // Autoplay may be blocked; that's fine — poster stays visible.
      playPromise.catch(function () {});
    }
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            hydrateVideo(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    lazyVideos.forEach(function (video) {
      observer.observe(video);
    });
  } else {
    // No IntersectionObserver support: hydrate immediately (non-mobile).
    lazyVideos.forEach(hydrateVideo);
  }

  /* Pause videos that scroll out of view to save CPU/battery. */
  if ("IntersectionObserver" in window) {
    var playbackObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (video.dataset.hydrated !== "true") return;
          if (entry.isIntersecting) {
            var p = video.play();
            if (p && typeof p.catch === "function") p.catch(function () {});
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    lazyVideos.forEach(function (video) {
      playbackObserver.observe(video);
    });
  }
})();
