// Starting point for a new theme's backdrop. Copy to theme-demo/bg-<theme>.js,
// rename the prefix "xx-" to a short theme prefix (Haunted uses "hm-"), and fill each zone.
// The scene is one inline SVG; every colour comes from the palette's CSS variables.

// Seeded pseudo-random numbers, so the scene looks the same on every load.
const seq = (n, seed, f) => { let s = seed; return Array.from({ length: n }, (_, i) => {
  s = (s * 9301 + 49297) % 233280; const a = s / 233280;
  s = (s * 9301 + 49297) % 233280; return f(i, a, s / 233280); }); };

// A reusable prop: build small helpers like this for anything that repeats (candles, bottles, trees).
const prop = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle class="xx-prop" r="10"/></g>`;

export function xxScene() {
  return `<svg class="xx" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <!-- gradients use class-named <stop>s so CSS can colour them from the palette -->
    <linearGradient id="xx-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="xx-s1"/><stop offset="1" class="xx-s2"/></linearGradient>
    <filter id="xx-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>

  <!-- 1. GROUND: wall / sky / floor that fills the frame (static) -->
  <rect width="1600" height="900" fill="url(#xx-sky)"/>

  <!-- 2. FAR LAYER: silhouettes, low contrast, gives depth (mostly hidden by panels) -->

  <!-- 3. LEFT MARGIN (x 0–330): the hero element of the place + one living detail -->

  <!-- 4. RIGHT MARGIN (x 1270–1600): a second strong element + one living detail -->

  <!-- 5. BOTTOM STRIP (y 760–900): characters, floor props, something that moves across -->

  <!-- 6. AIR: things that drift or fly over everything (bats, petals, embers, pixies) -->
  ${seq(6, 3, (i, a, b) => prop(a * 1600, 200 + b * 400, .6)).join('')}

  <!-- 7. FINISH: vignette and any full-screen flash or tint layer -->
</svg>`;
}
