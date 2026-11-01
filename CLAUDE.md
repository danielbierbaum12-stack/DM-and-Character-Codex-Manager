# Codex Manager: notes for the next AI

This repo keeps the game data of the Character Codex (player sheet) and the DM Codex (DM screen) congruent. Read `README.md` first: it has the layout, the field-by-field rules for which app wins, and the update steps.

## Rules
- Each app's own `CLAUDE.md` / `README.md` rules still apply when you change that app: its work branch, no pushing to `main`, publishing artifacts only after the owner says yes, never touching Cloudflare or the owner's local files.
- Rules baseline is the 2014 books / SRD 5.1. Never invent content for material you can't check; leave it and say so.
- Every ruling goes in `shared/corrections.json` with a `_why`. Don't hand-edit `shared/master/` (it's rebuilt) or `shared/changes-log.json` (it's appended by the build).
- After `apply_master.py`, rebuild and test both apps before committing (README steps 4 to 6), and commit each app on its own branch.

## Gotchas
- The Character Codex data lives inline in `Character_Codex.html` as single-line `const NAME = <json>;` tables. `tools/codex_io.py` reads and writes them; never print one.
- The DM Codex knows some spells by their SRD names (`spell_aliases.min.json`); the master keeps that as `dmName`.
- `build_master.py` reads the apps, so after an apply its report shows no disagreements. The history is in `changes-log.json`.

## Good next steps
1. Feats, classes, races and backgrounds exist only in the Character Codex today. If the DM Codex starts using them, add them to the master the same way.
2. The DM bestiary (300+ SRD monsters) is the DM Codex's own; only creatures both apps carry are in `creatures.json`.
3. Longer term (from the Character Codex's notes): one repo with `shared/`, `player/`, `dm/` and a build that outputs each HTML file. This repo is the first step: the shared data and the checks.
