# Research: better battle maps, and a better music / soundboard / ambience experience (2026-11-20)

What could make the DM Codex's battle map and audio significantly better, checked against what the app already does.
Ranked by value at the table. Licences were read from the publishers' own pages where the search reached them;
where it did not, that is said. Nothing here has been built yet.

## Where the app stands today
- **Battle map:** own layered canvas (floors, terrain, grid, objects, areas, walls, tokens, lighting, fog, weather,
  labels), sight checked by sampling 5 points per square (`sightClear`), exports a 70 px-per-square picture for other
  tabletops. No import of maps made in other tools, no generator.
- **Audio:** soundboard of synthesized sounds (`sound_synth.js`, made in the browser on the claude.ai version, shipped as
  files in the Cloudflare build), one ambience bed at a time with crossfades and ducking, a reverb inside the synthesizer
  (Freeverb), Spotify / Plex / Kenku FM for music. Each ambience is one long loop: nothing varies from one minute to
  the next. Rain was removed (owner, 2026-11-19).
- **Hard limit:** the claude.ai link cannot fetch outside files or call outside services, so anything there must be made
  in the page. The Cloudflare build and the local file can load files.

## Battle map

### 1. Import maps from the tools DMs already use: Universal VTT (.dd2vtt / .uvtt) (highest value)
Dungeondraft, Dungeon Alchemist and other map makers export "Universal VTT": one JSON file with the map picture
(base64 PNG), the grid size, walls (`line_of_sight`), doors and windows (`portals`) and lights. Roll20 and Foundry
import it with walls and lighting ready to use. No browser library exists, but the format is small enough to read
directly. Importing it would give the DM a finished, beautiful map with working walls, doors, fog and lights in one
step; exporting our maps in the same format would let them travel the other way.
Sources: [Roll20 UVTT support](https://help.roll20.net/hc/en-us/articles/41643201127831-Universal-Virtual-Tabletop-UVTT-Support),
[Roll20 wiki: UVTT](https://wiki.roll20.net/Uvtt), [Dungeondraft guide: Universal VTT](https://dungeondraft-encyclopaedia.gitbook.io/guide/final-steps/exporting-your-map/universal-vtt).

### 2. Generate a dungeon in one tap (skill installed: `procedural-gen`)
Seeded layouts so a map can be shared by its seed: rooms and corridors (BSP or placement plus a spanning tree), caves
(random walk or cellular automata), with a check that every room is reachable and a door between rooms. The generator
writes into the map's own data (terrain, walls, doors), so everything else (fog, lighting, tokens) works on it.
Optional: import Watabou's free One Page Dungeon JSON (rooms, doors, notes); its format has known quirks (entrances
both "stairs", door direction fields) and its licence is only stated informally by users, so check before relying on it.
Sources: [procedural-gen skill](https://github.com/gamedev-skills/awesome-gamedev-agent-skills),
[@mikewesthad/dungeon](https://github.com/mikewesthad/dungeon), [Watabou One Page Dungeon](https://watabou.itch.io/one-page-dungeon),
[Watabou JSON notes](https://watabou.itch.io/one-page-dungeon/comments?before=230).

### 3. Exact sight and light along walls
Today sight samples 5 points per square. The standard exact method sweeps the wall endpoints around the viewer and
builds a visibility polygon (Red Blob Games), and there is a grid version for walls that run along square edges, which
is how our walls are stored. Sharper shadows, no gaps at corners, and faster on big maps.
Sources: [Red Blob Games: 2D visibility](https://www.redblobgames.com/articles/visibility/),
[Red Blob Games: thin-wall field of view](https://redblobgames.com/x/2128-thin-wall-fov).

### 4. Art for maps and tokens: let the DM bring their own
Good free art exists but may not be shipped inside a public app: Forgotten Adventures (free tier for personal use,
credit required, commercial use needs a licence), 2-Minute Tabletop (mostly CC BY-NC 4.0, attribution requested).
For the owner's own table, an "add your own pictures" library for objects and tokens (stored on the device, like the
uploaded sounds) is allowed; bundling the packs is not.
Sources: [Forgotten Adventures licence](https://forgotten-adventures.net/info),
[2-Minute Tabletop free maps](https://shop.2minutetabletop.com/blogs/news/free-battle-maps-assets-by-2-minute-tabletop).

### Skills
- Installed 2026-11-19: `canvas-2d` (the map already passes its main check: drawing at the screen's real pixel
  density), `procedural-gen`.
- Konva itself is not needed: the map already follows its layer model.
- No further battle-map skill worth installing was found.

## Music, soundboard and ambience

### 1. Living ambience: layers and scattered sounds, with an intensity slider (highest value)
This is what makes Syrinscape and Tabletop Audio's SoundPad feel alive: a quiet bed loop plus separate "spot" sounds
(a crow, a distant door, a cough at the bar) that play at random moments, from random sides, at varied volume, so the
scene never repeats. One "calm → tense → fight" slider crossfades layers in and out. It needs no new files: our
synthesizer already makes the pieces (`sound_synth.js` builds ambiences from exactly such parts). Built on the
AudioContext clock with a look-ahead scheduler, which is what the installed `game-audio` skill describes.
Sources: [web.dev: audio scheduling](https://web.dev/articles/audio-scheduling),
[Syrinscape forum: layering via the API](https://forum.syrinscape.com/t/api-playing-multiple-elements/13712),
[game-audio skill](https://github.com/PlayableIntelligence/game-creator).

### 2. The room's sound: one reverb for the whole scene
A scene setting (cave, stone hall, tavern, forest, open air) that sends every sound through the same Web Audio
ConvolverNode, so a sword clash in a cave sounds like it is in a cave. The room responses can be made in the browser
(shaped decaying noise), which keeps the claude.ai version working and avoids licences. Recorded room responses
(OpenAIR, mostly CC BY, check each file) could be added to the Cloudflare build later.
Sources: [OpenAIR library](https://www.openair.hosted.york.ac.uk/?page_id=2).

### 3. Real recordings for the hosted build
- **Sonniss GDC bundles:** gigabytes of free, royalty-free sounds each year. A small curated set could ship with the
  Cloudflare build. Read the bundle licence first: the search could not open it.
- **Freesound:** a huge CC0 / CC BY library. The DM could search it from the Audio tab in the hosted build. It needs an
  API key, and original-quality downloads need OAuth.
- **find-free-sound-effects:** the skill already installed (lotsofsounds) finds free effects while building.
- None of these work on the claude.ai link.

Sources: [Sonniss GDC 2026 bundle](https://rekkerd.org/sonniss-releases-gdc-2026-game-audio-bundle/),
[Freesound API authentication](https://freesound.org/docs/api/authentication.html),
[Freesound API discussion](https://groups.google.com/g/freesound-api/c/tZ9-GWKFydw).

### 4. Made-to-order sounds and music with AI (needs an account and a key)
ElevenLabs has official agent skills: `sound-effects` (text to effect, seamless loops, set length) and `music`
(instrumental background tracks). Install with `npx skills add elevenlabs/skills`; every call needs an ElevenLabs API
key and is paid. Use: generate a library once (a tavern bed, cave drips, a dragon roar) and ship it with the Cloudflare
build. Stable Audio Open is free for individuals and organisations under $1M revenue, but makes clips up to 47 s and
needs a GPU to run, which this container does not have.
Sources: [ElevenLabs agent skills](https://elevenlabs.io/blog/elevenlabs-agent-skills),
[ElevenLabs sound effects](https://elevenlabs.io/docs/capabilities/sound-effects),
[Stable Audio Open](https://stability.ai/news/stable-audio-open-research-paper).

### 5. Ready-made ambience services
- **Syrinscape:** has an API, but layering several elements needs one call per element.
- **Tabletop Audio:** no app licence was found, so its tracks must not be embedded.
- **Music:** Spotify, Plex and Kenku FM already cover it.

## Recommended order
1. Battle map: import (and export) Universal VTT maps with their walls, doors and lights.
2. Audio: living ambience (bed plus scattered spot sounds, intensity slider) built from our own synthesized parts.
3. Audio: one reverb per scene ("the room's sound").
4. Battle map: one-tap dungeon generator (seeded rooms and corridors, caves).
5. Battle map: exact sight and light along walls.
6. Optional, needs the owner: an ElevenLabs key to generate a recorded-quality library for the Cloudflare build;
   or a Freesound key for searching from the Audio tab.
