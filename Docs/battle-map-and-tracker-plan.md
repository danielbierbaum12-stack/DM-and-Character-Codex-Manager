# Battle map and combat tracker: plan (2026-11-18)

From the owner: the Battle Map tab should use the same tracker as Combat, more compact and collapsible, showing the
whole initiative order and stats (today it focuses on one creature at a time); combat without a map should use
the space well. Skills: `DM-Tool/.claude/skills/vtt-battle-map`, `DM-Tool/.claude/skills/dnd-combat-tracker`
(rules there), `dm@neural-initiative` as a 5e reference.

## What exists today (checked in the code)
- **Tracker** (`09_initiative.js`, `34_combat_rules.js`): initiative order with a round counter, lair actions on
  initiative 20, temporary HP, concentration saves, death saves for heroes, timed effects that end at the start or
  end of a named turn (`effects[].rounds`, `untilTurn`), recharge abilities, combat log, group initiative option.
- **Map** (`23_battle.js` …): square grid at 5 ft, snapping, ruler with two diagonal rules, AoE templates (sphere,
  cone, line, cube) that highlight squares, fog for the player display, vision and darkvision, lighting, a token
  panel that shows one selected creature, player display, table camera and touch tray.

## Gaps
1. Ties in initiative aren't broken by Dexterity (sort is by initiative only).
2. No legendary action pool (refills each turn) or legendary resistance count.
3. The Battle Map tab shows one creature at a time; no compact full order with HP / AC / conditions.
4. Selecting a row and selecting a token aren't fully two-way (row → token → row, centring the map).
5. Combat without a map: the tracker could use the freed space better (wider rows, stat columns).
6. Hex grids and a per-map grid scale don't exist (square grid, fixed `BM_PX`).

## Steps
1. **Compact tracker on the Battle Map** (owner's main ask). A collapsible strip or side list on the Battle Map tab
   built from the same rows as Combat (one component, two densities): every combatant in order, with initiative, HP
   bar and number (temp HP shown), AC, conditions as icons with turns left, concentration mark, and the current turn
   highlighted. Collapse to just the current turn and the next two; expand to the full list. Remembered per device.
   Ultra view starts collapsed.
2. **Two-way selection.** Row click → select and centre the token (if on the map); token click → highlight and
   scroll to its row; the current turn glows in both; the one-creature panel still opens from either.
3. **Combat without a map.** When the encounter has no map, Combat uses the full width: stat columns (AC, HP, temp
   HP, conditions, concentration, legendary actions) on desktop, today's one-line rows on phones.
4. **Turn-order rules.** Dexterity tie-break (deterministic; equal Dex keeps the DM's order), legendary action pool
   that refills at the creature's turn, legendary resistance counter, both read from the stat block where present.
5. **Grid options (later).** Per-map grid scale; hex grid only if the owner wants it (it touches every distance,
   reach and AoE helper).
6. **Tests and checks.** New Playwright test for the compact tracker, collapse, two-way selection and tie-break; run
   both full suites; screenshots at 390 / 820 / 1400 px; the accessibility test (`test68`).

## Also queued from the same message (DM Codex)
- **First-open experience chooser:** all features shown as a grid of cards (soundboard, music, scenes, battle map,
  every tab); three presets: *Basic* (pen-and-paper essentials: bestiary, NPCs, party, battle setup, combat tracker
  without a map, shops, notes, rules), *Ambience* (Basic + battle map, music, soundboard and atmosphere), *Full DM
  suite* (Ambience + long-campaign tools: bases, downtime, world, timeline, random encounters…). Any card can be
  switched on or off; unchosen tabs are hidden (`prefs.hiddenTabs`) and can be added back in Settings.
- **Calmer open/close:** the "2014 Player's Handbook" source fold jumps off screen when it opens; folds should open
  gently and stay in place, and closing should animate away smoothly (in All the fixings; instant elsewhere).
- **Notes tab "Show" button** doesn't show or hide its section: fix and test.
