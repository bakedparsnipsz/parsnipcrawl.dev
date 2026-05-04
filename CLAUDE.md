@AGENTS.md

<!-- BEGIN:parsnipscrawl-rules -->
# parsnipscrawl.dev — Claude Code standing orders

## Read first
Read DESIGN_SYSTEM.md before writing any component, style, or game logic.

## Hard rules — never break these
- Add any new code in the root of this directory and follow folder patterns.
- All colours from CSS custom properties in DESIGN_SYSTEM.md §2 — never hardcode hex
- CSS variable suffixes use hyphens: --purple-3 not --purple3, --text-2 not --text2
- All spacing from the 8px scale only: 4, 8, 16, 24, 32, 40px — nothing in between
- Minimum font size: 10px — never go below this
- Approved font sizes only: 10, 11, 14, 16, 20, 24, 32, and clamp(28px,4.5vw,36px) for hero
- Body font must stay around 16px and 14px depending on context and space. only badges or tags should use 11px or 10px
- No Tailwind, no CSS-in-JS, no component libraries (shadcn, MUI, etc.)
- All pixel art is inline SVG or Canvas2D — no image files, no sprite sheets
- Primary button resting colour: --purple (NOT --purple-2 — insufficient contrast)
- Disabled button: bg #0e0015, border #3a1050, color #7a4a9a — no opacity hack
- border-radius: 2px default, 4px overlays only, 8px outer wrapper only
- Site name "Parsnipscrawl.dev" — single line, clamp(28px,4.5vw,36px), white-space: nowrap

## Build order
1. globals.css — CSS custom properties + base reset
2. layout.tsx — TopBar + mode toggle + localStorage state init
3. PostCard.tsx
4. DungeonCanvas.tsx + game loop
5. ArticleProse.tsx + CodeBlock.tsx
6. CombatOverlay.tsx + EncounterFlash.tsx
7. RoomClearScreen.tsx

## Watch for drift
- Colour drift: reject any hex value not in §2
- Font substitution: only UnifrakturMaguntia, Cinzel Decorative, Cinzel, Share Tech Mono
- Border radius creep: flat is the aesthetic — resist rounding things
- Spacing drift: no 6px, 10px, 12px, 20px, 28px — round to the 8px scale
- Tailwind: not available, not wanted
- Canvas libraries: use vanilla Canvas2D only