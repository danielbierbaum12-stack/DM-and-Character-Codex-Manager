"""Build the master game data from both apps, and report where they disagree.

    python3 tools/build_master.py

Reads the Character Codex (Character_Codex.html + Dnd Spreadsheet.xlsx) and the DM Codex (Source/*.min.json), merges
them field by field (rules in README.md), applies shared/corrections.json, and writes:

    shared/master/spells.json      every spell, both apps' fields
    shared/master/creatures.json   the Character Codex companions / summons / Wild Shape forms, checked against the bestiary
    shared/master/items.json       the item catalogue
    shared/master/conditions.json  short (player sheet) and full (DM) condition text
    shared/Codex Master Data.xlsx  the same, as a spreadsheet
    reports/congruence-report.md   what differed, which side won, and what each app still needs (apply_master.py)

It only reads the apps. Run apply_master.py to write the master back into them.
"""
import copy, datetime, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import codex_io as io
from codex_io import norm

CORR = io.load_json(os.path.join(io.ROOT, 'shared', 'corrections.json'))
MASTER = os.path.join(io.ROOT, 'shared', 'master')
os.makedirs(MASTER, exist_ok=True)

cc = io.load_cc()
dm = io.load_dm()
sheet = io.load_sheet_spells()
log = {'spells': [], 'creatures': [], 'notes': []}   # (name, field, cc value, dm value, master value, reason)


# ------------------------------------------------------------------ text helpers
def cap(t):
    return t[:1].upper() + t[1:] if t else t


def plural(text):
    """'8 hour' -> '8 hours', '1 bonus' -> '1 bonus action', '1 miles' -> '1 mile'."""
    t = str(text or '').strip().replace('dispeled', 'dispelled')
    t = re.sub(r'\b1 (minute|hour|day|round|mile|year)s\b', r'1 \1', t)
    t = re.sub(r'^1 bonus$', '1 bonus action', t)
    t = re.sub(r'\b([2-9]|\d\d+) (minute|hour|day|round|mile|year)\b', r'\1 \2s', t)
    return t


def master_dur(s):
    d = cap(plural(s.get('dur', '')))
    if s.get('conc') and d and not d.lower().startswith('up to') and not d.lower().startswith('instantaneous'):
        d = 'Up to ' + d[:1].lower() + d[1:]
    return d


def fmt_comp(row):
    """Spreadsheet 'v, s, m' + '(a tiny ball of bat guano)' -> 'V, S, M (a tiny ball of bat guano)'."""
    if not row or not row.get('components'):
        return ''
    parts = ', '.join(p.strip().upper() for p in str(row['components']).split(',') if p.strip())
    mat = row.get('materials')
    if mat:
        mat = str(mat).strip()
        m = re.search(r"'text':\s*(['\"])(.*?)\1", mat)
        mat = m.group(2) if m else mat.strip('()').strip()
        if mat:
            parts += f' ({mat})'
    return parts


def fmt_dm_comp(c):
    """DM 'VSM (A tiny ball...)' -> 'V, S, M (a tiny ball...)' (fallback when the spreadsheet lacks a spell)."""
    m = re.match(r'^([VSM]+)\s*(\((.*)\))?$', c or '', re.S)
    if not m:
        return c or ''
    out = ', '.join(m.group(1))
    if m.group(3):
        out += ' (' + m.group(3)[:1].lower() + m.group(3)[1:].rstrip('.') + ')'
    return out


HL = re.compile(r'\n*\s*At Higher Levels[.:]?\s*', re.I)


def higher_levels(desc):
    m = HL.search(desc or '')
    return desc[m.end():].strip() if m else ''


# ------------------------------------------------------------------ spells
aliases = dm['spell_aliases']                         # Character Codex name -> DM (SRD) name
dm_spells = {norm(s['n']): s for s in dm['spells']}
spells = []
for s in cc['SPELLS']:
    dm_name = aliases.get(s['n'], s['n'])
    d = dm_spells.get(norm(dm_name))
    m = copy.deepcopy(s)
    m['school'] = cap(s.get('school', ''))
    m['time'] = plural(s.get('time', ''))
    m['range'] = cap(plural(s.get('range', '')))
    m['dur'] = master_dur(s)
    m['ritual'] = bool(s.get('ritual')) or bool(d and d.get('ritual'))
    m['comp'] = fmt_comp(sheet.get(norm(s['n']))) or (fmt_dm_comp(d.get('comp')) if d else '')
    if dm_name != s['n']:
        m['dmName'] = dm_name
    # Higher-level text: the Character Codex mostly keeps upcasting as numbers only; the SRD text says it in words.
    if d and not higher_levels(s.get('desc')) and higher_levels(d.get('desc')):
        m['desc'] = s['desc'].rstrip() + '\n\nAt Higher Levels. ' + higher_levels(d['desc'])
        log['spells'].append((s['n'], 'desc', '(no higher-level text)', '(has it)', 'added the SRD At Higher Levels text', 'from DM'))
    fix = {k: v for k, v in CORR['spells'].get(s['n'], {}).items() if not k.startswith('_')}
    m.update(fix)
    # log every field where the apps disagreed and who won
    if d and d.get('src') != 'cc':
        pairs = [('school', s.get('school', ''), d.get('sch', '')), ('cls', sorted(s.get('cls') or []), sorted(d.get('cls') or [])),
                 ('range', s.get('range', ''), d.get('range', '')), ('lvl', s.get('lvl'), d.get('lvl'))]
        for f, a, b in pairs:
            mv = m.get(f)
            if str(a).lower() != str(b).lower():
                why = CORR['spells'].get(s['n'], {}).get('_why') if f in fix else 'Character Codex (rules-reviewed) wins'
                log['spells'].append((s['n'], f, a, b, mv, why))
        if s.get('desc') and d.get('desc') and s['desc'] != d['desc']:
            import difflib
            r = difflib.SequenceMatcher(None, s['desc'][:500], re.sub(HL, ' ', d['desc'])[:500]).ratio()
            if r < 0.75:
                log['spells'].append((s['n'], 'desc', 'book wording', f'{r:.0%} similar (loose SRD translation)', 'Character Codex wording', 'Character Codex wins'))
    spells.append(m)
spells.sort(key=lambda x: (x['lvl'], x['n']))

# ------------------------------------------------------------------ creatures
ABL = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
bestiary = {norm(x['n']): x for x in dm['monsters']}
dice_sp = lambda t: re.sub(r'(\d+d\d+)\s*([+-])\s*(\d+)', r'\1\2\3', t or '')
nums = lambda t: re.findall(r'[+-]\d+ to hit|\d+ \(\d+d\d+(?:[+-]\d+)?\)|DC \d+', dice_sp(t))


def first_int(v):
    m = re.search(r'\d+', str(v))
    return int(m.group()) if m else None


creatures = []
for c in cc['CREATURE_DB']:
    m = copy.deepcopy(c)
    b = bestiary.get(norm(c['n']))
    if b:
        corrected = set(CORR['creatures'].get(c['n'], {}))
        def setf(field, new, old):
            if new != old and field not in corrected:
                log['creatures'].append((c['n'], field, old, new, new, 'SRD bestiary (DM Codex) wins'))
                m[field] = new
        setf('size', b['sz'], c.get('size'))
        setf('abil', dict(zip(ABL, b['ab'])), {k: int(v) for k, v in (c.get('abil') or {}).items()})
        hp = f"{b['hp']} ({b['hd'].replace(' ', '')})" if b.get('hd') else str(b['hp'])
        if first_int(c['hp']) != b['hp'] or (b.get('hd') and b['hd'].replace(' ', '') not in str(c['hp']).replace(' ', '')):
            setf('hp', hp, c['hp'])
        if first_int(c.get('ac')) != b['acv']:
            setf('ac', b['acv'], c.get('ac'))
        if str(c.get('cr')) != str(b.get('crd')):
            setf('cr', b['crd'], c.get('cr'))
        if norm(c.get('speed', '')).replace('0ft', '', 1) != norm(b.get('sp', '')) and norm(c.get('speed', '')) != norm(b.get('sp', '')):
            setf('speed', b['sp'], c.get('speed'))
        have_t = {t['n'] for t in m.get('traits', [])}
        for t in b.get('tr', []):
            if t['n'] not in have_t:
                m.setdefault('traits', []).append({'n': t['n'], 'd': t['d']})
                log['creatures'].append((c['n'], 'trait', '(missing)', t['n'], t['n'], 'SRD bestiary (DM Codex) wins'))
        b_act = {a['n'].split(' (')[0]: a for a in b.get('ac_actions', []) + b.get('rx', [])}
        for a in m.get('actions', []):
            ba = b_act.get(a['n'].split(' (')[0])
            if ba and nums(a.get('d')) != nums(ba.get('d')):
                log['creatures'].append((c['n'], 'action ' + a['n'], ', '.join(nums(a.get('d'))), ', '.join(nums(ba['d'])), 'SRD text', 'SRD bestiary (DM Codex) wins'))
                a['d'] = dice_sp(ba['d']).rstrip('.') + '.'
    fix = {k: v for k, v in CORR['creatures'].get(c['n'], {}).items() if not k.startswith('_')}
    for k, v in fix.items():
        bk = {'speed': 'sp'}.get(k)
        if c.get(k) == v and (not b or not bk or b.get(bk) == v):
            m[k] = v; continue
        log['creatures'].append((c['n'], k, c.get(k) if k != 'actions' else '(see app)', (b or {}).get({'speed': 'sp'}.get(k, k), '—') if k == 'speed' else '—', v if k != 'actions' else '(corrected)', CORR['creatures'][c['n']]['_why']))
        m[k] = v
    creatures.append(m)

# ------------------------------------------------------------------ conditions
full = {x['n']: x['desc'] for x in dm['conditions']}
conditions = []
for n, short in io.cc_status_effects():
    base = 'Exhaustion' if n.startswith('Exhaustion') else n
    conditions.append({'n': n, 'short': short, 'full': full.get(base, '')})
for n, d in full.items():
    if n != 'Exhaustion' and n not in {c['n'] for c in conditions}:
        conditions.append({'n': n, 'short': '', 'full': d})

# ------------------------------------------------------------------ items
items = cc['ITEM_DB']
dm_items = {x['n'] for x in dm['items']}
missing_items = [i['n'] for i in items if i['n'] not in dm_items]
if missing_items:
    log['notes'].append(f'{len(missing_items)} Character Codex items are not in the DM Codex catalogue yet: {", ".join(missing_items[:20])}')

# ------------------------------------------------------------------ item prices, rarity and CR (shared/item-pricing.json)
PR = io.load_json(os.path.join(io.ROOT, 'shared', 'item-pricing.json'))
RAR = re.compile(r'\b(very rare|uncommon|common|rare|legendary|artifact)\b', re.I)
unpriced = []
items = copy.deepcopy(items)
for i in items:
    n, rar, base = i['n'], None, 0
    plus = re.match(r'^(.*) \+([123])$', n)
    if n in PR['mundane']:
        rar = 'mundane'
    elif n in PR['rarity']:
        rar = PR['rarity'][n]
    elif plus and i.get('type') in PR['plusN'] and plus.group(1) in PR['mundane']:
        rar, base = PR['plusN'][i['type']][plus.group(2)], PR['mundane'][plus.group(1)]
    else:
        found = RAR.findall(i.get('notes', ''))
        rar = found[-1].lower() if found else None
    if rar == 'mundane':
        price = PR['mundane'][n]
    elif rar in PR['rarityPrice']:
        price = PR['rarityPrice'][rar] * (PR['consumableFactor'] if i.get('type') == 'Consumable' or n in PR['consumables'] else 1) + base
    else:
        price = None
    i['rarity'] = rar or 'unknown'
    i['price'] = price
    i['level'] = PR['rarityLevel'].get(rar, None)
    if price is None:
        unpriced.append(n)
if unpriced:
    log['notes'].append(f'{len(unpriced)} items have no known rarity or price (the DM sets one in the Marketplace): {", ".join(unpriced)}')

# ------------------------------------------------------------------ write
io.dump_json(spells, os.path.join(MASTER, 'spells.json'))
io.dump_json(creatures, os.path.join(MASTER, 'creatures.json'))
io.dump_json(items, os.path.join(MASTER, 'items.json'))
io.dump_json(conditions, os.path.join(MASTER, 'conditions.json'))

# permanent history of every reconciliation (the live report only shows what still differs)
HIST = os.path.join(io.ROOT, 'shared', 'changes-log.json')
history = io.load_json(HIST) if os.path.exists(HIST) else []
seen = {(h['area'], h['name'], h['field'], json.dumps(h['master'], ensure_ascii=False)) for h in history}
today = datetime.date.today().isoformat()
for area in ('spells', 'creatures'):
    for n, f, a, b, mv, w in log[area]:
        k = (area, n, f, json.dumps(mv, ensure_ascii=False))
        if k not in seen:
            seen.add(k)
            history.append({'date': today, 'area': area, 'name': n, 'field': f, 'character_codex': a, 'dm_codex': b, 'master': mv, 'why': w})
io.dump_json(history, HIST)

# what each app still needs (compared with the master)
def cc_pending():
    by = {s['n']: s for s in spells}
    out = 0
    for s in cc['SPELLS']:
        m = by[s['n']]
        out += any(s.get(f) != m.get(f) for f in ('school', 'time', 'range', 'dur', 'desc', 'comp', 'ritual'))
    cr = {x['n']: x for x in creatures}
    out_c = sum(1 for x in cc['CREATURE_DB'] if x != cr[x['n']])
    return out, out_c


def dm_pending():
    out = 0
    for m in spells:
        d = dm_spells.get(norm(m.get('dmName', m['n'])))
        if not d:
            out += 1; continue
        out += any([d.get('sch') != m['school'], d.get('time') != m['time'], d.get('range') != m['range'], d.get('dur') != m['dur'],
                    d.get('comp') != m['comp'], sorted(d.get('cls') or []) != sorted(m.get('cls') or []), d.get('desc') != m['desc']])
    croc = bestiary.get('crocodile')
    return out, int(bool(croc and croc['sp'] != CORR['creatures']['Crocodile']['speed']))


def cell(v):
    v = json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else str(v)
    return v.replace('|', '\\|').replace('\n', ' ')[:140]


cs, cc_cr = cc_pending()
ds, dm_cr = dm_pending()
R = [f'# Congruence report\n',
     f'Built {datetime.date.today().isoformat()} by `tools/build_master.py` from the Character Codex and the DM Codex.\n',
     '## Still to apply\n',
     '| App | Spells that differ from the master | Creatures that differ |', '|---|---|---|',
     f'| Character Codex | {cs} | {cc_cr} |', f'| DM Codex | {ds} | {dm_cr} |', '',
     'Run `python3 tools/apply_master.py` to write the master into both apps (then build and test them; see README). '
     'Every change ever reconciled is kept in `shared/changes-log.json` and the spreadsheet\'s Changes sheet; the tables below show only what differs right now.\n',
     f'## Master totals\n', f'- Spells: {len(spells)}', f'- Companion / summon / Wild Shape creatures: {len(creatures)} '
     f'({sum(1 for c in cc["CREATURE_DB"] if norm(c["n"]) in bestiary)} also in the DM bestiary)', f'- Items: {len(items)}',
     f'- Conditions: {len(conditions)}', '']
for note in log['notes']:
    R.append(f'- {note}')
for key, title in (('spells', 'Spells'), ('creatures', 'Creatures')):
    rows = log[key]
    R += [f'## {title}: where the apps disagreed ({len(rows)})\n', '| Name | Field | Character Codex | DM Codex | Master | Why |', '|---|---|---|---|---|---|']
    R += [f'| {cell(n)} | {cell(f)} | {cell(a)} | {cell(b)} | {cell(mv)} | {cell(w)} |' for n, f, a, b, mv, w in rows]
    R.append('')
R += ['## Spell fields that are only formatting\n',
      'Not listed above, and normalised in the master for both apps: casting times like `1 bonus` become `1 bonus action`; '
      'singular units become plural (`8 hour` to `8 hours`); concentration durations read `Up to 1 minute`; ranges start with a capital. '
      'Components (V, S, M and materials) come from the spreadsheet\'s Spell Data sheet, so the Character Codex gets them for the first time.\n',
      '## Conditions\n',
      'Same conditions in both apps. The Character Codex shows a one-line summary per condition (and splits Exhaustion into levels 1 to 6); '
      'the DM Codex shows the full SRD text. Both are kept in `shared/master/conditions.json` as `short` and `full`; neither app needs changes.\n']
open(os.path.join(io.ROOT, 'reports', 'congruence-report.md'), 'w', encoding='utf-8').write('\n'.join(R) + '\n')

# spreadsheet copy of the master
try:
    import openpyxl
    from openpyxl.styles import Font
    wb = openpyxl.Workbook()
    def sheet_of(title, cols, rows):
        ws = wb.create_sheet(title)
        ws.append(cols)
        for c in ws[1]:
            c.font = Font(bold=True)
        for r in rows:
            ws.append([json.dumps(v, ensure_ascii=False) if isinstance(v, (list, dict)) else v for v in r])
        ws.freeze_panes = 'A2'
    wb.remove(wb.active)
    sheet_of('Spells', ['name', 'level', 'school', 'casting_time', 'range', 'components', 'duration', 'concentration', 'ritual', 'classes', 'subclasses', 'dm_name', 'description'],
             [[s['n'], s['lvl'], s['school'], s['time'], s['range'], s['comp'], s['dur'], s['conc'], s['ritual'], ', '.join(s.get('cls') or []), ', '.join(s.get('sub') or []), s.get('dmName', ''), s['desc']] for s in spells])
    sheet_of('Creatures', ['name', 'size', 'type', 'cr', 'ac', 'hp', 'speed'] + ABL + ['traits', 'actions', 'note'],
             [[c['n'], c.get('size'), c.get('type'), c.get('cr'), c.get('ac'), c.get('hp'), c.get('speed')] + [(c.get('abil') or {}).get(a) for a in ABL]
              + ['; '.join(t['n'] for t in c.get('traits', [])), '; '.join(a['n'] for a in c.get('actions', [])), c.get('desc', '')] for c in creatures])
    sheet_of('Items', ['name', 'type', 'rarity', 'price_gp', 'min_level', 'damage', 'damage_type', 'properties', 'range', 'notes'],
             [[i['n'], i.get('type'), i.get('rarity'), i.get('price'), i.get('level'), i.get('dmgDice'), i.get('dmgType'), i.get('properties'), i.get('range'), i.get('notes')] for i in items])
    sheet_of('Conditions', ['name', 'short (Character Codex)', 'full (DM Codex)'], [[c['n'], c['short'], c['full']] for c in conditions])
    sheet_of('Changes', ['date', 'area', 'name', 'field', 'character_codex', 'dm_codex', 'master', 'why'],
             [[h['date'], h['area'], h['name'], h['field'], h['character_codex'], h['dm_codex'], h['master'], h['why']] for h in history])
    wb.save(os.path.join(io.ROOT, 'shared', 'Codex Master Data.xlsx'))
except ImportError:
    print('openpyxl not installed: skipped the spreadsheet copy')

print(f'master: {len(spells)} spells, {len(creatures)} creatures, {len(items)} items, {len(conditions)} conditions')
print(f'disagreements logged: {len(log["spells"])} spell fields, {len(log["creatures"])} creature fields')
print(f'to apply: Character Codex {cs} spells / {cc_cr} creatures; DM Codex {ds} spells / {dm_cr} creatures')
