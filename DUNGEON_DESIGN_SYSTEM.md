# parsnipcrawl.dev — Design System

> A reference for Claude Code. Everything needed to build the blog + dungeon game consistently.

---

## 1. Concept & Architecture

**parsnipcrawl.dev** is a software engineering blog that doubles as a 2D pixel dungeon RPG. The same content powers both views — the user can toggle between them at any time via the top bar.

### The core mapping

| Blog concept              | Dungeon concept   |
| ------------------------- | ----------------- |
| Article / post            | Room              |
| Series                    | Floor / zone      |
| Tag (`#rust`, `#systems`) | Room type / biome |
| About page                | Character sheet   |
| Reading an article        | Exploring a room  |
| Quiz / code challenge     | Combat encounter  |
| Newsletter subscribe      | Save point        |
| Series capstone post      | Boss room         |

### Views

- **Blog view** — standard reading experience, styled with retro pixel aesthetics
- **Dungeon view** — top-down 2D tile-based game; walk between rooms, press `E` to enter (read) them
- **Article view** — the reading experience inside a room; combat triggers on scroll milestones
- **Room clear screen** — cinematic transition after finishing an article (flash → loot → next room)

---

## 2. Colour Palette

All custom properties. Define these on `:root`.

```css
:root {
  /* Backgrounds */
  --bg: #0a0008; /* page / void */
  --bg2: #110012; /* card surfaces */
  --bg3: #1a001c; /* elevated surfaces */

  /* Borders */
  --border: #4a1060; /* default border */
  --border-b: #8a20b0; /* bright / hover border */

  /* Brand */
  --pink: #ff3a7a; /* primary accent — titles, CTA hover, current room */
  --pink2: #ff6aa0; /* lighter pink — hover states */
  --purple: #c040ff; /* secondary accent — tags, XP, magic */
  --purple2: #8020cc; /* mid purple — bars, borders */
  --purple3: #4a0080; /* dark purple — button backgrounds */

  /* Gold — boss rooms, loot, XP rewards */
  --gold: #d4a030;
  --gold2: #ffcc60;

  /* Text */
  --text: #e8c8f0; /* primary body text */
  --text2: #a070c0; /* secondary / muted */
  --text3: #6a3a8a; /* tertiary / labels / hints */

  /* Semantic */
  --blood: #8a0020; /* HP, danger, enemies, death */
  --green: #2ad880; /* success, correct answers, lore drops */
  --fire: #ff6020; /* torch flames */
}
```

### Usage rules

- `--pink` — current room indicator, hover titles, CTA primary
- `--purple` / `--purple2` — XP bars, tags, magic items, dungeon UI chrome
- `--gold` / `--gold2` — boss rooms only, loot, rare items, XP rewards
- `--blood` — HP bar, enemy difficulty, wrong answers, death states
- `--green` — correct answers, lore drops, health potions, success states
- Never use pure `#000000` black — use `--bg` (`#0a0008`) instead

---

## 3. Typography

```css
/* Import in <head> or @import in CSS */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Share+Tech+Mono&display=swap');
```

| Role           | Font                 | Size    | Weight | Usage                                              |
| -------------- | -------------------- | ------- | ------ | -------------------------------------------------- |
| Display / hero | `Cinzel`             | 28–38px | 700    | Site name, article titles, room names, loot screen |
| Heading 2      | `Cinzel`             | 20–24px | 700    | Section headers inside articles                    |
| Heading 3      | `Share Tech Mono`    | 12px    | 400    | Sub-sections; prefix with `> ` in CSS `::before`   |
| Body           | `Share Tech Mono`    | 12px    | 400    | Article prose, line-height 1.85–1.9                |
| UI / chrome    | `Share Tech Mono`    | 9–11px  | 400    | Tags, metadata, breadcrumbs, HUD, controls         |
| Pixel / game   | `monospace` (system) | varies  | 400    | In-canvas SVG labels only                          |

### Heading conventions

```css
/* h2 in article prose */
.prose h2::before {
  content: '// ';
  color: var(--text3);
  font-size: 14px;
}

/* h3 in article prose */
.prose h3::before {
  content: '> ';
  color: var(--text3);
}

/* Cinzel titles get a shadow */
.site-name {
  text-shadow: 2px 2px 0 var(--purple3);
}
```

---

## 4. Pixel Art System

All pixel art is **pure SVG / CSS** — no image files. Rule: `image-rendering: pixelated` on every SVG.

### Canonical sprite sizes

| Sprite                | ViewBox      | Render size  | Notes                 |
| --------------------- | ------------ | ------------ | --------------------- |
| Favicon / logo icon   | `0 0 8 8`    | 14–16px      | Crown + skull hybrid  |
| Player character      | `0 0 10 12`  | 40×48px      | Sword on right side   |
| Imp enemy             | `0 0 12 10`  | 48×40px      | Pink glowing eyes     |
| Skeleton enemy        | `0 0 12 16`  | 48×64px      | Bone white            |
| Skull (boss)          | `0 0 18 18`  | 36×36px      | Blood red, pink eyes  |
| Tome (article icon)   | `0 0 16 16`  | 32×32px      | Purple spellbook      |
| Scroll (article icon) | `0 0 14 16`  | 28×32px      | Brown parchment       |
| Crown (header)        | `0 0 16 10`  | 64×40px      | Gold with gem accents |
| Sword divider         | `0 0 30 5`   | 60×10px      | Purple, pink guard    |
| Health potion         | `0 0 7 9`    | 14×18px      | Green liquid          |
| Relic / seal          | `0 0 7 7`    | 14×14px      | Gold cross            |
| Chest                 | drawn inline | 16×16px tile | Brown + gold latch    |
| Torch                 | drawn inline | 16×16px tile | Animated flame        |
| Pillar                | drawn inline | 16×16px tile | Purple stone          |

### Dungeon tile system

Tile size: **16×16px** on a `MAP_W × MAP_H` grid (default 25×22).

```js
const T = {
  VOID: 0, // black, impassable
  FLOOR: 1, // #140020 — standard walkable
  WALL: 2, // #1e0030 side / #3a0060 top face
  TORCH: 6, // floor tile + animated flame drawn on top
  PILLAR: 7, // #2a0045 — impassable decoration
  CHEST: 5, // floor tile + chest sprite
  BOSS_FLOOR: 8, // #160a00 — warmer dark floor for boss rooms
};
```

### Tile colours

```js
FLOOR: '#140020';
BOSS_FLOOR: '#160a00';
WALL_SIDE: '#2a0048';
WALL_TOP: '#3a0060'; // top face of wall — brighter
FLOOR_GRID: '#1c0028'; // subtle 1px grid lines
```

### Torch animation (canvas)

```js
// In game loop, increment torchAnim each frame
torchAnim += 0.04 * dt;

// Per torch tile:
const flicker = Math.sin(torchAnim * 3 + (tx + ty)) * 0.5 + 0.5;
// flame colours cycle between #d4a030 → #ff6020 → rgba(255,200,50)
// radial glow: rgba(212,160,48, 0.15 + flicker*0.1), radius 12px
```

### Vignette / darkness overlay

```js
// Applied every frame over the canvas
const vig = ctx.createRadialGradient(cx, cy, vigR * 0.3, cx, cy, vigR);
vig.addColorStop(0, 'transparent');
vig.addColorStop(1, 'rgba(0,0,0,0.75)');
```

---

## 5. Component Library

### 5.1 Top Bar

Sticky, `z-index: 50`. Present in all views.

```html
<div class="topbar">
  <!-- pixel logo icon (8×8 SVG) -->
  <!-- .logo-text: Cinzel 13px var(--pink) -->
  <!-- .tb-url: monospace URL display -->
  <!-- HP / XP / LVL stats -->
  <!-- .tb-mode: mode toggle button -->
</div>
```

```css
.topbar {
  background: #05000a;
  border-bottom: 2px solid var(--border);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-text {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--pink);
  letter-spacing: 1px;
}
.tb-url {
  flex: 1;
  background: #0a000f;
  border: 1px solid var(--border);
  color: var(--text2);
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 2px;
}
.tb-mode {
  background: var(--purple3);
  border: 1px solid var(--purple);
  color: var(--purple2);
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  padding: 3px 10px;
  cursor: pointer;
  border-radius: 2px;
  letter-spacing: 1px;
}
.tb-mode:hover {
  background: var(--purple2);
  color: #fff;
  border-color: var(--pink);
}
```

### 5.2 HUD Bar (dungeon view)

```css
.hud {
  background: #08000f;
  border-bottom: 1px solid var(--border);
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.hud-bar {
  width: 80px;
  height: 6px;
  background: #1a0018;
  border: 1px solid #2a0028;
}
.hud-fill.hp {
  background: var(--blood);
}
.hud-fill.xp {
  background: var(--purple2);
}
```

### 5.3 Post Card (blog feed)

Three variants: **normal**, **boss**, **new**.

```css
.post-card {
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 16px;
  background: var(--bg2);
  display: flex;
  gap: 14px;
  cursor: pointer;
}
.post-card:hover {
  border-color: var(--pink);
  background: #160018;
}
.post-card.boss {
  border-color: var(--gold);
  background: #130a00;
}
.post-card.boss:hover {
  border-color: var(--gold2);
}
/* Left column: 48px wide, holds pixel sprite + label */
/* Right column: flex:1, holds meta + title + excerpt + footer */
```

Card footer layout: `read-time | XP bar (44×3px) | room location (margin-left: auto)`

XP bar colours:

- Normal post: `var(--purple2)`
- Boss post: `var(--gold)`

### 5.4 Tags / Pills

```css
.tag {
  font-size: 9px;
  padding: 2px 6px;
  letter-spacing: 1px;
  border-radius: 1px;
  border: 1px solid;
}
.tag.purple {
  border-color: var(--purple2);
  color: var(--purple);
  background: #1a003a;
}
.tag.pink {
  border-color: var(--blood);
  color: var(--pink);
  background: #1a000a;
}
.tag.gold {
  border-color: var(--gold);
  color: var(--gold2);
  background: #130800;
}
.tag.new {
  border-color: #0a5a3a;
  color: var(--green);
  background: #001a0a;
}
```

### 5.5 Article Prose Styles

```css
.prose {
  font-size: 12px;
  line-height: 1.9;
  color: #b090c8;
}
.prose p {
  margin: 0 0 16px;
}
.prose h2 {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  color: var(--text);
  margin: 28px 0 10px;
}
.prose h2::before {
  content: '// ';
  color: var(--text3);
  font-family: 'Share Tech Mono', monospace;
}
.prose h3 {
  font-size: 12px;
  color: #6acc6a;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 20px 0 8px;
}
.prose h3::before {
  content: '> ';
  color: var(--text3);
}
.prose strong {
  color: var(--text);
}
.inline-code {
  background: #0a000f;
  border: 1px solid #2a0040;
  color: #8aff8a;
  padding: 1px 5px;
  font-size: 11px;
  border-radius: 1px;
  font-family: 'Share Tech Mono', monospace;
}
```

### 5.6 Code Block

```css
.code-block {
  background: #060006;
  border: 1px solid var(--border);
  border-radius: 2px;
  margin: 16px 0;
}
.code-hdr {
  background: #0e0012;
  border-bottom: 1px solid #2a0040;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
}
.code-lang {
  color: var(--purple);
  letter-spacing: 1px;
}
.code-body {
  padding: 14px 16px;
}
.code-body pre {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  line-height: 1.7;
}
```

Syntax token colours:

```css
.tok-kw {
  color: #4aff4a;
} /* keywords */
.tok-fn {
  color: #7accff;
} /* functions */
.tok-str {
  color: #ffca7a;
} /* strings */
.tok-cmt {
  color: #3a6a3a;
  font-style: italic;
} /* comments */
.tok-ty {
  color: #ca7aff;
} /* types */
.tok-num {
  color: #ff7a7a;
} /* numbers */
.tok-mac {
  color: #ffaa4a;
} /* macros */
```

### 5.7 Callout Boxes

Two flavours:

```css
.callout {
  border: 1px solid #1a4a1a;
  background: #04080a;
  padding: 12px 16px;
  margin: 16px 0;
  font-size: 11px;
  line-height: 1.7;
  color: var(--text2);
}
.callout-hd {
  color: var(--green);
  font-size: 9px;
  letter-spacing: 2px;
  margin-bottom: 6px;
}
.callout.warn {
  border-color: #5a3a0a;
  background: #0c0800;
}
.callout.warn .callout-hd {
  color: var(--gold);
}
```

- `[ LORE DROP ]` — green, for interesting asides
- `[ TRAP AHEAD ]` — amber, for warnings

### 5.8 Room Overlay (article enter)

Full-screen overlay triggered by `E` in dungeon mode or "Collect Loot" button.

```css
.room-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 0, 8, 0.92);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ro-title {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  color: var(--pink);
  letter-spacing: 2px;
}
.ro-title.boss {
  color: var(--gold2);
}
.ro-btn {
  background: var(--purple3);
  border: 2px solid var(--purple);
  color: var(--purple2);
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  padding: 10px 24px;
  cursor: pointer;
  border-radius: 2px;
}
.ro-btn.boss {
  background: #1a0800;
  border-color: var(--gold);
  color: var(--gold);
}
```

### 5.9 Combat Overlay

Full-screen, `z-index: 200`. Three-column grid: player sprite | question area | enemy sprite.

```css
.combat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 0, 8, 0.92);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}
.combat-box {
  background: var(--bg2);
  border: 2px solid var(--pink);
  border-radius: 4px;
  max-width: 520px;
  width: 100%;
}
.combat-arena {
  display: grid;
  grid-template-columns: 80px 1fr 80px;
  gap: 16px;
  padding: 18px;
  align-items: start;
}
.answer-btn {
  width: 100%;
  text-align: left;
  background: #0a000f;
  border: 1px solid var(--border);
  color: var(--text2);
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  padding: 8px 12px;
  cursor: pointer;
  margin-bottom: 6px;
}
.answer-btn.correct {
  border-color: var(--green);
  background: #001a08;
  color: var(--green);
}
.answer-btn.wrong {
  border-color: var(--blood);
  background: #1a0008;
  color: #ff6060;
}
```

### 5.10 Encounter Flash (corner notification)

```css
.encounter-flash {
  position: fixed;
  top: 56px;
  right: 16px;
  z-index: 150;
  background: var(--bg2);
  border: 2px solid var(--pink);
  border-radius: 4px;
  padding: 12px 16px;
  max-width: 220px;
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from {
    transform: translateX(40px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### 5.11 Loot Screen

Post-article. Two-column layout: XP breakdown + loot drops (left) | next room preview + inventory (right).

Key elements:

- XP breakdown table with `total` row in Cinzel gold
- Loot items: `48px` icon + name + type descriptor
- Rare items: `border-color: #4a3a00`, name in `var(--gold2)`
- Inventory: `28×28px` slots, `background: #0a000f`, `border: 1px solid var(--border)`
- Next room preview card with inline pixel scene SVG

### 5.12 Minimap

```css
/* 6px per map tile, rendered to a canvas or CSS grid */
/* Room colours */
cleared: '#6020a0'   border: '#8020cc'
current: '#ff3a7a'   border: '#ff6aa0'
unread:  '#2a0040'   border: '#3a0060'
boss:    '#d4a030'   border: '#ffcc60'
/* Player dot: 5×5px hot pink, pulsing 9×9px ring */
```

### 5.13 Sword Divider

```html
<div class="divider">
  <div class="divider-line"></div>
  <!-- 60×10px SVG sword glyph, purple/pink -->
  <div class="divider-line"></div>
</div>
```

```css
.divider {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 24px;
  background: #08000e;
  border-bottom: 1px solid var(--border);
}
.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}
```

### 5.14 Scanline Overlay

Applied as a `position: absolute` layer over every major container. `z-index` must be the highest non-interactive layer.

```css
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.07) 3px,
    rgba(0, 0, 0, 0.07) 4px
  );
  pointer-events: none;
  z-index: 200;
  border-radius: inherit;
}
```

### 5.15 Section Label

```css
.section-label {
  font-size: 10px;
  color: var(--text3);
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-label::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  background: var(--purple2);
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
```

---

## 6. Game Engine (dungeon view)

### Map structure

```js
const TILE = 16;         // px per tile in world space
const MAP_W = 25;        // tiles wide
const MAP_H = 22;        // tiles tall

// Room definition
{
  id:    number,
  x:     number,         // tile col
  y:     number,         // tile row
  w:     number,         // width in tiles
  h:     number,         // height in tiles
  type:  'cleared' | 'current' | 'unread' | 'boss',
  name:  string,
  diff:  'Easy' | 'Medium' | 'Hard' | 'BOSS',
  xp:    number,
  time:  string,
  floor: string,
  desc:  string,
}
```

### Camera

```js
// Smooth follow — runs every frame
camX += (targetCamX - camX) * 0.12 * dt;
camY += (targetCamY - camY) * 0.12 * dt;

// Target centres player
targetCamX = player.x - canvas.width / (2 * TILE);
targetCamY = player.y - canvas.height / (2 * TILE);
```

### Collision

```js
const MARGIN = 0.35; // player hitbox margin in tile units
function canMoveTo(nx, ny) {
  const corners = [
    [nx - MARGIN, ny - MARGIN],
    [nx + MARGIN, ny - MARGIN],
    [nx - MARGIN, ny + MARGIN],
    [nx + MARGIN, ny + MARGIN],
  ];
  return corners.every(([cx, cy]) => {
    const t = map[Math.floor(cy)]?.[Math.floor(cx)];
    return t !== T.VOID && t !== T.WALL && t !== T.PILLAR;
  });
}
```

### Movement speed

```js
const SPEED = 0.06; // tiles per frame at 60fps
// Diagonal normalisation
if (dx !== 0 && dy !== 0) {
  dx *= 0.707;
  dy *= 0.707;
}
```

### Controls

| Key             | Action                       |
| --------------- | ---------------------------- |
| `WASD` / `↑↓←→` | Move                         |
| `E`             | Enter / inspect current room |
| `Escape`        | Close overlay                |
| `M`             | Toggle minimap (optional)    |

### Combat encounter triggers

- **Scroll depth** — fire at 20%, 55%, 85% through the article
- **Time on page** — fire after 40s if no encounter triggered yet
- **Passive XP** — +5 XP every 20 seconds of reading
- **Scroll milestone XP** — +25 XP at 25%, 50%, 75%, 100%

```js
const TRIGGER_POINTS = [0.2, 0.55, 0.85];
```

---

## 7. Content Schema

Each blog post/article maps to a dungeon room. Recommended frontmatter:

```yaml
---
title: 'Why I rewrote my parser in Rust and regretted nothing'
slug: parser-in-rust
series: systems-programming
floor: 3
room: 7
roomName: 'The Parser Pit'
difficulty: Hard # Easy | Medium | Hard | BOSS
xp: 850
sprite: tome # tome | scroll | skull | sword | gem
tags: [rust, systems, compilers, perf]
readingTime: 12
isBoss: false
enemies:
  - name: 'Syntax Wraith'
    hp: 60
    xpReward: 120
    question: 'In Rust, what does the borrow checker primarily enforce?'
    answers:
      - 'Memory safety without a GC' # correct
      - 'Faster compile times'
      - 'Automatic garbage collection'
      - 'Thread priority scheduling'
    correctIndex: 0
---
```

---

## 8. Layout Structure

```
┌─────────────────────────────────────────────┐
│  TOPBAR (sticky, z:50)                      │
│  logo · url · HP · XP · LVL · mode-toggle  │
├─────────────────────────────────────────────┤
│  [dungeon only] HUD                         │
│  HP bar · XP bar · rooms · slain · floor    │
├──────────────────────────────┬──────────────┤
│                              │  SIDEBAR     │
│  MAIN CONTENT AREA           │  190px       │
│                              │              │
│  blog:   feed of post cards  │  minimap     │
│  dungeon: canvas game view   │  char card   │
│  article: prose + code       │  room info   │
│                              │  TOC / nav   │
│                              │              │
├──────────────────────────────┴──────────────┤
│  FOOTER                                     │
│  // tagline ·  _ (blinking cursor)          │
└─────────────────────────────────────────────┘
```

---

## 9. Animation & Motion

| Element                | Animation                                      | Timing                     |
| ---------------------- | ---------------------------------------------- | -------------------------- |
| Torch flame            | `Math.sin(torchAnim * 3 + (tx+ty))`            | 60fps canvas               |
| Enemy bob              | `Math.sin(anim * 4) * 0.8`                     | 60fps canvas               |
| Player walk bob        | `Math.sin(playerAnim * 8) * 0.6`               | 60fps canvas               |
| Minimap player ring    | `Math.sin(torchAnim * 4)` opacity pulse        | 60fps canvas               |
| XP orbs fly to player  | Ease-in-out over 1200ms on room clear          | JS `requestAnimationFrame` |
| Encounter flash        | `slideIn` 0.3s ease (translateX 40px → 0)      | CSS keyframe               |
| XP popup               | `popUp` 0.4s ease (scale 0.8 → 1), show 1800ms | CSS keyframe               |
| Room clear flash       | White overlay 0.08s in / 0.4s out              | CSS transition             |
| Cinematic progress bar | Width 0→100% over 1.2s ease                    | CSS transition             |
| Camera follow          | Lerp: `camX += (target - camX) * 0.12 * dt`    | 60fps                      |
| Cursor blink           | `blink` 1s step-end infinite                   | CSS keyframe               |
| Combat HP bars         | `width` transition 0.5s                        | CSS transition             |

---

## 10. Z-Index Stack

```
200  scanlines overlay (pointer-events: none)
200  combat overlay (fixed, pointer-events: all)
150  encounter flash (fixed)
100  room enter overlay (absolute within canvas-area)
 50  topbar (sticky)
 50  HUD bar (sticky/relative)
  2  topo background SVG / background layers
  1  all other content
```

---

## 11. Tech Stack Recommendations

| Concern             | Recommendation                          | Notes                                                             |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| Framework           | **Next.js 14** (App Router)             | Static export for blog, easy routing                              |
| Styling             | **CSS custom properties** (no Tailwind) | The design system is bespoke enough that utility classes fight it |
| Content             | **MDX** + frontmatter YAML              | Lets you embed callout/combat components in posts                 |
| Game canvas         | Vanilla `Canvas2D`                      | No game engine needed — the renderer is ~200 lines                |
| Pixel fonts         | Google Fonts (Cinzel + Share Tech Mono) | Self-host in prod for performance                                 |
| State               | `localStorage`                          | Track explored rooms, XP, HP, inventory — no login needed         |
| Sprites             | Inline SVG + CSS                        | No image files; everything scales crisp                           |
| Animation           | CSS keyframes + `requestAnimationFrame` | No animation library needed                                       |
| Syntax highlighting | **Shiki** with a custom theme           | Define token colours from §5.6 above                              |
| Deployment          | Vercel                                  | Next.js native                                                    |

### Shiki custom theme (token mappings)

```json
{
  "keyword": "#4aff4a",
  "function": "#7accff",
  "string": "#ffca7a",
  "comment": "#3a6a3a",
  "type": "#ca7aff",
  "number": "#ff7a7a",
  "macro": "#ffaa4a",
  "variable": "#e8c8f0",
  "parameter": "#b090c8"
}
```

---

## 12. File Structure (suggested)

```
dungeon-dev/
├── app/
│   ├── layout.tsx           # topbar, mode toggle, global state
│   ├── page.tsx             # blog feed (default view)
│   ├── dungeon/
│   │   └── page.tsx         # game canvas view
│   └── blog/
│       └── [slug]/
│           └── page.tsx     # article reading view
├── components/
│   ├── TopBar.tsx
│   ├── PostCard.tsx
│   ├── ArticleProse.tsx
│   ├── CodeBlock.tsx        # wraps Shiki
│   ├── Callout.tsx
│   ├── CombatOverlay.tsx
│   ├── EncounterFlash.tsx
│   ├── RoomClearScreen.tsx
│   ├── DungeonCanvas.tsx    # main game renderer
│   ├── Minimap.tsx
│   └── sprites/
│       ├── PlayerSprite.tsx
│       ├── ImpSprite.tsx
│       ├── SkeletonSprite.tsx
│       └── ItemSprite.tsx   # tome, scroll, potion, relic
├── lib/
│   ├── dungeonMap.ts        # tile map builder
│   ├── gameLoop.ts          # requestAnimationFrame loop
│   ├── collision.ts         # canMoveTo()
│   ├── playerState.ts       # HP, XP, inventory (localStorage)
│   └── contentToRoom.ts     # maps MDX frontmatter → room config
├── content/
│   └── posts/
│       └── parser-in-rust.mdx
├── styles/
│   └── globals.css          # :root vars + base resets
└── public/
    └── fonts/               # self-hosted Cinzel + Share Tech Mono
```

---

## 13. Prompt for Claude Code

Use this as your opener when starting the build:

```
Build parsnipcrawl.dev — a software engineering blog that is also a 2D pixel dungeon RPG.
Use the attached design system document as the single source of truth for all colours,
typography, components, sprites, game logic, and file structure.

Key constraints:
- Next.js 14 App Router, MDX for content, vanilla Canvas2D for the game
- No Tailwind — use CSS custom properties as defined in the design system
- All pixel art is inline SVG or canvas-drawn — no image files
- Player state (HP, XP, explored rooms, inventory) persists in localStorage
- The mode toggle in the top bar switches between blog view and dungeon view
  without a page reload — both are routes but share a layout

Start with: globals.css (CSS variables), layout.tsx (TopBar + mode toggle),
then PostCard.tsx, then DungeonCanvas.tsx.
```
