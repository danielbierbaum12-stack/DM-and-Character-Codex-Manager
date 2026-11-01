# DM and Character Codex Manager

The shared game data for the two apps, so they agree with each other and with the books:

- **Character Codex** (player sheet): repo `dnd-player-tool`, branch `claude/blissful-volta-9g6vlo`
- **DM Codex** (DM screen): repo `dm-tool`, branch `claude/eloquent-pascal-n5tsxg`

Each app still ships as its own single HTML file. This repo holds the **master data**, the reviewed rulings, and the scripts that check the two apps against each other and update them.

## What's here

| Path | What it is |
|---|---|
| `shared/master/spells.json` | All 505 spells, with every field either app uses: level, school, casting time, range, components, duration, concentration, ritual, classes, subclasses, description, rules data (`mechanics`, `upcast`), and `dmName` when the DM Codex uses the SRD name (`Acid Arrow` for `Melf's Acid Arrow`) |
| `shared/master/creatures.json` | The Character Codex's 73 companions, summons and Wild Shape forms, checked against the DM Codex bestiary |
| `shared/master/items.json` | The 502-item catalogue (both apps use the same list) |
| `shared/master/conditions.json` | Each condition's one-line summary (player sheet) and full SRD text (DM screen) |
| `shared/Codex Master Data.xlsx` | The same master data as a spreadsheet: Spells, Creatures, Items, Conditions, and a Changes sheet |
| `shared/corrections.json` | Rulings that override both apps, each with its reason |
| `shared/changes-log.json` | Every disagreement ever settled: what each app had, what the master uses, and why |
| `reports/congruence-report.md` | Live status: what still differs between the apps and the master (0 right now) |
| `reports/2026-11-01-first-reconciliation.md` | The first comparison, before anything was fixed |
| `tools/` | The scripts (below) |

## How the master is decided

| Data | Taken from | Why |
|---|---|---|
| Spell level, school, classes, subclasses, concentration, rules data | Character Codex | It had a rules-accuracy review; the DM Codex had 3 wrong schools and 5 spells missing Artificer |
| Spell description | Character Codex wording, plus the DM Codex's "At Higher Levels" paragraph when the Character Codex had none | The DM Codex's SRD text is a loose translation in places ("Hold Monster: a creature you can see and reach") |
| Components | `Dnd Spreadsheet.xlsx` → Spell Data | The only source that covers every spell |
| Casting time, duration, range | Character Codex, with the wording made the same in both apps | `1 bonus action`, `8 hours`, `Up to 1 minute` |
| Creature stats (size, AC, HP, speed, ability scores, CR, attacks, traits) | DM Codex bestiary (SRD 5.1) | The Character Codex had wrong numbers on 18 beasts |
| Anything in `shared/corrections.json` | That file | Both apps were wrong, or one was missing it |

## Updating the data

The two app repos need to be checked out next to this one (`../DND-Player-Tool`, `../DM-Tool`), or set `CC_REPO` and `DM_REPO`.

1. **Fix it once, in the right place.** For a ruling, add an entry to `shared/corrections.json` with a `_why`. For new content, add it to the Character Codex (the DM Codex picks new spells, creatures and items up from it).
2. `python3 tools/build_master.py` rebuilds the master, the spreadsheet and the report, and says how many spells and creatures each app still needs.
3. `python3 tools/apply_master.py` writes the master into both apps.
4. **Character Codex:** regenerate `Docs/character-codex-game-data.json` (command palette → Export game data, or `buildGameDataExport()`), `cp Character_Codex.html cloudflare-deploy/index.html`, and run the tests (`tests/master_data.js` covers this data).
5. **DM Codex:** in `Source/`, `python3 merge_cc_data.py ../../DND-Player-Tool/Docs/character-codex-game-data.json` (adds anything new), then `bash build.sh && bash build.sh preview && bash build.sh cloudflare`, `cp dm-codex.html "../DM Codex.html"`, and `node tests/run_all.js` plus `node tests/run_all.js cloudflare` (`tests/test42.js` covers this data).
6. Run `build_master.py` again: the report should say 0 and 0.

Needs Python 3 with `openpyxl` (for the spreadsheet) and the apps' own Playwright setup for their tests.
