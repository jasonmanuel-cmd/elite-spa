/* ==========================================================================
   Elite Auto Spa — location, gallery, about, FAQ, contact, legal pages
   ========================================================================== */
import { SITE, breadcrumb, breadcrumbLd, businessNode } from "./partials.mjs";

const check = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;

const ctaBand = (heading) => `
    <section class="section" aria-labelledby="page-cta-title">
      <div class="container">
        <div class="cta-band reveal">
          <span class="eyebrow" style="justify-content:center">Get Started</span>
          <h2 id="page-cta-title">${heading}</h2>
          <div class="btn-row">
            <button class="btn btn--primary" type="button" data-open-quote>Start Your Quote</button>
            <a class="btn btn--ghost" href="tel:${SITE.phoneHref}">Call ${SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>`;

const serviceLinks = [
  ["Paint Protection Film", "/services/paint-protection-film.html"],
  ["Ceramic Coatings", "/services/ceramic-coatings.html"],
  ["Window Tint", "/services/window-tint.html"],
  ["Vinyl Wraps", "/services/vinyl-wraps.html"],
  ["Mobile Detailing", "/services/mobile-detailing.html"],
  ["Paint Correction", "/services/paint-correction.html"],
  ["Vehicle Restoration", "/services/vehicle-restoration.html"]
];

/* ------------------------------ LOCATIONS ------------------------------ */
function locationPage(loc) {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/#service-area" },
    { label: loc.city, href: loc.path }
  ];

  const links = serviceLinks
    .map(([l, h]) => `<a class="pill-link" href="${h}">${l} ${arrow}</a>`)
    .join("\n");

  const points = loc.points
    .map(
      (p) =>
        `<li class="reveal"><span class="tick" aria-hidden="true">${check}</span><div><strong>${p.t}</strong><p>${p.d}</p></div></li>`
    )
    .join("\n");

  const jsonld = [
    { "@context": "https://schema.org", ...businessNode },
    breadcrumbLd(trail),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: loc.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  const faqs = loc.faqs
    .map(
      (f) => `
          <details class="faq-item reveal">
            <summary>${f.q}<span class="faq-item__icon" aria-hidden="true"></span></summary>
            <div class="faq-item__body"><p>${f.a}</p></div>
          </details>`
    )
    .join("");

  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="page-hero page-hero--compact" aria-labelledby="loc-title">
      <div class="page-hero__media">
        <img src="/assets/images/showroom-interior.webp" alt="Elite Auto Spa restyling studio interior" width="1024" height="1024" loading="eager" decoding="async" />
      </div>
      <div class="container">
        <div class="page-hero__inner">
          <span class="eyebrow reveal">Serving ${loc.city}, TX</span>
          <h1 id="loc-title" class="reveal" data-delay="1">${loc.h1}</h1>
          <p class="lead reveal" data-delay="2">${loc.intro}</p>
          <div class="btn-row reveal" data-delay="3">
            <button class="btn btn--primary" type="button" data-open-quote>Get a Quote</button>
            <a class="btn btn--ghost" href="tel:${SITE.phoneHref}">Call ${SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="loc-points">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Local Service</span>
          <h2 id="loc-points">${loc.pointsHeading}</h2>
        </div>
        <ul class="benefit-list">
${points}
        </ul>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="loc-services">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">What We Offer</span>
          <h2 id="loc-services">Services available in ${loc.city}</h2>
        </div>
        <div class="pill-row reveal">
${links}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="loc-faq">
      <div class="container narrow">
        <div class="section-head reveal">
          <span class="eyebrow">${loc.city} FAQ</span>
          <h2 id="loc-faq">Questions from ${loc.city} drivers</h2>
        </div>
        <div class="faq-list">${faqs}
        </div>
      </div>
    </section>
${ctaBand(`Serving ${loc.city} and the surrounding area`)}
  </main>
`;

  return {
    out: loc.path.replace(/^\//, ""),
    title: loc.metaTitle,
    description: loc.metaDesc,
    canonical: loc.path,
    jsonld,
    main
  };
}

const LOCATIONS = [
  {
    path: "/locations/boerne-tx.html",
    city: "Boerne",
    h1: "Automotive Restyling in Boerne, TX",
    metaTitle:
      "Auto Detailing, PPF & Ceramic Coatings in Boerne, TX | Elite Auto Spa",
    metaDesc:
      "Elite Auto Spa is a premium automotive restyling showroom in Boerne, TX offering PPF, ceramic coatings, window tint, wraps, detailing, and restoration.",
    intro:
      "Our showroom is based in Boerne, in the Texas Hill Country. Bring your vehicle in for protection, restyling, and detailing performed with showroom-level care.",
    pointsHeading: "Why Boerne drivers choose Elite Auto Spa",
    points: [
      { t: "Local showroom", d: "A dedicated space in Boerne built around protection and finish quality." },
      { t: "Hill Country driving", d: "Protection options suited to the roads and sun exposure many locals face." },
      { t: "Full service range", d: "From PPF and coatings to detailing and restoration under one roof." },
      { t: "Mobile options", d: "Mobile service available for qualifying jobs, subject to on-site conditions." }
    ],
    faqs: [
      { q: "Where are you located in Boerne?", a: "We're at 108 Scheele Rd, Unit 3, Boerne, TX 78015. Call (830) 431-2088 to plan your visit." },
      { q: "Do you serve areas near Boerne?", a: "Yes. We serve Boerne and the Greater San Antonio area. Mobile service is available for qualifying jobs depending on location and conditions." },
      { q: "What are your hours?", a: "Monday–Friday 9:00 AM–5:00 PM, Saturday by appointment only, and closed Sunday." }
    ]
  },
  {
    path: "/locations/san-antonio-tx.html",
    city: "San Antonio",
    h1: "Automotive Restyling for Greater San Antonio",
    metaTitle:
      "PPF, Ceramic Coatings & Detailing for San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Elite Auto Spa serves Greater San Antonio with paint protection film, ceramic coatings, window tint, wraps, detailing, and restoration from our Boerne showroom.",
    intro:
      "We proudly serve Greater San Antonio from our Boerne showroom, with mobile service options for qualifying jobs across the metro area.",
    pointsHeading: "Serving the Greater San Antonio metro",
    points: [
      { t: "Metro coverage", d: "Serving Greater San Antonio and surrounding communities." },
      { t: "Showroom quality", d: "The same careful, finish-focused work our showroom is known for." },
      { t: "Complete services", d: "PPF, coatings, tint, wraps, detailing, correction, and restoration." },
      { t: "Mobile availability", d: "Mobile service for qualifying jobs, based on location and access." }
    ],
    faqs: [
      { q: "Do you come to San Antonio?", a: "We offer mobile service options for qualifying jobs in Greater San Antonio, subject to location and on-site conditions such as power and water access. Many services are performed at our Boerne showroom." },
      { q: "How far do you travel?", a: "Coverage depends on the service and scheduling. Contact us with your location and we'll confirm availability." },
      { q: "Can I visit the showroom?", a: "Absolutely. Our showroom is at 108 Scheele Rd, Unit 3, Boerne, TX 78015 — a short drive from much of the metro." }
    ]
  }
];

export const locationPages = LOCATIONS.map(locationPage);

/* -------------------------------- GALLERY ------------------------------- */
const galleryItems = [
  ["/assets/images/projects/ppf-detail.webp", "Paint protection film application on a glossy black hood", "Paint Protection Film"],
  ["/assets/images/projects/ceramic-coating.webp", "Water beading on a ceramic-coated surface", "Ceramic Coating"],
  ["/assets/images/projects/window-tint.webp", "Luxury sedan with freshly tinted windows", "Window Tint"],
  ["/assets/images/projects/vinyl-wrap.webp", "Pickup truck wrapped in satin color-shift vinyl", "Vinyl Wrap"],
  ["/assets/images/projects/mobile-detailing.webp", "Interior detailing of a luxury car", "Detailing"],
  ["/assets/images/projects/paint-correction.webp", "Machine polishing during paint correction", "Paint Correction"],
  ["/assets/images/projects/restoration.webp", "Restored classic car in a premium workshop", "Restoration"],
  ["/assets/images/showroom-interior.webp", "Elite Auto Spa restyling studio interior", "The Showroom"]
];

function galleryPage() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery.html" }
  ];
  const cards = galleryItems
    .map(
      ([src, alt, cap], i) => `
          <figure class="gallery-item reveal" data-delay="${i % 4}">
            <img data-src="${src}" alt="${alt}" width="1024" height="1024" loading="lazy" decoding="async" class="lazy-img" />
            <figcaption>${cap}</figcaption>
          </figure>`
    )
    .join("");

  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="section section--top" aria-labelledby="gallery-title">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Our Work</span>
          <h1 id="gallery-title">Project gallery</h1>
          <p class="lead">A selection of protection, wrap, and detailing work. Placeholder imagery shown &mdash; replace with approved project photos before launch.</p>
        </div>
        <div class="gallery-grid">${cards}
        </div>
      </div>
    </section>
${ctaBand("Like what you see? Let's talk about your vehicle.")}
  </main>
`;

  return {
    out: "gallery.html",
    title: "Project Gallery | Elite Auto Spa — Boerne & San Antonio, TX",
    description:
      "Browse a selection of paint protection film, ceramic coating, window tint, wrap, detailing, and restoration work from Elite Auto Spa in Boerne, TX.",
    canonical: "/gallery.html",
    jsonld: [breadcrumbLd(trail)],
    main
  };
}
export const galleryPageObj = galleryPage();

/* --------------------------------- ABOUT -------------------------------- */
function aboutPage() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about.html" }
  ];
  const values = [
    { t: "Finish-first", d: "We treat every vehicle like it belongs in a showroom, because to its owner, it does." },
    { t: "Straight talk", d: "Clear expectations, honest guidance, and no pressure — just the right service for your goals." },
    { t: "Careful craft", d: "Methodical prep and application because the details are what last." },
    { t: "Local roots", d: "Proud to serve Boerne and Greater San Antonio drivers and their vehicles." }
  ]
    .map(
      (v) =>
        `<li class="reveal"><span class="tick" aria-hidden="true">${check}</span><div><strong>${v.t}</strong><p>${v.d}</p></div></li>`
    )
    .join("\n");

  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="page-hero page-hero--compact" aria-labelledby="about-title">
      <div class="page-hero__media">
        <img src="/assets/images/showroom-interior.webp" alt="Interior of the Elite Auto Spa restyling studio" width="1024" height="1024" loading="eager" decoding="async" />
      </div>
      <div class="container">
        <div class="page-hero__inner">
          <span class="eyebrow reveal">About Us</span>
          <h1 id="about-title" class="reveal" data-delay="1">A showroom experience, not a car wash</h1>
          <p class="lead reveal" data-delay="2">Elite Auto Spa is a premium automotive restyling showroom in Boerne, TX, serving Greater San Antonio with protection, restyling, detailing, and restoration.</p>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="about-story">
      <div class="container narrow">
        <div class="prose reveal">
          <h2 id="about-story">Our approach</h2>
          <p>We built Elite Auto Spa around a simple idea: your vehicle deserves careful, finish-focused work in a space designed for it. From paint protection film and ceramic coatings to window tint, wraps, detailing, correction, and restoration, every service is performed with showroom-level attention.</p>
          <p>We're proud to serve Boerne and the Greater San Antonio area, with mobile service options for qualifying jobs. Whether you're protecting a new vehicle or reviving a cherished classic, we'll help you choose the right approach and set clear expectations along the way.</p>
          <p class="disclaimer"><strong>Business details:</strong> Elite Auto Spa is the DBA of Elite Mobile Detail LLC. Any statistics or claims shown on this site are business-provided and should be verified before publishing.</p>
        </div>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="about-values">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">What Guides Us</span>
          <h2 id="about-values">Our values</h2>
        </div>
        <ul class="benefit-list">
${values}
        </ul>
      </div>
    </section>
${ctaBand("Come experience the difference")}
  </main>
`;

  return {
    out: "about.html",
    title: "About Elite Auto Spa | Restyling Showroom in Boerne, TX",
    description:
      "Elite Auto Spa is a premium automotive restyling showroom in Boerne, TX serving Greater San Antonio with PPF, ceramic coatings, tint, wraps, detailing, and restoration.",
    canonical: "/about.html",
    jsonld: [
      { "@context": "https://schema.org", ...businessNode },
      breadcrumbLd(trail)
    ],
    main
  };
}
export const aboutPageObj = aboutPage();

/* ---------------------------------- FAQ --------------------------------- */
const FAQS = [
  { q: "What is paint protection film and is it worth it in Texas?", a: "Paint protection film (PPF) is a clear, durable urethane film applied over your vehicle's paint to help guard against rock chips, road debris, and minor abrasions. In Texas, where highway driving and sun exposure are common, many owners choose PPF on high-impact areas such as the hood, bumper, and mirrors to help preserve the finish." },
  { q: "How long do ceramic coatings last?", a: "Longevity depends on the specific product, the number of layers, how the vehicle is used, and how it is maintained. Manufacturers publish a range of durability estimates. We recommend confirming the expected lifespan of the specific coating we apply, along with the maintenance required to support it." },
  { q: "What is the difference between ceramic coating and PPF?", a: "Ceramic coating is a liquid polymer that cures to a hard, hydrophobic layer that makes cleaning easier and adds gloss, but it is not designed to stop rock chips. Paint protection film is a thicker physical film built to absorb impact from debris. Many owners combine both: PPF on impact zones and ceramic coating over the rest." },
  { q: "How dark can window tint legally be in Texas?", a: "Texas regulates window tint by visible light transmission (VLT) and by window position, and rules can change. Because legal limits vary and are updated periodically, please confirm current Texas tint regulations with official state sources before choosing a shade. We are happy to walk you through compliant options." },
  { q: "Do you offer mobile detailing in Boerne and San Antonio?", a: "We offer mobile service options for qualifying detailing services in Boerne and the Greater San Antonio area. Availability depends on the service, location, and on-site conditions such as power and water access. Contact us and we'll confirm whether mobile service fits your request." },
  { q: "How do I request a quote from Elite Auto Spa?", a: "Use the Get a Quote button to open our quick multi-step form, or call (830) 431-2088. Share your vehicle details and the service you're interested in, and we'll follow up during business hours." },
  { q: "What is your cancellation policy?", a: "Cancellations within 24 hours that are not rescheduled may be subject to a 25% cancellation fee. Please confirm current terms before booking." },
  { q: "Do you offer warranties?", a: "Warranty coverage depends on the specific product and service. We'll explain any applicable manufacturer or workmanship warranty for the products we recommend before you commit." },
  { q: "How should I maintain my vehicle after service?", a: "Aftercare varies by service — coatings, film, and wraps each have specific needs. We provide simple maintenance guidance so your results last as long as possible." }
];

function faqPage() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "FAQ", href: "/faq.html" }
  ];
  const items = FAQS.map(
    (f) => `
          <details class="faq-item reveal">
            <summary>${f.q}<span class="faq-item__icon" aria-hidden="true"></span></summary>
            <div class="faq-item__body"><p>${f.a}</p></div>
          </details>`
  ).join("");

  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="section section--top" aria-labelledby="faq-title">
      <div class="container narrow">
        <div class="section-head reveal">
          <span class="eyebrow">Answers</span>
          <h1 id="faq-title">Frequently asked questions</h1>
          <p class="lead">Helpful information about our services in Boerne and Greater San Antonio. Still have questions? Call ${SITE.phone}.</p>
        </div>
        <div class="faq-list">${items}
        </div>
      </div>
    </section>
${ctaBand("Didn't find your answer? Let's talk.")}
  </main>
`;

  return {
    out: "faq.html",
    title: "FAQ | Elite Auto Spa — PPF, Ceramic Coatings, Tint & More",
    description:
      "Answers to common questions about paint protection film, ceramic coatings, window tint, detailing, and more at Elite Auto Spa in Boerne & San Antonio, TX.",
    canonical: "/faq.html",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        }))
      },
      breadcrumbLd(trail)
    ],
    main
  };
}
export const faqPageObj = faqPage();

/* -------------------------------- CONTACT ------------------------------- */
function contactPage() {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact.html" }
  ];

  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="section section--top" aria-labelledby="contact-title">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Get in Touch</span>
          <h1 id="contact-title">Contact Elite Auto Spa</h1>
          <p class="lead">Call, email, or request a quote and we'll follow up during business hours.</p>
        </div>

        <div class="contact-grid">
          <div class="contact-card reveal">
            <h2>Visit the showroom</h2>
            <address>
              <strong class="legal-name">Elite Auto Spa</strong><br />
              108 Scheele Rd, Unit 3<br />
              Boerne, TX 78015
            </address>
            <p class="contact-line"><a class="btn btn--ghost" href="tel:${SITE.phoneHref}">Call ${SITE.phone}</a></p>
            <p class="contact-line"><a class="link" href="mailto:${SITE.email}">${SITE.email}</a></p>

            <h3>Hours</h3>
            <ul class="hours-list">
              <li><span>Mon&ndash;Fri</span><span>9:00 AM &ndash; 5:00 PM</span></li>
              <li><span>Saturday</span><span>By appointment</span></li>
              <li><span>Sunday</span><span>Closed</span></li>
            </ul>

            <h3>Service area</h3>
            <p>Boerne and Greater San Antonio, with mobile options for qualifying jobs.</p>
          </div>

          <div class="contact-card contact-card--cta reveal" data-delay="1">
            <h2>Request a quote</h2>
            <p>The fastest way to get started is our quick multi-step quote form. Tell us about your vehicle and the service you're interested in.</p>
            <button class="btn btn--primary btn--block" type="button" data-open-quote>Open the Quote Form</button>
            <p class="hint" style="margin-top:1rem">Prefer to talk? Call ${SITE.phone} during business hours and we'll help right away.</p>

            <div class="map-embed">
              <iframe
                title="Map showing Boerne, TX service area"
                src="https://www.google.com/maps?q=Boerne,+TX+78015&output=embed"
                loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
`;

  return {
    out: "contact.html",
    title: "Contact Elite Auto Spa | Boerne & San Antonio, TX",
    description:
      "Contact Elite Auto Spa in Boerne, TX. Call (830) 431-2088, email us, or request a quote for PPF, ceramic coatings, window tint, wraps, detailing, and restoration.",
    canonical: "/contact.html",
    jsonld: [
      { "@context": "https://schema.org", ...businessNode },
      breadcrumbLd(trail)
    ],
    main
  };
}
export const contactPageObj = contactPage();

/* --------------------------------- LEGAL -------------------------------- */
const LEGAL_UPDATED = "October 23, 2026";

function legalPage({ out, title, description, canonical, heading, body }) {
  const trail = [
    { label: "Home", href: "/" },
    { label: heading, href: canonical }
  ];
  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="section section--top" aria-labelledby="legal-title">
      <div class="container narrow">
        <div class="prose reveal">
          <h1 id="legal-title">${heading}</h1>
          <p><em>Last updated: ${LEGAL_UPDATED}</em></p>
          ${body}
        </div>
      </div>
    </section>
  </main>
`;
  return { out, title, description, canonical, jsonld: [breadcrumbLd(trail)], main };
}

export const privacyPageObj = legalPage({
  out: "privacy-policy.html",
  title: "Privacy Policy | Elite Auto Spa",
  description:
    "How Elite Auto Spa (Elite Mobile Detail LLC) collects, uses, and protects information submitted through this website.",
  canonical: "/privacy-policy.html",
  heading: "Privacy Policy",
  body: `
          <p>Elite Auto Spa (“we,” “us,” or “our”) is a trade name of Elite Mobile Detail LLC, 108 Scheele Rd, Unit 3, Boerne, TX 78015. This policy explains what information we collect through eliteautospasa.com, how we use it, and the choices you have.</p>

          <h2>Information we collect</h2>
          <p><strong>Information you give us.</strong> When you submit our quote form we collect the service you are interested in; your vehicle's year, make, model, and type; any project details you write; your name, phone number, and email address; your preferred contact method and timeframe; and whether you agreed to receive text messages.</p>
          <p><strong>Information collected automatically.</strong> Our hosting provider keeps standard server logs (such as IP address, browser type, and pages requested) for security and reliability. We do not currently run advertising or analytics trackers on this site.</p>

          <h2>How we use information</h2>
          <ul>
            <li>To respond to your request and prepare a quote.</li>
            <li>To schedule and carry out services, and to send appointment updates.</li>
            <li>To protect the site against spam and abuse.</li>
            <li>To meet legal and accounting obligations.</li>
          </ul>
          <p>We do not sell your personal information, and we do not share it with third parties for their own marketing.</p>

          <h2>Who handles your information</h2>
          <p>We use service providers who process information only on our behalf: Vercel (website hosting), and Resend (delivery of quote-request emails to us). The contact page embeds a Google Map and the site loads fonts from Google Fonts, so Google may receive your IP address when those load. We may also disclose information if required by law.</p>

          <h2>Text messaging</h2>
          <p>If you check the text-message consent box, we use your mobile number to send appointment updates and service-related messages. Your mobile number and SMS consent are never shared with third parties or affiliates for marketing or promotional purposes. See our <a href="/sms-terms.html">SMS Terms</a> for how to opt out.</p>

          <h2>Retention and security</h2>
          <p>We keep quote requests and customer records for as long as needed to provide services, resolve disputes, and meet legal obligations, then delete or anonymize them. We use reasonable safeguards, including encrypted (HTTPS) transmission, but no method of transmission or storage is completely secure.</p>

          <h2>Your choices</h2>
          <p>You may ask us to access, correct, or delete the information you submitted, and you may opt out of text messages at any time by replying STOP. Texas and other state laws may give you additional rights; contact us and we will respond as the law requires.</p>

          <h2>Children</h2>
          <p>This site is not directed to children under 13, and we do not knowingly collect their information.</p>

          <h2>Changes</h2>
          <p>We may update this policy and will change the date above when we do.</p>

          <h2>Contact</h2>
          <p>Questions or requests? Email <a href="mailto:contact@eliteautospasa.com">contact@eliteautospasa.com</a> or call <a href="tel:+18304312088">(830) 431-2088</a>.</p>`
});

export const smsPageObj = legalPage({
  out: "sms-terms.html",
  title: "SMS Terms & Conditions | Elite Auto Spa",
  description:
    "SMS Terms & Conditions for Elite Auto Spa (Elite Mobile Detail LLC): what texts we send, how to opt out, and message rates.",
  canonical: "/sms-terms.html",
  heading: "SMS Terms & Conditions",
  body: `
          <h2>Program description</h2>
          <p>Elite Auto Spa, a trade name of Elite Mobile Detail LLC, sends text messages to customers who opt in through our quote form. Messages are limited to appointment confirmations and reminders, scheduling changes, quote follow-ups you requested, and other service-related updates about your vehicle. We do not send promotional marketing texts under this program.</p>

          <h2>How you opt in</h2>
          <p>You opt in by checking the text-message consent box on our quote form and submitting your mobile number. You can also opt in by texting us first.</p>

          <h2>Consent</h2>
          <p>Consent to receive text messages is not a condition of any purchase or service. Message frequency varies based on your appointments and requests.</p>

          <h2>Message and data rates</h2>
          <p>Message and data rates may apply, depending on your mobile carrier and plan.</p>

          <h2>Opt out and help</h2>
          <p>Reply <strong>STOP</strong> at any time to stop receiving messages; you will receive one confirmation text and no further messages. Reply <strong>HELP</strong> for help, or contact us at <a href="tel:+18304312088">(830) 431-2088</a> or <a href="mailto:contact@eliteautospasa.com">contact@eliteautospasa.com</a>.</p>

          <h2>Carriers</h2>
          <p>Carriers are not liable for delayed or undelivered messages.</p>

          <h2>Privacy</h2>
          <p>We handle your information as described in our <a href="/privacy-policy.html">Privacy Policy</a>. Your mobile number and SMS consent are not shared with third parties or affiliates for marketing or promotional purposes.</p>`
});
