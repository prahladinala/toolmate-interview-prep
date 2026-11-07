import { JutroQuestion } from "../jutroQuizData"

export const metaFrontendQuestions: JutroQuestion[] = [
  {
    id: "meta-1",
    question: "In React 18 and 19, what is the primary benefit of the 'useTransition' hook in client rendering?",
    options: [
      "It marks non-urgent state updates as interruptible so that urgent inputs (like keystrokes) remain responsive",
      "It memoizes expensive mathematical function calculations",
      "It creates an isolated web worker thread for background execution",
      "It automatically runs garbage collection on unmounted DOM nodes"
    ],
    answer: [0],
    category: "React Architecture & Concurrency",
    explanation: "useTransition allows developers to mark state transitions as non-urgent, enabling React to pause or interrupt rendering if higher-priority events (e.g. typing, clicking) occur.",
    isMultiSelect: false
  },
  {
    id: "meta-2",
    question: "Which of the following accessibility (a11y) techniques ensure that dynamic content changes are properly announced to screen reader users without shifting keyboard focus? (Select two)",
    options: [
      "Using aria-live='polite' or aria-live='assertive'",
      "Using role='status' or role='alert'",
      "Applying CSS display: none to the container",
      "Setting tabIndex={-1} on all child elements",
      "Using title attributes on paragraph tags"
    ],
    answer: [0, 1],
    category: "Accessibility (WCAG & a11y)",
    explanation: "Live regions defined via aria-live attributes or ARIA live landmark roles (status, alert) instruct assistive technologies to announce dynamic updates asynchronously.",
    isMultiSelect: true
  },
  {
    id: "meta-3",
    question: "When measuring Web Performance, what does the 'Interaction to Next Paint' (INP) metric represent?",
    options: [
      "The longest latency observed between a user interaction (click, keypress, tap) and the next visual frame update",
      "The time it takes to download and parse the main JavaScript bundle",
      "The duration before the largest image or text block renders on screen",
      "The network round-trip time of the first HTTP API request"
    ],
    answer: [0],
    category: "Web Performance & Metrics",
    explanation: "INP is a Core Web Vital that assesses a page's overall responsiveness to user interactions by sampling all clicks, taps, and key presses throughout the entire page lifecycle.",
    isMultiSelect: false
  },
  {
    id: "meta-4",
    question: "Which CSS property provides native browser-level layout containment, allowing the rendering engine to skip layout and painting for offscreen DOM elements?",
    options: [
      "content-visibility: auto",
      "will-change: transform",
      "contain: strict",
      "transform: translateZ(0)"
    ],
    answer: [0],
    category: "CSS Performance & DOM",
    explanation: "content-visibility: auto enables the browser to skip layout and rendering work for off-screen elements until the user scrolls near them, dramatically boosting initial render speeds.",
    isMultiSelect: false
  },
  {
    id: "meta-5",
    question: "Which statements correctly describe the behavior of JavaScript closures in modern V8/SpiderMonkey engines? (Select two)",
    options: [
      "Closures retain references to variables in lexical scope, keeping those variables on the heap rather than on the stack",
      "Closures can cause memory leaks if retained in global event listeners or long-lived timers",
      "Closures make independent static deep copies of outer scope values at function creation time",
      "Closures only work with primitive types and cannot capture object references",
      "Arrow functions cannot create closures"
    ],
    answer: [0, 1],
    category: "JavaScript Core & Runtime",
    explanation: "Closures maintain live references to enclosed variables on the heap. If references to the closure persist (e.g. in window listeners), those variables cannot be garbage collected.",
    isMultiSelect: true
  },
  {
    id: "meta-6",
    question: "How does React's Reconciliation algorithm handle elements of different types during a re-render?",
    options: [
      "It completely tears down the old DOM tree, unmounts all children, and builds the new tree from scratch",
      "It preserves the existing DOM node and mutates its attributes in place",
      "It merges the children and schedules an asynchronous worker diff",
      "It throws an unhandled reconciliation error"
    ],
    answer: [0],
    category: "React Architecture & Concurrency",
    explanation: "Whenever root elements have different types (e.g. from <a> to <div>, or <Header> to <Nav>), React dismantles the old tree and reconstructs the new tree from root down.",
    isMultiSelect: false
  },
  {
    id: "meta-7",
    question: "What is the primary purpose of the 'navigator.sendBeacon()' browser API?",
    options: [
      "Asynchronously transmitting telemetry/analytics data to a server before page unload without delaying document navigation",
      "Streaming two-way real-time websocket packets",
      "Caching static assets in the CacheStorage API",
      "Triggering device push notifications"
    ],
    answer: [0],
    category: "Web APIs & Networking",
    explanation: "sendBeacon() queues small HTTP POST payloads for transmission after the document unloads, avoiding blocking navigation or being cancelled prematurely.",
    isMultiSelect: false
  },
  {
    id: "meta-8",
    question: "In security architecture, what vulnerability is mitigated by setting the 'HttpOnly' flag on session cookies?",
    options: [
      "Cross-Site Scripting (XSS) theft of session tokens via document.cookie",
      "Cross-Site Request Forgery (CSRF) state changes",
      "Man-in-the-Middle (MitM) packet sniffing",
      "SQL injection attacks against database queries"
    ],
    answer: [0],
    category: "Security & Web Standards",
    explanation: "HttpOnly cookies cannot be accessed by client-side JavaScript (document.cookie), preventing malicious scripts injected via XSS from exfiltrating authentication cookies.",
    isMultiSelect: false
  }
]

export const metaCategories = Array.from(
  new Set(metaFrontendQuestions.map((q) => q.category))
)
