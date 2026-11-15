#!/usr/bin/env python3
"""Build the shared rulebook and write it into both apps.

  shared/rulebook/*.rules.txt   the rules, in a small text format (see README there)
  shared/rulebook/rulebook-core.js, rulebook.css   the search and display engine, the same in both apps

  python3 tools/build_rulebook.py            # check and write shared/rulebook/rulebook.json
  python3 tools/build_rulebook.py --apply    # also write it into the DM Codex and the Character Codex

Text format:
  # category-id | Category name
  @ rule-id | Title | kind (rule, faq, edge) | source
  k: search words        s: the short answer        - a detail line
  p: note for players    d: note for the DM          r: related ids, comma separated
"""
import json, re, sys, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RB = os.path.join(ROOT, 'shared', 'rulebook')
DM = os.path.join(os.path.dirname(ROOT), 'DM-Tool', 'Source')
CC = os.path.join(os.path.dirname(ROOT), 'DND-Player-Tool', 'Character_Codex.html')

def parse():
    cats, rules, cur, cat = [], [], None, None
    for path in sorted(glob.glob(os.path.join(RB, '*.rules.txt'))):
        for n, line in enumerate(open(path, encoding='utf-8'), 1):
            line = line.rstrip('\n')
            where = f'{os.path.basename(path)}:{n}'
            if not line.strip(): continue
            if line.startswith('# '):
                cid, name = [x.strip() for x in line[2:].split('|')]
                cat = cid; cats.append({'id': cid, 'name': name}); continue
            if line.startswith('@ '):
                parts = [x.strip() for x in line[2:].split('|')]
                assert len(parts) == 4, f'{where}: need id | title | kind | source'
                assert parts[2] in ('rule', 'faq', 'edge'), f'{where}: kind {parts[2]}'
                cur = {'id': parts[0], 't': parts[1], 'kind': parts[2], 'src': parts[3], 'c': cat, 'k': '', 's': '', 'b': []}
                rules.append(cur); continue
            assert cur is not None, f'{where}: text before any rule'
            if line.startswith('- '): cur['b'].append(line[2:].strip()); continue
            m = re.match(r'^([kspdr]): ?(.*)$', line)
            assert m, f'{where}: cannot read "{line[:40]}"'
            key, val = m.group(1), m.group(2).strip()
            if key == 'r': cur['r'] = [x.strip() for x in val.split(',') if x.strip()]
            else: cur[key] = val
    return cats, rules

def check(cats, rules):
    ids = [r['id'] for r in rules]
    dup = {i for i in ids if ids.count(i) > 1}
    assert not dup, f'duplicate ids: {dup}'
    known = set(ids); bad = []
    for r in rules:
        assert r['s'], f'{r["id"]}: no short answer'
        assert re.match(r'^[a-z0-9-]+$', r['id']), f'bad id {r["id"]}'
        for x in r.get('r', []):
            if x not in known: bad.append(f'{r["id"]} -> {x}')
    assert not bad, 'related ids that do not exist: ' + ', '.join(bad)

def inject(text, name, body):
    a, b = f'/*{name}_START*/', f'/*{name}_END*/'
    assert text.count(a) == 1 and text.count(b) == 1, f'markers for {name} not found exactly once'
    i, j = text.index(a) + len(a), text.index(b)
    return text[:i] + '\n' + body.rstrip('\n') + '\n' + text[j:]

def main():
    cats, rules = parse(); check(cats, rules)
    data = {'v': 1, 'cats': cats, 'rules': rules}
    js = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    open(os.path.join(RB, 'rulebook.json'), 'w', encoding='utf-8').write(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
    kinds = {k: sum(1 for r in rules if r['kind'] == k) for k in ('rule', 'faq', 'edge')}
    print(f'{len(rules)} entries in {len(cats)} sections: {kinds}')
    if '--apply' not in sys.argv: return
    core = open(os.path.join(RB, 'rulebook-core.js'), encoding='utf-8').read()
    css = open(os.path.join(RB, 'rulebook.css'), encoding='utf-8').read()
    data_js = 'const RULEBOOK_DATA = ' + js + ';'
    # DM Codex: two source files and a stylesheet, picked up by build.sh
    head = '/* Written by the Codex Manager (tools/build_rulebook.py). Do not edit here: change shared/rulebook and run it again. */\n'
    open(os.path.join(DM, '44_rulebook_data.js'), 'w', encoding='utf-8').write(head + data_js + '\n')
    open(os.path.join(DM, '45_rulebook_core.js'), 'w', encoding='utf-8').write(head + core)
    open(os.path.join(DM, 'rulebook.css'), 'w', encoding='utf-8').write(head + css)
    # Character Codex: between markers in the one file
    s = open(CC, encoding='utf-8').read()
    s = inject(s, 'RULEBOOK_CSS', css); s = inject(s, 'RULEBOOK_DATA', data_js); s = inject(s, 'RULEBOOK_CORE', core)
    open(CC, 'w', encoding='utf-8').write(s)
    print('written into the DM Codex (Source/44, 45, rulebook.css) and the Character Codex')

if __name__ == '__main__': main()
