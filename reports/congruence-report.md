# Congruence report

Built 2026-11-01 by `tools/build_master.py` from the Character Codex and the DM Codex.

## Still to apply

| App | Spells that differ from the master | Creatures that differ |
|---|---|---|
| Character Codex | 0 | 0 |
| DM Codex | 0 | 0 |

Run `python3 tools/apply_master.py` to write the master into both apps (then build and test them; see README). Every change ever reconciled is kept in `shared/changes-log.json` and the spreadsheet's Changes sheet; the tables below show only what differs right now.

## Master totals

- Spells: 505
- Companion / summon / Wild Shape creatures: 73 (61 also in the DM bestiary)
- Items: 502
- Conditions: 20

## Spells: where the apps disagreed (0)

| Name | Field | Character Codex | DM Codex | Master | Why |
|---|---|---|---|---|---|

## Creatures: where the apps disagreed (0)

| Name | Field | Character Codex | DM Codex | Master | Why |
|---|---|---|---|---|---|

## Spell fields that are only formatting

Not listed above, and normalised in the master for both apps: casting times like `1 bonus` become `1 bonus action`; singular units become plural (`8 hour` to `8 hours`); concentration durations read `Up to 1 minute`; ranges start with a capital. Components (V, S, M and materials) come from the spreadsheet's Spell Data sheet, so the Character Codex gets them for the first time.

## Conditions

Same conditions in both apps. The Character Codex shows a one-line summary per condition (and splits Exhaustion into levels 1 to 6); the DM Codex shows the full SRD text. Both are kept in `shared/master/conditions.json` as `short` and `full`; neither app needs changes.

