/* ==========================================================================
   Elite Auto Spa — future.js
   The "2040" layer: scroll progress, headline split, badge tilt, live studio
   status, counters, protocol track, hero motes, cursor ring.
   Everything here is decorative progressive enhancement. No network calls,
   no storage, no tracking. Honors prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var raf = window.requestAnimationFrame.bind(window);

  /* 1. Scroll progress bar ------------------------------------------ */
  var bar = document.querySelector("[data-scroll-progress]");
  var protocol = document.querySelector("[data-protocol]");
  var scrollTick = false;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    raf(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.setProperty("--p", h > 0 ? Math.min(1, window.scrollY / h).toFixed(4) : 0);
      if (protocol) {
        var r = protocol.getBoundingClientRect();
        var fill = (window.innerHeight * 0.7 - r.top) / Math.max(1, r.height);
        protocol.style.setProperty("--fill", Math.max(0, Math.min(1, fill)).toFixed(3));
      }
      scrollTick = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* 2. Headline word split (keeps text intact for assistive tech) ---- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    if (reduce) return;
    var i = 0;
    el.querySelectorAll(".text-gradient").forEach(function (g) {
      var words = g.textContent.trim().split(/\s+/);
      g.textContent = "";
      words.forEach(function (word, idx) {
        var w = document.createElement("span");
        w.className = "w";
        w.style.setProperty("--i", i++);
        w.textContent = word;
        g.appendChild(w);
        if (idx < words.length - 1) g.appendChild(document.createTextNode(" "));
      });
    });
    el.classList.add("is-split");
  });

  /* 3. Badge tilt (pointer only) ------------------------------------ */
  var stage = document.querySelector("[data-tilt]");
  if (stage && finePointer && !reduce) {
    var badge = stage.querySelector(".badge");
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      badge.style.setProperty("--rx", (x * 16).toFixed(2) + "deg");
      badge.style.setProperty("--ry", (-y * 16).toFixed(2) + "deg");
    });
    stage.addEventListener("pointerleave", function () {
      badge.style.setProperty("--rx", "0deg");
      badge.style.setProperty("--ry", "0deg");
    });
  }

  /* 4. Live studio clock + open/closed (real hours, Central Time) ---- */
  var clocks = document.querySelectorAll("[data-clock]");
  var statuses = document.querySelectorAll("[data-open-status]");
  var chip = document.querySelector("[data-live-status]");
  function central() {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: o.weekday, h: parseInt(o.hour, 10) % 24, m: parseInt(o.minute, 10) };
    } catch (e) { return null; }
  }
  function tickClock() {
    var t = central();
    if (!t) return;
    var hh = t.h % 12 || 12;
    var label = hh + ":" + (t.m < 10 ? "0" : "") + t.m + " " + (t.h >= 12 ? "PM" : "AM") + " CT";
    var weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(t.day) !== -1;
    var open = weekday && t.h >= 9 && t.h < 17;
    clocks.forEach(function (el) { el.textContent = label; });
    statuses.forEach(function (el) { el.textContent = open ? "Open now" : "Mon–Fri 9–5"; });
    if (chip) {
      chip.setAttribute("data-state", open ? "open" : "closed");
      var txt = chip.querySelector("[data-live-text]");
      if (txt) txt.textContent = (open ? "Open now" : "Closed") + " · Boerne " + label.replace(" CT", "");
    }
  }
  if (clocks.length || statuses.length || chip) {
    tickClock();
    setInterval(tickClock, 30000);
  }

  /* 5. Counters ------------------------------------------------------ */
  var counters = document.querySelectorAll("[data-count]");
  function format(el, n) {
    var pad = parseInt(el.getAttribute("data-pad") || "0", 10);
    var s = String(Math.round(n));
    if (pad && s.length < pad) s = new Array(pad - s.length + 1).join("0") + s;
    else if (!pad) s = Math.round(n).toLocaleString("en-US");
    return s + (el.getAttribute("data-suffix") || "");
  }
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        co.unobserve(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var start = performance.now();
        var dur = 1400;
        (function step(now) {
          var p = Math.min(1, (now - start) / dur);
          el.textContent = format(el, target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf(step);
        })(start);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = format(el, 0); co.observe(el); });
  }

  /* 6. Hero motes (tiny drifting embers) ----------------------------- */
  var canvas = document.querySelector("[data-motes]");
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = 0, H = 0, motes = [], running = false, visible = true;
    var size = function () {
      var r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.floor(r.width * dpr));
      H = canvas.height = Math.max(1, Math.floor(r.height * dpr));
      var count = Math.min(70, Math.floor(r.width / 18));
      motes = [];
      for (var i = 0; i < count; i++) motes.push(spawn(true));
    };
    var spawn = function (anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 10,
        r: (0.6 + Math.random() * 1.6) * dpr,
        v: (0.15 + Math.random() * 0.45) * dpr,
        d: (Math.random() - 0.5) * 0.25 * dpr,
        red: Math.random() < 0.45,
        a: 0.25 + Math.random() * 0.6
      };
    };
    var frame = function () {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < motes.length; i++) {
        var m = motes[i];
        m.y -= m.v; m.x += m.d;
        if (m.y < -10) motes[i] = spawn(false);
        ctx.beginPath();
        ctx.fillStyle = m.red ? "rgba(255,77,77," + m.a + ")" : "rgba(220,220,220," + m.a * 0.7 + ")";
        ctx.shadowColor = m.red ? "rgba(211,47,47,0.9)" : "rgba(255,255,255,0.5)";
        ctx.shadowBlur = 8 * dpr;
        ctx.arc(m.x, m.y, m.r, 0, 6.2832);
        ctx.fill();
      }
      raf(frame);
    };
    var setRunning = function () {
      var want = visible && !document.hidden;
      if (want && !running) { running = true; raf(frame); }
      else if (!want) running = false;
    };
    size();
    window.addEventListener("resize", size, { passive: true });
    document.addEventListener("visibilitychange", setRunning);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; setRunning(); }).observe(canvas);
    }
    setRunning();
  }

  /* 7. Cursor ring (desktop pointers only; native cursor stays) ------ */
  if (finePointer && !reduce) {
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
    var tx = -100, ty = -100, cx = -100, cy = -100, moved = false;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!moved) { moved = true; ring.classList.add("is-on"); }
      var hot = e.target.closest && e.target.closest("a, button, [role=button], .card, input, select, textarea, label");
      ring.classList.toggle("is-hot", !!hot);
    }, { passive: true });
    document.addEventListener("pointerleave", function () { ring.classList.remove("is-on"); });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      ring.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      raf(loop);
    })();
  }
})();
