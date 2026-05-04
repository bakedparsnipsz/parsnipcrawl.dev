import type { Post } from './types';

export const POSTS: Post[] = [
  {
    slug: 'event-loop-demystified',
    title: 'The Event Loop Demystified',
    excerpt:
      'You\'ve heard it a thousand times — "JavaScript is single-threaded." But what does that actually mean when setTimeout, Promises, and queueMicrotask all behave differently?',
    series: 'js-internals',
    floor: 1,
    room: 1,
    roomName: 'The Loop Chamber',
    difficulty: 'Easy',
    xp: 250,
    sprite: 'scroll',
    tags: ['javascript', 'runtime', 'async'],
    readingTime: 7,
    isBoss: false,
    publishedAt: '2026-04-10',
    enemies: [
      {
        name: 'Callback Wraith',
        hp: 40,
        xpReward: 80,
        question: 'Which queue has higher priority: the microtask queue or the macrotask queue?',
        answers: [
          'Microtask queue — microtasks run before the next macrotask',
          'Macrotask queue — it runs first on each tick',
          'They run in parallel on separate threads',
          'Priority depends on the runtime version',
        ],
        correctIndex: 0,
      },
    ],
    content: `
The JavaScript runtime has one call stack, one heap, and a queue of messages. That is the entire mental model. Everything else — Promises, async/await, setTimeout — is machinery built on top of it.

## // The Call Stack

When you call a function, a frame is pushed onto the stack. When it returns, the frame pops. Synchronous code runs to completion before anything else gets a look in. This is what "single-threaded" actually means: there is no pre-emption, no time-slicing, no context switching mid-function.

## // Two Queues, One Loop

The event loop runs a continuous check: if the call stack is empty, pull the next task from a queue and run it. The twist is that there are *two* queues and they have different priorities.

### > Microtask queue

Microtasks are processed **after every task** but *before* the next paint or I/O callback. Promises settle here. \`queueMicrotask()\` lands here. \`MutationObserver\` callbacks land here.

\`\`\`javascript
Promise.resolve()
  .then(() => console.log('microtask 1'))
  .then(() => console.log('microtask 2'));

setTimeout(() => console.log('macrotask'), 0);

console.log('sync');
// Output: sync → microtask 1 → microtask 2 → macrotask
\`\`\`

### > Macrotask queue

setTimeout, setInterval, I/O callbacks, and UI events all go here. Only one macrotask runs per loop iteration — after which the entire microtask queue drains before the next macrotask is picked up.

## // Why This Matters in Practice

Starving the macrotask queue with microtasks is a real footgun. If a \`.then()\` chain continuously re-queues itself, the browser never gets to paint and the UI freezes. This is not theoretical — it has caused production incidents.

\`\`\`javascript
// This will freeze the tab — never do this
function poison() {
  return Promise.resolve().then(poison);
}
\`\`\`

The event loop is not magic. It is a \`while(true)\` loop around a priority queue with two slots. Once you internalise that, async JavaScript becomes considerably less surprising.
    `.trim(),
  },
  {
    slug: 'css-grid-mastery',
    title: 'CSS Grid: Beyond the Basics',
    excerpt:
      "Grid areas, subgrid, auto-placement algorithms — most developers only use a fraction of what CSS Grid can do. Let's fix that.",
    series: 'css-deep-dives',
    floor: 1,
    room: 2,
    roomName: 'The Grid Vault',
    difficulty: 'Medium',
    xp: 400,
    sprite: 'tome',
    tags: ['css', 'layout', 'grid'],
    readingTime: 10,
    isBoss: false,
    publishedAt: '2026-04-17',
    enemies: [
      {
        name: 'Specificity Golem',
        hp: 55,
        xpReward: 110,
        question: 'What does `grid-template-areas` require from its child elements?',
        answers: [
          'Children must set `grid-area` to match a named area',
          'Children must use integer line numbers',
          'Children must be direct block-level elements only',
          'Children must set `position: absolute`',
        ],
        correctIndex: 0,
      },
    ],
    content: `
Most CSS Grid tutorials stop at \`grid-template-columns: repeat(3, 1fr)\` and call it a day. That covers maybe 30% of the feature set. The rest — named areas, implicit tracks, subgrid, and the auto-placement algorithm — are what separate someone who uses Grid from someone who understands it.

## // Named Grid Areas

\`grid-template-areas\` is the most readable way to define a layout and the most underused. You draw the layout in ASCII and assign children to positions by name.

\`\`\`css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 160px;
  grid-template-rows: 48px 1fr 40px;
  grid-template-areas:
    "topbar topbar  topbar"
    "sidebar main   aside"
    "footer  footer footer";
}

.topbar  { grid-area: topbar;  }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main;    }
.aside   { grid-area: aside;   }
.footer  { grid-area: footer;  }
\`\`\`

A dot (\`.\`) represents an empty cell. You can span areas by repeating the name across cells — the browser validates that the shape is rectangular.

## // The Auto-Placement Algorithm

When you don't explicitly place an item, Grid places it for you. Understanding *how* changes the game.

### > dense packing

\`grid-auto-flow: dense\` tells the algorithm to backfill gaps. Without it, items flow forward-only. With it, a small item can fill a hole left by a larger one. This is how masonry-ish layouts work without JavaScript.

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-flow: dense;
  gap: 12px;
}

.feature { grid-column: span 2; grid-row: span 2; }
\`\`\`

## // Subgrid

Subgrid (now in all major browsers) lets a nested grid inherit the track definitions of its parent. The canonical use-case: card grids where you want every card's internal rows to align across the row.

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* inherits parent row tracks */
}
\`\`\`

Now every card's header, body, and footer snap to the same horizontal bands — no JavaScript measurement required.
    `.trim(),
  },
  {
    slug: 'typescript-compiler-api',
    title: 'Parsing TypeScript with the Compiler API',
    excerpt:
      'The TypeScript compiler is a fully public API. You can walk ASTs, extract type information, and build your own tooling — all without forking tsc.',
    series: 'typescript-internals',
    floor: 2,
    room: 1,
    roomName: 'The Type Catacombs',
    difficulty: 'Hard',
    xp: 750,
    sprite: 'tome',
    tags: ['typescript', 'compilers', 'tooling', 'ast'],
    readingTime: 14,
    isBoss: false,
    publishedAt: '2026-04-24',
    enemies: [
      {
        name: 'Syntax Wraith',
        hp: 65,
        xpReward: 130,
        question:
          'In the TypeScript Compiler API, what is the difference between a `SyntaxKind` and a `Type`?',
        answers: [
          'SyntaxKind describes AST node shape; Type describes the semantic type resolved by the checker',
          'SyntaxKind is runtime; Type is compile-time only',
          'They are aliases for the same concept',
          'SyntaxKind is for JS; Type is for TS-only syntax',
        ],
        correctIndex: 0,
      },
      {
        name: 'Borrow Spectre',
        hp: 45,
        xpReward: 90,
        question: 'Which function creates a TypeChecker from a Program?',
        answers: [
          'program.getTypeChecker()',
          'ts.createTypeChecker(program)',
          'ts.getChecker(sourceFile)',
          'program.buildChecker()',
        ],
        correctIndex: 0,
      },
    ],
    content: `
Most TypeScript tooling you use daily — ESLint's TS rules, ts-morph, Storybook's docgen, your IDE's autocomplete — is built on top of the TypeScript Compiler API. It ships as part of the \`typescript\` package and is entirely public.

## // The Two Layers

There are two distinct layers in the compiler API: the **syntactic** layer and the **semantic** layer.

The syntactic layer parses source text into an AST. No type information, no cross-file analysis. Fast and self-contained.

The semantic layer adds a type checker that resolves types, follows imports, and understands the full program. Slower to initialise but necessary for anything type-aware.

## // Walking an AST

\`\`\`typescript
import ts from 'typescript';

const source = ts.createSourceFile(
  'example.ts',
  \`const x: number = 42;\`,
  ts.ScriptTarget.Latest,
  true,
);

function walk(node: ts.Node, depth = 0) {
  const kind = ts.SyntaxKind[node.kind];
  console.log(' '.repeat(depth * 2) + kind);
  ts.forEachChild(node, child => walk(child, depth + 1));
}

walk(source);
\`\`\`

### > Output

\`\`\`
SourceFile
  VariableStatement
    VariableDeclarationList
      VariableDeclaration
        Identifier          // x
        NumberKeyword       // : number
        NumericLiteral      // 42
\`\`\`

## // Resolving Types

For semantic information you need a full Program and a TypeChecker.

\`\`\`typescript
const program = ts.createProgram(['src/index.ts'], {
  strict: true,
  target: ts.ScriptTarget.ESNext,
});

const checker = program.getTypeChecker();
const source  = program.getSourceFile('src/index.ts')!;

ts.forEachChild(source, node => {
  if (ts.isVariableStatement(node)) {
    const decl = node.declarationList.declarations[0];
    const type = checker.getTypeAtLocation(decl);
    console.log(checker.typeToString(type)); // "number"
  }
});
\`\`\`

## // Practical Uses

The Compiler API is the right choice for: generating typed documentation, building codemods that preserve types, writing custom lint rules that need full type information, or extracting component prop types at build time for design-system tooling.
    `.trim(),
  },
  {
    slug: 'react-reconciler-internals',
    title: 'Writing a React Renderer from Scratch',
    excerpt:
      'React\'s reconciler is a package you can swap out. Building a toy renderer reveals exactly what "the virtual DOM" is and isn\'t — and why Fiber was a necessary redesign.',
    series: 'react-internals',
    floor: 2,
    room: 2,
    roomName: 'The Fiber Forge',
    difficulty: 'Hard',
    xp: 900,
    sprite: 'skull',
    tags: ['react', 'internals', 'reconciler', 'fiber'],
    readingTime: 16,
    isBoss: false,
    publishedAt: '2026-04-28',
    enemies: [
      {
        name: 'Stale Closure Imp',
        hp: 50,
        xpReward: 100,
        question: 'In React Fiber, what is a "work unit"?',
        answers: [
          "A single Fiber node — one element's work can be paused and resumed",
          'A batch of setState calls',
          'A useEffect call',
          'A full component subtree re-render',
        ],
        correctIndex: 0,
      },
    ],
    content: `
The "virtual DOM" is one of the most misunderstood concepts in frontend. It is not a performance technique — it is a programming model. The performance characteristics come from *batching* reconciliation, not from diffing being inherently faster than direct DOM mutation.

## // react-reconciler

React ships a package called \`react-reconciler\` that you can use to target anything — DOM, canvas, terminal, native, PDF. The host environment provides a handful of callbacks; the reconciler does the tree diffing and calls them at the right time.

\`\`\`typescript
import Reconciler from 'react-reconciler';

const hostConfig = {
  createInstance(type, props) {
    return { type, props, children: [] };
  },
  appendChildToContainer(container, child) {
    container.children.push(child);
  },
  commitMount() {},
  // ... ~25 more callbacks
};

const renderer = Reconciler(hostConfig);
\`\`\`

## // What Fiber Actually Is

Before Fiber (pre React 16), reconciliation was a recursive depth-first traversal. You could not pause it mid-way. For large trees, this could block the main thread for tens of milliseconds — hence janky animations.

### > Fiber as a linked list

Fiber converts the component tree into a linked list of work units. Each node has three pointers:

\`\`\`
child   → first child
sibling → next sibling at same depth
return  → parent
\`\`\`

The reconciler walks this structure iteratively. Because each step is a single function call that returns the next unit of work, the runtime can pause between units, check if there's higher-priority work (like a user keypress), and resume later.

## // The Two-Phase Commit

Fiber splits work into two phases:

1. **Render phase** — pure, interruptible. Builds a "work-in-progress" tree, computes effects. Can be thrown away and restarted.
2. **Commit phase** — synchronous, not interruptible. Flushes all mutations to the host (DOM, canvas, etc.) at once. This is what makes updates appear atomic.

This is why you should never trigger side effects during render — the render phase can run multiple times for a single commit.
    `.trim(),
  },
  {
    slug: 'browser-rendering-pipeline',
    title: 'The Browser Rendering Pipeline',
    excerpt:
      'From HTML bytes to pixels on screen, the browser does a surprising amount of work. Understanding the pipeline is the prerequisite to reasoning about performance.',
    series: 'browser-internals',
    floor: 1,
    room: 3,
    roomName: 'The Paint Pit',
    difficulty: 'Medium',
    xp: 450,
    sprite: 'scroll',
    tags: ['browsers', 'performance', 'rendering', 'css'],
    readingTime: 9,
    isBoss: false,
    publishedAt: '2026-04-14',
    enemies: [
      {
        name: 'Layout Thrash Demon',
        hp: 50,
        xpReward: 100,
        question: 'Which CSS property change triggers layout (reflow)?',
        answers: [
          'Changing `width` or `height`',
          'Changing `opacity`',
          'Changing `transform`',
          'Changing `background-color`',
        ],
        correctIndex: 0,
      },
    ],
    content: `
The browser turns HTML, CSS, and JavaScript into pixels through a deterministic pipeline. Every frame that gets rendered goes through the same stages. Understanding them tells you exactly why some "optimisations" do nothing and others are transformative.

## // Parse → Style → Layout → Paint → Composite

That is the full pipeline in one line. Each stage feeds into the next, and each stage has a cost. The goal of performance work is to touch as few stages as possible per change.

### > Parse

HTML is parsed into a DOM tree. CSS is parsed into a CSSOM tree. Neither tree is the "virtual DOM" — that is a framework abstraction. These are actual browser data structures.

JavaScript execution is interleaved here, which is why \`<script>\` tags block parsing unless marked \`defer\` or \`async\`.

## // Style Calculation

The browser matches CSS rules to DOM nodes and computes each element's final computed style. This is where specificity wars happen at the engine level.

\`\`\`css
/* This forces the browser to evaluate :nth-child for every list item */
.card:nth-child(odd) > .inner > span { color: red; }

/* This is O(1) per element */
.card-label-alt { color: red; }
\`\`\`

## // Layout (Reflow)

Layout computes the geometry — position and size — of every element in the render tree. It is expensive and contagious: changing one element's dimensions can cascade to siblings and parents.

### > The layout thrash pattern

\`\`\`javascript
// BAD: forces layout twice per element
elements.forEach(el => {
  const h = el.offsetHeight;        // read → forces layout
  el.style.height = h * 2 + 'px';  // write → invalidates layout
});

// GOOD: batch reads then writes
const heights = elements.map(el => el.offsetHeight);  // one layout
elements.forEach((el, i) => { el.style.height = heights[i] * 2 + 'px'; });
\`\`\`

## // Paint and Composite

Paint rasterises elements onto layers. Composite assembles those layers on the GPU.

\`transform\` and \`opacity\` are cheap because they only trigger compositing — no layout, no paint. This is why animating these two properties is the correct approach for smooth 60fps animations. Anything else risks dropping frames.
    `.trim(),
  },
  {
    slug: 'state-management-patterns',
    title: 'State Management Without the Boilerplate',
    excerpt:
      'Redux, MobX, Zustand, Jotai, Valtio — the state management ecosystem is a graveyard of over-engineered solutions. Here is how to pick the right tool without getting burned.',
    series: 'architecture',
    floor: 2,
    room: 3,
    roomName: 'The State Sanctum',
    difficulty: 'Medium',
    xp: 500,
    sprite: 'tome',
    tags: ['state', 'architecture', 'react', 'zustand'],
    readingTime: 11,
    isBoss: false,
    publishedAt: '2026-04-21',
    enemies: [
      {
        name: 'Redux Revenant',
        hp: 60,
        xpReward: 120,
        question:
          'In Zustand, how do you prevent a component from re-rendering when an unrelated slice of state changes?',
        answers: [
          'Use a selector: `useStore(state => state.count)` — only re-renders when `count` changes',
          'Split the store into multiple files',
          'Wrap the component in `React.memo`',
          'Use `shallow` equality by default — Zustand handles this automatically',
        ],
        correctIndex: 0,
      },
    ],
    content: `
The React state management ecosystem has matured enough that "which library should I use" has a defensible answer for most cases. The harder question is when to reach for external state at all.

## // The Colocation Principle

Before introducing any library, ask: can this state live closer to where it's used?

- **Component state** — \`useState\`. If only one component needs it, it lives there.
- **Shared ancestor state** — lift up, pass down. Works fine for 2-3 levels.
- **Context** — for infrequently-changing values (theme, auth, locale). Context re-renders all consumers on every change, so it is a poor fit for high-frequency updates.
- **External store** — for global UI state, server-derived state, or state that outlives component trees.

## // Zustand: The Right Size

Zustand wins the pragmatism award. The entire API is:

\`\`\`typescript
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
}

const useCounter = create<CounterStore>()(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));

// In a component:
const count = useCounter(state => state.count);
\`\`\`

No reducers, no action types, no dispatch. The selector in \`useCounter\` is the key: the component only re-renders when \`count\` changes, not when any other part of the store updates.

### > Persistence in one line

\`\`\`typescript
import { persist } from 'zustand/middleware';

const useStore = create(persist(
  (set) => ({ hp: 100, xp: 0 }),
  { name: 'dungeon-state' },
));
\`\`\`

## // When to Use Server State Libraries

For data that lives on a server — user profiles, post lists, comments — a dedicated server-state library (TanStack Query, SWR) is almost always the correct choice over manual fetch + useState. They handle caching, deduplication, background refetch, and optimistic updates, all of which you will eventually re-implement badly if you roll your own.

The rule of thumb: if the state came from a server and needs to stay in sync with it, use a server-state library. If it is local UI state, use Zustand or \`useState\`.
    `.trim(),
  },
  {
    slug: 'web-performance-core-vitals',
    title: 'Core Web Vitals: What Actually Moves the Numbers',
    excerpt:
      "LCP, CLS, INP — Google's metrics are now a ranking signal. But optimising for them without understanding what they measure leads to gaming, not improving. Here's the substance.",
    series: 'performance',
    floor: 3,
    room: 1,
    roomName: 'The Vitals Vault',
    difficulty: 'Hard',
    xp: 700,
    sprite: 'sword',
    tags: ['performance', 'web-vitals', 'lcp', 'cls', 'inp'],
    readingTime: 13,
    isBoss: false,
    publishedAt: '2026-04-26',
    enemies: [
      {
        name: 'Layout Shift Shade',
        hp: 70,
        xpReward: 140,
        question: 'What is the primary cause of poor Interaction to Next Paint (INP)?',
        answers: [
          'Long-running JavaScript blocking the main thread during an interaction',
          'Images loading slowly',
          'Too many CSS animations',
          'Network latency on API calls',
        ],
        correctIndex: 0,
      },
    ],
    content: `
Core Web Vitals became a Google ranking factor in 2021 and the industry responded mostly by gaming the metrics at the edges rather than addressing the underlying problems. Here is what each metric actually measures and what genuinely moves the number.

## // LCP — Largest Contentful Paint

LCP measures when the largest visible content element — usually a hero image or above-the-fold heading — has been rendered. Google's threshold: good is under 2.5s.

### > What actually causes bad LCP

**Resource discovery latency.** If your hero image is in a CSS background or JS-rendered, the browser can't discover it until the stylesheet or JS executes. Putting it in \`<img>\` with \`fetchpriority="high"\` lets the preload scanner find it immediately.

\`\`\`html
<!-- Discovered by preload scanner — good -->
<img src="/hero.webp" fetchpriority="high" alt="..." />

<!-- Not discovered until CSSOM is built — bad for LCP -->
<div style="background-image: url('/hero.webp')"></div>
\`\`\`

## // CLS — Cumulative Layout Shift

CLS scores the total visual instability. Elements jumping around when content loads below them. Good is under 0.1.

The root cause in 90% of cases: content without reserved dimensions. Images without \`width\`/\`height\` attributes. Ad slots that expand. Fonts that swap in and push text.

\`\`\`css
/* Reserve space for images — eliminates that category of shift */
img { aspect-ratio: attr(width) / attr(height); }
\`\`\`

## // INP — Interaction to Next Paint

INP replaced FID in 2024. It measures the worst interaction latency across the whole session. Good is under 200ms.

### > The only real fix

Long tasks block the main thread. Break them up.

\`\`\`javascript
async function processLargeList(items) {
  for (let i = 0; i < items.length; i++) {
    process(items[i]);
    if (i % 50 === 0) {
      // Yield to the browser every 50 items
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
\`\`\`

\`scheduler.yield()\` (available in Chrome) is the proper API for this pattern — it uses priority-aware scheduling instead of a 0ms timeout hack.
    `.trim(),
  },
  {
    slug: 'the-dom-is-not-slow',
    title: 'The DOM Is Not Slow — You Are Using It Wrong',
    excerpt:
      "The virtual DOM narrative convinced a generation of developers that touching the DOM is dangerous. It's not. Uncoordinated, unmeasured DOM access is. There's a difference.",
    series: 'browser-internals',
    floor: 3,
    room: 2,
    roomName: 'The BOSS NODE',
    difficulty: 'BOSS',
    xp: 1500,
    sprite: 'skull',
    tags: ['dom', 'performance', 'browsers', 'myths'],
    readingTime: 18,
    isBoss: true,
    publishedAt: '2026-04-30',
    enemies: [
      {
        name: 'Virtual DOM Lich',
        hp: 120,
        xpReward: 300,
        question:
          'Why does the virtual DOM not inherently provide a performance advantage over direct DOM manipulation?',
        answers: [
          'It adds overhead (diff + patch). The gain is predictability and batching — not DOM avoidance.',
          'Virtual DOM operations are synchronous and block the main thread.',
          'Browsers have optimised the DOM to be as fast as JavaScript objects.',
          'The virtual DOM skips the layout phase entirely.',
        ],
        correctIndex: 0,
      },
      {
        name: 'Framework Phantom',
        hp: 80,
        xpReward: 200,
        question: 'What is `requestAnimationFrame` primarily used for?',
        answers: [
          "Scheduling visual updates to synchronise with the browser's paint cycle",
          'Deferring heavy computation to a background thread',
          'Batching multiple setState calls in React',
          'Preventing layout thrash by reading DOM properties asynchronously',
        ],
        correctIndex: 0,
      },
    ],
    content: `
The virtual DOM was invented to solve a real problem: coordinating UI state with the DOM in large applications, without requiring developers to think about which parts of the tree need updating. It was not invented because the DOM is slow.

Pete Hunt's original React blog post said as much. The virtual DOM is "fast enough" — it adds a diff cost and patches the DOM with the minimum changes. The DOM itself is not the bottleneck.

## // What "Slow DOM" Actually Means

When people say the DOM is slow, they mean one of three things:

1. **Forced synchronous layout** — reading layout properties (offsetHeight, getBoundingClientRect) immediately after writing styles forces the browser to flush pending layout work. This is the layout thrash pattern, and it is absolutely slow.

2. **Too many style invalidations** — changing properties that affect layout (width, height, top, margin) marks a large subtree for reflow. Doing this in a loop compounds the cost.

3. **Uncoordinated paint** — triggering repaints outside of \`requestAnimationFrame\` can cause multiple paints per frame or paints at the wrong time in the rendering pipeline.

## // Vanilla DOM Can Be Fast

\`\`\`javascript
// Animating 10,000 elements at 60fps — vanilla JS
const elements = document.querySelectorAll('.particle');
const positions = Array.from(elements, () => ({ x: 0, y: 0, vx: Math.random() * 2, vy: Math.random() * 2 }));

function tick() {
  // Batch all writes — no reads during this loop
  elements.forEach((el, i) => {
    positions[i].x += positions[i].vx;
    positions[i].y += positions[i].vy;
    el.style.transform = \`translate(\${positions[i].x}px, \${positions[i].y}px)\`;
  });
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
\`\`\`

This runs at 60fps. No framework. No virtual DOM. Because it follows the rules: batch writes, use transforms, synchronise with the paint cycle.

## // When Frameworks Win

Frameworks win on *developer ergonomics*, not raw performance. When your UI has complex conditional rendering, interdependent state, and dozens of contributors, the cost of the virtual DOM diff is worth paying for the programming model you get in return.

The mistake is treating "use a framework" and "do not touch the DOM" as synonymous. For performance-critical hotpaths — canvas renderers, data visualisations, game loops — you want direct DOM or canvas access. The framework is the right tool for the page shell; it is usually the wrong tool for the inner render loop.

## // The Actual Checklist

- Use \`transform\` and \`opacity\` for animations — GPU-composited, no reflow
- Batch DOM reads before writes — never interleave
- Wrap mutations in \`requestAnimationFrame\`
- Use \`will-change: transform\` sparingly to promote elements to their own compositing layer
- Prefer \`IntersectionObserver\` over scroll event listeners
- Use \`ResizeObserver\` instead of polling \`offsetWidth\`

The DOM is a perfectly capable rendering API. The browser vendors have been optimising it for thirty years. Respect the pipeline and it will respect you back.
    `.trim(),
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getPostsByFloor(floor: number): Post[] {
  return POSTS.filter((p) => p.floor === floor);
}
