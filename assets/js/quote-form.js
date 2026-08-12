/* ==========================================================================
   Elite Auto Spa — quote-form.js
   Multi-step, accessible quote request form with client-side validation
   and a configurable fetch() POST submission.
   --------------------------------------------------------------------------
   IMPORTANT: Client-side validation is a UX convenience ONLY.
   Server-side validation, sanitization, and spam protection are MANDATORY.
   See README.md for the required backend responsibilities.
   ========================================================================== */

(function () {
  "use strict";

  /* =====================================================================
     CONFIG — change these values to point at your backend / automation.
     Do NOT place API keys or secrets in this front-end file. Send the
     request to a server endpoint (or automation webhook) that holds the
     secret and performs server-side validation + spam filtering.
  ===================================================================== */
  var CONFIG = {
    // Default: your own server route that validates + forwards the lead.
    endpoint: "/api/quote",

    // ---- Alternative endpoints (uncomment ONE and update the URL) --------
    // Zapier Catch Hook:
    // endpoint: "https://hooks.zapier.com/hooks/catch/XXXXXXX/XXXXXXX/",
    //
    // Make.com (Integromat) custom webhook:
    // endpoint: "https://hook.us1.make.com/XXXXXXXXXXXXXXXXXXXX",
    //
    // GoHighLevel inbound webhook:
    // endpoint: "https://services.leadconnectorhq.com/hooks/XXXX/webhook-trigger/XXXX",
    //
    // HubSpot Forms API (server-proxied recommended):
    // endpoint: "/api/hubspot-quote",
    // ----------------------------------------------------------------------

    method: "POST",
    // Set to false if your endpoint expects multipart/form-data (file upload).
    sendAsJson: true,
    // Minimum ms the honeypot expects the form to be open (bot heuristic).
    minFillTimeMs: 2500
  };

  var form = document.querySelector("[data-quote-form]");
  if (!form) return;

  var steps = Array.prototype.slice.call(
    form.querySelectorAll("[data-step]")
  );
  var progressItems = Array.prototype.slice.call(
    form.querySelectorAll("[data-progress] li")
  );
  var btnNext = form.querySelector("[data-next]");
  var btnPrev = form.querySelector("[data-prev]");
  var btnSubmit = form.querySelector("[data-submit]");
  var statusEl = form.querySelector("[data-form-status]");
  var stepLabel = form.querySelector("[data-step-label]");
  var honeypot = form.querySelector("[data-honeypot]");

  var current = 0;
  var openedAt = Date.now();

  var stepNames = ["Service", "Vehicle", "Contact", "Consent"];

  /* ------------------------------------------------------------------ */
  /* Step navigation                                                     */
  /* ------------------------------------------------------------------ */
  function showStep(index) {
    current = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i === current);
      step.setAttribute("aria-hidden", String(i !== current));
    });

    progressItems.forEach(function (item, i) {
      var state = i < current ? "done" : i === current ? "active" : "todo";
      item.setAttribute("data-state", state);
    });

    if (stepLabel) {
      stepLabel.textContent =
        "Step " + (current + 1) + " of " + steps.length + " — " +
        stepNames[current];
    }

    // Toggle nav buttons
    if (btnPrev) btnPrev.style.visibility = current === 0 ? "hidden" : "visible";
    if (btnNext) btnNext.hidden = current === steps.length - 1;
    if (btnSubmit) btnSubmit.hidden = current !== steps.length - 1;

    // Move focus to the step heading for screen readers
    var heading = steps[current].querySelector("h3, [data-step-heading]");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Validation                                                          */
  /* ------------------------------------------------------------------ */
  function validateField(field) {
    var input = field.querySelector(".input, .select, .textarea");
    if (!input) return true;

    var valid = true;
    var value = (input.value || "").trim();

    if (input.required && !value) {
      valid = false;
    } else if (input.type === "email" && value) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (input.type === "tel" && value) {
      // Accept 10+ digits, ignoring formatting characters
      valid = value.replace(/[^\d]/g, "").length >= 10;
    }

    field.classList.toggle("is-invalid", !valid);
    if (!valid) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
    return valid;
  }

  function validateStep(index) {
    var step = steps[index];
    // A radio group counts as required if it has data-required-group
    var groupOk = true;
    var group = step.querySelector("[data-required-group]");
    if (group) {
      var checked = group.querySelector("input:checked");
      var groupError = group.parentNode.querySelector(".error-msg");
      groupOk = !!checked;
      if (groupError) groupError.style.display = checked ? "none" : "block";
    }

    var fields = Array.prototype.slice.call(step.querySelectorAll(".field"));
    var fieldsOk = fields.reduce(function (ok, field) {
      // Consent checkbox validity handled separately
      return validateField(field) && ok;
    }, true);

    // Consent step: require the SMS/consent-agreement box only if flagged required
    var consentBox = step.querySelector("[data-consent-required]");
    var consentOk = true;
    if (consentBox) {
      consentOk = consentBox.checked;
      var consentWrap = consentBox.closest(".consent");
      if (consentWrap) {
        consentWrap.style.borderColor = consentOk ? "" : "#ff6b6b";
      }
    }

    return groupOk && fieldsOk && consentOk;
  }

  /* Live-clear invalid state as the user types */
  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("is-invalid")) {
      validateField(field);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Button wiring                                                       */
  /* ------------------------------------------------------------------ */
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      if (validateStep(current)) {
        showStep(current + 1);
      } else {
        announce("Please complete the highlighted fields to continue.", "error");
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      showStep(current - 1);
    });
  }

  /* ------------------------------------------------------------------ */
  /* File input label feedback                                           */
  /* ------------------------------------------------------------------ */
  var fileInput = form.querySelector('input[type="file"]');
  var fileLabelText = form.querySelector("[data-file-label]");
  if (fileInput && fileLabelText) {
    var defaultFileText = fileLabelText.textContent;
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files.length) {
        fileLabelText.textContent =
          fileInput.files.length === 1
            ? fileInput.files[0].name
            : fileInput.files.length + " files selected";
      } else {
        fileLabelText.textContent = defaultFileText;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Submission                                                          */
  /* ------------------------------------------------------------------ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate every step before sending
    for (var i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        showStep(i);
        announce("Please complete the highlighted fields.", "error");
        return;
      }
    }

    // Honeypot check: if filled, silently treat as spam
    if (honeypot && honeypot.value) {
      announce("Thank you. Your request has been received.", "success");
      form.reset();
      return;
    }

    // Time-based bot heuristic
    if (Date.now() - openedAt < CONFIG.minFillTimeMs) {
      // Too fast to be human — likely a bot. Fail quietly.
      announce("Thank you. Your request has been received.", "success");
      return;
    }

    submitForm();
  });

  function submitForm() {
    setLoading(true);

    var formData = new FormData(form);
    // Add metadata useful for routing/attribution
    formData.append("_page", window.location.pathname);
    formData.append("_submittedAt", new Date().toISOString());

    var fetchOptions = { method: CONFIG.method };

    if (CONFIG.sendAsJson && (!fileInput || !fileInput.files.length)) {
      var payload = {};
      formData.forEach(function (value, key) {
        payload[key] = value;
      });
      fetchOptions.headers = { "Content-Type": "application/json" };
      fetchOptions.body = JSON.stringify(payload);
    } else {
      // multipart/form-data — let the browser set the boundary header
      fetchOptions.body = formData;
    }

    fetch(CONFIG.endpoint, fetchOptions)
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function () {
        announce(
          "Thank you. Your quote request has been received. We'll reach out during business hours.",
          "success"
        );
        form.reset();
        window.setTimeout(function () { showStep(0); }, 400);
      })
      .catch(function (err) {
        // The endpoint is a placeholder by default; guide the user gracefully.
        announce(
          "We couldn't submit the form automatically. Please call (830) 431-2088 or email contact@eliteautospasa.com and we'll help right away.",
          "error"
        );
        if (window.console) console.warn("[v0] Quote submission failed:", err.message);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function setLoading(isLoading) {
    if (!btnSubmit) return;
    btnSubmit.disabled = isLoading;
    btnSubmit.dataset.originalText =
      btnSubmit.dataset.originalText || btnSubmit.textContent;
    btnSubmit.textContent = isLoading
      ? "Sending…"
      : btnSubmit.dataset.originalText;
  }

  function announce(message, type) {
    if (!statusEl) return;
    statusEl.hidden = false;
    statusEl.textContent = message;
    statusEl.className =
      "form-status " +
      (type === "success" ? "form-status--success" : "form-status--error");
    statusEl.setAttribute("role", type === "success" ? "status" : "alert");
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  // Reset the fill-timer whenever the modal is opened
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-open-quote]")) {
      openedAt = Date.now();
    }
  });

  showStep(0);
})();
