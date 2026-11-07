export interface CheatSheetSection {
  title: string
  items: Array<{
    name: string
    codeOrFormula?: string
    notes: string
    gotcha?: string
  }>
}

export interface TechCheatSheet {
  techId: string
  title: string
  tagline: string
  complexityTable?: Array<{
    operation: string
    best: string
    average: string
    worst: string
    space: string
  }>
  goldenRules: string[]
  sections: CheatSheetSection[]
}

export const CURATED_CHEATSHEETS: Record<string, TechCheatSheet> = {
  javascript: {
    techId: "javascript",
    title: "JavaScript Core & Runtime Interview Cheat Sheet",
    tagline: "Event loop phases, prototype chains, closures, async mechanics & memory management.",
    goldenRules: [
      "JavaScript is single-threaded; asynchronous concurrency is orchestrated by the Event Loop and libuv/browser APIs.",
      "Microtasks (Promise.then, queueMicrotask, MutationObserver) ALWAYS drain before the next Macrotask (setTimeout, setInterval, I/O).",
      "Closures retain references to outer scope variables in the heap, not copies; beware memory leaks in unclosed handlers.",
      "Arrow functions do not bind their own 'this', 'arguments', or 'prototype'; they lexically capture enclosing context.",
      "Use WeakMap / WeakSet for metadata or caching keys without blocking garbage collection."
    ],
    sections: [
      {
        title: "Event Loop & Task Priority Execution Order",
        items: [
          {
            name: "Synchronous Execution",
            codeOrFormula: "Call Stack (LIFO)",
            notes: "Executes top-level synchronous code immediately until stack frames empty."
          },
          {
            name: "Microtask Queue (High Priority)",
            codeOrFormula: "Promise.then() / catch(), queueMicrotask()",
            notes: "Completely drained after the current script run, before any browser render or Macrotask.",
            gotcha: "An infinite recursive microtask loop starves the event loop and locks UI rendering."
          },
          {
            name: "Macrotask Queue (Task Queue)",
            codeOrFormula: "setTimeout(fn, 0), setInterval(), setImmediate()",
            notes: "Processed one task per event loop tick, followed by microtask check and render updates."
          }
        ]
      },
      {
        title: "Prototypes & Inheritance",
        items: [
          {
            name: "Prototype Chain",
            codeOrFormula: "obj.__proto__ === Object.getPrototypeOf(obj)",
            notes: "Property resolution climbs up the prototype chain until matching property or null is found."
          },
          {
            name: "Object.create(proto)",
            codeOrFormula: "Object.create(parentObj)",
            notes: "Creates a new object with the specified prototype without executing the constructor function.",
            gotcha: "Object.assign does shallow copy of own enumerable properties; it does not copy prototype chains."
          }
        ]
      },
      {
        title: "Equality & Type Coercion Traps",
        items: [
          {
            name: "Loose vs Strict Equality",
            codeOrFormula: "== vs ===",
            notes: "=== checks value and type without coercion. == converts types (e.g. [] == ![] is true).",
            gotcha: "NaN === NaN is false! Use Number.isNaN(x) or Object.is(x, NaN)."
          },
          {
            name: "Nullish Coalescing (??)",
            codeOrFormula: "a ?? b",
            notes: "Only falls back on null or undefined. Unlike ||, it preserves 0, false, and empty string ''."
          }
        ]
      }
    ]
  },
  react: {
    techId: "react",
    title: "React 19 & Architecture Interview Cheat Sheet",
    tagline: "Fiber reconciler, hooks rules, concurrent rendering, state batching & performance optimizations.",
    goldenRules: [
      "Components must be pure functions regarding rendering: same props & state produce same JSX without side effects.",
      "React 18/19 batches all state updates automatically across timeouts, promises, and native event handlers.",
      "Never mutate state directly: always return new objects or arrays to trigger reconciliation by reference equality.",
      "useMemo / useCallback should optimize expensive computations or referential stability for memoized children, not every trivial variable.",
      "Keys must be stable, unique, and predictable (never use Math.random() or unstable array indices when items can reorder/delete)."
    ],
    sections: [
      {
        title: "Core Hooks Lifecycle & Mechanics",
        items: [
          {
            name: "useEffect vs useLayoutEffect",
            codeOrFormula: "useEffect(fn, deps) vs useLayoutEffect(fn, deps)",
            notes: "useEffect runs asynchronously after paint (non-blocking). useLayoutEffect runs synchronously after DOM mutation but before paint.",
            gotcha: "Use useLayoutEffect only to measure DOM or prevent visual flickering before paint."
          },
          {
            name: "useCallback & useMemo",
            codeOrFormula: "useMemo(() => compute(a), [a])",
            notes: "useCallback caches function instances between renders; useMemo caches calculated return values."
          },
          {
            name: "useTransition (Concurrent Mode)",
            codeOrFormula: "const [isPending, startTransition] = useTransition()",
            notes: "Marks non-urgent UI updates (like search filtering) as interruptible without freezing the input responsiveness."
          }
        ]
      },
      {
        title: "Reconciliation & Fiber Architecture",
        items: [
          {
            name: "Virtual DOM & Fiber Tree",
            codeOrFormula: "WorkInProgress Tree vs Current Tree",
            notes: "Double-buffering model: React updates the workInProgress tree in chunks and commits to DOM in a single synchronous pass."
          },
          {
            name: "Diffing Algorithm Rules",
            codeOrFormula: "O(n) Heuristic Diffing",
            notes: "Two elements of different types generate different trees. Keys differentiate items across re-renders."
          }
        ]
      }
    ]
  },
  "dsa-javascript": {
    techId: "dsa-javascript",
    title: "Data Structures & Algorithms Complexity & Pattern Cheat Sheet",
    tagline: "Time/Space complexities, algorithmic archetypes, pointer techniques & interview templates.",
    complexityTable: [
      { operation: "Array (Index Access / Lookup)", best: "O(1)", average: "O(1)", worst: "O(1)", space: "O(n)" },
      { operation: "Array (Insert / Delete at End)", best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(n)" },
      { operation: "Array (Insert / Delete at Beginning)", best: "O(n)", average: "O(n)", worst: "O(n)", space: "O(n)" },
      { operation: "Hash Map / Set (Insert / Search / Delete)", best: "O(1)", average: "O(1)", worst: "O(n)", space: "O(n)" },
      { operation: "Binary Search Tree (Balanced)", best: "O(1)", average: "O(log n)", worst: "O(log n)", space: "O(n)" },
      { operation: "Merge Sort / Heap Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
      { operation: "Quick Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    ],
    goldenRules: [
      "Always clarify input constraints: Can array be empty? Are values sorted? Can there be duplicates? Can numbers be negative?",
      "Sorting first takes O(n log n) but frequently reduces O(n²) brute-force problems to O(n) two-pointer solutions.",
      "Hash Map tradeoffs: trade O(n) space to achieve O(1) instantaneous lookup.",
      "Sliding Window pattern applies to contiguous sub-arrays/strings; Two Pointers apply to sorted pairs or cycle detection (Floyd's algorithm).",
      "Breadth-First Search (Queue) guarantees the shortest path in unweighted graphs; DFS (Stack/Recursion) explores topological or tree branches."
    ],
    sections: [
      {
        title: "Top 4 Must-Know Algorithmic Patterns",
        items: [
          {
            name: "Two Pointers (Opposite Ends)",
            codeOrFormula: "while (left < right) { if (sum === target) return; sum < target ? left++ : right--; }",
            notes: "Used on sorted arrays for target pairs, palindrome verification, or container with most water."
          },
          {
            name: "Fast & Slow Pointers (Floyd's Cycle)",
            codeOrFormula: "slow = slow.next; fast = fast.next.next;",
            notes: "Detects cycles in linked lists in O(n) time and O(1) space, and finds linked list middle nodes."
          },
          {
            name: "Sliding Window",
            codeOrFormula: "for (let r = 0; r < n; r++) { add(r); while (invalid) remove(l++); }",
            notes: "Tracks longest/shortest sub-array matching criteria (e.g., longest substring without repeating characters)."
          },
          {
            name: "Binary Search Template",
            codeOrFormula: "mid = left + Math.floor((right - left) / 2)",
            notes: "Avoids integer overflow. In JS, bitwise `(left + right) >> 1` also works for 32-bit integers."
          }
        ]
      }
    ]
  },
  "frontend-system-design": {
    techId: "frontend-system-design",
    title: "Frontend System Design & Architecture Cheat Sheet",
    tagline: "High-scale frontend scalability, caching tiers, state distribution & resilience frameworks.",
    goldenRules: [
      "RADIO Framework: Requirements (Functional/Non-functional) -> Architecture -> Data Model -> Interface (API/Components) -> Optimizations.",
      "Non-functional priorities: Performance (Core Web Vitals), Availability/Offline, Security (XSS/CSRF/CSP), Accessibility (WCAG 2.1 AA), Scalability.",
      "Network Caching tiers: CDN Edge Cache (Cloudflare/CloudFront) -> HTTP Browser Cache (Cache-Control: immutable) -> Service Worker -> Memory (React Query / SWR / Zustand).",
      "List Virtualization (Windowing) is non-negotiable for feeds with >100 items to avoid DOM explosion and garbage collection lag.",
      "State segmentation: Separate Server State (cached, asynchronous) from Global UI State (theme, sidebar, modal) and Local Ephemeral State."
    ],
    sections: [
      {
        title: "Performance & Core Web Vitals Targets",
        items: [
          {
            name: "Largest Contentful Paint (LCP)",
            codeOrFormula: "Target: ≤ 2.5 seconds (Good)",
            notes: "Measures main visual content load speed. Optimize hero image priority (fetchpriority='high'), preload fonts, remove render-blocking CSS."
          },
          {
            name: "Interaction to Next Paint (INP)",
            codeOrFormula: "Target: ≤ 200 milliseconds (Good)",
            notes: "Replaced FID. Measures total interaction latency. Yield main thread using scheduler.yield() or requestIdleCallback."
          },
          {
            name: "Cumulative Layout Shift (CLS)",
            codeOrFormula: "Target: ≤ 0.1 (Good)",
            notes: "Visual stability. Always reserve aspect-ratio dimensions on images/video/ads before resources load."
          }
        ]
      },
      {
        title: "Data Synchronization Patterns",
        items: [
          {
            name: "Optimistic UI Updates",
            codeOrFormula: "Apply UI change -> Fire API -> Rollback if rejection",
            notes: "Delivers 0ms perceived response time on actions like 'Like', 'Bookmark', or 'Send Message'."
          },
          {
            name: "Polling vs WebSockets vs SSE",
            codeOrFormula: "HTTP Short/Long Poll vs WS (Duplex) vs Server-Sent Events (Uni-directional)",
            notes: "Use SSE for live dashboards, stock tickers, or AI streaming. Use WebSockets for two-way collaboration and chat."
          }
        ]
      }
    ]
  },
  nextjs: {
    techId: "nextjs",
    title: "Next.js App Router Architecture Cheat Sheet",
    tagline: "RSC payload streaming, Server Actions, route handlers, revalidation & rendering strategies.",
    goldenRules: [
      "React Server Components (RSC) run ONLY on the server: zero client bundle size, direct database/backend access, secrets stay secure.",
      "Add 'use client' only when needing interactivity (useState, useEffect, event listeners, browser APIs). Push client boundaries down the tree.",
      "Server Actions must validate input and authenticate permissions; never trust client-provided IDs directly.",
      "Streaming with Suspense allows fast TTFB by progressively flushing HTML shells and streaming slower database-dependent chunks.",
      "Caching levels: Request Memoization (per-render deduping) -> Data Cache (fetch cache) -> Full Route Cache -> Router Cache."
    ],
    sections: [
      {
        title: "Rendering Strategies in App Router",
        items: [
          {
            name: "Static Rendering (Default)",
            codeOrFormula: "export const dynamic = 'error'",
            notes: "Routes rendered at build time or revalidation time. Cached on CDN for maximum speed."
          },
          {
            name: "Dynamic Rendering",
            codeOrFormula: "headers(), cookies(), searchParams",
            notes: "Routes rendered per-request when dynamic functions or no-store headers are detected."
          },
          {
            name: "Incremental Static Regeneration (ISR)",
            codeOrFormula: "revalidatePath() or { next: { revalidate: 60 } }",
            notes: "Serves cached static page while regenerating fresh content in the background on cache expiration."
          }
        ]
      }
    ]
  },
  typescript: {
    techId: "typescript",
    title: "TypeScript Type System & Advanced Generics Cheat Sheet",
    tagline: "Conditional types, Mapped types, infer keyword, utility types & discriminating unions.",
    goldenRules: [
      "Favor Discriminated Unions with a shared literal tag (e.g., type: 'success' | 'error') over optional nullable flags.",
      "Avoid 'any': use 'unknown' when type is uncertain, requiring type narrowing with type guards before usage.",
      "Use 'satisfies' operator to validate that an expression matches a type without widening its specific inferred type.",
      "Use 'const assertions' (as const) to preserve exact literal types and mark arrays/objects as deeply readonly.",
      "Use 'keyof' and 'typeof' to extract property names and structural types from runtime objects."
    ],
    sections: [
      {
        title: "Advanced Utility & Conditional Types",
        items: [
          {
            name: "Conditional Types with 'infer'",
            codeOrFormula: "type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;",
            notes: "Extracts an embedded type parameter dynamically from a function signature or promise."
          },
          {
            name: "Mapped Types & Key Remapping",
            codeOrFormula: "type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }",
            notes: "Transforms property names and types programmatically across an interface."
          },
          {
            name: "Exclusion & Extraction",
            codeOrFormula: "Exclude<T, U> vs Extract<T, U>",
            notes: "Exclude removes assignable union members; Extract selects matching union members."
          }
        ]
      }
    ]
  }
}
