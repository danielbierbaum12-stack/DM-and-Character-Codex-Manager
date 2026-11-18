/* ===================== THEME TEXT TINTS AND LIGHT/DARK (same code in the DM Codex and the Character Codex) =====================
   Green, blue and red are fill colours; as text they need their own shade that is readable on the theme's cards
   (DESIGN.md, The Pigment Rule). themeApplyTints(vars) works those shades out for any theme: lighter on a dark theme,
   darker on a light one, until they reach 4.6:1 on every surface. It also tells the browser whether the theme is light
   or dark (native controls, scrollbars), and nudges the theme's own text colours (text, dim text, bright gold) until they
   read on its surfaces. themeAutoPick(id, themes) gives the theme to use when "Match my device" is on:
   Sunlit Parchment in light mode, the chosen theme (or Ink & Gold, if the chosen one is light) in dark mode. */
function themeHex(h){ h = String(h||'').trim().replace('#',''); if(h.length===3) h = h.split('').map(c=>c+c).join(''); return /^[0-9a-f]{6}$/i.test(h) ? [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)) : null; }
function themeLum(rgb){ const f = v=>{ v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }; return 0.2126*f(rgb[0]) + 0.7152*f(rgb[1]) + 0.0722*f(rgb[2]); }
function themeContrast(a, b){ const x = themeLum(a), y = themeLum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); }
function themeIsLight(vars){ const bg = themeHex(vars && vars.ink); return !!bg && themeLum(bg) > 0.35; }
function themeTint(pigment, surfaces, light){
  let c = themeHex(pigment); if(!c) return null;
  const ok = x=>surfaces.every(s=>themeContrast(x, s) >= 4.6);
  // change lightness only (hue and saturation stay), in small steps, until it reads on every surface
  const toHsl = ([r,g,b])=>{ r/=255; g/=255; b/=255; const mx = Math.max(r,g,b), mn = Math.min(r,g,b), l = (mx+mn)/2; let h = 0, s = 0;
    if(mx!==mn){ const d = mx-mn; s = l>0.5 ? d/(2-mx-mn) : d/(mx+mn); h = mx===r ? (g-b)/d + (g<b?6:0) : mx===g ? (b-r)/d + 2 : (r-g)/d + 4; h /= 6; } return [h, s, l]; };
  const toRgb = ([h,s,l])=>{ if(!s) return [l,l,l].map(v=>Math.round(v*255)); const q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
    const f = t=>{ t = (t+1)%1; return t<1/6 ? p+(q-p)*6*t : t<1/2 ? q : t<2/3 ? p+(q-p)*(2/3-t)*6 : p; }; return [f(h+1/3), f(h), f(h-1/3)].map(v=>Math.round(v*255)); };
  let hsl = toHsl(c);
  for(let i=0; i<80 && !ok(c); i++){ hsl[2] = Math.max(0, Math.min(1, hsl[2] + (light ? -0.01 : 0.01))); c = toRgb(hsl); }
  return '#' + c.map(v=>v.toString(16).padStart(2,'0')).join('');
}
function themeApplyTints(vars){
  if(!vars) return;
  const light = themeIsLight(vars), surfaces = ['ink','panel','panel2'].map(k=>themeHex(vars[k])).filter(Boolean);
  const root = document.documentElement;
  [['emerald','emerald-text'], ['azure','azure-text'], ['blood-bright','blood-text']].forEach(([from, to])=>{ const t = themeTint(vars[from] || vars.blood, surfaces, light); if(t) root.style.setProperty('--'+to, t); });
  // the theme's own text colours must read on its surfaces too (a custom palette, or gold that is too pale on parchment)
  ['parchment', 'parchment-dim', 'gold-bright'].forEach(k=>{ const v = themeHex(vars[k]); if(!v) return;
    const fixed = themeTint(vars[k], surfaces, light); if(fixed && fixed.toLowerCase()!==String(vars[k]).toLowerCase()) root.style.setProperty('--'+k, fixed); });
  root.style.colorScheme = light ? 'light' : 'dark';
  root.classList.toggle('light-theme', light);
}
function themePrefersLight(){ return !!(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches); }
function themeAutoPick(id, themes){
  const chosen = themes.find(t=>t.id===id) || themes[0];
  if(themePrefersLight()) return (themes.find(t=>t.id==='sunlit-parchment') || chosen).id;
  return themeIsLight(chosen.vars) ? themes[0].id : chosen.id;
}
