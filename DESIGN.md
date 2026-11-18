---
name: DM Codex & Character Codex
description: A lamplit codex for the D&D table, one look shared by the DM's screen and the players' sheets.
colors:
  ink: "#12100f"
  panel: "#1c1815"
  panel2: "#231e1a"
  well: "color-mix(in srgb, #12100f 55%, #1c1815)"
  deep: "color-mix(in srgb, #12100f 80%, #000)"
  line: "#3a332b"
  used: "#4a4238"
  parchment: "#e9dfc4"
  parchment-dim: "#b9ac8c"
  gold: "#b8923f"
  gold-bright: "#d8b45f"
  blood: "#7c2331"
  blood-bright: "#a83244"
  emerald: "#3f6d54"
  azure: "#3a5f74"
typography:
  headline:
    fontFamily: "Cinzel, Georgia, serif"
    fontWeight: 700
    letterSpacing: "0.04em"
  title:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "14px"
    fontWeight: 700
  body:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.06em"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "12px"
rounded:
  sm: "5px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  card: "12px"
components:
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.xl}"
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "{colors.panel2}"
    textColor: "{colors.gold-bright}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
  chip-danger:
    backgroundColor: "{colors.blood}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.xl}"
---

# Design System: DM Codex & Character Codex

Both apps use exactly this system: the same `:root` tokens are defined in `DM-Tool/Source` (dm-codex) and in
`Character_Codex.html`. Change a token in both. Product context is in `PRODUCT.md`.

## Overview

**Creative North Star: "The Lamplit Codex"** (proposed name; the owner can rename it)

A well-used book of lore read by lamplight: ink-dark pages, parchment lettering, gold leaf on what matters, and a few
deep pigments (blood, emerald, azure) for meaning. It is a working tool first. Most screens are dense on purpose:
people use them mid-turn at a busy table, often on a phone. Atmosphere grows with the chosen view: the plain views stay
quiet and fast, "All the fixings" adds glows, embers, dice and sound.

**Key Characteristics:**
- Dark surfaces in three steps (ink, panel, panel2), separated by thin `line` borders rather than heavy shadows.
- Gold is the single accent for action and focus; deep pigments carry meaning (danger, healthy, magic), never decoration.
- Cinzel small caps for headings, labels and tabs; Spectral for reading text; JetBrains Mono for dice and numbers.
- Same layout in every view (`body.tight`); views add or remove things, never padding.

## Colors

Warm near-black surfaces, parchment text, gold leaf accent, three deep pigments.

### Primary
- **Gold Leaf** (#b8923f): primary buttons (with ink text, 6.5:1), active tab, focus, borders on chosen items.
- **Bright Gold Leaf** (#d8b45f): gold text on dark (9.6:1), headings' accents, hover.

### Secondary (meaning colours)
- **Blood** (#7c2331) / **Bright Blood** (#a83244): danger, damage, enemies, over-limit warnings. Fills only.
- **Emerald** (#3f6d54): healthy, success, allies. Fills only.
- **Azure** (#3a5f74): magic, information, water. Fills only.

### Neutral
- **Ink** (#12100f): page background. **Panel** (#1c1815): cards. **Panel 2** (#231e1a): raised controls.
- **Well** (ink 55% into panel): inputs. **Deep** (ink with black): recessed areas.
- **Line** (#3a332b): borders and dividers. **Used** (#4a4238): spent pips and slots, disabled fills.
- **Parchment** (#e9dfc4): main text (13–14:1). **Dim Parchment** (#b9ac8c): secondary text (7–8:1).

### Named Rules
**The Pigment Rule.** Blood, emerald and azure are fills behind parchment text, not text colours: as text on the dark
surfaces they reach only 1.7–3.2:1. Where a coloured word or number is needed (HP, "known", a warning), use a lighter
text tint of the pigment that reaches 4.5:1, defined once as a token in both apps.

**The Never-Colour-Alone Rule.** Every meaning a colour carries (HP state, conditions, enemy / ally / neutral,
success / failure, map markers) also has a word, icon or shape. Players with colour blindness must lose nothing.

**The One Gold Rule.** Gold marks the thing to press or the thing chosen. If everything on a screen is gold, nothing is.

## Typography

**Display / Label Font:** Cinzel (with Georgia, serif)
**Body Font:** Spectral (with Georgia, serif)
**Numbers / Dice:** JetBrains Mono

**Character:** carved Roman capitals for structure, a bookish serif for reading, a clean mono so numbers line up.

### Hierarchy
- **Headline** (Cinzel 700, 16–20px, small caps, tracked): section titles.
- **Title** (Cinzel 700, 13–15px): card titles, names in lists.
- **Body** (Spectral 400, 13–14px, 1.45): descriptions, rules text, notes. Long text at most ~75 characters a line.
- **Label** (Cinzel 700, 11px, uppercase, tracked): field labels, tab names, stat names.
- **Numbers** (JetBrains Mono, 12px+; large stat numbers in Cinzel): modifiers, dice, HP.

### Named Rules
**The 11 px Floor.** Nothing a person reads or presses is smaller than 11 px. Where space is tight, shorten the words
or use an icon with a tooltip; don't shrink the type.

## Layout

- One shared spacing for all views (`body.tight`). Ultra simplified (`body.view-ultra`) removes things and folds the
  rest behind "⋯" (less-used actions) and "▸ Label" (details); it never changes padding.
- Phones and Ultra use the compact layout (`body.cui`): one column, bottom tab bar, folded reference sections.
- Desktop: top tab bar; DM Codex adds side panels (map panel, split screen). Wide tables scroll inside their card,
  never the page.
- Dense lists are single rows (name · meta · number); details open in place.

## Elevation & Depth

Mostly flat, layered by tone: ink page, panel cards, panel2 controls, with 1 px `line` borders. One shadow token,
`--shadow: 0 8px 24px rgba(0,0,0,.45)`, lifts modals, popovers and the floating dice button only. Coloured glows
(gold on the active tab, green on HP) belong to the Extra and All the fixings views; the plain views stay flat.

## Shapes

Soft corners: 5–6 px on controls and chips, 8–10 px on cards, 12 px on dialogs. Pills (999 px) for chips and status
tags. Round dice and portrait tokens. No sharp 0 px corners and no heavy rounding beyond 12 px.

## Components

- **Buttons:** primary = gold fill, ink text; ghost = panel2 fill, gold-bright text, line border; danger = blood fill,
  parchment text. At least 24 px tall to tap (the hit area can extend past the drawn button).
- **Inputs:** well background, parchment text, line border, gold border on focus. Always a label (visible, or
  `aria-label` where the layout is a dense row).
- **Cards:** panel background, 10 px corners, line border, Cinzel title.
- **Tabs:** Cinzel labels; active tab in gold with an underline. Tab bars are marked up as tab lists.
- **Chips / pips:** pill shape; spent pips use `used`.
- **Toasts:** bottom, above the tab bar, never over the row being worked on; short, with Undo where it applies.
- **Focus:** a visible gold ring on every control reached by keyboard.

## Do's and Don'ts

- **Do** change tokens and shared components in both apps together.
- **Do** keep numbers from the rules visible at a glance (bonus, DC, HP, slots) and the explanation one tap away.
- **Do** keep motion short and meaningful (a roll result, an HP change); with reduced motion, keep the change visible
  and drop the movement.
- **Don't** use blood, emerald or azure as text on dark surfaces (The Pigment Rule).
- **Don't** make a box bigger without putting more in it.
- **Don't** add glows, gradients or animation to the plain views; atmosphere lives in All the fixings.
- **Don't** add frameworks or icon libraries; icons are the apps' own inline set (`ico()`).
