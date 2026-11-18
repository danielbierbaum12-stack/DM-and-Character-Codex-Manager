/* ===================== CALM FOLDS (same code in the DM Codex and the Character Codex) =====================
   A <details> section opens and closes in place:
   - In every view, its header stays where it was on the screen (closing a long section while scrolled down no longer
     throws the header off screen).
   - In "All the fixings": opening fades the content in with a 4 px drift (160 ms); closing shrinks the section
     smoothly (180 ms) before it shuts, instead of vanishing.
   - Other views and reduced motion: instant, as before. */
(function(){
  const fancy = ()=>{ try{
    if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if(document.body.classList.contains('reduce-motion')) return false;
    return typeof viewLevelNow==='function' && viewLevelNow()==='all';
  }catch(e){ return false; } };
  const content = (d, s)=>[...d.children].filter(k=>k!==s);
  document.addEventListener('click', e=>{
    const s = e.target.closest && e.target.closest('summary'); if(!s || e.defaultPrevented) return;
    const d = s.parentElement; if(!d || d.tagName!=='DETAILS') return;
    if(e.target!==s && e.target.closest('a, input, select, textarea, button')) return;   // a control inside the header does its own thing
    const top = s.getBoundingClientRect().top;
    const keep = ()=>{ const now = s.getBoundingClientRect().top; if(Math.abs(now - top) > 1) window.scrollBy(0, now - top); };
    if(d.open && fancy() && d.animate){
      e.preventDefault();
      if(d.dataset.closing) return;
      d.dataset.closing = '1';
      const h = d.getBoundingClientRect().height, sh = s.getBoundingClientRect().height + parseFloat(getComputedStyle(d).paddingTop) + parseFloat(getComputedStyle(d).paddingBottom);
      const prevOverflow = d.style.overflow; d.style.overflow = 'hidden';
      content(d, s).forEach(k=>k.animate([{opacity:1}, {opacity:0}], {duration:140, fill:'forwards'}));
      const a = d.animate([{height:h+'px'}, {height:Math.max(0, sh)+'px'}], {duration:180, easing:'cubic-bezier(.2,.7,.2,1)'});
      const done = ()=>{ d.open = false; d.style.overflow = prevOverflow; delete d.dataset.closing; content(d, s).forEach(k=>k.getAnimations().forEach(x=>x.cancel())); keep(); };
      a.onfinish = done; a.oncancel = done;
      return;
    }
    requestAnimationFrame(()=>{
      keep();
      if(d.open && fancy() && d.animate) content(d, s).forEach(k=>k.animate([{opacity:0, transform:'translateY(-4px)'}, {opacity:1, transform:'none'}], {duration:160, easing:'ease-out'}));
    });
  });
})();
