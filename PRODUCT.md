# Product

<!-- impeccable:product-schema 1 -->

Two apps, one product: the **DM Codex** (the Dungeon Master's screen) and the **Character Codex** (each player's
character sheet), for Dungeons & Dragons 5e. This record covers both; each app's own `CLAUDE.md` / `README.md` holds
its build details.

## Platform

web

## Users
- **The DM** runs the session from the DM Codex on a laptop or desktop: prepares chapters and scenes, runs combat and
  the battle map, plays music and sound, looks up rules, hands out rewards. Sometimes a TV or second screen shows the
  player display.
- **The players** each use the Character Codex, mostly on phones at the table, sometimes on a computer at home: roll,
  track HP, slots, conditions and resources, cast spells, manage inventory, build and level up their character.
- Both apps serve tables that know the rules well and tables with new or young players. The owner's own group comes
  first now; the apps are meant to become something any group can pick up later.

## Product Purpose
Take the bookkeeping off the table so the session is about playing. The apps calculate numbers from the character's
real stats and the actual rules (not guesses), lead the play when asked (Guided) and stay out of the way when not
(Manual), and keep the DM's and players' views of the same game data in agreement.

Success: a session runs without anyone flipping through books or doing arithmetic, new players understand what they
can do on their turn, and experienced players never feel the app taking control away from them.

## Positioning
- One shared game-data and rules core feeding a DM tool and a player tool that agree with each other (the Codex
  Manager checks it), instead of two unrelated apps.
- Rules accuracy as a feature: numbers derived from the 2014 rules (SRD 5.1) with 2024 changes behind switches, and a
  built-in rulebook with sourced answers to common and niche questions.
- Every screen works at five levels of detail, from Ultra simplified to All the fixings, so the same app suits a
  phone at a crowded table and a big screen at home.

## Operating Context
- **Both in person and online, about equally.** In person: DM laptop, players' phones, optionally a TV as the player
  display or a table camera. Online: everyone on their own screen, voice and music over Discord (Kenku FM).
- Live play is time-pressured and social: a player needs their attack bonus in seconds, a DM juggles initiative,
  monsters and the map at once. Preparation (chapters, NPCs, maps, characters) happens before the session, unhurried.
- Ways the apps run: single HTML files opened directly, the owner's local server (`server.py`, which also links the
  apps: "Your turn" notices, Kenku FM relay), a Cloudflare site, and claude.ai artifact links (the normal place to
  publish; no link between apps there).

## Capabilities and Constraints
- Each app is one self-contained HTML file: no framework, no build-time dependencies, all game data inline. It must
  keep working offline and from a file.
- Shared display rules both apps must keep identical: the five views (Ultra simplified, Simplified, Normal, Extra,
  All the fixings), Guided and Manual play, spell component display, the rulebook, the table link. Change both together.
- "A box is only bigger when it holds more": views differ by what they show, never by padding alone.
- Manual play always works: every automatic step has a hand control.
- Rules content only from sources that can be checked (SRD 5.1, SRD 5.2.1, labelled Sage Advice); homebrew and
  unverifiable material is left out and said so.
- Claude can act inside both apps (Ask Claude, Claude Code copy/paste, `CodexAPI` / `DMCodexAPI`).
- Undecided: whether the apps eventually merge into one repo with a shared build (`shared/`, `player/`, `dm/`).

## Brand Commitments
- Names: "DM Codex" (also "Dungeon Master's Codex") and "Character Codex".
- Voice: plain, short, friendly words in the apps; explain rules in everyday language.
- The established look (dark surfaces, gold accents, small-caps headings, the "All the fixings" atmosphere) is the
  incumbent identity; DESIGN.md records it.

## Evidence on Hand
- Sample content: the sample chapter "Chapter 1: The Great Goose Caper" (DM Codex) and the sample wizard character
  (`DND-Player-Tool/Docs/presentation-sample-setup.js`).
- Rules sources supplied by the owner: Basic Rules 2018, SRD 5.1, SRD 5.2.1, the 5.1→5.2 change notes, Sage Advice
  Compendium v2.0 and v2.4.
- Test suites in both repos (Playwright) and the review in `Docs/review-and-plan-2026-11.md`.
- No testimonials, user counts or public reviews exist; never invent them.

## Product Principles
1. **The table comes first.** Anything that slows a turn down is a bug; the most-used thing is always one tap away.
2. **Correct by the rules.** Calculate, don't guess; cite sources; never invent rules content.
3. **Lead or step back.** Guided helps and prompts; Manual never changes anything the player didn't press.
4. **Same game, two seats.** The DM's and players' apps share data, words and display rules.
5. **Detail on demand.** Five levels of detail; nothing is removed for good, each step up adds something.

## Accessibility & Inclusion
- Standard: WCAG 2.2 AA (readable contrast, labelled fields, full keyboard use, 24 px tap targets, reduced motion).
- **Colour blindness:** never rely on colour alone. HP state, conditions, enemy/ally/neutral, success/failure and
  map markers always carry a word, icon or shape as well as a colour.
- **New and young players:** plain words, rules explained where they're used (the rulebook, "how it's built" popups,
  Guided prompts), no jargon without an explanation one tap away.
