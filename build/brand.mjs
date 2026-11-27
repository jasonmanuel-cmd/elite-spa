/* ==========================================================================
   Elite Auto Spa — brand marks as an inline SVG sprite
   --------------------------------------------------------------------------
   Vector recreation of the supplied brand board (wing logo + round badge).
   Inline <symbol>s (not <img>) so the page's self-hosted Montserrat renders
   inside the marks and every instance stays crisp at any size.

   Use:  <svg class="x" aria-hidden="true"><use href="#eas-logo"/></svg>
   Symbols: eas-logo (wings), eas-mark (ring monogram), eas-badge (round).
   ========================================================================== */

const LETTERS = `
    <g id="eas-letters" fill="url(#eas-chrome)" stroke="#050505" stroke-width="1.2" stroke-linejoin="round">
      <path d="M222 150H284V168H244V188H278V205H244V228H286V246H222Z"/>
      <path fill-rule="evenodd" d="M296 246 322 150H348L374 246H350L346 226H324L320 246ZM326 208H344L335 178Z"/>
      <path d="M386 150H446V168H406V188H446V246H384V228H424V206H386Z"/>
    </g>`;

const WING = `
      <path d="M18 150H300V190H182L60 168Z" fill="url(#eas-chrome-h)"/>
      <path d="M70 204H300V230H122Z" fill="url(#eas-red)"/>
      <path d="M122 240H300V258H154Z" fill="url(#eas-chrome-h)"/>`;

export const brandSprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="eas-chrome" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset=".38" stop-color="#a9a9a9"/>
      <stop offset=".52" stop-color="#f1f1f1"/><stop offset="1" stop-color="#6d6d6d"/>
    </linearGradient>
    <linearGradient id="eas-chrome-h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#8a8a8a"/><stop offset=".45" stop-color="#f4f4f4"/><stop offset="1" stop-color="#7c7c7c"/>
    </linearGradient>
    <linearGradient id="eas-red" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff6b6b"/><stop offset=".5" stop-color="#d32f2f"/><stop offset="1" stop-color="#7a1010"/>
    </linearGradient>
    <filter id="eas-drop" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".85"/></filter>
${LETTERS}
    <path id="eas-arc-top" d="M65 300a235 235 0 0 1 470 0"/>
    <path id="eas-arc-bottom" d="M35 300a265 265 0 0 0 530 0"/>
  </defs>

  <symbol id="eas-logo" viewBox="0 0 640 360">
    <circle cx="320" cy="190" r="150" fill="#060606" stroke="url(#eas-chrome)" stroke-width="16"/>
    <circle cx="320" cy="190" r="128" fill="none" stroke="#d32f2f" stroke-width="3"/>
    <g filter="url(#eas-drop)">
      <g>${WING}</g>
      <g transform="translate(640 0) scale(-1 1)">${WING}</g>
    </g>
    <path d="M196 128H444L470 154V252L444 278H196L170 252V154Z" fill="#050505" stroke="#2c2c2c" stroke-width="2"/>
    <g transform="translate(35 0) skewX(-14)" filter="url(#eas-drop)"><use href="#eas-letters"/></g>
    <path d="M200 296H440M200 330H440" stroke="#c0c0c0" stroke-width="1.6"/>
    <text x="320" y="319" text-anchor="middle" fill="#c0c0c0" font-family="Montserrat, system-ui, sans-serif" font-weight="600" font-size="22" letter-spacing="7.5">ELITE AUTO SPA</text>
  </symbol>

  <symbol id="eas-mark" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="55" fill="#060606" stroke="url(#eas-chrome)" stroke-width="6"/>
    <circle cx="60" cy="60" r="46" fill="none" stroke="#d32f2f" stroke-width="2"/>
    <g transform="translate(60 60) scale(.36) translate(-334 -198)"><g transform="translate(49 0) skewX(-14)"><use href="#eas-letters"/></g></g>
  </symbol>

  <symbol id="eas-badge" viewBox="0 0 600 600">
    <circle cx="300" cy="300" r="294" fill="#050505" stroke="#d32f2f" stroke-width="5"/>
    <circle cx="300" cy="300" r="272" fill="none" stroke="url(#eas-chrome)" stroke-width="26"/>
    <circle cx="300" cy="300" r="200" fill="none" stroke="#d32f2f" stroke-width="4"/>
    <circle cx="300" cy="300" r="190" fill="#0b0b0b"/>
    <text font-family="Montserrat, system-ui, sans-serif" font-weight="700" font-size="34" letter-spacing="9" fill="#bdbdbd" text-anchor="middle">
      <textPath href="#eas-arc-top" startOffset="50%">ELITE MOBILE DETAIL</textPath>
    </text>
    <text font-family="Montserrat, system-ui, sans-serif" font-weight="700" font-size="34" letter-spacing="9" fill="#bdbdbd" text-anchor="middle">
      <textPath href="#eas-arc-bottom" startOffset="50%">ELITE MOBILE DETAIL</textPath>
    </text>
    <path d="M175 252A140 140 0 0 1 425 252" fill="none" stroke="url(#eas-chrome)" stroke-width="9" stroke-linecap="round"/>
    <g transform="translate(300 292) scale(1.05) translate(-334 -198)" filter="url(#eas-drop)"><g transform="translate(49 0) skewX(-14)"><use href="#eas-letters"/></g></g>
    <path d="M190 352H410M190 380H410" stroke="#c0c0c0" stroke-width="1.5"/>
    <text x="300" y="372" text-anchor="middle" fill="#c0c0c0" font-family="Montserrat, system-ui, sans-serif" font-weight="600" font-size="19" letter-spacing="6.5">ELITE AUTO SPA</text>
    <text x="300" y="440" text-anchor="middle" fill="#e8e8e8" font-family="'Mrs Saint Delafield', cursive" font-size="54">&#8212; Dillon Grady</text>
  </symbol>
</svg>
`;

/* Inline lockups used by header/footer/hero. */
export const logoWide = (cls = "brand__logo") =>
  `<svg class="${cls}" viewBox="0 0 640 360" role="img" aria-label="Elite Auto Spa"><use href="#eas-logo" width="640" height="360"/></svg>`;
export const logoMark = (cls = "brand__mark") =>
  `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><use href="#eas-mark" width="120" height="120"/></svg>`;
export const logoBadge = (cls = "badge") =>
  `<svg class="${cls}" viewBox="0 0 600 600" role="img" aria-label="Elite Auto Spa — Elite Mobile Detail badge"><use href="#eas-badge" width="600" height="600"/></svg>`;
