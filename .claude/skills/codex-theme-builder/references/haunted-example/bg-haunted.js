// Haunted Manor backdrop: an animated gallery hall drawn as inline SVG.
// Colours come from the palette variables (--p-wall, --p-wall2, --p-gilt, --p-ecto),
// so every element restyles when the palette changes.

const curtain = (x, flip) => {
  const s = flip ? -1 : 1;
  const p = (dx) => x + s * dx;
  return `<path class="hm-curtain" d="M${p(0)} 270 C${p(40)} 320 ${p(10)} 420 ${p(36)} 520 C${p(50)} 600 ${p(18)} 660 ${p(30)} 720 L${p(-6)} 720 C${p(-10)} 600 ${p(-14)} 420 ${p(-10)} 270 Z"/>
    <path class="hm-curtain-fold" d="M${p(8)} 290 C${p(26)} 380 ${p(6)} 470 ${p(20)} 560 M${p(-2)} 300 C${p(4)} 420 ${p(-4)} 560 ${p(6)} 700"/>`;
};

const web = (x, y, sx) => {
  const lines = [];
  for (let k = 0; k <= 5; k++) {
    const a = (k / 5) * (Math.PI / 2);
    lines.push(`M${x} ${y} L${(x + sx * 150 * Math.cos(a)).toFixed(1)} ${(y + 150 * Math.sin(a)).toFixed(1)}`);
  }
  for (const r of [40, 80, 120]) {
    let d = '';
    for (let k = 0; k <= 5; k++) {
      const a = (k / 5) * (Math.PI / 2), px = x + sx * r * Math.cos(a), py = y + r * Math.sin(a);
      if (k === 0) d += `M${px.toFixed(1)} ${py.toFixed(1)}`;
      else {
        const am = ((k - 0.5) / 5) * (Math.PI / 2), rm = r * 0.86;
        d += ` Q${(x + sx * rm * Math.cos(am)).toFixed(1)} ${(y + rm * Math.sin(am)).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
    }
    lines.push(d);
  }
  return `<path class="hm-web" d="${lines.join(' ')}"/>`;
};

const candle = (x, y) => `<rect class="hm-wax" x="${x - 4}" y="${y}" width="8" height="22" rx="1"/>
  <ellipse class="hm-flame" cx="${x}" cy="${y - 7}" rx="4" ry="8"/>
  <circle class="hm-halo" cx="${x}" cy="${y - 7}" r="16"/>`;

const bat = (k) => `<g class="hm-batpath hm-bp${k}"><g class="hm-bat">
    <path class="hm-wing hm-wl" d="M0 0 C-8 -10 -20 -14 -34 -10 C-28 -6 -26 -2 -28 4 C-22 0 -16 2 -14 6 C-10 2 -4 2 0 4 Z"/>
    <path class="hm-wing hm-wr" d="M0 0 C8 -10 20 -14 34 -10 C28 -6 26 -2 28 4 C22 0 16 2 14 6 C10 2 4 2 0 4 Z"/>
    <ellipse class="hm-batbody" cx="0" cy="2" rx="5" ry="8"/><path class="hm-batbody" d="M-4 -5 L-5 -11 L-1 -6 Z M4 -5 L5 -11 L1 -6 Z"/>
    <circle class="hm-bateye" cx="-2" cy="-2" r="1"/><circle class="hm-bateye" cx="2" cy="-2" r="1"/></g></g>`;

export function hauntedScene() {
  const ticks = Array.from({ length: 12 }, (_, k) => {
    const a = (k / 12) * Math.PI * 2;
    return `M${(1430 + 28 * Math.cos(a)).toFixed(1)} ${(420 + 28 * Math.sin(a)).toFixed(1)} L${(1430 + 33 * Math.cos(a)).toFixed(1)} ${(420 + 33 * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return `<svg class="hm" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <path id="hm-motif" d="M45 8 C56 28 72 34 72 52 C72 66 58 72 52 63 C61 61 61 50 52 48 C48 60 50 74 45 88 C40 74 42 60 38 48 C29 50 29 61 38 63 C32 72 18 66 18 52 C18 34 34 28 45 8 Z M45 94 C51 104 51 114 45 124 C39 114 39 104 45 94 Z"/>
    <pattern id="hm-damask" width="90" height="130" patternUnits="userSpaceOnUse">
      <rect class="hm-wall" width="90" height="130"/>
      <use class="hm-motif" href="#hm-motif"/>
      <use class="hm-motif" href="#hm-motif" x="-45" y="65"/><use class="hm-motif" href="#hm-motif" x="45" y="65"/>
    </pattern>
    <linearGradient id="hm-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1426"/><stop offset="1" stop-color="#1c2638"/></linearGradient>
    <linearGradient id="hm-gilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="hm-g1"/><stop offset=".5" class="hm-g2"/><stop offset="1" class="hm-g3"/></linearGradient>
    <radialGradient id="hm-vignette" cx=".5" cy=".45" r=".75"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient>
    <radialGradient id="hm-ghostfill" cx=".5" cy=".12" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".35" class="hm-ecto-stop" stop-opacity=".6"/><stop offset=".8" class="hm-ecto-stop" stop-opacity=".25"/><stop offset="1" class="hm-ecto-stop" stop-opacity="0"/></radialGradient>
    <filter id="hm-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
    <clipPath id="hm-winclip"><path d="M100 680 V420 Q185 270 270 420 V680 Z"/></clipPath>
    <clipPath id="hm-ovalclip"><ellipse cx="180" cy="170" rx="58" ry="74"/></clipPath>
    <clipPath id="hm-gentclip"><rect x="1362" y="92" width="136" height="176"/></clipPath>
  </defs>

  <rect width="1600" height="900" fill="url(#hm-damask)"/>
  <rect class="hm-stripe" width="1600" height="900"/>
  <rect class="hm-cornice" y="0" width="1600" height="26"/>

  <!-- wainscoting and floor -->
  <rect class="hm-wainscot" y="712" width="1600" height="188"/>
  <rect class="hm-rail" y="706" width="1600" height="10"/>
  ${Array.from({ length: 16 }, (_, k) => `<rect class="hm-panelline" x="${k * 100 + 14}" y="734" width="72" height="104" rx="3"/>`).join('')}
  <rect class="hm-floor" y="858" width="1600" height="42"/>

  <!-- moonlight falling from the window across the floor -->
  <path class="hm-shaft" d="M100 420 L270 420 L560 900 L120 900 Z"/>

  <!-- left: arched window with lightning, curtains, oval portrait -->
  <g class="hm-window">
    <path d="M100 680 V420 Q185 270 270 420 V680 Z" fill="url(#hm-glass)"/>
    <g clip-path="url(#hm-winclip)">
      <circle class="hm-moon" cx="214" cy="410" r="26"/>
      <path class="hm-hill" d="M100 640 C150 610 210 625 270 600 V680 H100 Z"/>
      <path class="hm-tree" d="M150 640 C152 600 146 570 138 540 M146 586 C130 570 122 560 112 556 M144 566 C160 552 170 536 172 520 M140 548 C136 530 128 520 120 516"/>
      <path class="hm-grave" d="M210 640 V620 Q220 610 230 620 V640 Z M240 648 V634 Q246 628 252 634 V648 Z"/>
      <g class="hm-hand"><path d="M196 560 C188 560 184 550 186 538 L184 506 C184 500 192 500 192 506 L194 532 L194 496 C194 489 202 489 202 496 L203 530 L205 494 C205 487 213 487 213 494 L212 532 L216 504 C216 498 224 498 223 504 L220 546 C224 540 230 536 234 540 C236 544 226 556 218 566 C212 572 204 572 196 560 Z"/></g>
      <rect class="hm-flash" x="100" y="270" width="170" height="410"/>
      <path class="hm-bolt" d="M196 300 L176 380 L196 384 L168 470 L210 372 L188 368 L206 300 Z"/>
    </g>
    <path class="hm-muntin" d="M185 300 V680 M100 520 H270"/>
    <path class="hm-winframe" d="M100 680 V420 Q185 270 270 420 V680 Z"/>
    <rect class="hm-sill" x="88" y="680" width="194" height="12" rx="2"/>
  </g>
  ${curtain(96, false)}${curtain(274, true)}
  <path class="hm-valance" d="M76 262 H294 V282 C270 298 250 282 232 296 C214 282 196 300 185 288 C174 300 156 282 138 296 C120 282 100 298 76 282 Z"/>

  <g class="hm-oval">
    <ellipse class="hm-ovalbg" cx="180" cy="170" rx="58" ry="74"/>
    <g clip-path="url(#hm-ovalclip)">
      <g class="hm-lady">
        <circle class="hm-sitter-dark" cx="180" cy="98" r="16"/>
        <path class="hm-sitter-dark" d="M180 104 C214 104 228 130 226 160 C226 186 220 200 210 206 C214 180 212 150 196 138 C188 146 172 146 164 138 C148 150 146 180 150 206 C140 200 134 186 134 160 C132 130 146 104 180 104 Z"/>
        <path class="hm-sitter" d="M180 122 C200 122 208 138 208 154 C208 180 196 200 180 200 C164 200 152 180 152 154 C152 138 160 122 180 122 Z"/>
        <path class="hm-sitter-dark" d="M156 150 C160 130 174 124 182 126 C176 132 170 140 156 150 Z M204 150 C200 132 192 126 184 126 C192 134 196 140 204 150 Z"/>
        <path class="hm-sitter-dark" d="M140 250 C142 222 158 210 180 210 C202 210 218 222 220 250 Z"/>
        <path class="hm-face-line" d="M168 160 h6 M186 160 h6 M175 184 Q180 187 185 184"/>
        <path class="hm-pearls" d="M160 222 Q180 238 200 222"/>
      </g>
      <g class="hm-skull">
        <path class="hm-bone" d="M180 112 C206 112 220 132 218 158 C217 174 210 182 204 186 V200 H156 V186 C150 182 143 174 142 158 C140 132 154 112 180 112 Z"/>
        <path class="hm-socket" d="M158 150 C158 140 174 140 174 152 C174 164 158 164 158 150 Z M186 152 C186 140 202 140 202 150 C202 164 186 164 186 152 Z M176 170 L180 162 L184 170 Z"/>
        <path class="hm-socket" d="M164 192 V200 M172 192 V200 M180 192 V200 M188 192 V200 M196 192 V200"/>
        <path class="hm-bone" d="M140 250 C142 222 158 214 180 214 C202 214 218 222 220 250 Z"/>
      </g>
    </g>
    <ellipse class="hm-ovalframe" cx="180" cy="170" rx="62" ry="78"/>
    <ellipse class="hm-ovalframe-in" cx="180" cy="170" rx="55" ry="71"/>
    <path class="hm-giltbit" d="M168 86 Q180 70 192 86 Q186 82 180 90 Q174 82 168 86 Z"/>
  </g>

  <!-- right: portrait whose eyes follow the cursor -->
  <g class="hm-gent"><g class="hm-tilt">
    <rect class="hm-ovalbg" x="1362" y="92" width="136" height="176"/>
    <g clip-path="url(#hm-gentclip)">
      <path class="hm-sitter-dark" d="M1380 268 C1382 228 1404 214 1430 214 C1456 214 1478 228 1480 268 Z"/>
      <path class="hm-collar" d="M1416 216 L1430 236 L1444 216 Z"/>
      <path class="hm-sitter" d="M1430 132 C1454 132 1462 152 1460 172 C1458 194 1446 210 1430 210 C1414 210 1402 194 1400 172 C1398 152 1406 132 1430 132 Z"/>
      <path class="hm-sitter-dark" d="M1402 158 C1398 132 1412 118 1430 118 C1448 118 1462 132 1458 158 C1452 142 1442 138 1430 138 C1418 138 1408 142 1402 158 Z"/>
      <path class="hm-sitter-dark" d="M1414 190 Q1430 182 1446 190 Q1430 196 1414 190 Z"/>
      <path class="hm-brow" d="M1410 160 L1424 163 M1436 163 L1450 160"/>
      <ellipse class="hm-eyewhite" cx="1418" cy="170" rx="6" ry="4"/><ellipse class="hm-eyewhite" cx="1442" cy="170" rx="6" ry="4"/>
      <circle class="hm-pupil" cx="1418" cy="170" r="2.4"/><circle class="hm-pupil" cx="1442" cy="170" r="2.4"/>
    </g>
    <rect class="hm-frame" x="1356" y="86" width="148" height="188"/>
    <rect class="hm-frame-in" x="1364" y="94" width="132" height="172"/>
    <path class="hm-giltbit" d="M1416 84 Q1430 64 1444 84 Q1436 78 1430 88 Q1424 78 1416 84 Z"/>
    <rect class="hm-plaque" x="1408" y="276" width="44" height="10" rx="2"/>
  </g><path class="hm-wire" d="M1380 86 L1430 52 L1480 86"/><circle class="hm-ironball" cx="1430" cy="52" r="4"/></g>

  <!-- right: grandfather clock with pendulum and raven -->
  <g class="hm-clock">
    <path class="hm-clockwood" d="M1386 470 V380 Q1430 340 1474 380 V470 Z"/>
    <circle class="hm-clockface" cx="1430" cy="420" r="36"/>
    <path class="hm-clockticks" d="${ticks}"/>
    <path class="hm-clockhand" d="M1430 420 L1430 396 M1430 420 L1444 428"/>
    <rect class="hm-clockwood" x="1398" y="470" width="64" height="300"/>
    <rect class="hm-clockglass" x="1410" y="486" width="40" height="250" rx="20"/>
    <g class="hm-pendulum"><path class="hm-rod" d="M1430 486 V680"/><circle class="hm-bob" cx="1430" cy="694" r="14"/></g>
    <rect class="hm-clockwood" x="1388" y="770" width="84" height="90"/>
    <rect class="hm-clocktrim" x="1384" y="766" width="92" height="8"/>
    <g class="hm-raven">
      <path class="hm-ravenbody" d="M1420 352 C1404 350 1396 340 1398 330 C1388 334 1380 334 1374 330 C1384 326 1394 322 1404 322 C1408 312 1418 306 1428 308 C1434 300 1442 300 1446 304 L1458 302 L1448 310 C1452 318 1450 330 1442 338 C1440 346 1432 352 1420 352 Z"/>
      <circle class="hm-raveneye" cx="1440" cy="308" r="2"/>
    </g>
  </g>

  <!-- floating candelabra -->
  <g class="hm-candelabra">
    <path class="hm-iron" d="M200 830 L188 846 H232 L220 830 M210 830 V770 M180 770 Q180 790 210 790 Q240 790 240 770 M180 770 V762 M240 770 V762 M210 770 V756"/>
    ${candle(180, 740)}${candle(210, 734)}${candle(240, 740)}
  </g>

  <!-- a pair of ghost dancers waltzing across the floor -->
  <g class="hm-waltzpath"><g class="hm-waltz">
    <path class="hm-dancer" filter="url(#hm-soft)" d="M-14 -96 C-2 -96 2 -86 0 -76 C10 -70 14 -54 12 -40 C24 -10 34 20 40 40 C10 46 -18 46 -40 40 C-30 14 -22 -14 -14 -38 C-22 -54 -22 -70 -16 -76 C-24 -82 -24 -96 -14 -96 Z"/>
    <path class="hm-dancer" filter="url(#hm-soft)" d="M22 -104 C34 -104 38 -94 36 -84 C44 -76 46 -60 42 -44 L46 40 L34 40 L30 -10 L24 40 L12 40 L16 -44 C12 -60 12 -76 18 -84 C12 -90 12 -104 22 -104 Z"/>
    <path class="hm-dancer" d="M-4 -64 C10 -70 22 -70 34 -64"/>
  </g></g>

  <!-- the ghost drifting across the hall -->
  <g class="hm-ghostpath"><g class="hm-ghost">
    <path fill="url(#hm-ghostfill)" filter="url(#hm-soft)" d="M0 -80 C-44 -80 -66 -40 -66 6 C-66 40 -70 70 -84 104 C-70 96 -60 108 -48 98 C-38 112 -26 100 -16 112 C-6 100 6 112 18 100 C30 112 40 100 52 108 C58 92 66 80 66 40 C66 -30 44 -80 0 -80 Z"/>
    <path class="hm-ghostarm" filter="url(#hm-soft)" d="M-60 0 C-90 10 -110 30 -120 50 C-100 44 -84 30 -62 26 Z"/>
    <ellipse class="hm-ghosteye" cx="-20" cy="-30" rx="9" ry="13"/><ellipse class="hm-ghosteye" cx="18" cy="-30" rx="9" ry="13"/>
    <path class="hm-ghosteye" d="M-14 4 C-10 -6 10 -6 14 4 C12 20 -12 20 -14 4 Z"/>
  </g></g>

  ${web(0, 26, 1)}${web(1600, 26, -1)}
  <g class="hm-spider"><path class="hm-thread" d="M60 30 V-400"/>
    <path class="hm-spiderlegs" d="M52 36 L40 28 L34 34 M52 40 L38 40 L32 48 M52 44 L40 50 L36 60 M68 36 L80 28 L86 34 M68 40 L82 40 L88 48 M68 44 L80 50 L84 60"/>
    <ellipse class="hm-spiderbody" cx="60" cy="42" rx="9" ry="11"/><circle class="hm-spiderbody" cx="60" cy="29" r="6"/>
    <circle class="hm-spidereye" cx="58" cy="28" r="1.2"/><circle class="hm-spidereye" cx="62" cy="28" r="1.2"/></g>
  ${[0, 1, 2, 3, 4, 5].map(bat).join('')}
  <rect width="1600" height="900" fill="url(#hm-vignette)"/>
  <rect class="hm-roomflash" width="1600" height="900"/>
</svg>`;
}
