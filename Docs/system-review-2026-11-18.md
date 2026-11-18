# System review (2026-11-18)

Every system of the DM Codex, the Character Codex and the Codex Manager, after the review plan, the battle plan and the
owner's requests of 2026-11-18 were finished. Checked by running both full test suites (DM 61 + 71, sheet 43, all
passing), Impeccable's rendered scan, contrast and size sweeps on dark and parchment themes, load and tab-switch timing,
and reading the code of the parts changed today.

## Where things stand

| System | State | Evidence |
|---|---|---|
| Accessibility (both) | Every field named; 4.5:1 text on dark **and** Sunlit Parchment; nothing under 11 px; 24 px hit areas; keyboard tab bar; reduced motion keeps changes | DM `test68`, sheet `tests/a11y.js` |
| Impeccable scan | Sheet 41 → 15 findings (desktop), 23 → 4 (phone); DM 99 → ~10 after the Bestiary detail fix; no small-control or low-contrast findings left | `.impeccable/audit/`, `review-and-plan-2026-11.md` |
| Themes | Text tints worked out per theme; parchment works; "Match my device" | `shared/theme/tints.js` |
| Battle map | Layers, fog, lighting (soft edges, magical darkness), compact tracker, row ↔ token | `test63`, `test67`, `test71` |
| Combat | Dex tie-break, legendary actions and resistance, HP feedback, death saves, concentration, timed effects | `test20`, `test71` |
| First open | Experience chooser (Basic / Ambience / Full) | `test70` |
| Audio | Mixer, iOS volume, rain, Kenku FM (relay limited to the DM Codex's places) | `test65`, `test66`, `kenku_relay` |
| Local server | Open endpoints now answer only the DM Codex's own places (fixed today) | `kenku_relay`, `table_link` |
| Speed | Loads 0.2–0.7 s; DM tab switch 40–130 ms; **sheet tab switch 170–250 ms** | measured at 1400 and 390 px |
| Saved data | DM sample 67 KB, sheet 8 KB (localStorage ~5 MB; big map pictures are the risk, already handled) | measured |

## Fixed during the review
- Local server: any website the owner visited could drive Kenku FM and post fake turn notices; now refused.
- The accessibility test misread blended backgrounds (`color(srgb …)`) and so missed faded text; fixed, which found
  and fixed the sheet's faded source tags (4.24:1) and the theme's pale gold on parchment.
- The light theme was mostly unreadable (415 / 667 failing spots): fixed with shared tints and tokens.

## Further improvements, in order of value

1. **One command to copy the shared scripts** (high value, small). `shared/a11y`, `shared/motion`, `shared/theme` are
   copied into both apps by hand today, so they can drift. A `tools/build_shared.py --apply`, like `build_rulebook.py`,
   with `SHARED_*_START/END` markers in the sheet and the DM `51/52/54` files, would make one source.
2. **Faster sheet tab switches** (high, medium). 170–250 ms per tab; the DM Codex manages 40–130 ms. Profile
   `renderInventory`, `renderCharacter`, `renderSpells`, `renderSpellbook` (cache the spell list HTML, render rows
   in idle time, as `stalePanels` already does for hidden tabs).
3. **Live two-way table link** (highest at the table, larger). Today only "Your turn" goes DM → sheets. Players' HP,
   conditions and initiative rolls could reach the DM through the same store (`dndcc_party_<code>_<id>`; fields in
   `shared/schema`), and the DM's damage / conditions could reach sheets as offers the player accepts (Manual play).
4. **Cloudflare functions** get the same origin check as `server.py` for the turn keys (code in the sheet repo; the
   owner deploys).
5. **Ask Claude reach for today's features**: actions for the experience chooser, legendary resistance and the theme
   (they work through the screen layer now; direct actions are faster and safer).
6. **Feature gaps** from `feature-checklist-2026-11.md`: random names / taverns / custom roll tables / hoards by CR;
   clues, faction reputation, `[[Name]]` wiki links; 4d6 method, multiclass prerequisites, containers, coin
   conversion, spell points, source-book filter; flanking and gritty / epic rest switches.
7. **Test suite speed**: the DM run takes ~45 minutes for both builds; run tests in parallel (2–3 at a time, as the
   sheet does) and replace count-based checks (action, tab and tool totals) with checks for named items.
8. **Small polish**: toasts on phones sit over the bottom rows (move above them or shrink); the last "card inside a
   card" spots (Bestiary filter bar, sheet HP and initiative boxes); the sheet's `CLAUDE.md` "Last full QA" date
   (2026-11-01) should be refreshed after the next click-through.
9. **Owner decisions**: per-map grid scale and hex grids; whether the experience chooser should also offer the view
   level (Ultra … All the fixings); publishing (DM v48, sheet v36) and the Cloudflare deploy.
