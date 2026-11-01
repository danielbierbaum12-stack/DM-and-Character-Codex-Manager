# First reconciliation (2026-11-01, before the fixes were applied)

Snapshot of both apps before `apply_master.py` first ran. Everything listed here has since been fixed in both apps; `congruence-report.md` shows the live state.


Built 2026-11-01 by `tools/build_master.py` from the Character Codex and the DM Codex.

## Still to apply

| App | Spells that differ from the master | Creatures that differ |
|---|---|---|
| Character Codex | 505 | 28 |
| DM Codex | 499 | 1 |

Run `python3 tools/apply_master.py` to write the master into both apps (then build and test them; see README). Every change ever reconciled is kept in `shared/changes-log.json` and the spreadsheet's Changes sheet; the tables below show only what differs right now.

## Master totals

- Spells: 505
- Companion / summon / Wild Shape creatures: 73 (61 also in the DM bestiary)
- Items: 502
- Conditions: 20

## Spells: where the apps disagreed (136)

| Name | Field | Character Codex | DM Codex | Master | Why |
|---|---|---|---|---|---|
| Thaumaturgy | desc | book wording | 40% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Bane | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Bless | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Burning Hands | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Burning Hands | range | 15 feet | Self | Self (15-foot cone) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Charm Person | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Charm Person | desc | book wording | 17% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Color Spray | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Color Spray | range | 15 feet | Self | Self (15-foot cone) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Command | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Create or Destroy Water | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Cure Wounds | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Cure Wounds | desc | book wording | 70% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| False Life | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| False Life | desc | book wording | 61% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Fog Cloud | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Guiding Bolt | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Healing Word | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Healing Word | desc | book wording | 73% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Hellish Rebuke | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Hunter's Mark | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Inflict Wounds | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Inflict Wounds | desc | book wording | 63% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Longstrider | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Longstrider | desc | book wording | 55% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Magic Missile | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Sleep | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Thunderwave | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Thunderwave | range | 15 feet | Self | Self (15-foot cube) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Aid | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Aid | desc | book wording | 72% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Animal Messenger | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Blindness/Deafness | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Branding Smite | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Enhance Ability | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Flame Blade | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Flaming Sphere | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Gust of Wind | range | 60 feet | Self | Self (60-foot line) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Heat Metal | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Hold Person | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Hold Person | desc | book wording | 54% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Invisibility | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Magic Mouth | desc | book wording | 34% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Magic Weapon | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Magic Weapon | desc | book wording | 61% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Melf's Acid Arrow | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Moonbeam | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Prayer of Healing | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Prayer of Healing | desc | book wording | 75% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Scorching Ray | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Shatter | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Spiritual Weapon | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Animate Dead | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Bestow Curse | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Call Lightning | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Clairvoyance | range | 1 miles | 1 mile | 1 mile | Character Codex (rules-reviewed) wins |
| Conjure Animals | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Counterspell | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Dispel Magic | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Dispel Magic | desc | book wording | 75% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Fear | range | 30 feet | Self | Self (30-foot cone) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Fireball | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Fly | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Fly | desc | book wording | 72% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Glyph of Warding | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Glyph of Warding | desc | book wording | 39% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Leomund's Tiny Hut | range | 10 feet | Self | Self (10-foot-radius hemisphere) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Lightning Bolt | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Lightning Bolt | range | 100 feet | Self | Self (100-foot line) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Magic Circle | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Major Image | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Mass Healing Word | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Revivify | school | Necromancy | Conjuration | Necromancy | Character Codex (rules-reviewed) wins |
| Speak with Plants | range | 30 feet | Self | Self (30-foot radius) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Spirit Guardians | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Spirit Guardians | range | 15 feet | Self | Self (15-foot radius) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Vampiric Touch | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Water Breathing | desc | book wording | 7% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Banishment | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Blight | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Confusion | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Conjure Minor Elementals | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Conjure Woodland Beings | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Dominate Beast | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Fire Shield | desc | book wording | 53% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Ice Storm | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Leomund's Secret Chest | cls | ["Artificer", "Wizard"] | ["Wizard"] | ["Artificer", "Wizard"] | Character Codex (rules-reviewed) wins |
| Mordenkainen's Faithful Hound | cls | ["Artificer", "Wizard"] | ["Wizard"] | ["Artificer", "Wizard"] | Character Codex (rules-reviewed) wins |
| Mordenkainen's Private Sanctum | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Mordenkainen's Private Sanctum | cls | ["Artificer", "Wizard"] | ["Wizard"] | ["Artificer", "Wizard"] | Character Codex (rules-reviewed) wins |
| Otiluke's Resilient Sphere | cls | ["Artificer", "Wizard"] | ["Wizard"] | ["Artificer", "Wizard"] | Character Codex (rules-reviewed) wins |
| Phantasmal Killer | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Wall of Fire | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Animate Objects | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Antilife Shell | range | 10 feet | Self | Self (10-foot radius) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Bigby's Hand | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Bigby's Hand | cls | ["Artificer", "Wizard"] | ["Wizard"] | ["Artificer", "Wizard"] | Character Codex (rules-reviewed) wins |
| Cloudkill | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Cone of Cold | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Cone of Cold | range | 60 feet | Self | Self (60-foot cone) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Conjure Elemental | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Contagion | desc | book wording | 43% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Creation | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Dominate Person | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Flame Strike | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Geas | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Hold Monster | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Hold Monster | desc | book wording | 38% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Insect Plague | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Mass Cure Wounds | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Mass Cure Wounds | school | Evocation | Conjuration | Evocation | Character Codex (rules-reviewed) wins |
| Modify Memory | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Planar Binding | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Scrying | desc | book wording | 72% similar (loose SRD translation) | Character Codex wording | Character Codex wins |
| Chain Lightning | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Circle of Death | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Conjure Fey | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Create Undead | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Disintegrate | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Globe of Invulnerability | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Globe of Invulnerability | range | 10 feet | Self | Self (10-foot radius) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Heal | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Mass Suggestion | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Otiluke's Freezing Sphere | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Sunbeam | range | 60 feet | Self | Self (60-foot line) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Wall of Ice | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Wall of Thorns | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Conjure Celestial | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Delayed Blast Fireball | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Etherealness | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Prismatic Spray | range | 60 feet | Self | Self (60-foot cone) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Antimagic Field | range | 10 feet | Self | Self (10-foot-radius sphere) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Control Weather | range | 5 miles | Self | Self (5-mile radius) | The book range is Self with an area; the source spreadsheet kept only the area size. |
| Dominate Monster | desc | (no higher-level text) | (has it) | added the SRD At Higher Levels text | from DM |
| Mass Heal | school | Evocation | Conjuration | Evocation | Character Codex (rules-reviewed) wins |
| Meteor Swarm | range | 1 miles | 1 mile | 1 mile | Character Codex (rules-reviewed) wins |

## Creatures: where the apps disagreed (50)

| Name | Field | Character Codex | DM Codex | Master | Why |
|---|---|---|---|---|---|
| Crab | abil | {"STR": 2, "DEX": 11, "CON": 8, "INT": 1, "WIS": 8, "CHA": 2} | {"STR": 2, "DEX": 11, "CON": 10, "INT": 1, "WIS": 8, "CHA": 2} | {"STR": 2, "DEX": 11, "CON": 10, "INT": 1, "WIS": 8, "CHA": 2} | SRD bestiary (DM Codex) wins |
| Crab | hp | 1 (1d4-1) | 2 (1d4) | 2 (1d4) | SRD bestiary (DM Codex) wins |
| Frog | abil | {"STR": 1, "DEX": 13, "CON": 8, "INT": 1, "WIS": 10, "CHA": 3} | {"STR": 1, "DEX": 13, "CON": 8, "INT": 1, "WIS": 8, "CHA": 3} | {"STR": 1, "DEX": 13, "CON": 8, "INT": 1, "WIS": 8, "CHA": 3} | SRD bestiary (DM Codex) wins |
| Frog | trait | (missing) | Standing Leap | Standing Leap | SRD bestiary (DM Codex) wins |
| Lizard | abil | {"STR": 2, "DEX": 11, "CON": 8, "INT": 1, "WIS": 8, "CHA": 3} | {"STR": 2, "DEX": 11, "CON": 10, "INT": 1, "WIS": 8, "CHA": 3} | {"STR": 2, "DEX": 11, "CON": 10, "INT": 1, "WIS": 8, "CHA": 3} | SRD bestiary (DM Codex) wins |
| Lizard | hp | 1 (1d4-1) | 2 (1d4) | 2 (1d4) | SRD bestiary (DM Codex) wins |
| Lizard | ac | 12 | 10 | 10 | SRD bestiary (DM Codex) wins |
| Octopus | abil | {"STR": 4, "DEX": 15, "CON": 9, "INT": 3, "WIS": 10, "CHA": 3} | {"STR": 4, "DEX": 15, "CON": 11, "INT": 3, "WIS": 10, "CHA": 4} | {"STR": 4, "DEX": 15, "CON": 11, "INT": 3, "WIS": 10, "CHA": 4} | SRD bestiary (DM Codex) wins |
| Quipper | trait | (missing) | Blood Frenzy | Blood Frenzy | SRD bestiary (DM Codex) wins |
| Spider | abil | {"STR": 2, "DEX": 14, "CON": 8, "INT": 1, "WIS": 10, "CHA": 4} | {"STR": 2, "DEX": 14, "CON": 8, "INT": 1, "WIS": 10, "CHA": 2} | {"STR": 2, "DEX": 14, "CON": 8, "INT": 1, "WIS": 10, "CHA": 2} | SRD bestiary (DM Codex) wins |
| Spider | trait | (missing) | Web Walker | Web Walker | SRD bestiary (DM Codex) wins |
| Spider | action Bite | +4 to hit | +4 to hit, DC 9, 2 (1d4) | SRD text | SRD bestiary (DM Codex) wins |
| Camel | abil | {"STR": 18, "DEX": 8, "CON": 14, "INT": 2, "WIS": 8, "CHA": 5} | {"STR": 16, "DEX": 8, "CON": 14, "INT": 2, "WIS": 8, "CHA": 5} | {"STR": 16, "DEX": 8, "CON": 14, "INT": 2, "WIS": 8, "CHA": 5} | SRD bestiary (DM Codex) wins |
| Wolf | action Bite | +4 to hit, 6 (2d4+2), DC 11 | +4 to hit, 7 (2d4+2), DC 11 | SRD text | SRD bestiary (DM Codex) wins |
| Boar | trait | (missing) | Charge | Charge | SRD bestiary (DM Codex) wins |
| Giant Badger | action Bite | +3 to hit, 3 (1d4+1) | +3 to hit, 4 (1d6+1) | SRD text | SRD bestiary (DM Codex) wins |
| Constrictor Snake | size | Medium | Large | Large | SRD bestiary (DM Codex) wins |
| Crocodile | speed | 20 ft., swim 30 ft. | 20 ft., swim 20 ft. | 20 ft., swim 30 ft. | SRD 5.1 / MM: swim 30 ft. The DM Codex bestiary had swim 20 ft.; the Character Codex was right. |
| Giant Spider | action Web | DC 12 | +5 to hit, DC 12 | SRD text | SRD bestiary (DM Codex) wins |
| Giant Eagle | trait | (missing) | Keen Sight | Keen Sight | SRD bestiary (DM Codex) wins |
| Giant Eagle | action Beak | +6 to hit, 6 (1d6+3) | +5 to hit, 6 (1d6+3) | SRD text | SRD bestiary (DM Codex) wins |
| Giant Eagle | action Talons | +6 to hit, 10 (2d6+3) | +5 to hit, 10 (2d6+3) | SRD text | SRD bestiary (DM Codex) wins |
| Baboon | size | Medium | Small | Small | SRD bestiary (DM Codex) wins |
| Baboon | abil | {"STR": 8, "DEX": 14, "CON": 12, "INT": 4, "WIS": 12, "CHA": 6} | {"STR": 8, "DEX": 14, "CON": 11, "INT": 4, "WIS": 12, "CHA": 6} | {"STR": 8, "DEX": 14, "CON": 11, "INT": 4, "WIS": 12, "CHA": 6} | SRD bestiary (DM Codex) wins |
| Baboon | hp | 3 (1d4+1) | 3 (1d6) | 3 (1d6) | SRD bestiary (DM Codex) wins |
| Baboon | action Bite | +2 to hit, 4 (1d4+2) | +1 to hit, 1 (1d4-1) | SRD text | SRD bestiary (DM Codex) wins |
| Flying Snake | trait | (missing) | Flyby | Flyby | SRD bestiary (DM Codex) wins |
| Flying Snake | action Bite | +6 to hit, DC 10, 7 (3d4) | +6 to hit, 7 (3d4) | SRD text | SRD bestiary (DM Codex) wins |
| Flying Snake | actions | (see app) | — | (corrected) | SRD 5.1: the poison damage has no saving throw. The old note called it a level 2 Wild Shape, but flying forms need level 8. |
| Flying Snake | desc | The only wild shape option with a fast fly speed at level 2 — great for aerial scouting. | — | A fast, tiny flyer. As a Wild Shape it needs Druid level 8 (no flying speed before then); it's also a Find Familiar option. | SRD 5.1: the poison damage has no saving throw. The old note called it a level 2 Wild Shape, but flying forms need level 8. |
| Giant Owl | hp | 19 (3d8+6) | 19 (3d10+3) | 19 (3d10+3) | SRD bestiary (DM Codex) wins |
| Giant Rat | action Bite | +4 to hit, 4 (1d3+2) | +4 to hit, 4 (1d4+2) | SRD text | SRD bestiary (DM Codex) wins |
| Giant Weasel | hp | 9 (2d6+2) | 9 (2d8) | 9 (2d8) | SRD bestiary (DM Codex) wins |
| Giant Weasel | action Bite | +4 to hit, 5 (1d4+3) | +5 to hit, 5 (1d4+3) | SRD text | SRD bestiary (DM Codex) wins |
| Goat | trait | (missing) | Sure-Footed | Sure-Footed | SRD bestiary (DM Codex) wins |
| Jackal | trait | (missing) | Keen Hearing and Smell | Keen Hearing and Smell | SRD bestiary (DM Codex) wins |
| Jackal | action Bite | +1 to hit | +1 to hit, 1 (1d4-1) | SRD text | SRD bestiary (DM Codex) wins |
| Vulture | abil | {"STR": 7, "DEX": 10, "CON": 13, "INT": 6, "WIS": 12, "CHA": 4} | {"STR": 7, "DEX": 10, "CON": 13, "INT": 2, "WIS": 12, "CHA": 4} | {"STR": 7, "DEX": 10, "CON": 13, "INT": 2, "WIS": 12, "CHA": 4} | SRD bestiary (DM Codex) wins |
| Vulture | trait | (missing) | Pack Tactics | Pack Tactics | SRD bestiary (DM Codex) wins |
| Giant Toad | cr | 1/4 | 1 | 1 | SRD bestiary (DM Codex) wins |
| Giant Toad | speed | 20 ft., swim 30 ft. | 20 ft., swim 40 ft. | 20 ft., swim 40 ft. | SRD bestiary (DM Codex) wins |
| Giant Toad | action Bite | +4 to hit, 7 (1d10+2), 3 (1d6), DC 13 | +4 to hit, 7 (1d10+2), 5 (1d10), DC 13 | SRD text | SRD bestiary (DM Codex) wins |
| Giant Wasp | abil | {"STR": 10, "DEX": 14, "CON": 12, "INT": 1, "WIS": 10, "CHA": 3} | {"STR": 10, "DEX": 14, "CON": 10, "INT": 1, "WIS": 10, "CHA": 3} | {"STR": 10, "DEX": 14, "CON": 10, "INT": 1, "WIS": 10, "CHA": 3} | SRD bestiary (DM Codex) wins |
| Giant Wasp | speed | 10 ft., fly 50 ft. | 10 ft., fly 50 ft., swim 50 ft. | 10 ft., fly 50 ft., swim 50 ft. | SRD bestiary (DM Codex) wins |
| Giant Boar | abil | {"STR": 17, "DEX": 8, "CON": 17, "INT": 2, "WIS": 7, "CHA": 5} | {"STR": 17, "DEX": 10, "CON": 16, "INT": 2, "WIS": 7, "CHA": 5} | {"STR": 17, "DEX": 10, "CON": 16, "INT": 2, "WIS": 7, "CHA": 5} | SRD bestiary (DM Codex) wins |
| Giant Boar | action Tusk | +6 to hit, 10 (2d6+3) | +5 to hit, 10 (2d6+3) | SRD text | SRD bestiary (DM Codex) wins |
| Giant Elk | abil | {"STR": 19, "DEX": 16, "CON": 14, "INT": 7, "WIS": 14, "CHA": 14} | {"STR": 19, "DEX": 16, "CON": 14, "INT": 7, "WIS": 14, "CHA": 10} | {"STR": 19, "DEX": 16, "CON": 14, "INT": 7, "WIS": 14, "CHA": 10} | SRD bestiary (DM Codex) wins |
| Giant Scorpion | hp | 52 (8d10+8) | 52 (7d10+14) | 52 (7d10+14) | SRD bestiary (DM Codex) wins |
| Killer Whale | ac | 13 | 12 | 12 | SRD bestiary (DM Codex) wins |
| Giant Crocodile | action Tail | +8 to hit, 14 (2d8+5) | +8 to hit, 14 (2d8+5), DC 16 | SRD text | SRD bestiary (DM Codex) wins |

## Spell fields that are only formatting

Not listed above, and normalised in the master for both apps: casting times like `1 bonus` become `1 bonus action`; singular units become plural (`8 hour` to `8 hours`); concentration durations read `Up to 1 minute`; ranges start with a capital. Components (V, S, M and materials) come from the spreadsheet's Spell Data sheet, so the Character Codex gets them for the first time.

## Conditions

Same conditions in both apps. The Character Codex shows a one-line summary per condition (and splits Exhaustion into levels 1 to 6); the DM Codex shows the full SRD text. Both are kept in `shared/master/conditions.json` as `short` and `full`; neither app needs changes.

