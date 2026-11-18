/* ===================== FIELD NAMES FOR SCREEN READERS (same code in the DM Codex and the Character Codex) =====================
   Many fields show their name in a <label> or text right beside them without linking it. This links them, so screen
   readers say "Character name, edit text" instead of "edit text". Order: the label already beside the field (in the
   same .field / box), a checkbox's row name and column heading in a table, the text just before it, then the
   placeholder. It never changes what is on the screen, and skips fields that already have a name. */
function a11yNameFields(root){
  const els = (root||document).querySelectorAll('input:not([type=hidden]):not([type=button]):not([type=submit]), select, textarea');
  let n = 0;
  const txt = el=>(el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  const short = s=>s && s.length<=60 && !/^[\s+−\-–✕×▾▸⋯•]*$/.test(s);
  els.forEach(e=>{
    if((e.labels && e.labels.length) || e.hasAttribute('aria-label') || e.hasAttribute('aria-labelledby') || e.title) return;
    let name = '', lab = null;
    // 1. a <label> (or .field-hd label) beside the field, in the same box, not linked to anything else
    for(let p = e.parentElement, i = 0; p && i<3 && !lab; p = p.parentElement, i++){
      const c = p.querySelector(':scope > label, :scope > .field-hd > label');
      if(c && !c.htmlFor && !c.contains(e) && !c.querySelector('input,select,textarea') && short(txt(c))) lab = c;
    }
    if(lab){ if(!lab.id) lab.id = 'lbl-'+Math.random().toString(36).slice(2, 9); e.setAttribute('aria-labelledby', lab.id); n++; return; }
    // 2. a checkbox or field in a table: the row's name and the column heading
    const td = e.closest('td');
    if(td){ const tr = td.parentElement, table = td.closest('table');
      const rowName = [...tr.children].map(txt).find(t=>t && t.length<=60 && !/^[\d\s+\-–—/:.%]*$/.test(t)) || '';
      const th = table && table.tHead ? table.tHead.rows[0] && table.tHead.rows[0].cells[td.cellIndex] : null;
      const head = txt(th);
      name = rowName ? (short(head) ? head+': '+rowName : (e.type==='checkbox' ? 'Choose '+rowName : rowName)) : head;
    }
    // 3. short text just before the field
    if(!name){ const prev = e.previousElementSibling; if(prev && !/^(INPUT|SELECT|TEXTAREA|BUTTON|SUMMARY)$/.test(prev.tagName) && short(txt(prev))) name = txt(prev); }
    // 4. the placeholder
    if(!name && e.placeholder) name = e.placeholder.replace(/[…\.]+$/, '');
    if(name){ e.setAttribute('aria-label', name); n++; }
  });
  return n;
}
(function(){
  let queued = false;
  const run = ()=>{ queued = false; try{ a11yNameFields(document); }catch(e){} };
  const start = ()=>{ run(); if(window.MutationObserver) new MutationObserver(()=>{ if(!queued){ queued = true; if(window.requestIdleCallback) requestIdleCallback(run, {timeout:300}); else setTimeout(run, 60); } }).observe(document.body, {childList:true, subtree:true}); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

/* ===================== PAGE STRUCTURE AND THE MAIN TAB BAR (same code in both apps) =====================
   The page language, one level-1 heading, a "main" area for the panels, and a main tab bar that works from the
   keyboard: Tab reaches the open tab, the arrow keys (and Home / End) move between tabs, Enter or Space opens one.
   Screen readers hear "tab, 3 of 14, selected". Clicks work exactly as before. */
function a11yStructure(){
  const de = document.documentElement;
  if(!de.lang) de.lang = 'en';
  if(!document.querySelector('h1, [role=heading][aria-level="1"]')){ const b = document.querySelector('.brand-name'); if(b){ b.setAttribute('role', 'heading'); b.setAttribute('aria-level', '1'); } }
  const firstPanel = document.querySelector('.panel[id^="panel-"]');
  if(firstPanel && !document.querySelector('main, [role=main]')) firstPanel.parentElement.setAttribute('role', 'main');
  const bar = document.getElementById('mainTabs'); if(!bar) return;
  bar.setAttribute('role', 'tablist');
  const tabs = [...bar.querySelectorAll('.tab[data-tab]')];
  const cur = tabs.find(t=>t.classList.contains('active')) || tabs[0];
  tabs.forEach(t=>{
    t.setAttribute('role', 'tab');
    const on = t===cur, panel = document.getElementById('panel-'+t.dataset.tab);
    if(t.getAttribute('aria-selected')!==String(on)) t.setAttribute('aria-selected', String(on));
    if(t.tabIndex!==(on ? 0 : -1)) t.tabIndex = on ? 0 : -1;
    if(panel){ t.setAttribute('aria-controls', panel.id); if(!panel.hasAttribute('role')) panel.setAttribute('role', 'tabpanel'); }
    if(!t.getAttribute('aria-label')){ const l = t.querySelector('.tab-label'); if(l && l.textContent.trim()) t.setAttribute('aria-label', l.textContent.trim()); }
  });
  if(!bar.dataset.kbd){ bar.dataset.kbd = '1';
    bar.addEventListener('keydown', e=>{
      const t = e.target.closest('.tab[data-tab]'); if(!t) return;
      const list = [...bar.querySelectorAll('.tab[data-tab]')].filter(x=>x.offsetParent!==null);
      const i = list.indexOf(t); let j = -1;
      if(e.key==='ArrowRight' || e.key==='ArrowDown') j = (i+1) % list.length;
      else if(e.key==='ArrowLeft' || e.key==='ArrowUp') j = (i-1+list.length) % list.length;
      else if(e.key==='Home') j = 0; else if(e.key==='End') j = list.length-1;
      else if(e.key==='Enter' || e.key===' '){ e.preventDefault(); t.click(); return; }
      if(j<0) return;
      e.preventDefault(); list.forEach(x=>{ x.tabIndex = -1; }); list[j].tabIndex = 0; list[j].focus();
    });
    // keep "selected" right when the open tab changes (a class change, not a new element)
    if(window.MutationObserver) new MutationObserver(()=>a11yStructure()).observe(bar, {subtree:true, attributes:true, attributeFilter:['class']});
  }
}
(function(){ const go = ()=>{ try{ a11yStructure(); }catch(e){} };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', go); else go(); })();
