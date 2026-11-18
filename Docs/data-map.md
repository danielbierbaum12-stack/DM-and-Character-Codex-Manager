# Data map (2026-11-18)

What each app stores, how the pieces link, and what is shared. The machine-readable version is
`shared/schema/entities.schema.json`. The apps store JSON (localStorage, the local server, Cloudflare KV, Export
files); this map is the plan for keeping them consistent, not a database.

## The picture

```
Campaign (one DM Codex = one campaign; exported as a whole)
├── Chapter ──< Section ──< Scene ── beats, plan, encounter, map
│      │           └── tags: notes, NPCs, locations, encounters, maps, clocks (chapterId / sectionId)
├── NPC library (stat block, role, attitude, faction) ──┐
├── Locations (region-map pins) ────────────────────────┼── World: connections web (links by id), factions, timeline
├── Notes (title, body, tags, folded)                   │
├── Encounters (lineup of creature refs) ── Combat (combatants: instance of a creature / NPC / party member)
├── Battle maps (tokens → combatant id, objects, walls, fog, lights)
├── Shops (stock of item refs, prices) · Bases & ships · Downtime activities · Rewards (→ reward codes)
├── House rules (shared to players as an HBR1. code)
└── Party (imported from character sheets: name, AC, HP, passives, DCs)

Character (one Character Codex save = one hero)
├── meta (name, race, background, alignment, portrait), abilities, classes[] (name, subclass, level)
├── features[], choiceFeatures, feats; spellbook / preparedSpells (spell refs); inventory (item refs) / equipment slots
├── hp, temp, hit dice, death saves, conditions (statusEffects), concentration, resources (featureCharges, slots)
├── companions (creature refs, roles), wild shape forms (creature refs)
└── notes, questLog, noteTags

Shared library (Codex Manager master, both apps): spells, items, creatures (only those both carry), conditions, rulebook
```

## Entities

| Entity | Lives in | Key | Links to | Shared? |
|---|---|---|---|---|
| Spell | master `spells.json` → both | name (DM may use the SRD name, `dmName`) | classes; creatures that cast it | **yes** |
| Item | master `items.json` → both | name | shops (stock), inventory, rewards | **yes** |
| Creature | master `creatures.json` (shared subset); DM bestiary (300+) | name | encounters, combatants, tokens, companions, wild shape | partly |
| Condition | master `conditions.json` → both | name | combatant / character status | **yes** |
| Rule entry | master `shared/rulebook` → both | id | house rules (by id), search | **yes** |
| House rule | DM `state.houseRules`; sheet `dndcc_houserules_v1` | id | rule entries | DM → players (HBR1. code) |
| Chapter / Section / Scene | DM `state.chapters` | id | everything tagged with chapterId / sectionId | no |
| NPC | DM `state.npcLibrary` | id | locations, factions, web links, combatants | no |
| Location | DM `state.locations` | id | region map, NPCs, notes | no |
| Note | DM `state.notes`; sheet `STATE.notes` | id | tags, chapter / section | no |
| Encounter | DM `state.encounters` | id | creature / NPC refs | no |
| Combatant | DM `state.combat.combatants` | id | its template (creature / NPC / party member), map token (`cid`) | no |
| Battle map | DM `state.battle.maps` | id | tokens → combatants, chapter | no |
| Shop | DM market | id | item refs | no |
| Party member | DM `state.party` | id | imported from a character (summary) | sheet → DM (file / code) |
| Character | sheet `STATE` (one per save, roster in `dndcc_roster_v1`) | id | spells, items, creatures, features | sheet → DM (summary) |
| Reward | DM `state.rewards` | id | items, gold, XP | DM → sheet (DMCR1. code) |
| Turn notice | server key `dndcc_turn_<code>` | table code | combatant name | DM → sheets (live) |

## What to share next (from the feature checklist)
1. **Feats, classes, races, backgrounds**: today only in the sheet. When the DM Codex needs them (NPCs built as
   characters, party view), add them to the master the same way as spells.
2. **Live party link**: the turn notice already uses the server; HP, conditions and initiative rolls from sheets could
   use the same store (`dndcc_party_<code>_<character id>`), read by the DM. The fields would be the party-member
   summary above.
3. **Wiki links**: `[[Name]]` in notes resolved against NPCs, locations, creatures, spells and items by name (the
   Ctrl K search index already has them).
