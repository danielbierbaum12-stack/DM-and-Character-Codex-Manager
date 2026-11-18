#!/usr/bin/env python3
"""Copy the shared scripts into both apps, so there is one source.

  shared/a11y/a11y_names.js  -> DM Source/51_a11y.js, and inline in Character_Codex.html
  shared/motion/folds.js     -> DM Source/52_folds.js, and inline
  shared/theme/tints.js      -> DM Source/54_theme.js, and inline

Each copy sits between two marker lines:
  /* SHARED_<NAME>_START: written by the Codex Manager (tools/build_shared.py); change shared/<path> there */
  /* SHARED_<NAME>_END */
Code outside the markers is the app's own (for example how each app reads "Match my device").

  python3 tools/build_shared.py            # check: list the copies that differ from shared/ (exit 1 if any)
  python3 tools/build_shared.py --apply    # write shared/ into both apps; then rebuild and test both
"""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DM = os.path.join(os.path.dirname(ROOT), 'DM-Tool', 'Source')
CC = os.path.join(os.path.dirname(ROOT), 'DND-Player-Tool', 'Character_Codex.html')
PARTS = [  # name, shared file, DM file
    ('A11Y',  'a11y/a11y_names.js', '51_a11y.js'),
    ('FOLDS', 'motion/folds.js',    '52_folds.js'),
    ('THEME', 'theme/tints.js',     '54_theme.js'),
]

def markers(name, rel):
    return (f'/* SHARED_{name}_START: written by the Codex Manager (tools/build_shared.py); change shared/{rel} there */\n',
            f'/* SHARED_{name}_END */')

def swap(text, name, rel, body, where):
    a, b = markers(name, rel)
    i = text.find(f'/* SHARED_{name}_START')
    j = text.find(b)
    if i < 0 or j < 0 or j < i: raise SystemExit(f'{where}: no SHARED_{name} markers')
    if text.count(f'/* SHARED_{name}_START') != 1: raise SystemExit(f'{where}: SHARED_{name} markers appear more than once')
    old = text[text.index('\n', i) + 1:j]
    return old, text[:i] + a + body + text[j:]

def main():
    apply = '--apply' in sys.argv
    cc = open(CC, encoding='utf-8').read(); cc_new = cc
    drift = []
    for name, rel, dmf in PARTS:
        body = open(os.path.join(ROOT, 'shared', rel), encoding='utf-8').read()
        if not body.endswith('\n'): body += '\n'
        dmp = os.path.join(DM, dmf)
        dm = open(dmp, encoding='utf-8').read()
        old, dm_new = swap(dm, name, rel, body, dmf)
        if old != body: drift.append(f'DM {dmf}')
        if apply and dm_new != dm: open(dmp, 'w', encoding='utf-8').write(dm_new)
        old, cc_new = swap(cc_new, name, rel, body, 'Character_Codex.html')
        if old != body: drift.append(f'Character Codex ({name.lower()})')
    if apply and cc_new != cc: open(CC, 'w', encoding='utf-8').write(cc_new)
    if not drift: print('All copies match shared/.'); return 0
    print(('Written: ' if apply else 'Differs from shared/: ') + ', '.join(drift))
    if apply: print('Now rebuild the DM Codex (build.sh, all three builds), copy the sheet to cloudflare-deploy/, and test both.')
    return 0 if apply else 1

if __name__ == '__main__': sys.exit(main())
