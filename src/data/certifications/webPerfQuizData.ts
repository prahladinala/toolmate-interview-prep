import { JutroQuestion } from "../jutroQuizData"

export const webPerfQuestions: JutroQuestion[] = [
  {
    id: "perf-1",
    question: "What is the official threshold for a 'Good' Largest Contentful Paint (LCP) score according to Google Web Vitals standards?",
    options: [
      "≤ 2.5 seconds",
      "≤ 1.0 second",
      "≤ 4.0 seconds",
      "≤ 500 milliseconds"
    ],
    answer: [0],
    category: "Core Web Vitals Thresholds",
    explanation: "Google classifies LCP as 'Good' if the largest image or text element in the viewport renders within 2.5 seconds or less on the 75th percentile of page loads.",
    isMultiSelect: false
  },
  {
    id: "perf-2",
    question: "Which of the following approaches prevent Cumulative Layout Shift (CLS) on pages loading dynamic banners, images, or third-party ads? (Select two)",
    options: [
      "Always setting explicit width and height attributes or CSS aspect-ratio on image and video elements",
      "Pre-allocating container space for ad slots and dynamic widgets with min-height",
      "Removing all font preloads",
      "Loading all images via base64 data URIs",
      "Disabling browser hardware acceleration"
    ],
    answer: [0, 1],
    category: "Layout Stability (CLS)",
    explanation: "Explicit dimensions or aspect-ratio reserve layout box space before resources download, preventing elements below from jumping when the image or ad loads.",
    isMultiSelect: true
  },
  {
    id: "perf-3",
    question: "What is the primary difference between '<link rel=\"preload\">' and '<link rel=\"prefetch\">'?",
    options: [
      "'preload' downloads high-priority resources needed for the CURRENT page immediately; 'prefetch' downloads low-priority resources expected for FUTURE navigations during idle time",
      "'preload' is only for fonts; 'prefetch' is only for images",
      "'prefetch' executes script tags immediately",
      "'preload' bypasses browser HTTP cache permanently"
    ],
    answer: [0],
    category: "Resource Hints & Loading",
    explanation: "rel='preload' forces the browser to fetch a critical resource for the active page ahead of time. rel='prefetch' fetches assets with low priority for likely subsequent page transitions.",
    isMultiSelect: false
  },
  {
    id: "perf-4",
    question: "Which modern image format generally provides the highest compression efficiency for photographic content on the web with alpha transparency support?",
    options: [
      "AVIF (AV1 Image File Format)",
      "JPEG",
      "GIF",
      "BMP"
    ],
    answer: [0],
    category: "Asset Optimization & Formats",
    explanation: "AVIF offers significantly smaller file sizes (typically 20% to 50% smaller than WebP and JPEG) while supporting 10-bit/12-bit color, HDR, and alpha channel transparency.",
    isMultiSelect: false
  },
  {
    id: "perf-5",
    question: "In browser rendering mechanics, what is the sequence of the Critical Rendering Path?",
    options: [
      "DOM Tree Construction -> CSSOM Construction -> Render Tree -> Layout (Reflow) -> Paint -> Composite",
      "Render Tree -> DOM -> Layout -> CSSOM -> Paint",
      "CSSOM -> DOM -> Composite -> Paint -> Layout",
      "Layout -> Paint -> DOM -> CSSOM -> Composite"
    ],
    answer: [0],
    category: "Browser Internals & Rendering",
    explanation: "The browser parses HTML to construct the DOM, parses CSS to construct the CSSOM, combines them into the Render Tree, computes geometric coordinates in Layout, rasterizes pixels in Paint, and layers them in Composite.",
    isMultiSelect: false
  }
]

export const webPerfCategories = Array.from(
  new Set(webPerfQuestions.map((q) => q.category))
)
