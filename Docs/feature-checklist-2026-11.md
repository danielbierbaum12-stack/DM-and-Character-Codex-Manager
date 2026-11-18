# Feature checklist (2026-11-18)

The owner's list, checked against both apps by searching the code (not a full click-through). CC = Character
Codex, DM = DM Codex. ✅ has it · ◐ partly · ✗ missing · ? not confirmed.

## Rules engine
- ✅ Ability scores and modifiers, proficiency bonus by level (CC).
- ✅ Derived stats recalculated: AC, initiative, saves, skills, passives, spell DC and attack, carrying capacity (CC).
- ✅ Where every number comes from: the "how it's built" popups (`whyRows`) (CC).
- ✅ Advantage / disadvantage (both).
- ◐ Ruleset switches: 2014 vs 2024 ✅, encumbrance variant ✅, multiclassing ✅, feats ✅; **flanking ✗, gritty / epic
  rest timing ✗** (the rulebook explains them, but nothing switches them on).

## Content library
- ✅ Races, subraces, lineages; classes, subclasses, features by level; backgrounds, feats (2024 origin feats behind
  the switch); spells with all their fields and class lists; weapons (properties, 2024 masteries), armour, gear,
  tools, magic items (rarity, attunement, charges); conditions, damage types, languages; deities ◐ (CC lists).
- ◐ Planes: rulebook only.
- ◐ Homebrew: JSON import / export for every library in the Dev tab ✅ and custom items / feats ✅; **filter by
  source book ✗**.

## Dice
- ✅ Formula roller with keep / drop and rerolls (DM `02_utils`, notation like 4d6dl1, 2d20kh1); CC rolls its own
  modifiers.
- ✅ Roll history: CC keeps the last 30; the DM dice roller has a History list (and the combat log).
- ✅ Crit rules (DM setting "Critical hits"; CC crits).
- ✅ Clickable rolls everywhere (CC skills, saves, attacks, spells; DM stat blocks).

## Character creator
- ◐ Creation flow: quick start plus tabs for each step; not one step-by-step wizard.
- ◐ Ability score methods: standard array ✅, point buy ✅ (27-point budget), manual ✅; **4d6 drop lowest ✗** in
  the sheet's quick start.
- ✅ Background / species ability rules by ruleset version.
- ◐ Validation: "Choices still to make" flags missing picks ✅; **multiclass prerequisites ✗**.
- ✅ Starting equipment packages or starting gold.
- ◐ Level-up: level plan table (class per level, notes) ✅, HP, features, subclass, ASI / feat, spells ✅;
  **undo / rebuild a level ?** (not confirmed).
- ✅ Multiclass and combined spell slots.
- ✅ Identity: name, portrait, appearance, age, alignment, traits, ideals, bonds, flaws, backstory, allies,
  organisations, enemies, notes and tags.

## Character tracker
- ✅ HP, max, temp HP handled correctly; resistances, immunities, vulnerabilities; hit dice; death saves;
  exhaustion (both versions); conditions; concentration with the save prompt; attacks list with to-hit, damage,
  properties, versatile, off-hand, ammunition.
- ✅ Spell slots and pact slots; prepared vs known; rituals; always-prepared spells; class resources (rage, ki,
  sorcery points, channel divinity, bardic inspiration, superiority dice, lay on hands, wild shape…); item charges
  and recharge; short and long rest; Heroic Inspiration. **Spell points variant ✗.**
- ✅ Equipped / carried, attunement (3, class exceptions), weight and encumbrance, currency, consumables.
  **Containers with their own weight rules ✗; currency conversion ✗.**
- ✅ Proficiencies and expertise, senses; ◐ speeds (walk ✅, fly / swim / climb / burrow as notes);
  ✅ wild shape / polymorph forms; ✅ familiars, companions, summons with stat blocks; ✅ XP; ✅ print sheet
  (browser print / PDF).

## DM Codex
- ◐ Campaigns: chapters, sections and scenes in one codex ✅, house rules ✅; **several separate campaigns ✗**
  (one codex per file, switched by export / import).
- ✅ Session planner (scenes, beats, session plan), session log ✅; **recap generator ◐** (via Ask Claude).
- ✅ Timeline and calendar with seasons (World tab, optional); moon phases / holidays ?.
- ◐ Quests and plot threads with status (chapters, scenes, Notes); **clues tracker ✗**.
- ◐ Player-facing vs DM-only: on maps, labels, map text, NPCs; not on every entry.
- ✅ NPC database with stat blocks, roles, attitude, notes; ✅ locations and region maps with pins and fog;
  ✅ factions in the connections web; **reputation per party member ✗**; **lore wiki backlinks ✗**
  (`[[Name]]` links planned); pantheon / cultures ◐ (notes).
- ✅ Monster library (300+ SRD) and editor; ✅ encounter difficulty (2014 and 2024 math setting); ✅ lair actions;
  ✅ legendary actions with a pool that refills each turn; ✅ legendary resistance counter (added 2026-11-18); **regional effects ✗**;
  ✅ traps (map trap zones, DC); ✅ random encounter tables.
- ✅ Combat tracker: initiative (auto for monsters), rounds, monster HP with groups, conditions and timed effects,
  concentration, recharge rolls, combat log, quick attacks, death and defeat, loot, Dexterity tie-break (added 2026-11-18).
- ✅ Rewards: DMG magic item tables, rewards to players (reward codes), shops with inventory, prices and haggling.
  **Hoard generator by CR ✗**, **item distribution log ✗**, XP / milestone awards ◐.
- ◐ Generators: random encounters ✅, downtime complications and rumours ✅, weather ✅; **random names ✗,
  taverns ✗, custom DM roll tables ✗**.
- ✅ Downtime: crafting, training, carousing, research with time and cost.
- ✅ Party dashboard (AC, HP, passives, DCs) from imported sheets; ◐ party resources live (only via import).

## Connecting the two
- ◐ Shared character data: the DM imports sheets (file / code); **not live**.
- ✅ Player view vs DM view (player display, handouts on the player display).
- ◐ Handouts: shown on the DM's player display ✅; **pushed to players' own sheets ✗**.
- ✗ Shared roll log, hidden DM rolls on it.
- ✅ DM applies rewards to a sheet (reward codes); **damage / conditions to a sheet ✗**.
- ✗ Item and gold transfers between characters.
- ✗ Group initiative where players submit their own rolls (the "Your turn" link only goes DM → players).
- ✅ Import / export and backups; ✅ search across everything (Ctrl K); ✅ offline-first with optional sync
  (local server / Cloudflare); ✅ phone layout.

## Biggest gaps, roughly in order of value at the table
1. Live link both ways (players' rolls, initiative and HP reaching the DM; DM's damage and conditions reaching
   sheets) — builds on the existing table link.
2. ~~Legendary counters and the Dexterity tie-break~~ (done 2026-11-18).
3. Generators: names, taverns, custom DM roll tables, hoards by CR.
4. Clues, faction reputation, lore backlinks (`[[Name]]`).
5. Sheet extras: 4d6 method, multiclass prerequisites, containers, currency conversion, spell points, source filter.
6. Rule switches: flanking, gritty / epic rests.
