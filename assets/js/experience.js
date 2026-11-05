/* Dependency-free enhancement. No network requests, storage, or form changes. */
(function () {
  "use strict";
  var shades = [70, 50, 35, 20, 5];
  var opacity = [0.12, 0.32, 0.53, 0.72, 0.91];
  var descriptions = [
    "The lightest shade in this visual comparison.",
    "A lighter shade with a subtle change in appearance.",
    "A middle shade in this visual comparison.",
    "A darker appearance in this visual comparison.",
    "The darkest shade in this visual comparison."
  ];

  document.querySelectorAll("[data-tint-studio]").forEach(function (studio) {
    var vehicleControls = studio.querySelector("[data-vehicle-controls]");
    var customize = studio.querySelector("[data-customize-controls]");
    var range = studio.querySelector("[data-tint-range]");
    var shadeRadios = studio.querySelectorAll("[data-shade-option]");
    var vehicleRadios = studio.querySelectorAll("[data-vehicle-option]");
    var wrapRadios = studio.querySelectorAll("[data-wrap-option]");
    var finishRadios = studio.querySelectorAll("[data-finish-option]");
    var coverageRadios = studio.querySelectorAll("[data-coverage-option]");
    var number = studio.querySelector("[data-tint-number]");
    var description = studio.querySelector("[data-tint-description]");
    var label = studio.querySelector("[data-tint-image-label]");
    var status = studio.querySelector("[data-tint-status]");
    var compare = studio.querySelector("[data-tint-compare]");
    var reset = studio.querySelector("[data-tint-reset]");
    var summary = studio.querySelector("[data-design-summary]");
    var copyStatus = studio.querySelector("[data-copy-status]");
    var vehicleNames = { sedan: "Sedan", coupe: "Coupe", suv: "SUV", pickup: "Pickup" };
    var selectedVehicle = null;
    var selected = 2;
    var color = "original";
    var finish = "gloss";
    var coverage = "none";
    var comparing = false;
    var announcement;
    var renderVersion = 0;
    if (!vehicleControls || !customize || !range || !number || !compare || !reset || !summary) return;

    function announce(text) {
      clearTimeout(announcement);
      announcement = setTimeout(function () { status.textContent = text; }, 120);
    }
    function render(shouldAnnounce) {
      renderVersion++;
      var vlt = shades[selected];
      var selectedColor = Array.from(wrapRadios).find(function (radio) { return radio.value === color; });
      var paint = selectedColor ? selectedColor.dataset.paint : "#7892ac";
      var colorName = selectedColor ? selectedColor.dataset.colorName : "Original graphite";
      studio.classList.toggle("has-vehicle", Boolean(selectedVehicle));
      studio.style.setProperty("--vehicle-tint-opacity", comparing ? "0" : String(opacity[selected]));
      studio.style.setProperty("--vehicle-paint", comparing ? "#7892ac" : paint);
      studio.style.setProperty("--vehicle-finish-opacity", !comparing && color !== "original" && finish === "satin" ? ".2" : ".85");
      studio.dataset.coverage = comparing ? "none" : coverage;
      studio.querySelectorAll("[data-vehicle-scene]").forEach(function (scene) { scene.toggleAttribute("hidden", scene.dataset.vehicleScene !== selectedVehicle); });
      studio.querySelector("[data-vehicle-empty]").hidden = Boolean(selectedVehicle);
      studio.querySelector("[data-vehicle-label]").textContent = selectedVehicle ? vehicleNames[selectedVehicle] + " concept" : "Choose your vehicle";
      customize.disabled = !selectedVehicle;
      compare.disabled = !selectedVehicle;
      reset.disabled = !selectedVehicle;
      summary.hidden = !selectedVehicle;
      number.replaceChildren(document.createTextNode(String(vlt)), Object.assign(document.createElement("span"), { textContent: "%" }));
      description.textContent = descriptions[selected];
      range.value = String(selected);
      range.setAttribute("aria-valuetext", vlt + " percent VLT, illustrative shade");
      shadeRadios.forEach(function (radio) { radio.checked = Number(radio.value) === vlt; });
      vehicleRadios.forEach(function (radio) { radio.checked = radio.value === selectedVehicle; });
      wrapRadios.forEach(function (radio) { radio.checked = radio.value === color; });
      finishRadios.forEach(function (radio) { radio.checked = radio.value === finish; });
      coverageRadios.forEach(function (radio) { radio.checked = radio.value === coverage; });
      studio.querySelector("[data-finish-controls]").disabled = color === "original";
      studio.querySelector("[data-finish-note]").textContent = color === "original" ? "Choose a wrap color to compare finishes. Colors are concepts, not a stocked-film catalog." : "Color and sheen are illustrative. Compare physical film samples for the actual finish and availability.";
      compare.setAttribute("aria-pressed", String(comparing));
      compare.textContent = comparing ? "Return to your design" : "Compare original";
      label.textContent = !selectedVehicle ? "Select a body style above" : comparing ? "Original concept · no customization overlays" : vlt + "% VLT · illustrative shade";
      studio.querySelector("[data-paint-label]").textContent = comparing ? "Original graphite" : colorName;
      studio.querySelector("[data-summary-vehicle]").textContent = selectedVehicle ? vehicleNames[selectedVehicle] + " concept" : "—";
      studio.querySelector("[data-summary-tint]").textContent = vlt + "% illustration";
      studio.querySelector("[data-summary-wrap]").textContent = color === "original" ? "No wrap preview" : colorName + " · " + (finish === "satin" ? "Satin" : "Gloss");
      studio.querySelector("[data-summary-coverage]").textContent = coverage === "none" ? "No coverage guide" : coverage === "front" ? "Front-body guide" : "Full-body guide";
      copyStatus.textContent = "";
      if (shouldAnnounce && selectedVehicle) announce(comparing ? "Showing the original concept illustration without customization overlays." : vehicleNames[selectedVehicle] + ", " + vlt + " percent tint illustration, " + (color === "original" ? "original graphite" : colorName + " " + finish) + ", " + (coverage === "none" ? "no PPF guide" : coverage + " body PPF guide") + ".");
    }
    function select(index) {
      if (!selectedVehicle) return;
      selected = Math.max(0, Math.min(shades.length - 1, index));
      comparing = false;
      render(true);
    }
    vehicleRadios.forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (!vehicleNames[radio.value]) return;
        selectedVehicle = radio.value;
        comparing = false;
        render(false);
        announce(vehicleNames[selectedVehicle] + " selected. Tint, wrap, and PPF controls are available below.");
      });
    });
    range.addEventListener("input", function () { select(Number(range.value)); });
    shadeRadios.forEach(function (radio) { radio.addEventListener("change", function () { select(shades.indexOf(Number(radio.value))); }); });
    wrapRadios.forEach(function (radio) { radio.addEventListener("change", function () { if (!selectedVehicle) return; color = radio.value; comparing = false; if (color === "original") finish = "gloss"; render(true); }); });
    finishRadios.forEach(function (radio) { radio.addEventListener("change", function () { if (!selectedVehicle || color === "original") return; finish = radio.value; comparing = false; render(true); }); });
    coverageRadios.forEach(function (radio) { radio.addEventListener("change", function () { if (!selectedVehicle) return; coverage = radio.value; comparing = false; render(true); }); });
    compare.addEventListener("click", function () { if (!selectedVehicle) return; comparing = !comparing; render(true); });
    reset.addEventListener("click", function () { if (!selectedVehicle) return; selected = 2; color = "original"; finish = "gloss"; coverage = "none"; comparing = false; render(true); });

    var tabs = Array.from(studio.querySelectorAll("[data-studio-tab]"));
    function openTab(tab, focus) {
      tabs.forEach(function (button) { var active = button === tab; button.setAttribute("aria-selected", String(active)); button.tabIndex = active ? 0 : -1; });
      studio.querySelectorAll("[data-studio-panel]").forEach(function (panel) { panel.hidden = panel.dataset.studioPanel !== tab.dataset.studioTab; });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { if (selectedVehicle) openTab(tab, false); });
      tab.addEventListener("keydown", function (event) {
        if (!selectedVehicle || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        var next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (i + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
        openTab(tabs[next], true);
      });
    });
    studio.querySelector("[data-copy-design]").addEventListener("click", async function (event) {
      if (!selectedVehicle) return;
      var button = event.currentTarget;
      var versionAtCopy = renderVersion;
      button.disabled = true;
      var lines = ["Elite Auto Spa · illustrative design", "Vehicle: " + studio.querySelector("[data-summary-vehicle]").textContent, "Tint: " + studio.querySelector("[data-summary-tint]").textContent, "Wrap: " + studio.querySelector("[data-summary-wrap]").textContent, "PPF: " + studio.querySelector("[data-summary-coverage]").textContent, "Concept only. Confirm exact vehicle, legal tint, film samples, availability, coverage, and price with the shop."];
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(lines.join("\n"));
        copyStatus.textContent = versionAtCopy === renderVersion ? "Selections copied. Nothing was sent to the shop." : "Earlier selections copied. Copy again for your current design.";
      } catch (_) { copyStatus.textContent = "Copy is unavailable here. Your selections are listed above for you to copy manually."; } finally { button.disabled = false; }
    });
    vehicleControls.disabled = false;
    render(false);
  });

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var smallScreen = window.matchMedia("(max-width: 760px)");
  var shortScreen = window.matchMedia("(max-height: 620px)");
  document.querySelectorAll("[data-experience-film]").forEach(function (film) {
    var enabled = false;
    var visible = true;
    var pending = false;
    var chapters = film.querySelectorAll("[data-film-chapter]");
    var index = film.querySelector("[data-film-index]");
    function clamp(n) { return Math.max(0, Math.min(1, n)); }
    function draw() {
      pending = false;
      if (!enabled || !visible) return;
      var rect = film.getBoundingClientRect();
      var progress = clamp(-rect.top / Math.max(1, film.offsetHeight - window.innerHeight));
      var reveal = clamp((progress - 0.19) / 0.43);
      var phase = progress < 0.34 ? 0 : progress < 0.72 ? 1 : 2;
      film.style.setProperty("--film-progress", progress.toFixed(4));
      film.style.setProperty("--film-scale", (1.02 + progress * 0.1).toFixed(4));
      film.style.setProperty("--film-second-scale", (1.08 - reveal * 0.08).toFixed(4));
      film.style.setProperty("--film-reveal", reveal.toFixed(4));
      film.style.setProperty("--film-beam", (reveal * 100).toFixed(2) + "%");
      film.style.setProperty("--film-beam-opacity", reveal > 0 && reveal < 1 ? ".7" : "0");
      film.style.setProperty("--tint-opacity", (0.12 + clamp((progress - 0.5) / 0.5) * 0.6).toFixed(4));
      index.textContent = "0" + (phase + 1);
      chapters.forEach(function (chapter, i) { chapter.classList.toggle("is-active", i === phase); });
    }
    function schedule() {
      if (!pending && enabled && visible) { pending = true; requestAnimationFrame(draw); }
    }
    function configure() {
      enabled = !reducedMotion.matches && !smallScreen.matches && !shortScreen.matches;
      film.classList.toggle("is-motion-enabled", enabled);
      if (!enabled) {
        film.removeAttribute("style");
        index.textContent = "03";
        chapters.forEach(function (chapter, i) { chapter.classList.toggle("is-active", i === 2); });
      } else { schedule(); }
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reducedMotion.addEventListener("change", configure);
    smallScreen.addEventListener("change", configure);
    shortScreen.addEventListener("change", configure);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) schedule();
      }, { rootMargin: "100px" }).observe(film);
    }
    configure();
  });
})();
