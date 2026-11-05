/**
 * Original, code-drawn vehicle studies for the Elite Auto Spa experience.
 * These generic silhouettes are not traced assets or exact manufacturer models.
 * No runtime dependencies. All scene definition IDs are scoped to id + body type.
 */

const vehicles = {
  sedan: {
    name: 'Sedan',
    description: 'A sculpted four-door sedan with a separate trunk and a gently arched roof.',
    wheels: [[318, 455, 69], [907, 455, 69]],
    body: 'M145 385 Q159 365 194 358 L285 346 L365 277 Q391 252 438 249 L641 249 Q679 249 714 277 L796 337 L984 355 Q1035 360 1061 382 L1074 415 L1069 454 Q1048 472 989 473 L986 455 A79 79 0 0 0 828 455 L824 475 L400 475 L397 455 A79 79 0 0 0 239 455 L235 474 L177 468 Q145 462 141 443 L139 411 Z',
    frame: 'M296 345 L376 282 Q396 262 438 261 L639 261 Q672 261 702 285 L774 338 Q533 326 296 345 Z',
    glass: [
      'M315 337 L389 283 Q407 271 438 271 L478 271 L468 331 Z',
      'M489 271 L624 271 Q640 271 655 276 L672 329 L480 331 Z',
      'M669 281 Q680 284 694 294 L747 333 L684 330 Z'
    ],
    pillar: 'M475 267 L488 267 L479 337 L465 338 Z',
    roof: 'M288 349 L370 278 Q395 250 438 249 L641 249 Q676 249 714 277 L793 337',
    shoulder: 'M157 384 Q426 344 747 352 Q920 354 1044 383',
    sill: 'M407 462 Q622 468 817 460',
    doors: ['M470 341 L455 398 L450 453 Q549 464 669 455 L676 339', 'M677 339 L707 389 L722 453'],
    handles: [[428, 367], [645, 364]],
    hood: 'M797 341 Q922 343 1017 367',
    frontZone: ['M802 346 L978 363 Q1034 369 1052 386 L1046 399 Q967 383 926 375 L828 370 Z', 'M827 379 Q897 358 953 389 Q979 410 986 452 L1059 446 L1063 417 L1049 399 Q930 381 827 379 Z'],
    rearLamp: 'M146 384 L213 373 L224 385 L150 398 Z',
    frontLamp: 'M1000 376 L1054 387 L1062 403 L1001 393 L977 384 Z',
    bumper: 'M1004 435 L1069 424 L1067 446 L1000 454 Z',
    trim: 'M150 431 L225 431 M996 432 L1062 418',
    mirror: 'M739 334 Q752 320 769 325 L787 340 L780 349 L744 345 Z',
    extras: ''
  },
  coupe: {
    name: 'Coupe',
    description: 'A low two-door coupe with a long hood, swept roof, and short rear deck.',
    wheels: [[310, 458, 69], [927, 458, 69]],
    body: 'M137 402 Q146 382 184 373 L285 356 L385 295 Q423 275 480 274 L605 274 Q648 274 686 300 L757 348 L990 365 Q1045 369 1080 391 L1097 417 L1090 456 Q1069 473 1009 475 L1006 458 A79 79 0 0 0 848 458 L845 477 L392 477 L389 458 A79 79 0 0 0 231 458 L227 475 L163 466 Q139 461 135 443 Z',
    frame: 'M304 352 L399 300 Q427 285 480 284 L603 284 Q640 285 676 308 L733 347 Q515 335 304 352 Z',
    glass: [
      'M327 344 L409 306 Q433 294 474 293 L492 293 L474 338 Z',
      'M503 293 L602 293 Q631 293 665 314 L711 341 L488 338 Z'
    ],
    pillar: 'M490 289 L505 289 L488 344 L472 345 Z',
    roof: 'M286 356 L386 295 Q422 275 480 274 L605 274 Q649 274 686 300 L755 348',
    shoulder: 'M148 400 Q467 355 764 366 Q925 365 1075 400',
    sill: 'M399 464 Q615 476 838 461',
    doors: ['M479 349 L454 400 L443 456 Q577 470 717 453 L725 352'],
    handles: [[466, 369]],
    hood: 'M770 353 Q943 356 1049 382',
    frontZone: ['M778 359 Q935 361 1047 388 L1066 399 L1031 404 Q891 375 814 380 Z', 'M849 383 Q936 364 981 406 Q1000 428 1007 454 L1079 446 L1085 420 L1066 404 Q930 378 849 383 Z'],
    rearLamp: 'M139 397 L203 383 L229 385 L218 394 L140 408 Z',
    frontLamp: 'M1004 384 L1074 400 L1085 416 L1026 406 L992 392 Z',
    bumper: 'M1020 440 L1090 428 L1086 451 L1014 457 Z',
    trim: 'M144 439 L218 439 M1018 437 L1084 424',
    mirror: 'M703 343 Q710 328 731 332 L751 345 L747 354 L710 352 Z',
    extras: '<path d="M161 376 L273 357 L279 363 L166 382 Z" fill="#17232c"/><path d="M754 398 L813 394 L802 402 L754 406 Z" fill="#1b2731" opacity=".75"/>'
  },
  suv: {
    name: 'SUV',
    description: 'A tall five-door SUV with an upright cabin, a long roof, and substantial wheel arches.',
    wheels: [[306, 453, 74], [916, 453, 74]],
    body: 'M144 364 L177 337 L213 250 Q222 226 253 222 L664 222 Q707 222 731 248 L806 325 L1007 341 Q1054 345 1070 372 L1083 417 L1075 463 L1000 476 L999 453 A83 83 0 0 0 833 453 L829 478 L393 478 L389 453 A83 83 0 0 0 223 453 L217 477 L157 467 L139 438 Z',
    frame: 'M210 333 L238 255 Q243 239 263 237 L663 237 Q692 237 712 258 L776 326 Z',
    glass: [
      'M227 325 L252 256 Q256 249 267 249 L354 249 L349 325 Z',
      'M369 249 L495 249 L496 325 L362 325 Z',
      'M511 249 L658 249 Q674 249 689 262 L748 325 L511 325 Z'
    ],
    pillar: 'M350 243 L370 243 L362 333 L347 333 Z M494 242 L513 242 L513 333 L495 333 Z',
    roof: 'M177 335 L213 250 Q222 226 253 222 L664 222 Q707 222 731 248 L806 325',
    shoulder: 'M153 362 Q481 337 785 344 L1038 365',
    sill: 'M398 465 L824 465',
    doors: ['M363 339 L357 374 L373 453 L498 454 L500 339', 'M511 339 L516 453 L742 453 L751 342'],
    handles: [[395, 357], [675, 357]],
    hood: 'M817 331 L1008 348 L1042 363',
    frontZone: ['M815 337 L1004 353 Q1043 358 1058 377 L1058 388 L965 373 L836 366 Z', 'M835 374 Q918 347 970 394 Q991 418 1000 450 L1067 450 L1074 419 L1061 392 L988 379 Z'],
    rearLamp: 'M146 366 L169 357 L183 358 L180 395 L146 401 Z',
    frontLamp: 'M1006 359 L1061 377 L1066 393 L1014 386 L993 371 Z',
    bumper: 'M1013 431 L1079 420 L1072 455 L1008 464 Z',
    trim: 'M146 436 L211 440 M1011 430 L1070 418',
    mirror: 'M744 327 Q755 311 773 317 L793 333 L787 347 L748 340 Z',
    extras: '<path d="M268 217 L649 217" stroke="#687681" stroke-width="5" stroke-linecap="round"/><path d="M285 218 L285 227 M628 218 L628 226" stroke="#222e38" stroke-width="7"/><path d="M395 474 L825 474" stroke="#10171d" stroke-width="10"/><path d="M406 472 L814 472" stroke="#76828c" stroke-width="2"/>'
  },
  pickup: {
    name: 'Pickup',
    description: 'An upright crew-cab pickup with an open cargo bed, squared-off hood, and high ground clearance.',
    wheels: [[299, 454, 76], [930, 454, 76]],
    body: 'M136 338 L418 334 L442 260 Q450 237 476 234 L671 234 Q704 234 728 262 L785 327 L1014 342 Q1062 346 1076 372 L1091 418 L1083 467 L1016 479 L1015 454 A85 85 0 0 0 845 454 L841 482 L388 482 L384 454 A85 85 0 0 0 214 454 L208 480 L143 470 L132 447 Z',
    frame: 'M437 330 L461 266 Q467 249 484 249 L668 249 Q690 249 711 271 L760 327 Z',
    glass: [
      'M453 322 L474 270 Q478 260 489 260 L546 260 L546 322 Z',
      'M562 260 L665 260 Q682 260 700 280 L736 322 L562 322 Z'
    ],
    pillar: 'M545 249 L563 249 L563 333 L546 333 Z',
    roof: 'M418 334 L442 260 Q450 237 476 234 L671 234 Q704 234 728 262 L785 327',
    shoulder: 'M145 360 L421 355 Q613 343 787 346 L1061 369',
    sill: 'M393 467 L834 467',
    doors: ['M433 341 L427 451 L550 454 L550 336', 'M562 336 L562 454 L764 453 L764 338'],
    handles: [[466, 357], [688, 356]],
    hood: 'M799 333 L1017 349 L1052 365',
    frontZone: ['M800 340 L1014 355 Q1052 360 1065 382 L1051 392 L971 376 L821 368 Z', 'M845 377 Q925 350 979 393 Q1006 416 1015 449 L1075 450 L1080 419 L1067 396 L995 382 Z'],
    rearLamp: 'M136 361 L157 360 L161 405 L135 408 Z',
    frontLamp: 'M1017 360 L1066 378 L1074 405 L1022 397 L1015 382 Z',
    bumper: 'M1026 434 L1087 423 L1081 458 L1020 468 Z',
    trim: 'M139 438 L202 444 M1023 432 L1078 418',
    mirror: 'M742 324 L763 312 L785 325 L788 347 L757 346 L747 337 Z',
    extras: '<path d="M141 335 L413 332 L410 344 L142 347 Z" fill="#172028"/><path d="M162 337 L397 336" stroke="#77858f" stroke-width="2" opacity=".8"/><path d="M413 349 L413 454" stroke="#162731" stroke-width="2" opacity=".75"/><path d="M394 479 L810 479" stroke="#10171d" stroke-width="12"/><path d="M407 476 L799 476" stroke="#75818b" stroke-width="3"/><path d="M147 416 L189 416" stroke="#1b2730" stroke-width="3"/>'
  }
};

function definitionPrefix(id, key) {
  // Encoding punctuation rather than stripping it avoids common ID collisions.
  return `vehicle-${Array.from(String(id)).map((c) => /[a-zA-Z0-9_-]/.test(c) ? c : `_u${c.codePointAt(0).toString(16)}_`).join('')}-${key}`;
}

function wheel(x, y, radius, p) {
  const r = radius;
  const spoke = `M-5 -${r * .17} L-${r * .13} -${r * .70} L-${r * .03} -${r * .76} L${r * .065} -${r * .29} L${r * .13} -${r * .71} L${r * .23} -${r * .68} L${r * .13} -${r * .16} Z`;
  return `<g transform="translate(${x} ${y})">
    <circle r="${r + 3}" fill="#030509"/>
    <circle r="${r}" fill="url(#${p}-tire)" stroke="#2d343c" stroke-width="1.5"/>
    <circle r="${r - 6}" fill="none" stroke="#505963" stroke-opacity=".22" stroke-width="1"/>
    <circle r="${r * .78}" fill="#111920" stroke="#8c98a2" stroke-width="2"/>
    <circle r="${r * .69}" fill="url(#${p}-rotor)"/>
    <circle r="${r * .55}" fill="none" stroke="#8a949c" stroke-width="1" opacity=".4"/>
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="0" cy="-${r * .58}" r="1.2" fill="#1c2228" transform="rotate(${i * 22.5})"/>`).join('')}
    <path d="M${r * .42} -${r * .38} Q${r * .72} -${r * .33} ${r * .65} ${r * .15} L${r * .43} ${r * .27} Q${r * .32} 0 ${r * .42} -${r * .38}Z" fill="#9c7952"/>
    ${Array.from({ length: 5 }, (_, i) => `<path d="${spoke}" transform="rotate(${i * 72 + 13})" fill="url(#${p}-alloy)" stroke="#bbc3cb" stroke-opacity=".55" stroke-width=".65"/>`).join('')}
    <circle r="${r * .17}" fill="url(#${p}-alloy)" stroke="#a9b3bc" stroke-width="1"/>
    ${Array.from({ length: 5 }, (_, i) => `<circle cx="0" cy="-${r * .12}" r="1.6" fill="#101821" transform="rotate(${i * 72})"/>`).join('')}
    <circle r="${r * .064}" fill="#26333d"/>
    <path d="M-${r * .71} -${r * .31} A${r * .78} ${r * .78} 0 0 1 ${r * .53} -${r * .56}" fill="none" stroke="#e9f2fa" stroke-opacity=".8" stroke-width="1.5"/>
    <path d="M-${r * .77} ${r * .39} A${r * .88} ${r * .88} 0 0 0 ${r * .64} ${r * .62}" fill="none" stroke="#606b77" stroke-opacity=".35" stroke-width="2"/>
  </g>`;
}

/** Return an original, fully self-contained studio scene for a generic body type. */
export function vehicleScene(id, vehicleKey = 'sedan') {
  const key = Object.hasOwn(vehicles, vehicleKey) ? vehicleKey : 'sedan';
  const v = vehicles[key];
  const p = definitionPrefix(id, key);
  return `<svg class="vehicle-art" data-vehicle-scene="${key}" viewBox="0 0 1200 650" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${p}-title ${p}-desc">
  <title id="${p}-title">${v.name} finish and window tint illustration</title>
  <desc id="${p}-desc">${v.description} Original generic vehicle illustration, not an exact manufacturer model. Paint, glass shade, finish reflections, and dashed protection areas are illustrative visual treatments.</desc>
  <defs>
    <linearGradient id="${p}-backdrop" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#10161d"/><stop offset=".66" stop-color="#141d26"/><stop offset="1" stop-color="#070b10"/></linearGradient>
    <radialGradient id="${p}-halo"><stop stop-color="#64798b" stop-opacity=".21"/><stop offset="1" stop-color="#20303f" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-floor"><stop stop-color="#73818c" stop-opacity=".23"/><stop offset="1" stop-color="#091018" stop-opacity="0"/></radialGradient>
    <linearGradient id="${p}-body-shade" x1="0" y1="0" x2=".08" y2="1"><stop stop-color="#f2f8ff" stop-opacity=".42"/><stop offset=".27" stop-color="#dceaff" stop-opacity=".20"/><stop offset=".50" stop-color="#e5f5ff" stop-opacity=".03"/><stop offset=".73" stop-color="#071322" stop-opacity=".35"/><stop offset=".9" stop-color="#020813" stop-opacity=".68"/><stop offset="1" stop-color="#bac9d7" stop-opacity=".25"/></linearGradient>
    <linearGradient id="${p}-side-light" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#eff8ff" stop-opacity=".06"/><stop offset=".38" stop-color="#f2fbff" stop-opacity=".34"/><stop offset=".42" stop-color="#d3edff" stop-opacity=".03"/><stop offset="1" stop-color="#02070d" stop-opacity=".2"/></linearGradient>
    <linearGradient id="${p}-glass" x1="0" y1="0" x2=".35" y2="1"><stop stop-color="#a6becb"/><stop offset=".4" stop-color="#718e9e"/><stop offset="1" stop-color="#385267"/></linearGradient>
    <linearGradient id="${p}-glass-reflection" x1="0" y1="0" x2="1" y2=".4"><stop stop-color="#f3fbff" stop-opacity=".03"/><stop offset=".45" stop-color="#e8f6ff" stop-opacity=".34"/><stop offset=".48" stop-color="#d9f1ff" stop-opacity=".05"/><stop offset="1" stop-color="#e4f6ff" stop-opacity=".15"/></linearGradient>
    <radialGradient id="${p}-tire" cx=".42" cy=".25" r=".8"><stop stop-color="#343c46"/><stop offset=".68" stop-color="#141a22"/><stop offset="1" stop-color="#060a0f"/></radialGradient>
    <linearGradient id="${p}-alloy" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e3ebf1"/><stop offset=".25" stop-color="#8695a3"/><stop offset=".45" stop-color="#c2cdd6"/><stop offset=".54" stop-color="#364553"/><stop offset="1" stop-color="#718291"/></linearGradient>
    <radialGradient id="${p}-rotor"><stop stop-color="#1d2731"/><stop offset=".45" stop-color="#76818b"/><stop offset="1" stop-color="#424c55"/></radialGradient>
    <linearGradient id="${p}-floor-reflection" x1="0" y1="0" x2="0" y2="1"><stop stop-color="white" stop-opacity=".5"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>
    <mask id="${p}-reflection-mask" maskUnits="userSpaceOnUse" x="100" y="526" width="1010" height="100"><rect x="100" y="526" width="1010" height="100" fill="url(#${p}-floor-reflection)"/></mask>
    <clipPath id="${p}-body-clip"><path d="${v.body}"/></clipPath>
    <clipPath id="${p}-glass-clip">${v.glass.map((d) => `<path d="${d}"/>`).join('')}</clipPath>
    <filter id="${p}-shadow" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="13"/></filter>
    <filter id="${p}-reflection-blur" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>
  <rect width="1200" height="650" fill="url(#${p}-backdrop)"/>
  <ellipse cx="626" cy="302" rx="635" ry="320" fill="url(#${p}-halo)"/>
  <ellipse cx="622" cy="529" rx="586" ry="113" fill="url(#${p}-floor)"/>
  <path d="M82 528 H1121" stroke="#acc5d8" stroke-opacity=".06"/>
  <ellipse cx="621" cy="519" rx="471" ry="20" fill="#00040a" opacity=".83" filter="url(#${p}-shadow)"/>
  <g id="${p}-car">
    <path d="M179 437 L1048 437 L1018 478 L186 478 Z" fill="#080e15"/>
    ${v.wheels.map(([x, y, r]) => wheel(x, y, r, p)).join('')}
    <path d="${v.body}" style="fill:var(--vehicle-paint, #7892ac)" stroke="#a8bac9" stroke-opacity=".28" stroke-width="1.2"/>
    <path d="${v.body}" fill="url(#${p}-body-shade)"/>
    <g clip-path="url(#${p}-body-clip)">
      <path d="M112 348 Q572 305 1098 365 L1100 461 Q636 403 127 452 Z" fill="url(#${p}-side-light)"/>
      <path d="M120 460 Q610 491 1102 455 L1100 494 L122 493 Z" fill="#05101b" opacity=".44"/>
      <path d="M159 400 Q469 373 744 379 Q924 381 1074 408" fill="none" stroke="#081625" stroke-width="2.2" opacity=".3"/>
    </g>
    <path d="${v.frame}" fill="#101c27" stroke="#a1afbd" stroke-width="2.2"/>
    ${v.glass.map((d) => `<path d="${d}" fill="url(#${p}-glass)"/>`).join('')}
    <g clip-path="url(#${p}-glass-clip)" opacity=".23" fill="#172939">
      <path d="M419 337 L425 307 Q427 299 441 300 L456 303 L469 336 Z M626 338 L628 306 Q629 298 643 301 L657 306 L667 340 Z"/>
      <path d="M217 323 Q511 300 781 329 L786 353 L208 355 Z"/>
    </g>
    ${v.glass.map((d) => `<path class="vehicle-art__tint" d="${d}" fill="#02060c" style="opacity:var(--vehicle-tint-opacity, .4)"/>`).join('')}
    <path d="${v.pillar}" fill="#14202b"/>
    <g class="vehicle-art__glass-reflections" opacity=".8">
      ${v.glass.map((d) => `<path d="${d}" fill="url(#${p}-glass-reflection)"/>`).join('')}
    </g>
    <g class="vehicle-art__finish" style="opacity:var(--vehicle-finish-opacity, .8)">
      <path d="${v.roof}" fill="none" stroke="#d9ecfb" stroke-width="2.2" stroke-opacity=".64"/>
      <path d="${v.shoulder}" fill="none" stroke="#e7f4ff" stroke-width="2" stroke-opacity=".59"/>
      <path d="${v.shoulder}" transform="translate(0 4)" fill="none" stroke="#d8efff" stroke-width="6" stroke-opacity=".09"/>
      <path d="${v.hood}" fill="none" stroke="#edf8ff" stroke-opacity=".5" stroke-width="1.2"/>
      <path d="${v.sill}" fill="none" stroke="#bcd4e9" stroke-opacity=".6" stroke-width="1.4"/>
    </g>
    ${v.doors.map((d) => `<path d="${d}" fill="none" stroke="#152535" stroke-width="1.5" opacity=".66"/>`).join('')}
    ${v.handles.map(([x, y]) => `<g><rect x="${x}" y="${y}" width="35" height="5" rx="2.5" fill="#172b3b" opacity=".8"/><path d="M${x + 3} ${y + 1} H${x + 30}" stroke="#cedce6" stroke-width="1.2" stroke-opacity=".75"/></g>`).join('')}
    <path d="${v.rearLamp}" fill="#5e222c" stroke="#fba6aa" stroke-opacity=".18" stroke-width="1"/>
    <path d="${v.rearLamp}" transform="translate(0 -1)" fill="none" stroke="#e95d69" stroke-width="1.9" opacity=".88"/>
    <path d="${v.frontLamp}" fill="#d0e5f0" stroke="#edf9ff" stroke-width="1.4"/>
    <path d="${v.frontLamp}" transform="translate(0 3)" fill="none" stroke="#96c9e5" stroke-opacity=".3" stroke-width="4"/>
    <path d="${v.bumper}" fill="#111d29" stroke="#465668" stroke-width="1"/>
    <path d="${v.trim}" stroke="#adbdca" stroke-opacity=".3" stroke-width="2" fill="none"/>
    <path d="${v.mirror}" style="fill:var(--vehicle-paint, #7892ac)" stroke="#172b3d" stroke-width="2"/>
    <path d="${v.mirror}" fill="url(#${p}-body-shade)"/>
${v.extras ? "    " + v.extras + "\n" : ""}    <g class="vehicle-art__ppf vehicle-art__ppf--front" clip-path="url(#${p}-body-clip)" opacity="0" fill="#83e5e8" fill-opacity=".07" stroke="#8ce7e9" stroke-width="2" stroke-dasharray="7 6" stroke-linejoin="round" pointer-events="none">
      ${v.frontZone.map((d) => `<path d="${d}"/>`).join('')}
    </g>
    <g class="vehicle-art__ppf vehicle-art__ppf--full" opacity="0" fill="none" stroke="#8ce7e9" stroke-width="2" stroke-dasharray="7 6" stroke-linejoin="round" pointer-events="none">
      <path d="${v.body}"/>
      <path d="${v.frame}"/>
      ${v.doors.map((d) => `<path d="${d}" stroke-opacity=".6"/>`).join('')}
    </g>
  </g>
  <g mask="url(#${p}-reflection-mask)" opacity=".21" aria-hidden="true" pointer-events="none">
    <use href="#${p}-car" transform="translate(0 660) scale(1 -.25)" filter="url(#${p}-reflection-blur)"/>
  </g>
</svg>`;
}

/** A small matching silhouette for body-style choices; it has no SVG definitions. */
export function vehicleIcon(vehicleKey = 'sedan') {
  const key = Object.hasOwn(vehicles, vehicleKey) ? vehicleKey : 'sedan';
  const v = vehicles[key];
  return `<svg class="vehicle-option__icon" viewBox="110 205 1000 330" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="${v.body}" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/>
    <path d="${v.frame}" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="5"/>
    ${v.wheels.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 3}" fill="none" stroke="currentColor" stroke-width="13"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="currentColor" fill-opacity=".5"/>`).join('')}
  </svg>`;
}
