/* ==========================================================================
   Elite Auto Spa — page content definitions
   Each entry: { out, ...headOpts, main }  where `main` is the <main> HTML.
   ========================================================================== */
import { SITE, breadcrumb, breadcrumbLd, businessNode } from "./partials.mjs";

const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const check = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

/* Reusable page-level CTA band */
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

/* --------------------------- SERVICE PAGES --------------------------- */
function servicePage(s) {
  const trail = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: s.short, href: s.path }
  ];

  const benefits = s.benefits
    .map(
      (b) =>
        `<li class="reveal"><span class="tick" aria-hidden="true">${check}</span><div><strong>${b.t}</strong><p>${b.d}</p></div></li>`
    )
    .join("\n");

  const steps = s.process
    .map(
      (p, i) =>
        `<li class="reveal" data-delay="${i}"><span class="proc-step__num">${String(
          i + 1
        ).padStart(2, "0")}</span><div><h3>${p.t}</h3><p>${p.d}</p></div></li>`
    )
    .join("\n");

  const faqs = s.faqs
    .map(
      (f) => `
          <details class="faq-item reveal">
            <summary>${f.q}<span class="faq-item__icon" aria-hidden="true"></span></summary>
            <div class="faq-item__body"><p>${f.a}</p></div>
          </details>`
    )
    .join("");

  const related = s.related
    .map(
      (r) =>
        `<a class="pill-link" href="${r.href}">${r.label} ${arrow}</a>`
    )
    .join("\n");

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.h1,
      serviceType: s.short,
      provider: businessNode,
      areaServed: [
        { "@type": "City", name: "Boerne" },
        { "@type": "City", name: "San Antonio" }
      ],
      description: s.metaDesc
    },
    breadcrumbLd(trail),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];

  const main = `
${breadcrumb(trail)}
  <main id="main">
    <section class="page-hero" aria-labelledby="svc-title">
      <div class="page-hero__media">
        <img src="${s.image}" alt="${s.imageAlt}" width="1024" height="1024" loading="eager" decoding="async" />
      </div>
      <div class="container">
        <div class="page-hero__inner">
          <span class="eyebrow reveal">${s.eyebrow}</span>
          <h1 id="svc-title" class="reveal" data-delay="1">${s.h1}</h1>
          <p class="lead reveal" data-delay="2">${s.intro}</p>
          <div class="btn-row reveal" data-delay="3">
            <button class="btn btn--primary" type="button" data-open-quote>Get a Quote</button>
            <a class="btn btn--ghost" href="tel:${SITE.phoneHref}">Call ${SITE.phone}</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="svc-benefits">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Why It Matters</span>
          <h2 id="svc-benefits">${s.benefitsHeading}</h2>
        </div>
        <ul class="benefit-list">
${benefits}
        </ul>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="svc-process">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Our Process</span>
          <h2 id="svc-process">How we approach every ${s.short.toLowerCase()} project</h2>
        </div>
        <ol class="process-list">
${steps}
        </ol>
      </div>
    </section>

    <section class="section" aria-labelledby="svc-faq">
      <div class="container narrow">
        <div class="section-head reveal">
          <span class="eyebrow">Good to Know</span>
          <h2 id="svc-faq">${s.short} questions</h2>
        </div>
        <div class="faq-list">${faqs}
        </div>
      </div>
    </section>

    <section class="section section--alt" aria-labelledby="svc-related">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Explore More</span>
          <h2 id="svc-related">Related services</h2>
        </div>
        <div class="pill-row reveal">
${related}
        </div>
      </div>
    </section>
${ctaBand(s.ctaHeading)}
  </main>
`;

  return {
    out: s.path.replace(/^\//, ""),
    title: s.metaTitle,
    description: s.metaDesc,
    canonical: s.path,
    ogImage: s.image,
    preloadImage: s.image,
    jsonld,
    main
  };
}

const SERVICES = [
  {
    path: "/services/paint-protection-film.html",
    short: "Paint Protection Film",
    eyebrow: "Paint Protection Film (PPF)",
    h1: "Paint Protection Film in Boerne & San Antonio",
    metaTitle:
      "Paint Protection Film (PPF) in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Clear paint protection film (PPF) to help guard your vehicle against rock chips and road debris in Boerne and Greater San Antonio. Request a quote from Elite Auto Spa.",
    image: "/assets/images/projects/ppf-detail.png",
    imageAlt:
      "Technician applying clear paint protection film to a glossy black hood",
    intro:
      "A clear, durable urethane film applied over your paint to help absorb impact from rock chips, road debris, and minor abrasions — popular for Texas highway driving.",
    benefitsHeading: "What paint protection film helps with",
    benefits: [
      { t: "Impact resistance", d: "Helps guard high-strike zones like the hood, bumper, and mirrors from rock chips and debris." },
      { t: "Self-healing options", d: "Many premium films are designed so light swirls diminish with heat from the sun or warm water." },
      { t: "Preserve the finish", d: "Helps protect original paint underneath, which many owners value at resale." },
      { t: "Gloss or satin", d: "Available in high-gloss or a satin finish to change the look while protecting." }
    ],
    process: [
      { t: "Consultation", d: "We review your vehicle, driving habits, and the coverage areas that matter most to you." },
      { t: "Prep & decontamination", d: "Surfaces are cleaned and prepped so the film adheres cleanly." },
      { t: "Precision application", d: "Film is applied to your selected coverage plan with careful edge work." },
      { t: "Inspection & cure", d: "We inspect the finish and share care guidance for the initial cure period." }
    ],
    faqs: [
      { q: "Is PPF worth it in Texas?", a: "Many owners who drive Texas highways choose PPF on high-impact areas to help guard against rock chips and debris. Whether it's worth it depends on your vehicle, mileage, and priorities — we're happy to discuss coverage options." },
      { q: "What areas can be covered?", a: "Common options range from partial front-end coverage (hood, bumper, mirrors) to full-vehicle coverage. We'll help you choose a plan that fits your goals and budget." },
      { q: "How long does PPF last?", a: "Durability varies by product, use, and maintenance. We'll confirm the expected lifespan and warranty of the specific film we recommend." },
      { q: "Can PPF and ceramic coating be combined?", a: "Yes. Many owners apply PPF to impact zones and a ceramic coating over the rest for easier cleaning and added gloss." }
    ],
    related: [
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" },
      { label: "Paint Correction", href: "/services/paint-correction.html" },
      { label: "Vinyl Wraps", href: "/services/vinyl-wraps.html" }
    ],
    ctaHeading: "Ready to protect your paint?"
  },
  {
    path: "/services/ceramic-coatings.html",
    short: "Ceramic Coatings",
    eyebrow: "Ceramic Coatings",
    h1: "Ceramic Coatings in Boerne & San Antonio",
    metaTitle:
      "Ceramic Coatings in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Professional ceramic coatings that add gloss and make cleaning easier for vehicles in Boerne and Greater San Antonio. Request a quote from Elite Auto Spa.",
    image: "/assets/images/projects/ceramic-coating.png",
    imageAlt: "Water beading on a freshly ceramic-coated metallic car surface",
    intro:
      "A liquid polymer that cures to a hard, hydrophobic layer — adding depth and gloss while helping water and grime release more easily during washing.",
    benefitsHeading: "What a ceramic coating offers",
    benefits: [
      { t: "Hydrophobic surface", d: "Water tends to bead and sheet, which can make routine washing easier." },
      { t: "Enhanced gloss", d: "Adds a deep, reflective finish that many owners love on darker paint." },
      { t: "Easier maintenance", d: "Contaminants have a harder time bonding, so cleanup is often simpler." },
      { t: "UV & chemical resistance", d: "Helps guard against sun exposure and everyday environmental fallout." }
    ],
    process: [
      { t: "Evaluation", d: "We assess paint condition to recommend any correction needed before coating." },
      { t: "Paint correction", d: "If selected, we reduce swirls so the coating locks in a clean finish." },
      { t: "Coating application", d: "The coating is applied in a controlled environment and leveled by hand." },
      { t: "Cure & care", d: "We share the cure timeline and a maintenance routine to support longevity." }
    ],
    faqs: [
      { q: "How long do ceramic coatings last?", a: "Longevity depends on the product, layers, use, and maintenance. Manufacturers publish durability ranges; we'll confirm the expected lifespan of the coating we apply." },
      { q: "Does a coating stop rock chips?", a: "No. Ceramic coatings add gloss and make cleaning easier but are not designed to stop rock chips. For impact protection, consider paint protection film." },
      { q: "Do I still need to wash my car?", a: "Yes. A coating makes washing easier but regular maintenance is still important. We'll provide simple care guidance." },
      { q: "Should paint be corrected first?", a: "Often, yes. Correcting swirls before coating helps lock in a clean, glossy finish rather than sealing in imperfections." }
    ],
    related: [
      { label: "Paint Correction", href: "/services/paint-correction.html" },
      { label: "Paint Protection Film", href: "/services/paint-protection-film.html" },
      { label: "Mobile Detailing", href: "/services/mobile-detailing.html" }
    ],
    ctaHeading: "Want a deeper, easier-to-clean finish?"
  },
  {
    path: "/services/window-tint.html",
    short: "Window Tint",
    eyebrow: "Window Tinting",
    h1: "Window Tint in Boerne & San Antonio",
    metaTitle: "Window Tinting in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Window tinting for heat and glare reduction with a clean, refined look in Boerne and Greater San Antonio. Confirm current Texas tint laws with official sources.",
    image: "/assets/images/projects/window-tint.png",
    imageAlt: "Sleek dark luxury sedan with freshly tinted windows in a showroom",
    intro:
      "Reduce heat and glare while giving your vehicle a clean, refined appearance. We'll walk you through film options and help you choose a compliant shade.",
    benefitsHeading: "Why owners choose window tint",
    benefits: [
      { t: "Heat rejection", d: "Quality films can help reduce interior heat during hot Texas days." },
      { t: "Glare reduction", d: "Helps cut harsh glare for a more comfortable drive." },
      { t: "UV protection", d: "Many films help block a significant portion of UV rays." },
      { t: "Refined look", d: "A clean, consistent shade that complements the vehicle." }
    ],
    process: [
      { t: "Film selection", d: "We review film types and help you choose a look and performance level." },
      { t: "Legal shade check", d: "We discuss compliant options — please confirm current Texas tint laws with official state sources." },
      { t: "Careful installation", d: "Windows are cleaned and film is applied with precise edges." },
      { t: "Cure guidance", d: "We share the short cure window and simple aftercare tips." }
    ],
    faqs: [
      { q: "How dark can tint be in Texas?", a: "Texas regulates tint by visible light transmission (VLT) and window position, and rules can change. Please confirm current Texas tint regulations with official state sources before choosing a shade — we're glad to explain compliant options." },
      { q: "Will tint help with heat?", a: "Quality films are designed to help reduce heat and glare. Actual performance varies by film, glass, and conditions." },
      { q: "How long before I can roll windows down?", a: "There's a short cure period after installation. We'll tell you exactly how long to wait for your film." },
      { q: "Do you offer different film grades?", a: "Yes. We can walk you through options that balance appearance, heat rejection, and budget." }
    ],
    related: [
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" },
      { label: "Vinyl Wraps", href: "/services/vinyl-wraps.html" },
      { label: "Mobile Detailing", href: "/services/mobile-detailing.html" }
    ],
    ctaHeading: "Considering window tint?"
  },
  {
    path: "/services/vinyl-wraps.html",
    short: "Vinyl Wraps",
    eyebrow: "Vinyl Wraps",
    h1: "Vinyl Wraps in Boerne & San Antonio",
    metaTitle: "Vinyl Wraps in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Full color changes and custom accents with premium wrap films in Boerne and Greater San Antonio. Request a wrap consultation from Elite Auto Spa.",
    image: "/assets/images/projects/vinyl-wrap.png",
    imageAlt: "Modern pickup truck wrapped in satin color-shift vinyl in a studio",
    intro:
      "Transform your vehicle with a full color change or custom accents using premium wrap films — a bold new look that can also help protect the paint underneath.",
    benefitsHeading: "What a vinyl wrap can do",
    benefits: [
      { t: "Full color change", d: "Reimagine your vehicle with gloss, satin, matte, or color-shift films." },
      { t: "Custom accents", d: "Roof, mirrors, trim, and hood accents for a tailored look." },
      { t: "Paint underneath", d: "A wrap can help shield factory paint from everyday wear." },
      { t: "Reversible style", d: "Change the look now and revisit later with proper removal." }
    ],
    process: [
      { t: "Design consult", d: "We discuss colors, finishes, and coverage to match your vision." },
      { t: "Surface prep", d: "Panels are cleaned and prepped so film lays down cleanly." },
      { t: "Wrap application", d: "Film is applied with careful edge wrapping and finishing." },
      { t: "Final inspection", d: "We inspect seams and edges, then share care guidance." }
    ],
    faqs: [
      { q: "Does a wrap protect my paint?", a: "A wrap can help shield factory paint from everyday wear, though it is not the same as paint protection film for impact resistance." },
      { q: "Can I remove the wrap later?", a: "Wraps are designed to be removable with proper technique. We'll discuss expectations for your specific film and paint." },
      { q: "What finishes are available?", a: "Options typically include gloss, satin, matte, and specialty color-shift films. We'll show you samples during your consult." },
      { q: "How do I care for a wrap?", a: "Wraps have specific care needs — we'll provide simple guidance to help maintain the finish." }
    ],
    related: [
      { label: "Paint Protection Film", href: "/services/paint-protection-film.html" },
      { label: "Window Tint", href: "/services/window-tint.html" },
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" }
    ],
    ctaHeading: "Ready to transform your look?"
  },
  {
    path: "/services/mobile-detailing.html",
    short: "Mobile Detailing",
    eyebrow: "Detailing",
    h1: "Detailing in Boerne & San Antonio",
    metaTitle:
      "Mobile & In-Shop Detailing in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Interior and exterior detailing with mobile options where available in Boerne and Greater San Antonio. Request a detailing quote from Elite Auto Spa.",
    image: "/assets/images/projects/mobile-detailing.png",
    imageAlt: "Technician steam-cleaning the interior of a luxury car",
    intro:
      "Thorough interior and exterior detailing to refresh your vehicle — with mobile service options available for qualifying jobs, subject to location and on-site conditions.",
    benefitsHeading: "A detail done with showroom care",
    benefits: [
      { t: "Interior refresh", d: "Careful cleaning of surfaces, carpets, and upholstery." },
      { t: "Exterior detail", d: "Wash, decontamination, and finishing for a clean, bright look." },
      { t: "Mobile options", d: "Available for qualifying services where power and water access allow." },
      { t: "Tailored packages", d: "We'll recommend a package that fits your vehicle and goals." }
    ],
    process: [
      { t: "Assessment", d: "We review the vehicle's condition and your priorities." },
      { t: "Interior & exterior", d: "We perform the selected detailing services with care." },
      { t: "Finishing", d: "Final touches to leave surfaces clean and refreshed." },
      { t: "Walkthrough", d: "We review the results and any recommended follow-up care." }
    ],
    faqs: [
      { q: "Do you offer mobile detailing?", a: "We offer mobile service options for qualifying detailing services in Boerne and Greater San Antonio. Availability depends on the service, location, and on-site conditions such as power and water access." },
      { q: "What's included in a detail?", a: "Packages vary by vehicle and needs. Contact us and we'll recommend interior, exterior, or combined services that fit." },
      { q: "How long does detailing take?", a: "Timing depends on the package and the vehicle's condition. We'll provide an estimate when we scope your job." },
      { q: "Can detailing be combined with coatings?", a: "Yes. Detailing pairs well with paint correction and ceramic coatings for a longer-lasting finish." }
    ],
    related: [
      { label: "Paint Correction", href: "/services/paint-correction.html" },
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" },
      { label: "Vehicle Restoration", href: "/services/vehicle-restoration.html" }
    ],
    ctaHeading: "Ready to refresh your vehicle?"
  },
  {
    path: "/services/paint-correction.html",
    short: "Paint Correction",
    eyebrow: "Paint Correction",
    h1: "Paint Correction in Boerne & San Antonio",
    metaTitle: "Paint Correction in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Multi-stage paint correction to help reduce swirls and restore clarity in Boerne and Greater San Antonio. Request a quote from Elite Auto Spa.",
    image: "/assets/images/projects/paint-correction.png",
    imageAlt: "Technician machine-polishing the glossy door panel of a luxury car",
    intro:
      "Multi-stage machine polishing to help reduce swirl marks and restore clarity and depth — an ideal foundation before applying a ceramic coating.",
    benefitsHeading: "What paint correction addresses",
    benefits: [
      { t: "Swirl reduction", d: "Helps diminish fine swirl marks that dull the finish." },
      { t: "Restored clarity", d: "Brings back depth and reflection to tired paint." },
      { t: "Coating-ready", d: "Creates a clean base so a coating locks in a crisp finish." },
      { t: "Tailored stages", d: "We match the number of stages to your paint's condition." }
    ],
    process: [
      { t: "Paint inspection", d: "We evaluate the finish to determine the right correction approach." },
      { t: "Test section", d: "We refine a process on a test area before full correction." },
      { t: "Multi-stage polish", d: "We work the paint in stages to reduce imperfections." },
      { t: "Protect the result", d: "We recommend a coating or sealant to help preserve the finish." }
    ],
    faqs: [
      { q: "Will correction remove all scratches?", a: "Correction can reduce many fine swirls and light imperfections, but deeper scratches may not be fully removable. We'll set clear expectations after inspecting your paint." },
      { q: "How long does it take?", a: "It depends on the vehicle's condition and the number of stages required. We'll estimate timing during evaluation." },
      { q: "Should I coat after correction?", a: "Applying a ceramic coating or sealant afterward helps protect the freshly corrected finish." },
      { q: "Is correction the same as buffing?", a: "Correction is a careful, multi-stage process aimed at improving the finish rather than a quick single-step buff." }
    ],
    related: [
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" },
      { label: "Mobile Detailing", href: "/services/mobile-detailing.html" },
      { label: "Vehicle Restoration", href: "/services/vehicle-restoration.html" }
    ],
    ctaHeading: "Want to restore your paint's clarity?"
  },
  {
    path: "/services/vehicle-restoration.html",
    short: "Vehicle Restoration",
    eyebrow: "Restoration",
    h1: "Vehicle Restoration in Boerne & San Antonio",
    metaTitle:
      "Vehicle Restoration in Boerne & San Antonio, TX | Elite Auto Spa",
    metaDesc:
      "Refinishing and revival work for cherished and classic vehicles in Boerne and Greater San Antonio. Request a restoration consultation from Elite Auto Spa.",
    image: "/assets/images/projects/restoration.png",
    imageAlt: "Classic vintage car with restored glossy paint in a premium workshop",
    intro:
      "Refinishing and revival work for cherished and classic vehicles — bringing back the depth and character of a finish you're proud to show.",
    benefitsHeading: "Bringing cherished vehicles back to life",
    benefits: [
      { t: "Finish revival", d: "Careful work to help restore depth and shine to aged paint." },
      { t: "Detail-focused", d: "Attention to the details that make a classic feel special again." },
      { t: "Custom scope", d: "Every restoration is scoped to the vehicle and your goals." },
      { t: "Preservation mindset", d: "We aim to protect and enhance what makes your vehicle unique." }
    ],
    process: [
      { t: "Discovery", d: "We review the vehicle, its history, and your restoration goals." },
      { t: "Scope & plan", d: "We outline a realistic plan and set clear expectations." },
      { t: "Restoration work", d: "We perform the agreed refinishing and revival steps." },
      { t: "Final reveal", d: "We review results together and recommend ongoing care." }
    ],
    faqs: [
      { q: "What vehicles do you restore?", a: "We focus on refinishing and revival work for cherished and classic vehicles. Contact us with your project and we'll discuss whether it's a fit." },
      { q: "How is a restoration scoped?", a: "Each project is unique. We'll assess the vehicle and outline a plan with clear expectations before starting." },
      { q: "Can you protect the finish afterward?", a: "Yes. We can recommend coatings or film to help protect the restored finish going forward." },
      { q: "How long does restoration take?", a: "Timelines vary widely by scope. We'll provide an estimate once we've reviewed the vehicle." }
    ],
    related: [
      { label: "Paint Correction", href: "/services/paint-correction.html" },
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" },
      { label: "Paint Protection Film", href: "/services/paint-protection-film.html" }
    ],
    ctaHeading: "Have a project in mind?"
  },
  {
    path: "/services/overspray-removal.html",
    short: "Overspray & Undercarriage",
    eyebrow: "Overspray Removal & Undercarriage",
    h1: "Overspray Removal & Undercarriage Cleaning",
    metaTitle:
      "Overspray Removal & Undercarriage Cleaning in Boerne & San Antonio | Elite Auto Spa",
    metaDesc:
      "Overspray removal and detailed undercarriage cleaning for vehicles in Boerne and Greater San Antonio. Request a quote from Elite Auto Spa.",
    image: "/assets/images/projects/paint-correction.png",
    imageAlt: "Detailed cleaning work on a luxury vehicle surface under studio light",
    intro:
      "Specialized overspray removal and detailed undercarriage cleaning to address contamination and buildup that standard washes leave behind.",
    benefitsHeading: "Specialized cleanup, done carefully",
    benefits: [
      { t: "Overspray removal", d: "Careful removal of paint or coating overspray from affected surfaces." },
      { t: "Undercarriage cleaning", d: "Detailed cleaning of areas that routine washes often miss." },
      { t: "Surface-safe methods", d: "We use approaches intended to protect your finish during cleanup." },
      { t: "Clear assessment", d: "We evaluate the situation and set realistic expectations." }
    ],
    process: [
      { t: "Assessment", d: "We inspect affected areas to determine the right approach." },
      { t: "Controlled cleanup", d: "We perform overspray or undercarriage work with care." },
      { t: "Inspection", d: "We review the results and recommend any follow-up." },
      { t: "Protection options", d: "We can suggest protection to help going forward." }
    ],
    faqs: [
      { q: "Can you remove all overspray?", a: "Results depend on the type of overspray and how long it has been on the surface. We'll assess the vehicle and set clear expectations before starting." },
      { q: "Why clean the undercarriage?", a: "The undercarriage collects buildup that standard washes miss. Detailed cleaning can help address contamination in these areas." },
      { q: "Is the process safe for my paint?", a: "We use methods intended to protect the finish during cleanup and will explain the approach for your vehicle." },
      { q: "How do I get started?", a: "Reach out with details and photos if possible. We'll review and recommend the right service." }
    ],
    related: [
      { label: "Mobile Detailing", href: "/services/mobile-detailing.html" },
      { label: "Paint Correction", href: "/services/paint-correction.html" },
      { label: "Ceramic Coatings", href: "/services/ceramic-coatings.html" }
    ],
    ctaHeading: "Need specialized cleanup?"
  }
];

export const servicePages = SERVICES.map(servicePage);
