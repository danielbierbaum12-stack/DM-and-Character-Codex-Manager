// Haunted Manor pieces from theme-demo/app.js.

// Theme definition (THEMES.haunted): fonts and the four palettes.
  haunted: {
    name: 'Haunted Manor', short: 'Haunted', icon: 'ghost',
    images: ['grain.webp'],
    fonts: ['600 1em "Spectral SC"', '400 1em "EB Garamond"', '600 1em "EB Garamond"'],
    palettes: [
      { name: 'Spectral Green', wall: '#1c2421', wall2: '#232d29', gilt: '#b39b5e', ecto: '#8dffc8', panel: 'rgba(14,20,18,.8)', text: '#e8f0ea', muted: '#a9bcb2', sw: ['#232d29', '#b39b5e', '#8dffc8'] },
      { name: "Widow's Violet", wall: '#221a2a', wall2: '#2a2033', gilt: '#a8906a', ecto: '#c9a6ff', panel: 'rgba(20,14,26,.8)', text: '#efe8f4', muted: '#bfb2cc', sw: ['#2a2033', '#a8906a', '#c9a6ff'] },
      { name: 'Pale Spirit', wall: '#182230', wall2: '#1e2a3a', gilt: '#a5a08a', ecto: '#9fdcff', panel: 'rgba(12,18,28,.8)', text: '#e8f0f8', muted: '#aebfd0', sw: ['#1e2a3a', '#a5a08a', '#9fdcff'] },
      { name: 'Faded Rose', wall: '#2a1a1e', wall2: '#331f25', gilt: '#b8956a', ecto: '#ffb3c4', panel: 'rgba(26,14,18,.8)', text: '#f6e9ec', muted: '#cdb2b9', sw: ['#331f25', '#b8956a', '#ffb3c4'] },
    ],
  },

// Hit points, slot hint and panel decoration lines:
  haunted: 'Each spirit is one slot. Tap to release or recall it.',
  if (state.theme === 'haunted') return `<div class="hp-ecto" ${aria}><div class="fill" style="width:${pct}%"></div></div>`;
  haunted: { panel: `<div class="decor" aria-hidden="true"><span class="dc hweb">${ico('spider-web')}</span><span class="dc hspider"><i></i></span></div>`, frame: corners('haunted') },
  if (state.theme === 'haunted') return hauntedScene();

// The cursor-following eyes need --ex/--ey set on pointermove:
//   root.style.setProperty('--ex', ((x / innerWidth) * 2 - 1).toFixed(3));
//   root.style.setProperty('--ey', ((y / innerHeight) * 2 - 1).toFixed(3));
