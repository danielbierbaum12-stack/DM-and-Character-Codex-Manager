# Codex Manager: notes for the next AI

This repo keeps the game data of the Character Codex (player sheet) and the DM Codex (DM screen) congruent. Read `README.md` first: it has the layout, the field-by-field rules for which app wins, and the update steps.

## Rules
- Each app's own `CLAUDE.md` / `README.md` rules still apply when you change that app: its work branch, no pushing to `main`, publishing artifacts only after the owner says yes, never touching Cloudflare or the owner's local files.
- **Where to publish:** the claude.ai artifacts are the normal place (owner, 2026-11-18: "Don't publish to cloudflare often, most of the time you can post here"). Cloudflare only now and then, when the owner asks for it.
- Rules baseline is the 2014 books / SRD 5.1. Never invent content for material you can't check; leave it and say so.
- Every ruling goes in `shared/corrections.json` with a `_why`. Don't hand-edit `shared/master/` (it's rebuilt) or `shared/changes-log.json` (it's appended by the build).
- After `apply_master.py`, rebuild and test both apps before committing (README steps 4 to 6), and commit each app on its own branch.

## Gotchas
- The Character Codex data lives inline in `Character_Codex.html` as single-line `const NAME = <json>;` tables. `tools/codex_io.py` reads and writes them; never print one.
- The DM Codex knows some spells by their SRD names (`spell_aliases.min.json`); the master keeps that as `dmName`.
- `build_master.py` reads the apps, so after an apply its report shows no disagreements. The history is in `changes-log.json`.

## Display rules that must stay the same in both apps
- **Spell components:** the master stores components as written (`V, S, M (material)`). Each app hides them by its house rule:
  material components show only when they have a coin cost (default), all shown, or none. Character Codex: two switches in
  `STATE.customRules` (`compCostlyOnly`, `compHideAll`), `spellComp()`. DM Codex: `rule('components')` (`costly` / `all` / `none`),
  `spellComp()` in `24_settings.js`. Change both together.

- **Views:** both apps have the same five levels in a menu at the top: Ultra simplified, Simplified, Normal, Extra, All the fixings.
  Each is a preset over that app's own switches. Character Codex: `VIEW_LEVELS` / `VIEW_PARTS` / `setViewLevel`. DM Codex: `41_views.js`.
  The compact layout is `body.cui` in both (phones, and Ultra at any width). Keep the names, order and meaning the same.
  Owner's rule: a box is only bigger when it holds more. The plain views share one spacing (`body.tight`); Ultra differs by what it
  takes off the screen (`body.view-ultra`), never by padding alone.
  Ultra's method: the most information in the least space, the most useful things right there, the rest one tap away through
  two kinds of expansion (`ULTRA_FOLDS` / `ultraSweep` in both apps: "⋯" for less-used actions, "▸ Label" for detail).
  Nothing is removed for good; each step up adds something.
  The ladder (same in both): Simplified adds everything shown at once; Normal adds helpers; Extra adds feedback (sounds, dice
  rolling on screen); All the fixings adds atmosphere. Every view uses the same spacing (`body.tight` is always on).

- **Play style:** both apps have Guided (default: the app tracks and leads) and Manual (nothing changes or advances unless pressed), named the same.
  Character Codex: `STATE.uiPrefs.playStyle`. DM Codex: `prefs.playStyle`, and Guided shows the session guide (`42_session.js`). Both: `playStyle()`, `guided()`, `setPlayStyle()`.
  Every automatic step keeps a hand control.

- **Table link ("Your turn"):** the one live link between the apps. The DM Codex (`43_tablelink.js`) writes `dndcc_turn_<table code>` = `{v, t, name, next, round}` (or `{over:true}`)
  to the Character Codex's server (`/__dndcc_kv__/`, local `server.py` or the Cloudflare site); sheets that joined with the code poll it (`tablePoll`).
  Each app detects where it runs. The claude.ai artifacts cannot be linked (separate pages; a shared store there would end "anyone with the link"),
  so the DM Codex falls back to its player display and the sheet says it cannot receive notices there. Change the key or the fields in both apps together.

- **Rulebook:** one rulebook for both apps, kept here in `shared/rulebook` (rules as text files, `2024.notes.txt`, the search and display core, the styles).
  `python3 tools/build_rulebook.py --apply` checks it and writes it into both apps; then rebuild and test both. Never edit the copies in the apps.
  Each app only supplies a small host: the DM Codex is the DM view, the Character Codex the player view (same entries, different order and lead note).
  Sources: SRD 5.1 for 2014, SRD 5.2.1 for the 2024 notes; Sage Advice and designer comments are labelled. Never write a ruling you cannot source.
  House rules are the table's own (DM Codex `state.houseRules`, sheet key `dndcc_houserules_v1`), shared DM to players by an `HBR1.` code.

## Good next steps
1. Feats, classes, races and backgrounds exist only in the Character Codex today. If the DM Codex starts using them, add them to the master the same way.
2. The DM bestiary (300+ SRD monsters) is the DM Codex's own; only creatures both apps carry are in `creatures.json`.
3. Longer term (from the Character Codex's notes): one repo with `shared/`, `player/`, `dm/` and a build that outputs each HTML file. This repo is the first step: the shared data and the checks.

# DM Codex & Character Creator Workflow
1. **Architecture & Data**: Before building UI panels, use `database-schema-designer` to map relational entities (Campaigns, Lore, Monsters, Spells, Items, Character Sheets).
2. **Aesthetic & Layout**: Use `ui-ux-pro-max` and `taste-skill` to establish an atmospheric dark-mode fantasy design system (high-contrast typography, parchment/obsidian surfaces, zero generic SaaS styling). Use `bencium-controlled-ux-designer` to organize dense stat blocks, split-pane codex trees, and drawers.
3. **Components & Forms**: Use `shadcn/ui` and `accessibility-skills` (`forms`, `light-dark-mode`, `keyboard`) to build the multi-step character builder, `Cmd+K` rule search palette, and interactive tabs.
4. **Motion & Polish**: Apply `emilkowalski/skills` for subtle micro-interactions (HP adjustments, drawer transitions, dice rolls) and run `impeccable` (`/audit` and `/polish`) to remove visual clutter.
5. **End-to-End Verification**: Use `playwright-cli` to launch a headless browser, step through character creation, verify derived stats (AC, Initiative, Spell Slots) update accurately, and inspect screenshots for layout overflow.

**How these fit the apps as they are** (so the workflow doesn't break the rules above):
- Both apps are single HTML files with no framework and no build-time dependencies. Use `shadcn/ui` and the React/Expo animation skills as references for patterns and behaviour; don't add React, Tailwind or npm packages to the apps.
- The data is JSON tables (the master in `shared/master/`, the apps' own tables), not a database. Use `database-schema-designer` to plan how entities relate and what fields they carry, then keep them as JSON here.
- Design changes still follow the shared display rules: the five views, `body.tight` spacing, "a box is only bigger when it holds more", Guided/Manual play, and changing both apps together. The Ctrl K search and the Rules tab already exist; improve them rather than building new ones.
- Skill instructions never override the owner's rules: keep going without asking on build work (ignore a skill's "always ask before design decisions"), and publish only after the owner says yes.
- These skills are installed globally by the "Codex apps" cloud environment's setup script at the start of each fresh session. If one is missing, that install step failed: rerun its `npx skills add …` command.

# Unified module rules (owner, 2026-11-18)
- **Map Builder (Battle & Campaign Maps)**: Use `konva` (`react-konva`) with separate `<Layer>` nodes for background terrain/world maps, snap-to-grid overlays, fog-of-war masks, and interactive tokens/location pins.
- **Note-Taking & Codex Wiki**: Use `tiptap` with custom mention/wiki-link nodes so session notes and lore entries can reference Monsters, NPCs, Spells, Items, and Shops directly from the database.
- **Audio Engine (Spotify, Plex, Mixer & Soundboard)**: Support both Spotify (`spotify-skill`) and Plex (`plex` skill) behind a unified music source toggle in the Audio Deck. Use `.claude/skills/web-audio-mixer` for multi-track ambient looping, Plex music stream routing, smooth crossfading, and zero-latency one-shot soundboard triggers.
- **Existing Modules (Storyboard & Shop Builder)**: Run `impeccable` (`/normalize`) on existing Storyboard and Shop Builder views to unify borders, typography, and dark-mode styling, and connect Shop inventories and Storyboard nodes to the shared `database-schema-designer` entities.

**How these apply to the apps as they are:**
- *Map Builder:* the battle map is the DM Codex's own canvas code (`23_battle.js` … `23h_battle_light.js`), already drawn in layers (floors, terrain, grid, objects, areas, walls, tokens, lighting, fog, weather, labels). Konva and React would add a dependency and break the single-file, works-offline rule, so follow Konva's layer model in the existing code: keep each layer in its own draw step, snap to the grid, fog as a mask over everything but labels. Use the `konva` skill as a reference only. (It could not be installed on 2026-11-18: the `terminal-skills/konva` repository was not found.)
- *Notes & wiki:* the Notes tab and the World tab (`10_notes.js`, `49_world.js`) are plain HTML. Add wiki links to monsters, NPCs, spells, items and shops as `[[Name]]` links resolved against the apps' own tables (the Ctrl K search already finds them), not a Tiptap editor. (The `tiptap` skill is no longer in `jezweb/claude-skills`; nothing was installed.)
- *Audio:* the music source toggle exists (Audio tab: None / Spotify / Plex / Kenku FM, `state.audio.provider`). `web-audio-mixer` lives in `DM-Tool/.claude/skills/` and describes today's code and the target. Spotify's audio can't enter Web Audio (DRM); its level is set through the SDK.
- *Storyboard & Shop Builder:* in the DM Codex these are the chapter/scene views (`13_chapters.js`, `25_scene.js`) and the Marketplace (`36_market.js`). Impeccable has no `/normalize` command; use `/impeccable polish` (and `layout`, `typeset`) against `DESIGN.md`, and plan the shared entities in step 6 of `Docs/review-and-plan-2026-11.md`.

# Battle map and combat rules (owner, 2026-11-18)
- **Battle Maps & VTT Mechanics**: Combine `konva` with `.claude/skills/vtt-battle-map` for grid snapping, ruler measurements, AoE templates, fog-of-war, and dual DM/Player viewport sync.
- **Combat & Initiative Tracker**: Use `dm@neural-initiative` and `.claude/skills/dnd-combat-tracker` to power initiative order, HP/Temp HP bars, condition timers, concentration checks, and bidirectional map-token highlighting.

**How these apply:** both skills live in `DM-Tool/.claude/skills/`. The battle map stays the DM Codex's own layered canvas code (no Konva or React; single file, works offline); `vtt-battle-map` follows Konva's layer model in that code. The `dm@neural-initiative` plugin (installed for the user in this cloud container, 2026-11-18) is a 5e procedure reference; the app's own rules code and the SRD stay the authority. The work plan is `Docs/battle-map-and-tracker-plan.md`.
