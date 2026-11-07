export interface TestCase {
  id: string
  name: string
  inputCode: string
  expectedDescription: string
  testFn: (resultOrFn: any) => boolean | Promise<boolean>
}

export interface CodingChallenge {
  id: string
  title: string
  category: "Algorithms" | "JavaScript Polyfills" | "Async & Promises" | "Data Structures"
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  initialCode: string
  solutionCode: string
  testRunnerScript: string
}

export const PLAYGROUND_PRESETS: CodingChallenge[] = [
  {
    id: "two-sum",
    title: "Two Sum (Map Lookup)",
    category: "Algorithms",
    difficulty: "Easy",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

Each input will have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    initialCode: `function twoSum(nums, target) {
  // Return [index1, index2] such that nums[index1] + nums[index2] === target
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Try running your code:
console.log("Example 1:", twoSum([2, 7, 11, 15], 9));
console.log("Example 2:", twoSum([3, 2, 4], 6));
`,
    solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    testRunnerScript: `
(function() {
  const tests = [
    {
      name: "Simple pair: [2, 7, 11, 15], target 9",
      run: () => {
        const res = twoSum([2, 7, 11, 15], 9);
        return Array.isArray(res) && res.includes(0) && res.includes(1);
      }
    },
    {
      name: "Non-zero indices: [3, 2, 4], target 6",
      run: () => {
        const res = twoSum([3, 2, 4], 6);
        return Array.isArray(res) && res.includes(1) && res.includes(2);
      }
    },
    {
      name: "Identical elements: [3, 3], target 6",
      run: () => {
        const res = twoSum([3, 3], 6);
        return Array.isArray(res) && res.includes(0) && res.includes(1);
      }
    },
    {
      name: "Negative numbers: [-1, -2, -3, -4, -5], target -8",
      run: () => {
        const res = twoSum([-1, -2, -3, -4, -5], -8);
        return Array.isArray(res) && res.includes(2) && res.includes(4);
      }
    }
  ];
  return tests.map(t => ({ name: t.name, passed: Boolean(t.run()) }));
})()
`,
  },
  {
    id: "debounce-polyfill",
    title: "Implement Custom Debounce",
    category: "JavaScript Polyfills",
    difficulty: "Medium",
    description: `Implement a \`debounce\` function that delays invoking \`fn\` until after \`delay\` milliseconds have elapsed since the last time the debounced function was invoked.
Must support passing arguments and preserving the \`this\` context.`,
    initialCode: `function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// Test invocation:
const logMessage = debounce((msg) => console.log("Debounced:", msg), 150);
logMessage("Call 1");
logMessage("Call 2");
logMessage("Call 3 (only this should log after delay)");
`,
    solutionCode: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
    testRunnerScript: `
(async function() {
  const results = [];
  
  // Test 1: Only call once after burst
  let callCount = 0;
  let lastArg = null;
  const debounced = debounce((val) => {
    callCount++;
    lastArg = val;
  }, 50);

  debounced("a");
  debounced("b");
  debounced("c");
  
  await new Promise(r => setTimeout(r, 80));
  results.push({
    name: "Coalesces multiple rapid calls into a single invocation",
    passed: callCount === 1 && lastArg === "c"
  });

  // Test 2: Multiple bursts separated by delay
  debounced("d");
  await new Promise(r => setTimeout(r, 80));
  results.push({
    name: "Executes again on subsequent call after cooldown",
    passed: callCount === 2 && lastArg === "d"
  });

  return results;
})()
`,
  },
  {
    id: "deep-clone",
    title: "Deep Clone (with Nested Objects & Arrays)",
    category: "JavaScript Polyfills",
    difficulty: "Medium",
    description: `Write a robust \`deepClone(obj)\` function that creates an independent deep copy of an object, preserving arrays, nested objects, dates, and circular references.`,
    initialCode: `function deepClone(value, map = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (map.has(value)) return map.get(value);

  const clone = Array.isArray(value) ? [] : {};
  map.set(value, clone);

  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key], map);
  }

  return clone;
}

const original = { a: 1, b: { c: [2, 3] }, d: new Date("2026-01-01") };
const copy = deepClone(original);
copy.b.c.push(99);
console.log("Original untouched c length:", original.b.c.length); // 2
console.log("Copy mutated c length:", copy.b.c.length); // 3
`,
    solutionCode: `function deepClone(value, map = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);
  if (map.has(value)) return map.get(value);

  const copy = Array.isArray(value) ? [] : {};
  map.set(value, copy);

  for (const [key, val] of Object.entries(value)) {
    copy[key] = deepClone(val, map);
  }
  return copy;
}`,
    testRunnerScript: `
(function() {
  const tests = [];

  // Test 1: Nested object mutation immunity
  const obj1 = { user: { profile: { name: "Alice", tags: ["dev", "lead"] } } };
  const cloned1 = deepClone(obj1);
  cloned1.user.profile.name = "Bob";
  cloned1.user.profile.tags.push("architect");

  tests.push({
    name: "Modifications to cloned object do not mutate original",
    passed: obj1.user.profile.name === "Alice" && obj1.user.profile.tags.length === 2
  });

  // Test 2: Preserves Date objects
  const dateObj = { created: new Date(1700000000000) };
  const clonedDate = deepClone(dateObj);
  tests.push({
    name: "Preserves Date instances as actual Date objects",
    passed: clonedDate.created instanceof Date && clonedDate.created.getTime() === 1700000000000
  });

  // Test 3: Circular references
  const circular = { id: 1 };
  circular.self = circular;
  let circularPassed = false;
  try {
    const clonedCircular = deepClone(circular);
    circularPassed = clonedCircular !== circular && clonedCircular.self === clonedCircular;
  } catch (e) {
    circularPassed = false;
  }
  tests.push({
    name: "Handles circular references without infinite call stack",
    passed: circularPassed
  });

  return tests;
})()
`,
  },
  {
    id: "promise-all",
    title: "Promise.all Polyfill",
    category: "Async & Promises",
    difficulty: "Hard",
    description: `Implement \`myPromiseAll(iterable)\` that takes an array of promises (or values) and returns a single Promise resolving to an array of all resolved values in their original input order.
If any promise rejects, the returned promise must reject immediately with that rejection reason.`,
    initialCode: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }
    const results = [];
    let completed = 0;
    const total = promises.length;

    if (total === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((val) => {
          results[index] = val;
          completed++;
          if (completed === total) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}

// Test invocation:
myPromiseAll([
  Promise.resolve(10),
  new Promise((r) => setTimeout(() => r(20), 50)),
  30
]).then(res => console.log("Promise.all resolved in order:", res));
`,
    solutionCode: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) return reject(new TypeError('Must be array'));
    if (promises.length === 0) return resolve([]);
    const results = [];
    let completed = 0;
    promises.forEach((p, idx) => {
      Promise.resolve(p)
        .then(val => {
          results[idx] = val;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);
    });
  });
}`,
    testRunnerScript: `
(async function() {
  const tests = [];

  // Test 1: Resolves values in original index order regardless of timing
  const p1 = new Promise(r => setTimeout(() => r("slow"), 40));
  const p2 = new Promise(r => setTimeout(() => r("fast"), 10));
  const res1 = await myPromiseAll([p1, p2, "instant"]);
  tests.push({
    name: "Preserves original array order irrespective of asynchronous completion timing",
    passed: res1[0] === "slow" && res1[1] === "fast" && res1[2] === "instant"
  });

  // Test 2: Empty array immediately resolves
  const resEmpty = await myPromiseAll([]);
  tests.push({
    name: "Immediately resolves empty array to empty array",
    passed: Array.isArray(resEmpty) && resEmpty.length === 0
  });

  // Test 3: Fast rejection
  let rejected = false;
  try {
    await myPromiseAll([
      new Promise(r => setTimeout(() => r(1), 100)),
      Promise.reject(new Error("Boom")),
    ]);
  } catch (err) {
    rejected = err.message === "Boom";
  }
  tests.push({
    name: "Rejects immediately upon first rejection without waiting for other promises",
    passed: rejected
  });

  return tests;
})()
`,
  },
  {
    id: "event-emitter",
    title: "Custom Event Emitter",
    category: "Data Structures",
    difficulty: "Medium",
    description: `Implement an \`EventEmitter\` class with \`on(event, listener)\`, \`emit(event, ...args)\`, and \`off(event, listener)\` methods.
Support multiple listeners for the same event and clean unsubscription.`,
    initialCode: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    const listeners = [...this.events.get(event)];
    for (const listener of listeners) {
      listener(...args);
    }
    return true;
  }

  off(event, listener) {
    if (!this.events.has(event)) return;
    const filtered = this.events.get(event).filter(l => l !== listener);
    if (filtered.length === 0) {
      this.events.delete(event);
    } else {
      this.events.set(event, filtered);
    }
  }
}

const ee = new EventEmitter();
const unsub = ee.on("greet", (name) => console.log(\`Hello \${name}!\`));
ee.emit("greet", "World");
unsub();
console.log("Emitting after unsub (should be silent):", ee.emit("greet", "Again"));
`,
    solutionCode: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(event, fn) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(fn);
    return () => this.off(event, fn);
  }
  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    this.events.get(event).forEach(fn => fn(...args));
    return true;
  }
  off(event, fn) {
    if (!this.events.has(event)) return;
    const list = this.events.get(event).filter(f => f !== fn);
    list.length ? this.events.set(event, list) : this.events.delete(event);
  }
}`,
    testRunnerScript: `
(function() {
  const tests = [];
  const emitter = new EventEmitter();

  // Test 1: Dispatches to listeners with correct arguments
  let receivedArgs = null;
  emitter.on("data", (a, b) => { receivedArgs = [a, b]; });
  emitter.emit("data", "hello", 42);
  tests.push({
    name: "Emits event and passes all arguments to registered listener",
    passed: receivedArgs !== null && receivedArgs[0] === "hello" && receivedArgs[1] === 42
  });

  // Test 2: Unsubscription
  let count = 0;
  const inc = () => count++;
  const unsubscribe = emitter.on("click", inc);
  emitter.emit("click");
  unsubscribe();
  emitter.emit("click");
  tests.push({
    name: "Returned unsubscribe function cleanly removes listener",
    passed: count === 1
  });

  return tests;
})()
`,
  },
]
