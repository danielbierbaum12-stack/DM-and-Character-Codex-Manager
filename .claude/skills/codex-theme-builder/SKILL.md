---
name: codex-theme-builder
description: The method for building a Character Codex theme to the Haunted Manor standard — how to plan the place, compose and animate an illustrated SVG backdrop, build panels and character-sheet elements from the theme's own materials, and test it — plus the technique library, pitfalls and the user's design preferences learned while building all the themes. Use whenever creating a new Codex theme, rebuilding or adding detail to an existing one, or reviewing a theme for quality.
---

# Building a Codex theme

Haunted Manor is the theme the user loves. This skill records **everything done to make it**, generalised so the same process produces a new theme of the same quality. It also captures what the user liked and rejected across all the other themes. Follow the process, use the techniques, check the pitfalls.

The worked example is in `references/haunted-example/`: scene, CSS, corner artwork and palettes. A blank scene skeleton is `references/scene-template.js`. The live demo is `theme-demo/`.

## What the user wants (learned from feedback)

- **A place, not a texture.** Themes built as a colour plus a texture plus floating particles were called "terrible" and "samey". Every good theme is a *specific location with things happening in it*: a gallery with portraits, a taproom with a bard, a dojo with a swordsman's shadow.
- **Literal, recognisable scene elements.** When the user names things, put those exact things in, and make them visible: the yeti in the cave, the gates of hell, a bartender, people clinking drinks.
- **Living details and small surprises.** Eyes that follow the cursor, a portrait that becomes a skull, a spider lowering, mushrooms that puff spores when tapped. Ask "what would happen in this place?" and animate it.
- **No rock textures** for Demon and Mushroom, and generally no reused stone or rock image as a background. Draw the place instead.
- **Unique per theme, everywhere.** Each theme reshapes ability scores, core stats, hit points, spell slots and panel frames as objects from its world. Recolouring a shared shape isn't enough.
- **Stylised, not cartoonish.** Frames are crafted from a material (gilt, forged iron, carved ice, living vine) with corner ornaments, not glowing rounded boxes or rainbow borders.
- **Compact and aligned.** The sheet must fit one desktop screen; rows level, nothing tilted or offset unless it's clearly deliberate. Spell slots small and characterful, not big buttons.
- **No "MS Paint" figures.** Flat single-colour shapes with thick uniform outlines read as cheap clip art (the castle knight was removed for this). Figures and props need shading (hatching, metal or fold gradients, a wash) and believable proportions, or they should be left out. A silhouette with fine detail (wiry limbs, veined wings) beats a crude coloured figure.
- **Serious fantasy, not cozy cartoon.** The Feywild was rejected as "Animal Crossing". The reference points are Brian Froud, Cicely Mary Barker and The Spiderwick Chronicles: botanical accuracy, muted earthy colour, ink line and watercolour, an undertone of menace (eyes in a hollow, warnings in the margins). Avoid saturated candy colours, glowing outlines and round friendly shapes.
- **Iterate in passes.** Rebuild one theme at a time, show it, then add a "detail pass" when asked.

## The process

### 1. Concept: pick the place and its materials
Write one line: *where are we, and what is the UI made of?*
- Haunted: a Victorian gallery hall at night; the UI is tarnished gilt, brass plaques and ectoplasm.
- Then list **10–14 things in that place**, aiming for: 2 large hero elements, 3–4 that animate continuously, 1–2 signature timed events, 2–3 creatures or characters, and air-borne life.

### 2. Palettes as variables
Four palettes per theme. Name every colour role the scene needs (Haunted: `wall`, `wall2`, `gilt`, `ecto`, `panel`, `text`, `muted`). Every colour in the scene, frames and widgets comes from these `--p-*` variables, so switching palette restyles the whole room. Palettes are variations of the place (Spectral Green / Widow's Violet / Pale Spirit / Faded Rose), not unrelated colour sets. Include one light palette only if the place can be daytime.

### 3. Lay out the scene around the panels
The panels cover the middle, so the scene lives in the **margins**.
- ViewBox `0 0 1600 900`, `preserveAspectRatio="xMidYMid slice"`.
- At 1440 px wide only ~200 units show each side; at 1920 px ~350. Put hero elements at x 40–300 and x 1300–1560.
- The bottom strip (y 760–900) shows below the panels on large screens: use it for characters and floor props.
- The top strip sits behind the title and buttons: keep it to ceiling, sky, hanging things.
- Make panels slightly see-through (`--p-panel` alpha ~0.8) so the scene shows faintly behind.
- Haunted map: window + curtains + oval portrait (left), gentleman portrait + clock + raven (right), candelabra + ghost dancers + moonlight on the floor (bottom), chandelier area, bats, spider and cobwebs (top and air).

### 4. Draw the scene (`bg-<theme>.js`)
One exported function returns an inline SVG string. Draw back to front: ground, far layer, margins, bottom strip, air, finish (vignette and flash). Use small helper functions for anything repeated (curtain, cobweb, candle, bat). Use seeded random numbers so the scene is identical every load.

### 5. Animate: continuous life + one signature event
- **Continuous** (always moving, slow, different periods so they never sync): pendulum 1.6 s, flames, chandelier sway 7 s, candelabra bob 6 s, bats, ghost glide 28 s, dancers 40 s.
- **Signature event** on one shared cycle: Haunted's lightning every 11 s drives the window flash, bolt, room flash, skull swap and handprint, all keyed to the same 88–93% window. Ice's 17 s cave flicker reveals the yeti; Tavern's 6 s toast drives arms, mugs and foam splash.
- **Interactive**: something that answers the user (eyes follow the cursor; toadstools burst spores when pressed).

### 6. Build the panels from the material
- Frame = `border` with a multi-stop gradient on `border-box` and the panel fill on `padding-box`, plus layered `box-shadow` rings (outer black rule, inset gilt line) and a `::before` detail line (Haunted's dotted "beaded molding").
- **Corner ornaments** as an SVG `<symbol>` in the page's hidden `<defs>`, placed four times (mirrored) and sized 80–96 px, offset outside the frame.
- Headings get the theme's display typeface; body a readable serif or sans. All from Google Fonts.

### 7. Reshape every character-sheet element
Ask what each element *is* in this place:

| Element | Haunted | Others that worked |
|---|---|---|
| Ability scores | Oval portraits with a silhouette and a brass name plaque | Playing cards (Rogue), tombstones (Darkwood), leaves (Fae), planets in orbit (Astral) |
| Core stats | Engraved brass plaques with corner screws | Signposts, chalkboards, flower medallions, ice shards |
| Hit points | Dripping ectoplasm bar | Burning candle, draining mana orb, emptying tankard, rose-tipped vine |
| Spell slots | Little ghosts that fade | Wax seals, snuffed candles, coins, runes, closed buds |

### 8. Test, then show
- Screenshot desktop **1440 and 1920** and phone **390**.
- **Freeze frames** of every timed event (see techniques) to prove it happens and looks right.
- Run the **alignment audit**: no text under corner ornaments, rows level, nothing outside panels, no overflow.
- Click through all themes and palettes for console errors.
- Then publish and describe what's in the scene, so the user knows what to look for.

## Technique library

**Scene drawing**
- Wallpaper: `<pattern>` tile containing a symmetrical motif `<path>`, used as a rect fill.
- Window views: `<clipPath>` the outside scene to the window shape, then draw the frame and muntins on top.
- Crescent moon: a `<mask>` with a white rect and a black offset circle, not a dark circle on top (that shows as a disc).
- Soft ghosts and mist: radial gradient fill (highlight near the top) plus `feGaussianBlur`.
- Swapping images: two groups on the same cycle with opposite opacity keyframes (lady/skull).
- Mirroring: `transform="translate(1600 0) scale(-1 1)"` reuses a left-side figure on the right.

**Illustrated (ink and watercolour) look** — see `theme-demo/bg-feywild.js`
- Hand-drawn wobble: wrap line work in a filter of `feTurbulence` (fractalNoise, ~.04) into `feDisplacementMap` (scale 3–4).
- Watercolour wash on large fills: a low-frequency turbulence turned into a mottled alpha (`feColorMatrix` alpha row like `0 0 0 1.9 -.75`), composited `in` the shape and merged over it, then displaced slightly.
- Shadows as hatching: a rotated `<pattern>` of thin ink lines used as an overlay fill (two angles for cross-hatching); colour the pattern line with CSS.
- Paper grain over the whole scene: a high-frequency desaturated turbulence rect with `mix-blend-mode:soft-light`.
- Depth through mist: far layers mix the trunk colour toward a mist colour and drop opacity; drifting blurred fog bands between layers.
- Botany from parameters: fern fronds as leaflets placed along a quadratic curve with tangent and normal vectors; foxglove bells placed along the stem's bezier, shrinking toward the tip.
- Field-guide annotations in an italic old-style face (IM Fell English), with a palette-specific note colour so light palettes stay readable.
- For a light palette, give the scene's dark masses (canopy, notes) their own palette variables instead of deriving them from ink.

**Motion**
- Pendulums, lanterns, swinging signs: `transform-origin` at the pivot in px plus an alternate rotate.
- Flight paths: an outer group with translate keyframes (the path); an inner group for the body; wings as separate paths flapping with `scaleY` at 0.2–0.3 s.
- Lowering spider: translateY keyframes with long holds at the top and bottom.
- Timed events: one long duration, all keyframes clustered in a short window (e.g. 88–93%), everything else idle.
- Cursor tracking: `pointermove` writes `--ex`/`--ey` (−1…1) on `:root`; pupils `translate(calc(var(--ex) * 3px), …)`.
- Interactive bursts: on `pointerdown`, read the target's `getBBox()`, append circles with per-circle `--dx`/`--dy` CSS variables, animate, remove after.
- Raising characters' arms: rotate the arm about the shoulder and counter-rotate the held object about the hand so it stays upright.

**Panels and widgets**
- Colour SVG symbols with inline `style="fill:var(--p-x)"` **inside the symbol**; CSS rules on `#symbol .class` don't reach `<use>` copies.
- Reordering tile contents (icon, value, score, then name plaque) with `order` instead of changing markup per theme.
- Masks and small decorative images as **PNG data URIs** (render SVG to PNG at 3×), never SVG data URIs or files.
- Grain textures are mid-grey: blend with `soft-light` or `overlay`, never `multiply` (it darkens paper to brown).

**Testing**
- Freeze frame: `document.getAnimations()` → filter by duration → `pause()` → set `currentTime` → screenshot.
- Alignment audit: compare text bounding boxes (use a Range around the text, not the element box) against an L-shaped band for each corner ornament; compare tops and heights of tiles in each row.

## Pitfalls hit while building (don't repeat)

- Hats drawn over faces: offset headwear above the eyes and check close up.
- Draw order: the floor covered the low table until it was moved after the floor in the SVG.
- Shadows behind paper must sit inside the clip and be dark enough to read.
- Tiny, pale particles on a same-coloured surface vanish: make bursts larger, outlined, and launch them clear of the source.
- A white flash washes out a white bolt: tint the flash (light blue).
- Mirrored groups: rotation keyframes still work in local space, which conveniently mirrors arm motion.
- Things placed in the centre are hidden by the panels; check at 1440 wide before calling the scene done.
- Large corner ornaments can touch the palette row; add top padding to the grid for that theme.
- Sharing review: published files must be HTML, JS, CSS, PNG, JPEG, GIF or WebP only. No SVG files, fonts or JSON in the artifact; load fonts from Google Fonts and libraries from jsDelivr/cdnjs.

## The Haunted example

`references/haunted-example/` holds the complete working theme to copy patterns from:
- `bg-haunted.js`: the scene (helpers for curtains, cobwebs, candles, bats; the timed lightning; the eyes).
- `haunted.css`: scene animations (`.hm-*`), the gilt frame, portrait-oval tiles, plaques, the ectoplasm bar, ghost slots.
- `haunted-corner.svg.html`: the skull-cartouche corner symbol and its gradient.
- `haunted-app-snippets.js`: the theme definition, fonts, four palettes, and the hit-point and decoration hooks.
