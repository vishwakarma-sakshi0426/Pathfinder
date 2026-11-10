export interface RoadmapMapping {
  id: string;
  title: string;
  url: string;
  description: string;
  highlights: string[];
  estimatedWeeks?: string;
  phrases: string[];
  keywords: string[];
  priority?: number;
}

export const ROADMAP_MAPPINGS: Record<string, RoadmapMapping> = {
  dsa: {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    url: 'https://roadmap.sh/datastructures-and-algorithms',
    description: 'Master essential data structures, algorithmic complexity, pattern problem-solving, and competitive coding for software engineering placements.',
    highlights: [
      'Asymptotic Analysis & Big O Notation',
      'Arrays, Strings, Hash Maps & Two Pointers',
      'Linked Lists, Stacks & Queues',
      'Trees, Binary Search Trees & Heaps',
      'Graph Algorithms (BFS, DFS, Dijkstra)',
      'Dynamic Programming, Recursion & Backtracking',
      'Coding Interview Patterns (Sliding Window, etc.)'
    ],
    estimatedWeeks: '12 - 16 weeks',
    priority: 10,
    phrases: [
      'dsa',
      'data structures',
      'algorithms',
      'data structures and algorithms',
      'data structures & algorithms',
      'datastructures',
      'coding interview preparation',
      'coding interview prep',
      'coding for placements',
      'placement preparation',
      'software engineering placements',
      'interview preparation',
      'competitive programming',
      'competitive programming basics',
      'problem solving',
      'leetcode',
      'learn dsa',
      'master dsa'
    ],
    keywords: [
      'dsa',
      'algorithms',
      'placements',
      'leetcode',
      'hackerrank',
      'recursion',
      'dp',
      'trees',
      'graphs'
    ]
  },
  frontend: {
    id: 'frontend',
    title: 'Frontend Developer',
    url: 'https://roadmap.sh/frontend',
    description: 'Step-by-step roadmap to modern frontend development, UI architecture, semantic web, and modern browser standards.',
    highlights: [
      'Semantic HTML5, CSS3, Modern Layouts (Flexbox/Grid)',
      'JavaScript fundamentals, ES6+, DOM manipulation',
      'Package Managers (npm, pnpm) and Build Tools (Vite)',
      'Modern UI Frameworks & Component Architecture',
      'Web Performance Optimization, Core Web Vitals',
      'Accessibility (a11y) & Cross-Browser Compatibility'
    ],
    estimatedWeeks: '16 - 20 weeks',
    priority: 5,
    phrases: [
      'frontend developer',
      'frontend development',
      'front end developer',
      'front end development',
      'front-end developer',
      'web ui development',
      'web ui',
      'client side development',
      'become a frontend developer',
      'learn frontend'
    ],
    keywords: [
      'frontend',
      'front-end',
      'css',
      'html'
    ]
  },
  backend: {
    id: 'backend',
    title: 'Backend Developer',
    url: 'https://roadmap.sh/backend',
    description: 'Master backend engineering, scalable server architectures, database management, authentication, and REST/GraphQL APIs.',
    highlights: [
      'Backend Programming Languages & Runtimes',
      'Relational & NoSQL Database Architecture',
      'RESTful APIs, GraphQL & WebSockets',
      'Authentication, Authorization, JWT & OAuth',
      'Caching (Redis), Message Queues (Kafka/RabbitMQ)',
      'Server Deployment, Testing & CI/CD Pipelines'
    ],
    estimatedWeeks: '16 - 20 weeks',
    priority: 5,
    phrases: [
      'backend developer',
      'backend development',
      'back end developer',
      'back end development',
      'back-end developer',
      'server side development',
      'server side',
      'become a backend developer',
      'learn backend',
      'api development'
    ],
    keywords: [
      'backend',
      'back-end',
      'apis',
      'databases',
      'server'
    ]
  },
  react: {
    id: 'react',
    title: 'React',
    url: 'https://roadmap.sh/react',
    description: 'Learn modern React ecosystem: functional components, custom hooks, state management, routing, SSR, and production performance.',
    highlights: [
      'JSX, Components, Props & State',
      'Hooks (useState, useEffect, useMemo, useCallback)',
      'State Management (Zustand, Redux Toolkit, Context)',
      'Routing (React Router) & Data Fetching (TanStack Query)',
      'Fullstack React Frameworks (Next.js, Remix)',
      'Component Testing & Performance Optimization'
    ],
    estimatedWeeks: '8 - 12 weeks',
    priority: 8,
    phrases: [
      'learn react',
      'react developer',
      'react development',
      'react js',
      'react.js',
      'reactjs',
      'next.js',
      'nextjs',
      'master react'
    ],
    keywords: [
      'react',
      'reactjs',
      'nextjs',
      'jsx'
    ]
  },
  javascript: {
    id: 'javascript',
    title: 'JavaScript',
    url: 'https://roadmap.sh/javascript',
    description: 'Master JavaScript from basic syntax and async programming to memory management, closures, prototypes, and modern ECMAScript features.',
    highlights: [
      'Data Types, Scopes, Closures & Hoisting',
      'Prototypes & Object-Oriented JavaScript',
      'Asynchronous JS: Promises, Async/Await & Event Loop',
      'DOM Manipulation & Event Handling',
      'Modules, ESNext Features & Functional Patterns',
      'Debugging, Browser DevTools & Performance'
    ],
    estimatedWeeks: '8 - 12 weeks',
    priority: 7,
    phrases: [
      'master javascript',
      'learn javascript',
      'javascript developer',
      'vanilla javascript',
      'vanilla js',
      'javascript programming',
      'ecmascript'
    ],
    keywords: [
      'javascript',
      'js',
      'ecmascript'
    ]
  },
  python: {
    id: 'python',
    title: 'Python',
    url: 'https://roadmap.sh/python',
    description: 'Complete path to Python: control flow, OOP, package ecosystem, data handling, and backend web frameworks.',
    highlights: [
      'Python Syntax, Data Structures & Comprehensions',
      'Object-Oriented Programming & Magic Methods',
      'Virtual Environments & Package Management (pip, poetry)',
      'File Handling, Concurrency & Asyncio',
      'Frameworks: FastAPI, Django & Flask',
      'Testing with pytest & Python Best Practices'
    ],
    estimatedWeeks: '8 - 12 weeks',
    priority: 7,
    phrases: [
      'learn python',
      'python developer',
      'python programming',
      'master python',
      'python backend',
      'fastapi',
      'django'
    ],
    keywords: [
      'python',
      'django',
      'fastapi',
      'flask'
    ]
  },
  cpp: {
    id: 'cpp',
    title: 'C++',
    url: 'https://roadmap.sh/cpp',
    description: 'Learn modern C++, memory pointers, Standard Template Library (STL), object-oriented design, templates, and high-performance computing.',
    highlights: [
      'C++ Basics, References & Pointers',
      'Memory Management (Stack vs Heap, Smart Pointers)',
      'Object-Oriented Programming & Polymorphism',
      'Standard Template Library (STL Containers & Algorithms)',
      'Templates & Generic Programming',
      'Modern C++ Standards (C++17, C++20)'
    ],
    estimatedWeeks: '10 - 14 weeks',
    priority: 7,
    phrases: [
      'learn c++',
      'learn cpp',
      'c++ developer',
      'cpp developer',
      'c plus plus',
      'master c++',
      'c++ programming'
    ],
    keywords: [
      'c++',
      'cpp',
      'stl'
    ]
  },
  java: {
    id: 'java',
    title: 'Java',
    url: 'https://roadmap.sh/java',
    description: 'Comprehensive guide to Java, object-oriented principles, JVM internals, Spring Boot, multithreading, and microservices.',
    highlights: [
      'Core Java Syntax & OOP Principles',
      'Collections Framework & Generics',
      'Concurrency, Multithreading & Virtual Threads',
      'JVM Architecture, Memory & Garbage Collection',
      'Spring Framework & Spring Boot',
      'Hibernate / JPA & Enterprise Architecture'
    ],
    estimatedWeeks: '12 - 16 weeks',
    priority: 7,
    phrases: [
      'learn java',
      'java developer',
      'java programming',
      'spring boot',
      'master java',
      'java backend'
    ],
    keywords: [
      'java',
      'springboot',
      'spring'
    ]
  },
  devops: {
    id: 'devops',
    title: 'DevOps Engineer',
    url: 'https://roadmap.sh/devops',
    description: 'Roadmap to DevOps practices, cloud infrastructure, containerization, CI/CD pipelines, and site reliability engineering.',
    highlights: [
      'Linux Administration, Shell Scripting & Networking',
      'Git Version Control & Branching Strategies',
      'Containers (Docker) & Container Orchestration (Kubernetes)',
      'CI/CD Workflows (GitHub Actions, GitLab CI, Jenkins)',
      'Infrastructure as Code (Terraform, Ansible)',
      'Monitoring, Observability & Site Reliability (Prometheus, Grafana)'
    ],
    estimatedWeeks: '16 - 22 weeks',
    priority: 8,
    phrases: [
      'devops engineer',
      'devops',
      'dev ops',
      'become a devops engineer',
      'ci/cd',
      'cicd',
      'site reliability engineer',
      'sre',
      'infrastructure as code'
    ],
    keywords: [
      'devops',
      'cicd',
      'terraform',
      'ansible',
      'sre'
    ]
  },
  cybersecurity: {
    id: 'cybersecurity',
    title: 'Cyber Security',
    url: 'https://roadmap.sh/cyber-security',
    description: 'Step-by-step roadmap to cybersecurity fundamentals, network protocols, penetration testing, threat hunting, and defense strategies.',
    highlights: [
      'Networking Fundamentals & Protocols (TCP/IP, DNS, SSL)',
      'Operating Systems Hardening (Linux & Windows)',
      'Cryptography & Public Key Infrastructure',
      'Web Application Security (OWASP Top 10)',
      'Penetration Testing, Ethical Hacking & Kali Linux',
      'Security Operations, Incident Response & Compliance'
    ],
    estimatedWeeks: '16 - 24 weeks',
    priority: 8,
    phrases: [
      'cyber security',
      'cybersecurity',
      'learn cybersecurity',
      'learn cyber security',
      'ethical hacking',
      'penetration testing',
      'pen testing',
      'infosec',
      'information security'
    ],
    keywords: [
      'cybersecurity',
      'security',
      'hacking',
      'infosec',
      'owasp'
    ]
  },
  machinelearning: {
    id: 'machinelearning',
    title: 'Machine Learning',
    url: 'https://roadmap.sh/machine-learning',
    description: 'Guide to machine learning algorithms, statistical modeling, feature engineering, neural networks, and model deployment.',
    highlights: [
      'Linear Algebra, Calculus & Statistics for ML',
      'Data Manipulation (NumPy, Pandas, Matplotlib)',
      'Supervised & Unsupervised Learning (Scikit-Learn)',
      'Deep Learning & Neural Networks (PyTorch, TensorFlow)',
      'Model Evaluation, Hyperparameter Tuning & Validation',
      'MLOps: Model Tracking, Serving & Production Deployment'
    ],
    estimatedWeeks: '16 - 24 weeks',
    priority: 8,
    phrases: [
      'machine learning',
      'learn machine learning',
      'machine learning engineer',
      'ml engineer',
      'deep learning',
      'data science',
      'neural networks',
      'scikit learn'
    ],
    keywords: [
      'machine learning',
      'ml',
      'pytorch',
      'tensorflow',
      'scikit'
    ]
  },
  aiengineer: {
    id: 'aiengineer',
    title: 'AI Engineer',
    url: 'https://roadmap.sh/ai-engineer',
    description: 'Modern guide for AI engineers building with Large Language Models, prompt engineering, RAG systems, vector embeddings, and autonomous agents.',
    highlights: [
      'Foundations of LLMs, Tokens & Transformers',
      'Prompt Engineering & Structured Outputs',
      'Embeddings & Vector Databases (Pinecone, Chroma, pgvector)',
      'Retrieval-Augmented Generation (RAG) Architecture',
      'Agent Frameworks (LangChain, LlamaIndex, LangGraph)',
      'Evaluation, Guardrails & Production Fine-tuning'
    ],
    estimatedWeeks: '12 - 18 weeks',
    priority: 9,
    phrases: [
      'ai engineer',
      'become an ai engineer',
      'artificial intelligence engineer',
      'generative ai',
      'gen ai',
      'genai',
      'prompt engineering',
      'llm engineer',
      'llms',
      'rag',
      'langchain'
    ],
    keywords: [
      'ai engineer',
      'generative ai',
      'genai',
      'llm',
      'langchain',
      'rag'
    ]
  },
  systemdesign: {
    id: 'systemdesign',
    title: 'System Design',
    url: 'https://roadmap.sh/system-design',
    description: 'Learn distributed systems architecture, scalability trade-offs, caching, message queues, and high-availability patterns for tech interviews.',
    highlights: [
      'Scalability: Horizontal vs Vertical, Latency vs Throughput',
      'Load Balancers & Reverse Proxies (Nginx, HAProxy)',
      'Caching Strategies (Redis, Memcached, CDN)',
      'Database Sharding, Replication & CAP Theorem',
      'Message Queues & Asynchronous Processing (Kafka)',
      'Real-world Case Studies (Designing Twitter, URL Shortener, Uber)'
    ],
    estimatedWeeks: '8 - 12 weeks',
    priority: 8,
    phrases: [
      'system design',
      'learn system design',
      'distributed systems',
      'high level design',
      'low level design',
      'hld',
      'lld',
      'system architecture',
      'scalability and system design'
    ],
    keywords: [
      'system design',
      'distributed systems',
      'scalability',
      'hld',
      'lld'
    ]
  },
  fullstack: {
    id: 'fullstack',
    title: 'Full Stack Developer',
    url: 'https://roadmap.sh/full-stack',
    description: 'Comprehensive pathway covering end-to-end web engineering, connecting responsive client interfaces with secure, scalable backend services.',
    highlights: [
      'Frontend Fundamentals (HTML, CSS, Modern JS)',
      'Backend APIs & Server Runtimes (Node/Express, Python)',
      'Database Schema Design & Querying (SQL & NoSQL)',
      'User Authentication & State Synchronization',
      'DevOps Essentials, Docker & Cloud Deployment'
    ],
    estimatedWeeks: '20 - 26 weeks',
    priority: 5,
    phrases: [
      'full stack',
      'fullstack',
      'full-stack',
      'full stack developer',
      'mern stack',
      'mean stack'
    ],
    keywords: [
      'fullstack',
      'full-stack',
      'mern'
    ]
  },
  android: {
    id: 'android',
    title: 'Android Developer',
    url: 'https://roadmap.sh/android',
    description: 'Build native mobile apps for Android using modern Kotlin, Jetpack Compose, MVVM architecture, and Google Play guidelines.',
    highlights: [
      'Kotlin Basics & Coroutines',
      'Jetpack Compose Declarative UI',
      'Architecture Components & Dependency Injection (Hilt)',
      'Room Database & Network Requests (Retrofit)',
      'App Publishing & Play Store Guidelines'
    ],
    estimatedWeeks: '14 - 18 weeks',
    priority: 7,
    phrases: [
      'android developer',
      'android development',
      'learn android',
      'kotlin android',
      'jetpack compose'
    ],
    keywords: [
      'android',
      'kotlin'
    ]
  },
  ios: {
    id: 'ios',
    title: 'iOS Developer',
    url: 'https://roadmap.sh/ios',
    description: 'Build native iOS apps using Swift, SwiftUI, Combine, Apple HIG design principles, and Xcode tooling.',
    highlights: [
      'Swift Language Fundamentals & Memory Safety',
      'SwiftUI Declarative Interface Design',
      'State Management & Concurrency with async/await',
      'CoreData / SwiftData & Networking',
      'App Store Optimization & TestFlight CI'
    ],
    estimatedWeeks: '14 - 18 weeks',
    priority: 7,
    phrases: [
      'ios developer',
      'ios development',
      'learn ios',
      'swift developer',
      'swiftui'
    ],
    keywords: [
      'ios',
      'swift',
      'swiftui'
    ]
  },
  docker: {
    id: 'docker',
    title: 'Docker',
    url: 'https://roadmap.sh/docker',
    description: 'Master containerization: Dockerfiles, multi-stage builds, networking, Docker Compose, and image security.',
    highlights: [
      'Containerization Concepts & Linux Namespaces',
      'Writing Optimized Dockerfiles & Multi-Stage Builds',
      'Docker Compose Multi-Container Orchestration',
      'Container Networking, Volumes & Storage',
      'Docker Security & Registry Management'
    ],
    estimatedWeeks: '4 - 6 weeks',
    priority: 7,
    phrases: [
      'learn docker',
      'docker containers',
      'containerization with docker',
      'docker'
    ],
    keywords: [
      'docker',
      'containerization'
    ]
  },
  kubernetes: {
    id: 'kubernetes',
    title: 'Kubernetes',
    url: 'https://roadmap.sh/kubernetes',
    description: 'Production container orchestration: pods, deployments, services, ingresses, Helm charts, and cluster management.',
    highlights: [
      'Kubernetes Architecture (Control Plane & Worker Nodes)',
      'Pods, Deployments, ReplicaSets & StatefulSets',
      'Services, Ingress Controllers & Network Policies',
      'ConfigMaps, Secrets & Persistent Volumes',
      'Helm Package Manager & GitOps (ArgoCD)'
    ],
    estimatedWeeks: '8 - 12 weeks',
    priority: 7,
    phrases: [
      'learn kubernetes',
      'kubernetes cluster',
      'k8s',
      'container orchestration'
    ],
    keywords: [
      'kubernetes',
      'k8s'
    ]
  }
};

/**
 * Intelligent Roadmap Detection
 * Normalizes user profession, goals, and skills to detect if a matching roadmap.sh exists.
 */
export function detectRoadmap(
  profession: string,
  goal: string,
  skills: string[] = []
): RoadmapMapping | null {
  const combinedText = [
    profession,
    goal,
    skills.join(' ')
  ].join(' ').toLowerCase();

  // Clean and normalize text
  const normalized = combinedText
    .replace(/[^\w\s+#.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return null;

  let bestMatch: RoadmapMapping | null = null;
  let highestScore = 0;

  for (const mapping of Object.values(ROADMAP_MAPPINGS)) {
    let score = 0;

    // Check multi-word phrase exact matches
    for (const phrase of mapping.phrases) {
      const p = phrase.toLowerCase();
      if (normalized.includes(p)) {
        // Multi-word phrase matches carry high confidence
        const wordCount = p.split(/\s+/).length;
        score += wordCount >= 2 ? 35 : 20;
      }
    }

    // Check individual keywords
    for (const keyword of mapping.keywords) {
      const kw = keyword.toLowerCase();
      // Whole word regex match
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');
      if (regex.test(normalized)) {
        score += 15;
      }
    }

    // Additional priority weighting
    if (score > 0 && mapping.priority) {
      score += mapping.priority;
    }

    // Specific intent combinations
    if (mapping.id === 'dsa') {
      const hasDsaKeywords = /(dsa|data\s*structure|algorithm|leetcode|placement|problem\s*solving|coding\s*interview)/i.test(normalized);
      if (hasDsaKeywords) {
        score += 25;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = mapping;
    }
  }

  // Minimum threshold to prevent false positives on unknown inputs (e.g. "painting", "dentistry")
  const MIN_MATCH_THRESHOLD = 20;

  if (highestScore >= MIN_MATCH_THRESHOLD) {
    return bestMatch;
  }

  return null;
}
