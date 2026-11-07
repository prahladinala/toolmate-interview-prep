import { JutroQuestion } from "../jutroQuizData"

export const systemDesignQuestions: JutroQuestion[] = [
  {
    id: "sd-1",
    question: "According to the CAP theorem, during a network partition (P) in a distributed database, what tradeoff must the system make?",
    options: [
      "Choose between Consistency (C) and Availability (A)",
      "Choose between Scalability and Durability",
      "Choose between Latency and Security",
      "Network partitions can always be eliminated with redundant fibers"
    ],
    answer: [0],
    category: "Distributed Systems & Consistency",
    explanation: "Because physical network partitions are unavoidable in distributed environments, a system can either ensure all nodes return identical data (Consistency) or ensure every non-failing node responds (Availability), but not both simultaneously during a partition.",
    isMultiSelect: false
  },
  {
    id: "sd-2",
    question: "Which caching eviction policy removes the item that has not been accessed for the longest duration?",
    options: [
      "LRU (Least Recently Used)",
      "LFU (Least Frequently Used)",
      "FIFO (First-In, First-Out)",
      "Random Eviction"
    ],
    answer: [0],
    category: "Caching & Data Eviction",
    explanation: "LRU evicts the item that has gone the longest without being accessed, commonly implemented via a Hash Map combined with a Doubly Linked List in O(1) time.",
    isMultiSelect: false
  },
  {
    id: "sd-3",
    question: "When designing high-throughput database sharding, what is the primary purpose of 'Consistent Hashing'?",
    options: [
      "Minimizing data reorganization and key re-mapping when adding or removing database nodes",
      "Encrypting primary keys with SHA-256",
      "Ensuring ACID transactions across multiple partitions",
      "Enforcing foreign key constraints across shards"
    ],
    answer: [0],
    category: "Partitioning & Sharding",
    explanation: "Consistent Hashing maps both data keys and servers to a virtual ring. When a server is added or removed, only k/n keys need to be remapped on average, avoiding catastrophic cluster-wide reshuffling.",
    isMultiSelect: false
  },
  {
    id: "sd-4",
    question: "In microservices architecture, which pattern is recommended to maintain eventual data consistency across multiple distributed service databases without distributed 2-Phase Commit (2PC) locks?",
    options: [
      "Saga Pattern (Choreography or Orchestration)",
      "Singleton Pattern",
      "Shared Database Anti-Pattern",
      "Heavy Read Lock Pattern"
    ],
    answer: [0],
    category: "Microservices & Transactions",
    explanation: "The Saga pattern coordinates a sequence of local transactions across microservices, where each transaction publishes an event and subsequent services execute next steps or compensating transactions on failure.",
    isMultiSelect: false
  },
  {
    id: "sd-5",
    question: "Which of the following techniques effectively mitigate the 'Cache Stampede' (Thundering Herd) problem when a hot key expires? (Select two)",
    options: [
      "Probabilistic early expiration (XFetch algorithm)",
      "Mutex / Distributed lock on cache miss before hitting the database",
      "Setting cache TTL to 0 seconds",
      "Disabling database indexes",
      "Increasing client HTTP timeout values"
    ],
    answer: [0, 1],
    category: "Caching & Data Eviction",
    explanation: "A distributed mutex ensures only one worker repopulates the expired cache entry while others wait. Probabilistic early expiration recomputes values in the background before the true TTL runs out.",
    isMultiSelect: true
  },
  {
    id: "sd-6",
    question: "What is the primary difference between a Forward Proxy and a Reverse Proxy?",
    options: [
      "A Forward Proxy acts on behalf of clients to access the internet; a Reverse Proxy acts on behalf of backend servers to intercept client requests",
      "A Forward Proxy handles SSL termination; a Reverse Proxy cannot",
      "A Reverse Proxy is only used in local networks",
      "A Forward Proxy is hardware-only"
    ],
    answer: [0],
    category: "Networking & Proxies",
    explanation: "Forward proxies mask and protect client identity when navigating out to the web (e.g. corporate VPNs). Reverse proxies (e.g. Nginx, Envoy) sit in front of backend servers to provide load balancing, SSL offload, and caching.",
    isMultiSelect: false
  }
]

export const systemDesignCategories = Array.from(
  new Set(systemDesignQuestions.map((q) => q.category))
)
