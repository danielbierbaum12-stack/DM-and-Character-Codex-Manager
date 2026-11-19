/* ===================== TAP TO EXPLAIN (same code in the DM Codex and the Character Codex) =====================
   Small marks such as "C" (concentration), "R" (ritual) or "↑" (upcast) explain themselves with a title, which only
   shows on hover with a mouse. On a phone nothing shows. Tapping (or clicking) one of these marks now shows a small
   bubble with what it means, next to the mark. Only the marks listed in TAP_TIP_SEL (plus anything with data-tip) take
   part, and never a real button, link or field, so every control still does what it did. The bubble goes away on the
   next tap, scrolling away, Escape, or after a few seconds. It is announced to screen readers (role="status").
   Each app adds its own marks with tapTipsStart(extraSelector). */
const TAP_TIP_SEL = '.badge[title], [data-tip]';
const TAP_TIP = {el:null, timer:null, sel:TAP_TIP_SEL, src:null};
function tapTipText(t){ return (t.getAttribute('data-tip') || t.getAttribute('title') || t.getAttribute('aria-label') || '').trim(); }
function tapTipHide(){
  clearTimeout(TAP_TIP.timer);
  if(TAP_TIP.el){ TAP_TIP.el.remove(); TAP_TIP.el = null; }
  if(TAP_TIP.src){ TAP_TIP.src.removeAttribute('aria-describedby'); TAP_TIP.src = null; }
}
function tapTipShow(target){
  const text = tapTipText(target); if(!text) return false;
  tapTipHide();
  const b = document.createElement('div');
  b.className = 'tap-tip'; b.id = 'tapTip'; b.setAttribute('role', 'status'); b.textContent = text;
  document.body.appendChild(b);
  const r = target.getBoundingClientRect(), w = b.offsetWidth, h = b.offsetHeight, gap = 6;
  let x = r.left + r.width/2 - w/2; x = Math.max(8, Math.min(x, document.documentElement.clientWidth - w - 8));
  let y = r.bottom + gap; if(y + h > window.innerHeight - 8) y = r.top - h - gap;   // above when there is no room below
  b.style.left = Math.round(x + window.scrollX) + 'px'; b.style.top = Math.round(Math.max(8, y) + window.scrollY) + 'px';
  target.setAttribute('aria-describedby', 'tapTip');
  TAP_TIP.el = b; TAP_TIP.src = target; TAP_TIP.y = window.scrollY;
  TAP_TIP.timer = setTimeout(tapTipHide, Math.min(9000, 3500 + text.length*40));
  return true;
}
function tapTipsStart(extra){
  if(extra) TAP_TIP.sel = TAP_TIP_SEL + ', ' + extra;
  if(TAP_TIP.started) return; TAP_TIP.started = true;
  // capture phase: a mark inside a clickable row (a spell's name toggles its details) explains itself instead
  document.addEventListener('click', e=>{
    const t = e.target.closest && e.target.closest(TAP_TIP.sel);
    if(!t || t.closest('button, a[href], input, select, textarea, label, summary, [contenteditable="true"]')) { if(TAP_TIP.el && !(t && t===TAP_TIP.src)) tapTipHide(); return; }
    if(TAP_TIP.src===t){ tapTipHide(); e.preventDefault(); e.stopPropagation(); return; }   // a second tap closes it
    if(tapTipShow(t)){ e.preventDefault(); e.stopPropagation(); }
  }, true);
  window.addEventListener('scroll', ()=>{ if(TAP_TIP.el && Math.abs(window.scrollY - TAP_TIP.y) > 40) tapTipHide(); }, {passive:true});   // small nudges (the page keeping its place) don't close it
  let vw = window.innerWidth; window.addEventListener('resize', ()=>{ if(TAP_TIP.el && window.innerWidth!==vw) tapTipHide(); vw = window.innerWidth; });   // a phone's address bar sliding away is not a reason
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && TAP_TIP.el) tapTipHide(); });
  const css = document.createElement('style');
  css.textContent = `.tap-tip{position:absolute;z-index:10050;max-width:min(280px, calc(100vw - 16px));padding:7px 10px;border-radius:8px;
    background:var(--panel2, #231e1a);color:var(--parchment, #e9dfc4);border:1px solid var(--gold, #b8923f);box-shadow:0 6px 18px rgba(0,0,0,.35);
    font-size:13px;line-height:1.4;font-weight:normal;font-style:normal;text-transform:none;letter-spacing:normal;pointer-events:none;animation:tapTipIn .12s ease-out;}
  @keyframes tapTipIn{from{opacity:0}to{opacity:1}}
  @media (prefers-reduced-motion: reduce){.tap-tip{animation:none}}
  body.reduce-motion .tap-tip, body.calm .tap-tip{animation:none}`;
  document.head.appendChild(css);
}
