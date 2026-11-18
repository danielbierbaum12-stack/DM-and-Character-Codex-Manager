# Review and update plan (2026-11-18)

A review of the DM Codex and the Character Codex after this round of work (rulebook, scribe tools, map Build tool,
Ask Claude reach, sound mixer, Kenku FM, map lighting), using the new skills. Method:
- `impeccable` audit: its detector on both app files, plus its five-part checklist.
- Measured in a real browser (the apps' own Playwright set-up) on every tab, at 1400 px and 390 px with the sample
  character / sample chapter loaded: text contrast, text size, tap-target size, form labels, keyboard focus, page overflow.
- Phone screenshots of the main tabs, checked by eye.
- The accessibility skills (`forms`, `keyboard`, `light-dark-mode`), Emil Kowalski's motion skills and
  `database-schema-designer` were used as the checklists for their parts of the plan below.

## Scores (impeccable audit, 0–4 each)

| # | Dimension | DM Codex | Character Codex | Key finding |
|---|-----------|----------|-----------------|-------------|
| 1 | Accessibility | 2 | 2 | Unlabelled form fields (CC 337 across tabs, DM 44), text under 11 px in the tab bars, low-contrast HP number and warnings (CC) |
| 2 | Performance | 3 | 3 | Fine; lighting and weather keep redrawing the map while shown (by design, stops with reduced motion) |
| 3 | Theming | 3 | 3 | Colour tokens used widely (DM 808 `var()` uses, CC 640), but ~100 hard-coded colours each; dark only, no light theme |
| 4 | Responsive | 3 | 3 | No sideways scrolling anywhere; many controls under 24 px; truncated labels on phones (DM) |
| 5 | Implementation integrity | 3 | 3 | One coherent dark-and-gold fantasy look shared by both apps; a few one-off styles |
| | **Total** | **14/20 (Good)** | **14/20 (Good)** | |

**Integrity verdict: pass.** Both apps share one deliberate look (dark surfaces, gold accents, small-caps headings, the same
five views and play styles), not a generic template. The detector found no layout anti-patterns; its findings were small
text (both tab bars), one glow text-shadow and one striped background (CC).

## What works (keep it)
- No page errors and no sideways overflow on any tab, desktop or phone.
- Every control reached by Tab shows a visible focus ring (first 25 stops checked in each app).
- Images all have alt text; no clickable `div`s pretending to be buttons.
- The two apps really do match: views, play styles, rulebook, spell components, table link.
- Ultra simplified and the folds keep phones usable despite very dense screens.

## Findings by severity

**P1 (fix before the next release)**
1. **Form fields without labels.** Screen readers announce them as "edit text". Worst: CC Spellbook (184: the per-spell
   pickers), CC Dev (41), CC Features (33), CC Character (29–32: name, race…), DM Dev (29), DM Bestiary filters (search,
   type, CR). WCAG 1.3.1 / 4.1.2. Fix: `<label for>` or `aria-label` on every field; visible labels where there's room.
2. **Low contrast.** CC: the HP number when it is over its maximum (3.2:1), the starting-equipment warning (2.7:1), the
   "✕" remove buttons (2.7:1), "0 known" counts (3.0:1). DM: the "✕" buttons in Notes (2.7:1). WCAG 1.4.3 needs 4.5:1.
3. **Reduced motion.** CC switches off every animation and transition at once (`* {animation:none; transition:none}`),
   which also kills useful feedback (a roll result appearing, a section opening). DM only covers the dice and map pegs, so
   the map lighting flicker, weather and toasts still move. Fix both the same way: keep state changes visible (fades,
   instant swaps), drop movement.
4. **Text under 11 px.** CC bottom tabs 9.5 px, AC label 9.5 px, "Play style"/"Volume" 10.5 px; DM tab bar 10 px,
   "Chapter"/"Section" labels 10.5 px. Fix without making boxes bigger (owner's rule): shorter labels or icons with the
   name in a tooltip, so 11–12 px fits in the same space.

**P2 (next pass)**
5. **Tap targets under 24 px.** Fold chevrons "▾" (17 px), chips 21 px tall ("above max", "Normal rolls", language
   chips), checkboxes 18 px where the row isn't clickable. WCAG 2.5.8. Enlarge the hit area, not the drawing (padding
   with negative margin, or make the whole row the label).
6. **Page structure.** DM: no `lang` on `<html>`, no `<h1>`, no `main` landmark. CC: tabs aren't marked as a tab list
   (DM's are), no `main`. Cheap fixes that help screen readers and search.
7. **Phone top bar (DM).** The view menu reads "All the fixing" and the chapter menu "Chapter 1:" (cut off); bottom
   tabs read "BATTLE SE…", "ENCOUNT…". Shorter names on phones.
8. **Toasts cover content.** The welcome toast sits over the Bestiary list on phones. Move toasts above the bottom tabs,
   away from list rows, or make them smaller on phones.
9. **Light theme.** Both apps are dark only and ignore the system's light/dark setting. A parchment (light) theme for
   daylight tables, with the dark one staying the default. All colours through tokens first (point 10).
10. **Hard-coded colours.** ~130 (DM) and ~90 (CC) colours outside the tokens. Move them onto the shared tokens so a
    second theme and contrast fixes happen in one place.

**P3 (polish)**
11. The glow text-shadow and the striped background in CC: the only two "generic effect" flags; check they earn their place.
12. Test runs rewrite a dozen screenshot PNGs in the DM Codex repo every time (git noise; each commit has to restore them).
    Write them to a temp folder instead.
13. Some tests count things (Claude actions, tools, tabs) and break whenever something is added. Check for the named
    items instead of the total.

## Work from this session to follow up
- **DM Codex v47** (sound mixer, rain, Kenku FM, map lighting) is committed and tested; it waits for the owner's yes to publish.
- **Cloudflare deploy** is still blocked (the upload token problem); waiting on the owner.
- **Kenku FM:** "Connect" tries ten ports one after another (up to 15 s when the server isn't running). Try them all at
  once. Not yet tried against the real Kenku FM app.
- **Lighting:** shadow edges follow the squares; magical darkness doesn't yet put lights out; a softer edge (blur where
  the browser supports it) and darkness-blocks-light are the next steps.
- **Scribe tools** (session plan, connections web, timeline, starter questions, split screen) are optional and off by
  default, waiting for the owner's review.

## The plan, in order

| Step | What | Skills | Apps |
|------|------|--------|------|
| 0 | Write `PRODUCT.md` and `DESIGN.md` here in the Manager: who uses the apps, the five views, play styles, and the current look as a shared design system (tokens, type, spacing, components). Every later step checks against it. | `impeccable init`, `impeccable document` | both |
| 1 | Labels on every field; contrast fixes; `lang`, `main`, `h1`, tab-list roles. | `forms`, `keyboard`, `impeccable harden` | both |
| 2 | Reduced motion done properly in both apps (feedback stays, movement goes), covering the map lighting and weather too. | `review-animations`, `remove-animations` | both |
| 3 | Text floor 11 px and 24 px tap areas without bigger boxes; phone top bar and bottom tab names. | `impeccable typeset`, `impeccable adapt`, `mobile-native` | both |
| 4 | Colours onto shared tokens, then a parchment light theme that follows the system setting (dark stays default). | `light-dark-mode`, `impeccable colorize`, `ui-ux-pro-max` | both |
| 5 | Motion polish where it helps play: HP change, slot spent, dice result, drawers and modals; nothing on high-frequency screens. | `find-animation-opportunities`, `animate`, `emil-design-eng` | both |
| 6 | Data map: write down the entities (campaign → chapter → section → scene; creatures, spells, items, characters, houses rules) and how they link, as a JSON schema in `shared/`. Shows what to share next (feats, classes, races, backgrounds). | `database-schema-designer` | Manager |
| 7 | Follow-ups: Kenku parallel connect, lighting softer edges and magical darkness, test-screenshot and count-check clean-up. | — | DM |
| 8 | Check it all: worst-case data on the busiest screens (long names, 20 conditions, 300 items), full character creation at levels 1/5/11/20 with AC, initiative and spell slots checked against the rules, screenshots at 390/820/1400; re-run this audit (aim 17+/20 for each app). | `break-ui`, `playwright-cli`, `impeccable audit`, `impeccable polish` | both |

Every step changes both apps together where the rule is shared, keeps the owner's rules (views, `body.tight`, a box is only
bigger when it holds more, Guided/Manual, no frameworks), adds tests, and runs both full suites before committing.
Publishing waits for the owner's yes each time.
