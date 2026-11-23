# Research: better art, and a more delightful interface (2026-11-23)

Two questions from the owner: how to make the art (theme backdrops, figures, tokens) better, and how to make the apps
feel more alive and pleasant to use. Each tool is checked against the apps' rules: one HTML file each, works offline,
no frameworks or npm packages in the apps, and the accessibility and phone rules. Licences come from the projects' own
pages where the search reached them; where not, that is said. Nothing here has been installed or built yet.

## Part 1: the art

### Where the art stands
The Theme Demo paints everything in code (p5.js, p5.brush, the huashu brush library), then glazes the result with
Python. That keeps everything free and licence-clean, and the owner likes the best of it (Haunted Manor). The limits:
figures and faces are hard to draw convincingly in code, and each scene takes a lot of hand-tuning.

### 1. An image-generation key: the biggest single jump (needs an account)
Painting a scene from a written brief, with a style reference, gives far richer backdrops, figures, portraits and
token art than code can. Current options and per-image prices (aggregator figures, mid-2026; check the official pages):
- **Google Gemini image ("Nano Banana 2")**: about $0.07 per 1K image, half that in batch. Takes up to 14 reference
  images, which is what keeps one theme's pictures in one style.
- **FLUX Kontext (Black Forest Labs)**: about $0.04 per image, including edits guided by a reference image.
- **OpenAI GPT Image**: priced by tokens; a few cents per image.
Many ready-made Claude skills wrap these (search "nano-banana" / "image-gen" on skills.sh); read one before
installing. With a key, a whole theme set (scene, panel textures, 20 token portraits) costs a few dollars.
Each provider's terms decide commercial use: read them before shipping pictures in a public app.
The Theme Demo session once tried an image key that turned out to be for another service.

### 2. Free public-domain art: real paintings and engravings, no key
- **The Met Open Access**: about 492,000 images of public-domain works under CC0, with a JSON API.
- **Smithsonian Open Access** and **Art Institute of Chicago**: also CC0 collections with APIs (not checked here).
- **Old Book Illustrations, Artvee, Standard Ebooks**: 19th-century engravings and book art (Gustave Doré, Walter
  Crane). Doré died in 1883, so his work is safe everywhere; Rackham (d. 1939) and Dulac (d. 1953) are still under
  copyright in some countries, so check each before use.
Use: real castle interiors, forests and night skies as backdrops, glazed and colour-graded into each theme, and
engraved figures as silhouettes (the Theme Demo already traced Rackham's this way).

### 3. Make code painting look painted: filters
- **Kuwahara filter** (anisotropic): the standard "oil paint" or "gouache" shader. It turns any picture, a photo,
  a public-domain painting or a code-drawn scene, into brushwork. Open-source WebGL versions exist; Acerola's original
  is MIT. It runs once, offline in the art pipeline, so the apps stay small. Strong pairing with option 2.
- **Rough.js** (MIT, under 9 KB): hand-drawn, sketchy lines for maps, frames and diagrams.
- **inkbrush** (npm): ink-brush strokes as SVG paths, for calligraphic borders.
- **InkField**: an ink-bleed and dry-brush demo worth studying for technique.

### Skills
- Already here: codex-theme-builder, huashu-art-motion, algorithmic-art, canvas-design.
- Style-reference skills exist on community registries (painterly, dark fantasy and so on). They are only prompt
  text; they add little without an image model.

## Part 2: the interface

### Principles that hold up
- "Juice" (Petri Purho): small inputs should give generous, satisfying feedback, but only as feedback, never
  decoration.
- Feedback timing: 150 to 300 ms; it must never block the next input.
- Restraint: the sources agree that too much juice distracts.
- For a table app, the screen should support the physical game, not replace it. That points to big, glanceable
  status and to celebrating real dice rolls (an "I rolled a 17" button), not only digital ones.

### Tools
1. **Native browser features: free, no library, fits every app rule.** Scroll-driven animations (now in all three
   engines), view transitions (smooth morphs between states, such as a card opening into its detail), anchor
   positioning (tooltips and menus that stay attached) and popovers. These give the biggest gain for the least
   weight; check caniuse before use.
2. **3D dice: Fantastic Dice (`@3d-dice/dice-box`).** Physics dice that tumble and land on the result (BabylonJS and
   Ammo, about 400 KB). The best upgrade for the dice tray. Its licence still needs checking, and its size goes
   against the single-file rule, so it would load only on the hosted build.
3. **Haptics: `web-haptics` (zero dependencies).** A buzz on Android for a hit, a crit or a death save. iPhone
   support came from a checkbox trick that Apple reportedly closed in iOS 26.5, so treat it as Android-first.
4. **GSAP (now free, including SplitText and MorphSVG, since 2025).** Timeline animation for big moments
   (natural 20, level up, combat start). Its licence forbids "competitive" visual animation builders, which doesn't
   affect these apps. It is a library, so only for rare showpiece moments.
5. **Rive (MIT runtime; the editor's free tier adds a splash screen) or Lottie (MIT player, lighter).** Animated,
   state-driven illustrations: a breathing campfire, a chest that opens. Rive's runtime is about 1 MB, so it would be
   for the hosted build only.

### Skills worth installing (read each SKILL.md first)
- **game-feel** (gamedev-skills/awesome-gamedev-agent-skills, Apache-2.0): screen shake, hit-stop, squash and
  stretch, and how to keep juice short. From the same source as procedural-gen.
- **interaction-polish** (flagrare/agent-skills): UI feel, after Emil Kowalski and Josh Comeau ("this feels stiff").
- **interaction-design** (wshobson/agents): microinteractions, transitions and reduced-motion handling.
- Already here and overlapping: emil-design-eng, animate, choreograph, gestures, mobile-native, impeccable.

## Recommendation
1. Install the three skills above. They are text only and free.
2. Art without a key: public-domain paintings and engravings, run through a Kuwahara filter, in place of some of the
   code-painted scenes. A big step up, with no cost or licence risk (Doré-era works).
3. Art with a key (owner's choice): Gemini image or FLUX Kontext for portraits, tokens and backdrops. A few dollars
   per theme.
4. Interface: native view transitions and scroll animations first; 3D dice and haptics for the hosted build.

## Sources
- Generative art and SVG skills: https://skills.sh/omer-metin/skills-for-antigravity/generative-art, https://www.skillsdirectory.com/skills/mostafa-drz-svg-art, https://www.thepromptindex.com/skill-database.php?tag=fantasy-art
- Painting libraries: https://ileivoivm.github.io/inkField/tech/en/index.html, https://www.npmjs.com/package/inkbrush, https://research.adobe.com/publication/a-procedural-watercolor-engine
- Kuwahara: https://blog.maximeheckel.com/posts/on-crafting-painterly-shaders, https://sveltethemes.dev/badbadbadbadbad/shader-playground, https://tympanus.net/codrops/2026/04/24/susurrus-crafting-a-cozy-watercolor-world-with-three-js-and-shaders/, https://remotebranch.eu/ChaoticByte/Fragmented/raw/tag/v10.2/shaderlib/kuwahara.gdshaderinc
- Rough.js: https://roughjs.com/
- Public domain: https://www.metmuseum.org/en/hubs/open-access, https://www.openculture.com/2020/02/old-book-illustrations-download.html, https://standardebooks.org/artworks/gustave-dore/fairy-land
- Image models: https://invideo.io/blog/ai-image-model-pricing/, https://awesomeagents.ai/pricing/image-generation-pricing/, https://skills.sh/connorads/dotfiles/nano-banana
- Juice and microinteractions: https://andrewdkennedy1.github.io/2026/01/29/the-architecture-of-delight.html, https://uxplanet.org/best-practices-for-microinteractions-9456211aeed0, https://www.joshwcomeau.com/email/009
- Table apps: https://foundryvtt.com/packages/pp-dice, https://metafilter.com/204093/Physical-Dice-vs-Digital-Dice
- Dice: https://github.com/3d-dice/dice-box, https://fantasticdice.games/
- Rive and Lottie: https://rive.app/blog/rive-as-a-lottie-alternative, https://ics.media/en/entry/241206/
- GSAP: https://webflow.com/blog/gsap-becomes-free, https://gsap.com/community/standard-license/
- Haptics: https://www.npmjs.com/package/ios-haptics, https://www.mintlify.com/lochie/web-haptics
- Browser features: https://web.dev/blog/web-platform-10-2026, https://webkit.org/?p=17818
- Skills: https://skills.sh/gamedev-skills/awesome-gamedev-agent-skills/game-feel, https://skillsmp.com/creators/flagrare/agent-skills/plugins-flagrare-skills-interaction-polish, https://skills.sh/wshobson/agents/interaction-design
