# Rulebook (shared by both apps)

- `*.rules.txt`: the rules, 2014 baseline, in short form. One file per group of sections.
- `2024.notes.txt`: what the 2024 rules (SRD 5.2.1) change, one line per rule id. Shown on the entry as "2024 rules".
- `rulebook-core.js`, `rulebook.css`: search and display. The same code runs in both apps; each app gives it a small `host` (see the top of the core file).
- `rulebook.json`: built from the text files. Do not edit.

Change the text files or the core, then run `python3 tools/build_rulebook.py --apply`. It checks the data (ids, cross-references) and writes it into the DM Codex (`Source/44_rulebook_data.js`, `45_rulebook_core.js`, `rulebook.css`) and the Character Codex (between the `RULEBOOK_*` markers). Then rebuild and test both apps.

## Writing an entry

```
# section-id | Section name
@ rule-id | Title | rule, faq or edge | source
k: extra search words
s: the short answer, one or two sentences
- a detail line (as many as needed)
p: a note for players
d: a note for the DM
r: related ids, comma separated
```

- Sage Advice entries were checked against the Compendium versions the owner supplied: "Sage Advice 2017" (v2.0) and "Sage Advice 2020" (v2.4). Where the two differ, the entry follows the later one and says so.
- Every entry names its source: PHB, DMG, MM, XGE, TCE, "Sage Advice" (official rulings) or "designer comment" (advice, not official). Never write a ruling you cannot source; say the DM decides.
- `faq` is for rules people often get wrong; `edge` for rare clashes with a known answer.
- Both apps show every entry. The player view leads with `p` and the DM view with `d`, and the sections are ordered for each reader (`RB_ORDER`).
- House rules are the table's own, written in the app. `house-presets.txt` is a list of common ones the table can pick with one tap ("Use at our table"): the DMG's optional rules (source `DMG ch.x`) and well-known table customs (source starting "Table custom", which the app labels as in no book). The build checks each one's source and the rule it sits next to.
