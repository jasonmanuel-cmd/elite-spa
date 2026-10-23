/* ==========================================================================
   Elite Auto Spa — POST /api/quote  (Vercel Serverless Function)
   --------------------------------------------------------------------------
   Validates a quote request server-side and emails it to the shop via the
   Resend REST API (no npm dependencies).

   Required environment variables (Vercel → Project → Settings → Env Vars):
     RESEND_API_KEY   API key from resend.com
     LEAD_TO_EMAIL    Where leads are delivered (e.g. contact@eliteautospasa.com)
   Optional:
     LEAD_FROM_EMAIL  Verified sender, e.g. "Elite Auto Spa <leads@eliteautospasa.com>"
                      (defaults to Resend's sandbox sender, which can only
                      deliver to the Resend account owner's email)
   ========================================================================== */
"use strict";

const SERVICES = [
  "Paint Protection Film",
  "Ceramic Coating",
  "Window Tint",
  "Vinyl Wrap",
  "Mobile Detailing",
  "Paint Correction",
  "Restoration",
  "Other"
];
const VEHICLE_TYPES = [
  "Sedan", "Coupe", "SUV", "Truck", "Electric / EV",
  "Sports / Exotic", "Classic / Vintage", "Other"
];
const CONTACT_METHODS = ["Phone call", "Text message", "Email"];
const TIMEFRAMES = ["This week", "Next week", "This month", "Just researching"];

const MAX_BODY_BYTES = 20 * 1024;
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };
const hits = new Map(); // best-effort, per warm serverless instance

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

/* Trim, drop control characters (blocks header injection), cap length. */
function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);
}

function oneOf(value, allowed) {
  const v = clean(value, 60);
  return allowed.includes(v) ? v : "";
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Returns { errors, lead }. Never trusts the client's validation. */
function validate(body) {
  const lead = {
    service: oneOf(body.service, SERVICES),
    vehicleYear: clean(body.vehicle_year, 4),
    vehicleMake: clean(body.vehicle_make, 40),
    vehicleModel: clean(body.vehicle_model, 60),
    vehicleType: oneOf(body.vehicle_type, VEHICLE_TYPES),
    details: clean(body.project_details, 2000),
    name: clean(body.name, 100).replace(/[\r\n]/g, " "),
    phone: clean(body.phone, 30).replace(/[\r\n]/g, " "),
    email: clean(body.email, 120).replace(/[\r\n]/g, ""),
    contactMethod: oneOf(body.preferred_contact, CONTACT_METHODS),
    timeframe: oneOf(body.preferred_timeframe, TIMEFRAMES),
    smsConsent: body.sms_consent === "yes",
    page: clean(body._page, 120)
  };

  const errors = [];
  if (!lead.service) errors.push("service");
  if (!lead.name) errors.push("name");
  if (lead.phone.replace(/\D/g, "").length < 10) errors.push("phone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push("email");
  if (lead.vehicleYear && !/^\d{4}$/.test(lead.vehicleYear)) errors.push("vehicle_year");
  return { errors, lead };
}

function renderEmail(lead) {
  const vehicle =
    [lead.vehicleYear, lead.vehicleMake, lead.vehicleModel].filter(Boolean).join(" ") || "—";
  const rows = [
    ["Service", lead.service],
    ["Vehicle", vehicle],
    ["Vehicle type", lead.vehicleType || "—"],
    ["Name", lead.name],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Preferred contact", lead.contactMethod || "No preference"],
    ["Timeframe", lead.timeframe || "Flexible"],
    ["SMS consent", lead.smsConsent ? "Yes" : "No"],
    ["Submitted from", lead.page || "—"],
    ["Details", lead.details || "—"]
  ];
  const html =
    `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="vertical-align:top"><strong>${escapeHtml(k)}</strong></td>` +
          `<td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`
      )
      .join("") +
    `</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { html, text };
}

async function sendEmail(lead) {
  const { html, text } = renderEmail(lead);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM_EMAIL || "Elite Auto Spa Leads <onboarding@resend.dev>",
      to: [process.env.LEAD_TO_EMAIL],
      reply_to: lead.email,
      subject: `New quote request: ${lead.service} — ${lead.name}`,
      html,
      text
    })
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}

function reply(res, status, payload) {
  res.status(status).setHeader("Cache-Control", "no-store").json(payload);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(res, 405, { ok: false, error: "Method not allowed" });
  }

  const type = String(req.headers["content-type"] || "");
  if (!type.includes("application/json")) {
    return reply(res, 415, { ok: false, error: "Send JSON" });
  }
  if (Number(req.headers["content-length"] || 0) > MAX_BODY_BYTES) {
    return reply(res, 413, { ok: false, error: "Request too large" });
  }

  const body = req.body && typeof req.body === "object" ? req.body : null;
  if (!body || Array.isArray(body)) {
    return reply(res, 400, { ok: false, error: "Invalid request body" });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (clean(body.company_website, 200)) return reply(res, 200, { ok: true });

  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (isRateLimited(forwarded || "unknown")) {
    return reply(res, 429, { ok: false, error: "Too many requests. Please call us instead." });
  }

  const { errors, lead } = validate(body);
  if (errors.length) {
    return reply(res, 400, { ok: false, error: "Invalid fields", fields: errors });
  }

  if (!process.env.RESEND_API_KEY || !process.env.LEAD_TO_EMAIL) {
    console.error("[quote] RESEND_API_KEY / LEAD_TO_EMAIL not configured");
    return reply(res, 503, { ok: false, error: "Quote delivery not configured" });
  }

  try {
    await sendEmail(lead);
    return reply(res, 200, { ok: true });
  } catch (err) {
    console.error("[quote] delivery failed:", err.message);
    return reply(res, 502, { ok: false, error: "Could not deliver request" });
  }
};
