/**
 * Pathfinder Shared Career Progress Service
 * Connects Career Assessment, Roadmap Generation, Quizzes, Resume, and the Career Control Center.
 */

export interface CareerSkill {
  id: string;
  name: string;
  progress: number; // 0 - 100
  required: boolean;
  weight: number; // e.g., 25 for core, 15 for supporting
  category: 'core' | 'supporting' | 'tool';
}

export interface MissionTask {
  id: string;
  text: string;
  completed: boolean;
  impact: number; // +Career Readiness impact
  skillId?: string;
  type?: 'task' | 'quiz' | 'project';
}

export interface WeeklyMission {
  id: string;
  title: string;
  objective: string;
  rewardText: string;
  rewardImpact: number;
  progress: number;
  tasks: MissionTask[];
}

export interface ProofItem {
  id: string;
  title: string;
  type: 'Project' | 'Challenge' | 'Certification' | 'Milestone';
  timeAgo: string;
  timestamp: number;
  verified: boolean;
  detail?: string;
  skillTag?: string;
}

export interface NextBestMove {
  id: string;
  skillName: string;
  currentProgress: number;
  targetProgress: number;
  title: string;
  reason: string;
  recommendation: string;
  expectedImpact: number;
  actionText: string;
  route?: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  activeDaysThisWeek: number;
  totalDays: number;
  weeklyDays: boolean[]; // Mon - Sun
}

export interface CareerProgressState {
  targetCareer: string;
  skills: CareerSkill[];
  weeklyMission: WeeklyMission;
  proofOfProgress: ProofItem[];
  streak: StreakInfo;
  lastUpdated: string;
}

const STORAGE_KEY = 'pathfinder_user_career_progress';

// Default career role configurations
export const CAREER_ROLE_TEMPLATES: Record<string, { skills: CareerSkill[]; mission: WeeklyMission }> = {
  'Frontend Developer': {
    skills: [
      { id: 'html-css', name: 'HTML & CSS', progress: 92, required: true, weight: 20, category: 'core' },
      { id: 'javascript', name: 'JavaScript', progress: 78, required: true, weight: 25, category: 'core' },
      { id: 'react', name: 'React.js', progress: 61, required: true, weight: 25, category: 'core' },
      { id: 'git', name: 'Git & GitHub', progress: 85, required: true, weight: 15, category: 'tool' },
      { id: 'testing', name: 'Testing & QA', progress: 42, required: true, weight: 15, category: 'supporting' },
      { id: 'typescript', name: 'TypeScript', progress: 31, required: true, weight: 15, category: 'core' },
      { id: 'performance', name: 'Performance & SEO', progress: 38, required: true, weight: 10, category: 'supporting' },
    ],
    mission: {
      id: 'mission-frontend',
      title: 'Close the Testing & Component Gap',
      objective: 'Build confidence with automated tests and typed component architecture.',
      rewardText: '+8 Career Readiness',
      rewardImpact: 8,
      progress: 50,
      tasks: [
        { id: 'm-1', text: 'Complete React Component Testing Basics', completed: true, impact: 2, skillId: 'testing' },
        { id: 'm-2', text: 'Build a Tested Mini Dashboard with Vitest', completed: true, impact: 3, skillId: 'testing' },
        { id: 'm-3', text: 'Convert 3 JavaScript modules to TypeScript', completed: false, impact: 2, skillId: 'typescript' },
        { id: 'm-4', text: 'Audit web performance with Lighthouse (Goal: 90+)', completed: false, impact: 1, skillId: 'performance' },
      ],
    },
  },

  'Full Stack Developer': {
    skills: [
      { id: 'frontend', name: 'Frontend (React & Tailwind)', progress: 84, required: true, weight: 25, category: 'core' },
      { id: 'nodejs', name: 'Node.js & Express', progress: 72, required: true, weight: 25, category: 'core' },
      { id: 'database', name: 'SQL & Database Design', progress: 65, required: true, weight: 20, category: 'core' },
      { id: 'api-security', name: 'REST APIs & JWT Auth', progress: 58, required: true, weight: 15, category: 'core' },
      { id: 'devops-ci', name: 'Docker & CI/CD Pipelines', progress: 34, required: true, weight: 15, category: 'supporting' },
      { id: 'system-design', name: 'System Architecture', progress: 41, required: true, weight: 15, category: 'supporting' },
    ],
    mission: {
      id: 'mission-fullstack',
      title: 'Containerize and Deploy Full Stack Microservice',
      objective: 'Transition from localhost to production-ready deployed containers.',
      rewardText: '+9 Career Readiness',
      rewardImpact: 9,
      progress: 40,
      tasks: [
        { id: 'm-fs-1', text: 'Implement JWT refresh token authentication', completed: true, impact: 3, skillId: 'api-security' },
        { id: 'm-fs-2', text: 'Write Dockerfile for Node.js API backend', completed: true, impact: 3, skillId: 'devops-ci' },
        { id: 'm-fs-3', text: 'Deploy PostgreSQL database container', completed: false, impact: 2, skillId: 'database' },
        { id: 'm-fs-4', text: 'Set up GitHub Actions automated build pipeline', completed: false, impact: 1, skillId: 'devops-ci' },
      ],
    },
  },

  'Backend Developer': {
    skills: [
      { id: 'node-backend', name: 'Node.js & TypeScript', progress: 82, required: true, weight: 25, category: 'core' },
      { id: 'databases-sql', name: 'PostgreSQL & Database Indexing', progress: 75, required: true, weight: 25, category: 'core' },
      { id: 'api-arch', name: 'REST & GraphQL Architecture', progress: 68, required: true, weight: 20, category: 'core' },
      { id: 'caching-redis', name: 'Redis Caching & Queues', progress: 46, required: true, weight: 15, category: 'supporting' },
      { id: 'microservices', name: 'Microservices & Message Brokers', progress: 36, required: true, weight: 15, category: 'supporting' },
      { id: 'docker-deploy', name: 'Docker & Cloud Deployment', progress: 55, required: true, weight: 15, category: 'tool' },
    ],
    mission: {
      id: 'mission-backend',
      title: 'Master Caching & Scalable Data Layers',
      objective: 'Improve backend latency and build fault-tolerant APIs.',
      rewardText: '+7 Career Readiness',
      rewardImpact: 7,
      progress: 50,
      tasks: [
        { id: 'm-be-1', text: 'Implement Redis caching layer for heavy SQL queries', completed: true, impact: 2, skillId: 'caching-redis' },
        { id: 'm-be-2', text: 'Configure rate limiting and security headers', completed: true, impact: 2, skillId: 'api-arch' },
        { id: 'm-be-3', text: 'Build a background job queue with BullMQ', completed: false, impact: 2, skillId: 'caching-redis' },
        { id: 'm-be-4', text: 'Benchmark database indexing speedups', completed: false, impact: 1, skillId: 'databases-sql' },
      ],
    },
  },

  'Data Structures & Algorithms': {
    skills: [
      { id: 'arrays-strings', name: 'Arrays, Strings & Two Pointers', progress: 90, required: true, weight: 25, category: 'core' },
      { id: 'trees-graphs', name: 'Trees & Graph Traversal (BFS/DFS)', progress: 76, required: true, weight: 25, category: 'core' },
      { id: 'recursion-dp', name: 'Dynamic Programming & Recursion', progress: 45, required: true, weight: 25, category: 'core' },
      { id: 'stacks-heaps', name: 'Stacks, Queues & Priority Heaps', progress: 80, required: true, weight: 15, category: 'core' },
      { id: 'complexity', name: 'Time & Space Complexity (Big-O)', progress: 88, required: true, weight: 15, category: 'supporting' },
      { id: 'bit-manipulation', name: 'Bit Manipulation & Math', progress: 35, required: true, weight: 10, category: 'supporting' },
    ],
    mission: {
      id: 'mission-dsa',
      title: 'Conquer Dynamic Programming Patterns',
      objective: 'Master bottom-up and memoization tabular techniques.',
      rewardText: '+8 Career Readiness',
      rewardImpact: 8,
      progress: 25,
      tasks: [
        { id: 'm-dsa-1', text: 'Solve 1D Dynamic Programming (Climbing Stairs, Robber)', completed: true, impact: 2, skillId: 'recursion-dp' },
        { id: 'm-dsa-2', text: 'Solve 0/1 Knapsack & Subset Sum variation', completed: false, impact: 2, skillId: 'recursion-dp' },
        { id: 'm-dsa-3', text: 'Master Longest Common Subsequence pattern', completed: false, impact: 2, skillId: 'recursion-dp' },
        { id: 'm-dsa-4', text: 'Complete Mock Placement Technical Assessment', completed: false, impact: 2, skillId: 'complexity' },
      ],
    },
  },

  'AI & Machine Learning Engineer': {
    skills: [
      { id: 'python-data', name: 'Python, NumPy & Pandas', progress: 88, required: true, weight: 25, category: 'core' },
      { id: 'ml-algorithms', name: 'Supervised & Unsupervised ML', progress: 70, required: true, weight: 25, category: 'core' },
      { id: 'deep-learning', name: 'Deep Learning (PyTorch / TensorFlow)', progress: 48, required: true, weight: 25, category: 'core' },
      { id: 'llm-nlp', name: 'LLMs, Prompt Engineering & RAG', progress: 62, required: true, weight: 20, category: 'core' },
      { id: 'math-stats', name: 'Linear Algebra & Probability', progress: 65, required: true, weight: 15, category: 'supporting' },
      { id: 'mlops', name: 'Model Deployment & MLOps', progress: 32, required: true, weight: 15, category: 'tool' },
    ],
    mission: {
      id: 'mission-ai',
      title: 'Build End-to-End RAG Knowledge System',
      objective: 'Connect vector databases with Gemini/OpenAI embeddings for document QA.',
      rewardText: '+8 Career Readiness',
      rewardImpact: 8,
      progress: 30,
      tasks: [
        { id: 'm-ai-1', text: 'Index PDF text with semantic vector embeddings', completed: true, impact: 2, skillId: 'llm-nlp' },
        { id: 'm-ai-2', text: 'Implement Cosine Similarity chunk retrieval', completed: false, impact: 2, skillId: 'llm-nlp' },
        { id: 'm-ai-3', text: 'Evaluate model hallucinations with RAGAS', completed: false, impact: 2, skillId: 'mlops' },
        { id: 'm-ai-4', text: 'Deploy inference API using FastAPI on Docker', completed: false, impact: 2, skillId: 'mlops' },
      ],
    },
  },
};

export const INITIAL_DEFAULT_ROLE = 'Frontend Developer';

export const INITIAL_DEFAULT_PROOF: ProofItem[] = [
  {
    id: 'proof-1',
    title: 'Built React Responsive Portfolio',
    type: 'Project',
    timeAgo: '2 days ago',
    timestamp: Date.now() - 2 * 86400000,
    verified: true,
    detail: 'Modular architecture, Tailwind styling, and Lighthouse score 96.',
    skillTag: 'React.js',
  },
  {
    id: 'proof-2',
    title: 'Solved 50 Algorithm Challenges',
    type: 'Challenge',
    timeAgo: '1 week ago',
    timestamp: Date.now() - 7 * 86400000,
    verified: true,
    detail: 'Mastered arrays, two-pointers, hash tables, and binary search.',
    skillTag: 'JavaScript',
  },
  {
    id: 'proof-3',
    title: 'Meta Frontend Certified — Coursera',
    type: 'Certification',
    timeAgo: '2 weeks ago',
    timestamp: Date.now() - 14 * 86400000,
    verified: true,
    detail: 'Certified in semantic HTML, modern CSS, and component state.',
    skillTag: 'HTML & CSS',
  },
];

export const INITIAL_DEFAULT_STREAK: StreakInfo = {
  currentStreak: 12,
  longestStreak: 28,
  activeDaysThisWeek: 5,
  totalDays: 142,
  weeklyDays: [true, true, true, false, true, true, false],
};

/**
 * Calculates Career Readiness:
 * weighted average = sum(skill.progress * skill.weight) / sum(skill.weight)
 */
export function calculateCareerReadiness(skills: CareerSkill[]): number {
  if (!skills.length) return 0;
  const totalWeight = skills.reduce((acc, s) => acc + (s.weight || 10), 0);
  const weightedSum = skills.reduce((acc, s) => acc + (s.progress * (s.weight || 10)), 0);
  return Math.min(100, Math.round(weightedSum / totalWeight));
}

/**
 * Categorizes a skill score into qualitative status
 */
export function getSkillStatus(progress: number): 'Strong' | 'Good' | 'Developing' | 'Gap' {
  if (progress >= 90) return 'Strong';
  if (progress >= 70) return 'Good';
  if (progress >= 50) return 'Developing';
  return 'Gap';
}

/**
 * Detects the Next Best Move from current skill gaps
 */
export function computeNextBestMove(targetCareer: string, skills: CareerSkill[]): NextBestMove {
  // Find required skills below 50 (or lowest progress)
  const sortedByUrgency = [...skills].sort((a, b) => {
    // Priority: gaps below 50 first, then weighted importance
    const aIsGap = a.progress < 50 ? 1 : 0;
    const bIsGap = b.progress < 50 ? 1 : 0;
    if (aIsGap !== bIsGap) return bIsGap - aIsGap;
    return a.progress - b.progress;
  });

  const topGap = sortedByUrgency[0] || {
    id: 'core-skill',
    name: 'Core Skills',
    progress: 50,
    weight: 20,
  };

  const expectedImpact = Math.min(8, Math.max(4, Math.round((topGap.weight / 15) * 5)));

  return {
    id: `move-${topGap.id}`,
    skillName: topGap.name,
    currentProgress: topGap.progress,
    targetProgress: Math.min(100, topGap.progress + 25),
    title: `Improve ${topGap.name} Skills`,
    reason: `${topGap.name} is currently your biggest skill gap (${topGap.progress}%) for your ${targetCareer} goal.`,
    recommendation: `Complete ${topGap.name} Hands-on Practice & Assessment`,
    expectedImpact,
    actionText: 'Start Now →',
    route: '/quiz',
  };
}

/**
 * Reads any saved roadmaps from Pathfinder's existing localStorage
 */
function checkExternalRoadmapProfession(): string | null {
  try {
    const raw = localStorage.getItem('savedRoadmaps');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const latest = parsed[parsed.length - 1];
        if (latest && latest.profession) {
          return latest.profession.trim();
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Initializes or loads the shared career progress state
 */
export function getCareerProgress(): CareerProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        const targetCareer = parsed.targetCareer || INITIAL_DEFAULT_ROLE;
        const template = CAREER_ROLE_TEMPLATES[targetCareer] || CAREER_ROLE_TEMPLATES[INITIAL_DEFAULT_ROLE];
        return {
          targetCareer,
          skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : template.skills,
          weeklyMission: (parsed.weeklyMission && Array.isArray(parsed.weeklyMission.tasks)) ? parsed.weeklyMission : template.mission,
          proofOfProgress: Array.isArray(parsed.proofOfProgress) ? parsed.proofOfProgress : INITIAL_DEFAULT_PROOF,
          streak: (parsed.streak && Array.isArray(parsed.streak.weeklyDays)) ? parsed.streak : INITIAL_DEFAULT_STREAK,
          lastUpdated: parsed.lastUpdated || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('careerProgressService: could not read stored state', err);
  }

  // Check if a roadmap profession was saved earlier
  const externalProfession = checkExternalRoadmapProfession();
  const matchedRole = externalProfession && CAREER_ROLE_TEMPLATES[externalProfession]
    ? externalProfession
    : INITIAL_DEFAULT_ROLE;

  const roleConfig = CAREER_ROLE_TEMPLATES[matchedRole] || CAREER_ROLE_TEMPLATES[INITIAL_DEFAULT_ROLE];

  const initialState: CareerProgressState = {
    targetCareer: matchedRole,
    skills: roleConfig.skills,
    weeklyMission: roleConfig.mission,
    proofOfProgress: INITIAL_DEFAULT_PROOF,
    streak: INITIAL_DEFAULT_STREAK,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  } catch {
    // ignore
  }

  return initialState;
}

/**
 * Saves and broadcasts state changes
 */
export function saveCareerProgress(newState: CareerProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    // Dispatch custom event for real-time reactivity in the same or other tabs
    window.dispatchEvent(new CustomEvent('pathfinder-career-progress-updated', { detail: newState }));
  } catch (err) {
    console.warn('careerProgressService: failed to save state', err);
  }
}

/**
 * Synchronizes target career and skills from Roadmap generation
 */
export function syncFromRoadmap(professionName: string, rawSkills?: string[]): CareerProgressState {
  const current = getCareerProgress();
  const trimmed = professionName.trim();
  if (!trimmed) return current;

  // If we already have a curated template for this role, use or adapt it
  const template = CAREER_ROLE_TEMPLATES[trimmed];
  let newSkills: CareerSkill[];

  if (template) {
    newSkills = template.skills;
  } else if (rawSkills && rawSkills.length > 0) {
    // Convert extracted roadmap skills to CareerSkill objects
    newSkills = rawSkills.slice(0, 7).map((skillName, idx) => ({
      id: `custom-skill-${idx}`,
      name: skillName,
      progress: Math.floor(35 + Math.random() * 45), // realistic starting baseline
      required: true,
      weight: idx < 3 ? 25 : 15,
      category: idx < 3 ? 'core' : 'supporting',
    }));
  } else {
    newSkills = CAREER_ROLE_TEMPLATES[INITIAL_DEFAULT_ROLE].skills;
  }

  const updated: CareerProgressState = {
    ...current,
    targetCareer: trimmed,
    skills: newSkills,
    weeklyMission: template?.mission || {
      id: `mission-${Date.now()}`,
      title: `Advance in ${trimmed}`,
      objective: `Master core skills required for ${trimmed}.`,
      rewardText: '+8 Career Readiness',
      rewardImpact: 8,
      progress: 25,
      tasks: [
        { id: 'm-c-1', text: `Build ${trimmed} Portfolio Project`, completed: false, impact: 3, type: 'project' },
        { id: 'm-c-2', text: `Practice ${newSkills[0]?.name || 'Fundamentals'} Assessment`, completed: false, impact: 2, type: 'quiz' },
        { id: 'm-c-3', text: `Document Architecture Decisions`, completed: false, impact: 2, type: 'task' },
      ],
    },
    lastUpdated: new Date().toISOString(),
  };

  saveCareerProgress(updated);
  return updated;
}

/**
 * Switches user's target career role
 */
export function switchTargetCareer(roleName: string): CareerProgressState {
  const current = getCareerProgress();
  const template = CAREER_ROLE_TEMPLATES[roleName] || CAREER_ROLE_TEMPLATES[INITIAL_DEFAULT_ROLE];

  const updated: CareerProgressState = {
    ...current,
    targetCareer: roleName,
    skills: template.skills,
    weeklyMission: template.mission,
    lastUpdated: new Date().toISOString(),
  };

  saveCareerProgress(updated);
  return updated;
}

/**
 * Toggles a mission task completion
 */
export function toggleMissionTask(taskId: string): CareerProgressState {
  const current = getCareerProgress();
  const task = current.weeklyMission.tasks.find(t => t.id === taskId);
  if (!task) return current;

  const wasCompleted = task.completed;
  const nowCompleted = !wasCompleted;

  // Update task completion
  const updatedTasks = current.weeklyMission.tasks.map(t =>
    t.id === taskId ? { ...t, completed: nowCompleted } : t
  );

  // Recalculate mission progress
  const completedCount = updatedTasks.filter(t => t.completed).length;
  const missionProgress = Math.round((completedCount / updatedTasks.length) * 100);

  // Boost skill progress if a skill is attached
  let updatedSkills = [...current.skills];
  if (task.skillId) {
    const delta = nowCompleted ? 8 : -8;
    updatedSkills = updatedSkills.map(s => {
      if (s.id === task.skillId || s.name.toLowerCase().includes(task.skillId!.toLowerCase())) {
        return { ...s, progress: Math.min(100, Math.max(10, s.progress + delta)) };
      }
      return s;
    });
  }

  // If newly completed, record a proof milestone!
  let updatedProof = [...current.proofOfProgress];
  if (nowCompleted) {
    const newProof: ProofItem = {
      id: `proof-${Date.now()}`,
      title: `Completed: ${task.text}`,
      type: task.type === 'project' ? 'Project' : 'Challenge',
      timeAgo: 'Just now',
      timestamp: Date.now(),
      verified: true,
      detail: `Earned +${task.impact}% towards ${current.targetCareer} readiness.`,
    };
    updatedProof = [newProof, ...updatedProof.slice(0, 7)];
  }

  const updated: CareerProgressState = {
    ...current,
    skills: updatedSkills,
    weeklyMission: {
      ...current.weeklyMission,
      tasks: updatedTasks,
      progress: missionProgress,
    },
    proofOfProgress: updatedProof,
    lastUpdated: new Date().toISOString(),
  };

  saveCareerProgress(updated);
  return updated;
}

/**
 * Boosts a specific skill's progress (e.g. from Quiz or practice)
 */
export function boostSkill(skillIdentifier: string, boostAmount: number = 10): CareerProgressState {
  const current = getCareerProgress();
  const search = skillIdentifier.toLowerCase();

  const updatedSkills = current.skills.map(skill => {
    if (skill.id.toLowerCase() === search || skill.name.toLowerCase().includes(search)) {
      return {
        ...skill,
        progress: Math.min(100, skill.progress + boostAmount),
      };
    }
    return skill;
  });

  const updated: CareerProgressState = {
    ...current,
    skills: updatedSkills,
    lastUpdated: new Date().toISOString(),
  };

  saveCareerProgress(updated);
  return updated;
}

/**
 * Adds a new proof item (e.g., project built or challenge finished)
 */
export function addProofOfProgress(item: Omit<ProofItem, 'id' | 'timestamp'>): CareerProgressState {
  const current = getCareerProgress();
  const fullItem: ProofItem = {
    ...item,
    id: `proof-${Date.now()}`,
    timestamp: Date.now(),
  };

  const updated: CareerProgressState = {
    ...current,
    proofOfProgress: [fullItem, ...current.proofOfProgress],
    lastUpdated: new Date().toISOString(),
  };

  saveCareerProgress(updated);
  return updated;
}
