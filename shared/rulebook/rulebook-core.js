/* ===== Rulebook: search and display, the same code in the DM Codex and the Character Codex =====
   Data: RULEBOOK_DATA {cats:[{id,name}], rules:[{id,t,c,kind,src,k,s,b[],p,d,n24,r[]}]}  (kind: rule | faq | edge)
   Each app calls rbInit(host) once and rbRender() to draw. host = {
     audience: 'player' | 'dm',          // same rules, different order and emphasis
     el(): the panel element,
     library(): [{type, name, sub, run()}],   // things in this app's own library (spells, items, creatures…)
     loadHouse(): array or Promise of it,  saveHouse(array),   // house rules and notes: {id, rule, title, text, from, t}
     switches(): [{label, value}],  openSwitches(),            // the app's own house-rule switches
     toast(msg), copy(text) }
   House rules sit next to the rule they change (rule = its id) and all together under "House rules". */
const RB = {host:null, mode:'home', q:'', cat:'', open:{}, more:false, house:[], ready:false, edit:null, byId:{}, docs:null, vocab:null};
const RB_ORDER = {
  player:['combat-flow','actions','attacks','movement','conditions','spellcasting','resting','core','abilities','equipment','character','adventuring','faq','edge','dm'],
  dm:['dm','combat-flow','actions','attacks','conditions','movement','spellcasting','adventuring','core','abilities','resting','equipment','character','faq','edge']};
const RB_BLURB = {
  player:{'combat-flow':'How a fight starts and what a turn is', actions:'Everything you can do with your action', attacks:'Hitting, damage, dropping to 0', movement:'Getting around the battlefield', conditions:'What each condition does', spellcasting:'Slots, concentration, components', resting:'Short and long rests', core:'The d20, advantage, proficiency', abilities:'Checks, skills and saves', equipment:'Armor, weapons, magic items', character:'Levels, feats, multiclassing', adventuring:'Travel, light, hazards', faq:'The rules people get wrong most', edge:'Odd clashes with a known answer', dm:'What the DM uses behind the screen'},
  dm:{dm:'DCs, encounters, monsters, rulings', 'combat-flow':'Surprise, initiative, turns', actions:'What a creature can do on its turn', attacks:'Hits, damage, death', conditions:'What each condition does', movement:'Position, terrain, falling', spellcasting:'Casting rules and disputes', adventuring:'Travel, light, traps, hazards', core:'The d20, advantage, stacking', abilities:'Checks, skills and saves', resting:'Short and long rests', equipment:'Armor, weapons, magic items', character:'Levels, feats, multiclassing', faq:'What players ask most', edge:'Odd clashes with a known answer'}};
const RB_SYN = {aoo:'opportunity attack', oa:'opportunity attack', ba:'bonus action', crit:'critical hit', crits:'critical hit', hp:'hit points', thp:'temporary hit points', temp:'temporary', adv:'advantage', disadv:'disadvantage', conc:'concentration', aoe:'area', los:'line effect', ko:'knock out', nat:'natural', dual:'two weapon', twf:'two weapon fighting', invis:'invisible', invisibility:'invisible', stealth:'hide', sneaking:'hide', hiding:'hide', downed:'zero', dying:'death saves', revive:'healing zero', unconscious:'unconscious', mounted:'mount', riding:'mount', swim:'swimming', underwater:'underwater', dark:'darkness', blind:'blinded', smite:'smite', multiclass:'multiclass', mc:'multiclass', asi:'ability score improvement', xp:'experience', dc:'dc', ac:'armor ac', init:'initiative', oppo:'opportunity', potion:'potion', potions:'potion', scroll:'scroll', attune:'attunement', carry:'carrying', encumbered:'encumbrance', hb:'house', homebrew:'house'};
function rbEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function rbNorm(s){ return String(s||'').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
function rbStem(w){ if(w.length>4){ if(w.endsWith('ing')) return w.slice(0,-3); if(w.endsWith('ed')) return w.slice(0,-2); if(w.endsWith('es')) return w.slice(0,-2); } if(w.length>3 && w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0,-1); if(w.length>4 && w.endsWith('e')) w = w.slice(0,-1); return w; }
const RB_STOP = new Set(['a','an','the','of','to','in','on','is','it','i','do','does','can','you','your','my','and','or','for','with','what','how','when','if','are','be','at','as','me','that','this','there','get','have','has']);
function rbTokens(s){ return rbNorm(s).split(' ').filter(w=>w && !RB_STOP.has(w)).map(rbStem); }
function rbQueryTokens(q){ const out = []; rbNorm(q).split(' ').forEach(w=>{ if(!w) return; if(RB_SYN[w]) rbTokens(RB_SYN[w]).forEach(x=>out.push(x)); else if(!RB_STOP.has(w)) out.push(rbStem(w)); }); return [...new Set(out)]; }
function rbNear(a, b){   // one letter added, dropped or changed (for typos in longer words)
  if(Math.abs(a.length-b.length)>1 || a.length<5) return false;
  let i = 0, j = 0, d = 0;
  while(i<a.length && j<b.length){ if(a[i]===b[j]){ i++; j++; continue; } if(++d>1) return false; if(a.length>b.length) i++; else if(b.length>a.length) j++; else { i++; j++; } }
  return d + (a.length-i) + (b.length-j) <= 1;
}
function rbIndex(){
  if(RB.docs) return;
  RB.docs = RULEBOOK_DATA.rules.map(r=>{ RB.byId[r.id] = r; return {r, t:rbTokens(r.t), k:rbTokens(r.k), s:rbTokens(r.s), b:rbTokens((r.b||[]).join(' ')+' '+(r.p||'')+' '+(r.d||'')+' '+(r.n24||'')), title:rbNorm(r.t)}; });
}
function rbWordScore(q, words){ let best = 0; for(const w of words){ if(w===q) return 1; if(best<0.7 && q.length>=3 && (w.startsWith(q) || (w.length>=4 && q.startsWith(w)))) best = 0.7; else if(best<0.4 && rbNear(q, w)) best = 0.4; } return best; }
function rbScoreFields(qt, f){   // f: [[words, weight]…]
  let total = 0, matched = 0;
  for(const q of qt){ let s = 0; for(const [words, wt] of f){ const m = rbWordScore(q, words); if(m) s = Math.max(s, m*wt); } if(s){ matched++; total += s; } }
  if(!matched || matched < Math.ceil(qt.length/2)) return 0;
  return total * Math.pow(matched/qt.length, 2);
}
/* rules matching a query, best first: [{r, score}] */
function rbSearch(q, limit){
  rbIndex(); const qt = rbQueryTokens(q); if(!qt.length) return [];
  const phrase = rbNorm(q), aud = RB.host ? RB.host.audience : 'player', out = [];
  for(const d of RB.docs){
    let s = rbScoreFields(qt, [[d.t, 10], [d.k, 6], [d.s, 3], [d.b, 1]]); if(!s) continue;
    if(phrase.length>3 && d.title.includes(phrase)) s += 15;
    if(d.t.length) s += 8 * d.t.filter(w=>qt.includes(w)).length / d.t.length;   // a title that is mostly the query: the base rule comes first
    if(d.r.kind!=='rule') s *= 1.08;                                   // the confusing ones are what people look up
    if((aud==='dm' && d.r.d) || (aud==='player' && d.r.p)) s *= 1.05;   // a note written for this reader
    if(aud==='player' && d.r.c==='dm') s *= 0.85;
    out.push({r:d.r, score:s});
  }
  out.sort((a, b)=>b.score-a.score);
  const top = out.length ? out[0].score : 0;
  return out.filter(x=>x.score >= top*0.28).slice(0, limit||8);
}
function rbSearchHouse(q){ const qt = rbQueryTokens(q); if(!qt.length) return []; return RB.house.map(h=>({h, score:rbScoreFields(qt, [[rbTokens(h.title), 10], [rbTokens(h.text), 3]])})).filter(x=>x.score).sort((a, b)=>b.score-a.score).slice(0, 5).map(x=>x.h); }
function rbSearchLibrary(q){
  const qt = rbQueryTokens(q); if(!qt.length || !RB.host || !RB.host.library) return [];
  let items = []; try{ items = RB.host.library() || []; }catch(e){ items = []; }
  const phrase = rbNorm(q), out = [];
  for(const it of items){ const nm = rbNorm(it.name); let s = rbScoreFields(qt, [[rbTokens(it.name), 10]]); if(!s) continue; if(nm===phrase) s += 30; else if(nm.startsWith(phrase)) s += 12; else if(nm.includes(phrase)) s += 6; if(s >= 7*Math.min(qt.length, 2)) out.push({it, score:s}); }
  out.sort((a, b)=>b.score-a.score || a.it.name.localeCompare(b.it.name));
  return out.slice(0, 8).map(x=>x.it);
}
function rbCats(){ const aud = RB.host.audience, order = RB_ORDER[aud]; return order.map(id=>RULEBOOK_DATA.cats.find(c=>c.id===id)).filter(Boolean).map(c=>({id:c.id, name:(aud==='player' && c.id==='dm') ? 'For the DM' : c.name, blurb:RB_BLURB[aud][c.id]||'', n:RULEBOOK_DATA.rules.filter(r=>r.c===c.id).length})); }
function rbHouseFor(id){ return RB.house.filter(h=>h.rule===id); }
function rbKindTag(r){ return r.kind==='faq' ? '<span class="rb-tag rb-faq">Common question</span>' : r.kind==='edge' ? '<span class="rb-tag rb-edge">Edge case</span>' : ''; }
function rbHouseHtml(h){
  if(RB.edit && RB.edit.id===h.id) return rbEditHtml(h);
  const rule = h.rule && RB.byId[h.rule];
  return `<div class="rb-house" data-hid="${rbEsc(h.id)}"><div class="rb-house-hd"><span class="rb-tag rb-hb">${h.from==='dm' ? 'House rule (from the DM)' : 'House rule'}</span><b>${rbEsc(h.title||'Note')}</b>
    <button type="button" class="ghost tiny" data-rb="hedit" data-id="${rbEsc(h.id)}">Edit</button></div>
    <div class="rb-house-tx">${rbEsc(h.text).replace(/\n/g, '<br>')}</div>${rule && RB.mode==='house' ? `<button type="button" class="rb-rel" data-rb="go" data-id="${rbEsc(rule.id)}">Changes: ${rbEsc(rule.t)}</button>` : ''}</div>`;
}
function rbEditHtml(h){
  return `<div class="rb-house rb-edit" data-hid="${rbEsc(h.id)}"><input type="text" class="rb-h-title" value="${rbEsc(h.title||'')}" placeholder="Name of the house rule or note" aria-label="Name">
    <textarea class="rb-h-text" rows="3" placeholder="What your table does" aria-label="Text">${rbEsc(h.text||'')}</textarea>
    <div class="rb-row"><button type="button" class="tiny" data-rb="hsave" data-id="${rbEsc(h.id)}">Save</button><button type="button" class="ghost tiny" data-rb="hcancel">Cancel</button>${h.isNew ? '' : `<button type="button" class="ghost tiny rb-del" data-rb="hdel" data-id="${rbEsc(h.id)}">Delete</button>`}</div></div>`;
}
function rbEntryHtml(r, forceOpen){
  const open = forceOpen || !!RB.open[r.id], aud = RB.host.audience, house = rbHouseFor(r.id);
  const mine = aud==='dm' ? r.d : r.p, other = aud==='dm' ? r.p : r.d;
  const adding = RB.edit && RB.edit.isNew && RB.edit.rule===r.id;
  return `<div class="rb-entry ${open?'open':''} ${house.length?'has-house':''}" data-rid="${rbEsc(r.id)}" id="rb-${rbEsc(r.id)}">
    <button type="button" class="rb-head" data-rb="toggle" data-id="${rbEsc(r.id)}" aria-expanded="${open}"><span class="rb-caret">${open?'▾':'▸'}</span><span class="rb-title">${rbEsc(r.t)} ${rbKindTag(r)}${house.length ? ' <span class="rb-tag rb-hb">House rule</span>' : ''}</span></button>
    <div class="rb-short">${rbEsc(r.s)}</div>
    ${open ? `<div class="rb-body">
      ${(r.b||[]).length ? `<ul>${r.b.map(x=>`<li>${rbEsc(x)}</li>`).join('')}</ul>` : ''}
      ${mine ? `<div class="rb-note rb-mine"><b>${aud==='dm' ? 'Ruling it' : 'For you'}</b> ${rbEsc(mine)}</div>` : ''}
      ${r.n24 ? `<div class="rb-note rb-24"><b>2024 rules</b> ${rbEsc(r.n24)}</div>` : ''}
      ${other ? `<div class="rb-note rb-other"><b>${aud==='dm' ? 'Players should know' : 'For the DM'}</b> ${rbEsc(other)}</div>` : ''}
      ${house.map(rbHouseHtml).join('')}
      ${adding ? rbEditHtml(RB.edit) : ''}
      <div class="rb-foot">${(r.r||[]).filter(id=>RB.byId[id]).map(id=>`<button type="button" class="rb-rel" data-rb="go" data-id="${rbEsc(id)}">${rbEsc(RB.byId[id].t)}</button>`).join('')}
        ${adding ? '' : `<button type="button" class="ghost tiny" data-rb="hadd" data-rule="${rbEsc(r.id)}">＋ House rule or note here</button>`}<span class="rb-src">${rbEsc(r.src)}</span></div>
    </div>` : ''}</div>`;
}
function rbHomeHtml(){
  const cats = rbCats(), aud = RB.host.audience;
  const quick = aud==='dm' ? ['dc-table','improvised-damage','conditions:Conditions','surprise','concentration','cover','death-saves','encounter-building'] : ['your-turn','bonus-action-spell','concentration','conditions:Conditions','death-saves','hide','opportunity-attack','resting-short'];
  return `<div class="rb-quick"><span class="rb-lbl">Looked up most</span>${quick.map(x=>{ const [id, nm] = x.split(':'); return nm ? `<button type="button" class="rb-rel" data-rb="cat" data-id="${id}">${nm}</button>` : (RB.byId[id] ? `<button type="button" class="rb-rel" data-rb="go" data-id="${id}">${rbEsc(RB.byId[id].t)}</button>` : ''); }).join('')}</div>
    <div class="rb-cats">${cats.map(c=>`<button type="button" class="rb-cat" data-rb="cat" data-id="${c.id}"><b>${rbEsc(c.name)}</b><span>${rbEsc(c.blurb)}</span><i>${c.n}</i></button>`).join('')}
      <button type="button" class="rb-cat rb-cat-house" data-rb="house"><b>House rules</b><span>Your table's own rules and notes, all in one place</span><i>${RB.house.length}</i></button></div>
    <div class="rb-about">Rules are the 2014 books, in short form, with the source on each entry. Where the 2024 rules differ, the entry says how. "Designer comment" means advice, not an official ruling. The DM has the final say.</div>`;
}
function rbCatHtml(){
  const c = rbCats().find(x=>x.id===RB.cat); if(!c) return rbHomeHtml();
  const list = RULEBOOK_DATA.rules.filter(r=>r.c===c.id);
  return `<div class="rb-crumb"><button type="button" class="ghost tiny" data-rb="home">◂ All sections</button><b>${rbEsc(c.name)}</b><span class="rb-lbl">${list.length} entries</span>
      <button type="button" class="ghost tiny" data-rb="openall">${list.every(r=>RB.open[r.id]) ? 'Close all' : 'Open all'}</button></div>
    <div class="rb-list">${list.map(r=>rbEntryHtml(r)).join('')}</div>`;
}
function rbSearchHtml(){
  const rules = rbSearch(RB.q, RB.more ? 25 : 8), house = rbSearchHouse(RB.q), lib = rbSearchLibrary(RB.q);
  const all = RB.more ? rules.length : rbSearch(RB.q, 25).length;
  if(!rules.length && !house.length && !lib.length) return `<div class="rb-empty">Nothing found for "${rbEsc(RB.q)}". Try one or two plain words, like "hide" or "bonus action spell".</div>`;
  return `${house.length ? `<div class="rb-group"><div class="rb-lbl">House rules</div>${house.map(rbHouseHtml).join('')}</div>` : ''}
    ${rules.length ? `<div class="rb-group"><div class="rb-lbl">Rules</div><div class="rb-list">${rules.map((x, i)=>rbEntryHtml(x.r, i===0 && !(x.r.id in RB.open))).join('')}</div>
      ${!RB.more && all>rules.length ? `<button type="button" class="ghost tiny" data-rb="more">Show ${all-rules.length} more</button>` : ''}</div>` : ''}
    ${lib.length ? `<div class="rb-group"><div class="rb-lbl">In your library</div><div class="rb-lib">${lib.map((it, i)=>`<button type="button" class="rb-libitem" data-rb="lib" data-i="${i}"><span class="rb-tag">${rbEsc(it.type)}</span><b>${rbEsc(it.name)}</b>${it.sub ? `<span>${rbEsc(it.sub)}</span>` : ''}</button>`).join('')}</div></div>` : ''}`;
}
function rbHouseModeHtml(){
  const sw = (RB.host.switches && RB.host.switches()) || [], general = RB.house.filter(h=>!h.rule || !RB.byId[h.rule]), tied = RB.house.filter(h=>h.rule && RB.byId[h.rule]);
  const adding = RB.edit && RB.edit.isNew && !RB.edit.rule;
  return `<div class="rb-crumb"><button type="button" class="ghost tiny" data-rb="home">◂ All sections</button><b>House rules</b><span class="rb-lbl">${RB.house.length} written</span></div>
    <div class="rb-hint">Everything your table does differently. A rule written next to a book rule also shows there, tagged "House rule".</div>
    <div class="rb-row">${adding ? '' : '<button type="button" class="tiny" data-rb="hadd" data-rule="">＋ New house rule</button>'}
      ${RB.host.audience==='dm' ? '<button type="button" class="ghost tiny" data-rb="hshare" title="Copies a code your players paste into their Character Codex">Copy for players</button>' : '<button type="button" class="ghost tiny" data-rb="himport" title="Paste the code your DM copied from the DM Codex">Get the DM\'s house rules</button>'}</div>
    ${RB.importing ? `<div class="rb-house rb-edit"><textarea class="rb-h-code" rows="3" placeholder="Paste the code from your DM (it starts with HBR1.)" aria-label="Code"></textarea><div class="rb-row"><button type="button" class="tiny" data-rb="himportgo">Add them</button><button type="button" class="ghost tiny" data-rb="hcancel">Cancel</button></div></div>` : ''}
    ${adding ? rbEditHtml(RB.edit) : ''}
    ${general.length ? `<div class="rb-group"><div class="rb-lbl">General</div>${general.map(rbHouseHtml).join('')}</div>` : ''}
    ${tied.length ? `<div class="rb-group"><div class="rb-lbl">Next to a book rule</div>${tied.map(rbHouseHtml).join('')}</div>` : ''}
    ${!RB.house.length && !adding ? '<div class="rb-empty">No house rules written yet.</div>' : ''}
    ${sw.length ? `<div class="rb-group"><div class="rb-lbl">Switches in this app</div><div class="rb-sw">${sw.map(x=>`<div><span>${rbEsc(x.label)}</span><b>${rbEsc(x.value)}</b></div>`).join('')}</div>${RB.host.openSwitches ? '<button type="button" class="ghost tiny" data-rb="switches">Change these in Settings</button>' : ''}</div>` : ''}`;
}
function rbRender(){
  if(!RB.host) return; const el = RB.host.el(); if(!el) return; rbIndex();
  if(!el.dataset.rbBound){ el.dataset.rbBound = '1'; el.addEventListener('click', rbClick); el.addEventListener('input', rbInput); el.addEventListener('keydown', e=>{ if(e.key==='Escape' && e.target.classList.contains('rb-q') && RB.q){ rbSetQuery(''); } }); }
  const mode = RB.q.trim() ? 'search' : RB.mode;
  let shell = el.querySelector(':scope > .rb');
  if(!shell){
    el.innerHTML = `<div class="rb"><div class="rb-top"> <input type="text" inputmode="search" enterkeyhint="search" class="rb-q" placeholder="${RB.host.audience==='dm' ? 'Search the rules, your house rules and your library' : 'Search the rules, house rules and your character\'s library'}" aria-label="Search the rulebook" autocomplete="off" spellcheck="false"><button type="button" class="ghost tiny rb-clear" data-rb="clear" hidden>Clear</button></div><div class="rb-main"></div></div>`;
    shell = el.querySelector(':scope > .rb');
  }
  const inp = shell.querySelector('.rb-q'); if(inp.value!==RB.q && document.activeElement!==inp) inp.value = RB.q;
  shell.querySelector('.rb-clear').hidden = !RB.q;
  shell.dataset.mode = mode;
  shell.querySelector('.rb-main').innerHTML = mode==='search' ? rbSearchHtml() : mode==='cat' ? rbCatHtml() : mode==='house' ? rbHouseModeHtml() : rbHomeHtml();
  if(RB.focusId){ const t = shell.querySelector('#rb-'+RB.focusId); RB.focusId = null; if(t && t.scrollIntoView) t.scrollIntoView({block:'start'}); }
  const f = shell.querySelector('.rb-edit .rb-h-title, .rb-edit .rb-h-code'); if(f && RB.focusEdit){ RB.focusEdit = false; f.focus(); }
}
let rbTimer = null;
function rbInput(e){ if(!e.target.classList.contains('rb-q')) return; RB.q = e.target.value; RB.more = false; clearTimeout(rbTimer); rbTimer = setTimeout(rbRender, 140); }
function rbSetQuery(q){ RB.q = q||''; RB.more = false; const el = RB.host && RB.host.el(); const inp = el && el.querySelector('.rb-q'); if(inp) inp.value = RB.q; rbRender(); }
/* open one rule in its section (related links, the apps' own search) */
function rbOpen(id){ rbIndex(); const r = RB.byId[id]; if(!r) return false; RB.q = ''; RB.mode = 'cat'; RB.cat = r.c; RB.open[id] = true; RB.focusId = id; const el = RB.host && RB.host.el(); const inp = el && el.querySelector('.rb-q'); if(inp) inp.value = ''; rbRender(); return true; }
function rbSaveHouse(){ try{ RB.host.saveHouse(RB.house.map(h=>({id:h.id, rule:h.rule||'', title:h.title||'', text:h.text||'', from:h.from||'me', t:h.t||0}))); }catch(e){} }
function rbUid(){ return 'h'+Date.now().toString(36)+Math.random().toString(36).slice(2, 6); }
function rbShareCode(){ return 'HBR1.'+btoa(unescape(encodeURIComponent(JSON.stringify(RB.house.map(h=>({r:h.rule||'', n:h.title||'', x:h.text||''})))))); }
function rbImportCode(code){
  const m = String(code||'').match(/HBR1\.([A-Za-z0-9+/=]+)/); if(!m) return -1;
  let arr; try{ arr = JSON.parse(decodeURIComponent(escape(atob(m[1])))); }catch(e){ return -1; }
  if(!Array.isArray(arr)) return -1;
  RB.house = RB.house.filter(h=>h.from!=='dm').concat(arr.filter(x=>x && (x.n || x.x)).slice(0, 300).map(x=>({id:rbUid(), rule:String(x.r||''), title:String(x.n||'').slice(0, 200), text:String(x.x||'').slice(0, 4000), from:'dm', t:Date.now()})));
  rbSaveHouse(); return arr.length;
}
function rbClick(e){
  const b = e.target.closest('[data-rb]'); if(!b) return; const a = b.dataset.rb, id = b.dataset.id, say = m=>{ if(RB.host.toast) RB.host.toast(m); };
  if(a==='toggle'){ RB.open[id] = !(RB.open[id] || (b.closest('.rb-entry').classList.contains('open'))); }
  else if(a==='go'){ rbOpen(id); return; }
  else if(a==='cat'){ RB.mode = 'cat'; RB.cat = id; RB.q = ''; const i = RB.host.el().querySelector('.rb-q'); if(i) i.value = ''; }
  else if(a==='home'){ RB.mode = 'home'; RB.edit = null; RB.importing = false; }
  else if(a==='house'){ RB.mode = 'house'; RB.q = ''; const i = RB.host.el().querySelector('.rb-q'); if(i) i.value = ''; }
  else if(a==='clear'){ rbSetQuery(''); return; }
  else if(a==='more'){ RB.more = true; }
  else if(a==='openall'){ const list = RULEBOOK_DATA.rules.filter(r=>r.c===RB.cat), all = list.every(r=>RB.open[r.id]); list.forEach(r=>RB.open[r.id] = !all); }
  else if(a==='lib'){ const it = rbSearchLibrary(RB.q)[+b.dataset.i]; if(it && it.run) it.run(); return; }
  else if(a==='switches'){ if(RB.host.openSwitches) RB.host.openSwitches(); return; }
  else if(a==='hadd'){ RB.edit = {id:rbUid(), rule:b.dataset.rule||'', title:'', text:'', isNew:true}; RB.importing = false; RB.focusEdit = true; }
  else if(a==='hedit'){ const h = RB.house.find(x=>x.id===id); if(h){ RB.edit = h; RB.focusEdit = true; } }
  else if(a==='hcancel'){ RB.edit = null; RB.importing = false; }
  else if(a==='hsave'){
    const box = b.closest('.rb-edit'), title = box.querySelector('.rb-h-title').value.trim(), text = box.querySelector('.rb-h-text').value.trim();
    if(!title && !text){ say('Write a name or some text first.'); return; }
    const h = RB.edit; if(!h) return;
    if(h.isNew){ RB.house.push({id:h.id, rule:h.rule, title, text, from:'me', t:Date.now()}); if(h.rule) RB.open[h.rule] = true; }
    else { h.title = title; h.text = text; h.t = Date.now(); }
    RB.edit = null; rbSaveHouse(); say('House rule saved.');
  }
  else if(a==='hdel'){ RB.house = RB.house.filter(x=>x.id!==id); RB.edit = null; rbSaveHouse(); say('House rule deleted.'); }
  else if(a==='hshare'){ if(!RB.house.length){ say('Write a house rule first.'); return; } const code = rbShareCode(); if(RB.host.copy) RB.host.copy(code, 'House rules copied. Players paste the code in their Rulebook → House rules.'); return; }
  else if(a==='himport'){ RB.importing = true; RB.edit = null; RB.focusEdit = true; }
  else if(a==='himportgo'){ const n = rbImportCode(b.closest('.rb-edit').querySelector('.rb-h-code').value); if(n<0){ say('That is not a house rules code. It starts with HBR1.'); return; } RB.importing = false; say(`${n} house rule${n===1?'':'s'} from the DM added.`); }
  rbRender();
}
function rbInit(host){
  RB.host = host; rbIndex();
  Promise.resolve().then(()=>host.loadHouse ? host.loadHouse() : []).then(arr=>{ RB.house = Array.isArray(arr) ? arr.filter(h=>h && h.id) : []; RB.ready = true; const el = host.el(); if(el && el.querySelector(':scope > .rb')) rbRender(); }).catch(()=>{ RB.ready = true; });
}
