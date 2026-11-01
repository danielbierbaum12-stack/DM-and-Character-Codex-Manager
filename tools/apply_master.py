"""Write the master game data (shared/master/) into both apps.

    python3 tools/build_master.py      # first: rebuild the master and the report
    python3 tools/apply_master.py      # then: update both apps' data in place

Character Codex: updates the SPELLS and CREATURE_DB tables inside Character_Codex.html.
DM Codex: updates Source/spells.min.json and Source/monsters.min.json.

After it runs, in each app repo (see README):
    Character Codex: cp Character_Codex.html cloudflare-deploy/index.html, regenerate Docs/character-codex-game-data.json, run the tests
    DM Codex: cd Source && python3 merge_cc_data.py <export> && bash build.sh && bash build.sh preview && bash build.sh cloudflare,
              cp dm-codex.html "../DM Codex.html", run the tests
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import codex_io as io
from codex_io import norm

MASTER = os.path.join(io.ROOT, 'shared', 'master')
spells = io.load_json(os.path.join(MASTER, 'spells.json'))
creatures = io.load_json(os.path.join(MASTER, 'creatures.json'))
CORR = io.load_json(os.path.join(io.ROOT, 'shared', 'corrections.json'))
by_name = {s['n']: s for s in spells}

# ------------------------------------------------------------------ Character Codex
CC_SPELL_FIELDS = ['lvl', 'school', 'time', 'range', 'dur', 'conc', 'ritual', 'comp', 'desc', 'cls']
cc = io.load_cc()
changed = 0
for s in cc['SPELLS']:
    m = by_name[s['n']]
    before = dict(s)
    for f in CC_SPELL_FIELDS:
        if f in m:
            s[f] = m[f]
    changed += before != s
cr = {c['n']: c for c in creatures}
cc_cr = sum(1 for c in cc['CREATURE_DB'] if c != cr[c['n']])
cc['CREATURE_DB'] = [cr[c['n']] for c in cc['CREATURE_DB']]
io.save_cc({'SPELLS': cc['SPELLS'], 'CREATURE_DB': cc['CREATURE_DB']})
print(f'Character Codex: {changed} spells, {cc_cr} creatures updated')

# ------------------------------------------------------------------ DM Codex
dm = io.load_dm()
dm_by = {norm(s['n']): s for s in dm['spells']}
changed = 0
for m in spells:
    d = dm_by.get(norm(m.get('dmName', m['n'])))
    if not d:
        print('  not in the DM Codex (merge_cc_data.py adds it):', m['n'])
        continue
    before = dict(d)
    d.update({'lvl': m['lvl'], 'sch': m['school'], 'time': m['time'], 'range': m['range'], 'comp': m['comp'], 'dur': m['dur'],
              'conc': bool(m['conc']), 'ritual': bool(m['ritual']), 'desc': m['desc'], 'cls': sorted(set(m.get('cls') or []))})
    changed += before != d
dm['spells'].sort(key=lambda s: (s['lvl'], s['n']))
io.save_dm('spells', dm['spells'])

# bestiary corrections (only fields the corrections file names for creatures that exist in the bestiary)
FIELD = {'speed': 'sp', 'size': 'sz', 'ac': 'acv'}
mons = {norm(x['n']): x for x in dm['monsters']}
fixed = 0
for name, fix in CORR['creatures'].items():
    x = mons.get(norm(name))
    if not x:
        continue
    for k, v in fix.items():
        if k in FIELD and x.get(FIELD[k]) != v:
            x[FIELD[k]] = v
            fixed += 1
io.save_dm('monsters', dm['monsters'])
print(f'DM Codex: {changed} spells updated, {fixed} bestiary fields corrected')
