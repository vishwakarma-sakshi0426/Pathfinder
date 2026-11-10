import type { RawJobItem } from './serpBackendHandler';

export interface JobPreference {
  role: string;
  skills: string[];
  experience: 'Fresher' | '0–1 Years' | '1–3 Years' | '3–5 Years' | '5+ Years';
  workPreference: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';
  location: string;
  locationType: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  indiaOnly?: boolean;
  minSalary?: string;
  maxSalary?: string;
  company?: string;
}

export interface JobMatchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: string;
  salary?: string;
  postedAt?: string;
  skills: string[];
  matchPercentage: number;
  matchReasons: string[];
  skillsMatchedCount: number;
  skillsTotalCount: number;
  isFresherFriendly: boolean;
  applyUrl: string;
  applySource: string;
  isExactUrl: boolean;
  description: string;
  isRemote: boolean;
  locationScore: number;
}

export interface JobSearchResponse {
  success: boolean;
  source: 'serp_api' | 'verified_catalog';
  message?: string;
  total: number;
  jobs: JobMatchResult[];
}

/**
 * Geographic Clusters for Indian Tech Hubs
 */
interface IndianCluster {
  primary: string[];
  nearby: string[];
  stateHubs: string[];
  stateName: string;
}

const CLUSTERS: Record<string, IndianCluster> = {
  mumbai: {
    primary: ['mumbai', 'bombay'],
    nearby: ['navi mumbai', 'thane', 'kalyan', 'panvel', 'mira bhayandar', 'dombivli'],
    stateHubs: ['pune', 'nashik', 'nagpur', 'aurangabad', 'chhatrapati sambhajinagar'],
    stateName: 'maharashtra',
  },
  pune: {
    primary: ['pune', 'poona', 'hinjawadi', 'pimpri', 'chinchwad', 'magarpatta', 'hadapsar', 'kharadi'],
    nearby: ['mumbai', 'navi mumbai', 'thane'],
    stateHubs: ['nashik', 'nagpur', 'aurangabad'],
    stateName: 'maharashtra',
  },
  bangalore: {
    primary: ['bangalore', 'bengaluru', 'whitefield', 'electronic city', 'koramangala', 'indiranagar', 'bellandur', 'hsr', 'marathahalli', 'sarjapur'],
    nearby: ['mysore', 'mysuru', 'hosur'],
    stateHubs: ['hubli', 'mangalore', 'mangaluru', 'belgaum'],
    stateName: 'karnataka',
  },
  delhi: {
    primary: ['delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad', 'greater noida', 'delhi ncr', 'ncr'],
    nearby: ['sonipat', 'meerut', 'manesar'],
    stateHubs: ['chandigarh', 'jaipur', 'lucknow', 'agra'],
    stateName: 'delhi',
  },
  hyderabad: {
    primary: ['hyderabad', 'secunderabad', 'cyberabad', 'hitec city', 'gachibowli', 'madhapur', 'kondapur'],
    nearby: ['warangal'],
    stateHubs: ['visakhapatnam', 'vizag', 'vijayawada'],
    stateName: 'telangana',
  },
  chennai: {
    primary: ['chennai', 'madras', 'omr', 'sholinganallur', 'guindy', 't nagar', 'velachery'],
    nearby: ['kanchipuram', 'chengalpattu'],
    stateHubs: ['coimbatore', 'madurai', 'trichy', 'salem'],
    stateName: 'tamil nadu',
  },
  indore: {
    primary: ['indore', 'dewas', 'pithampur'],
    nearby: ['ujjain', 'bhopal'],
    stateHubs: ['jabalpur', 'gwalior'],
    stateName: 'madhya pradesh',
  },
  ahmedabad: {
    primary: ['ahmedabad', 'gandhinagar', 'gift city', 'sanand'],
    nearby: ['vadodara', 'baroda'],
    stateHubs: ['surat', 'rajkot'],
    stateName: 'gujarat',
  },
  kolkata: {
    primary: ['kolkata', 'calcutta', 'salt lake', 'new town', 'howrah', 'sector v'],
    nearby: ['hooghly'],
    stateHubs: ['durgapur', 'siliguri'],
    stateName: 'west bengal',
  },
  jaipur: {
    primary: ['jaipur', 'sitapura', 'malviya nagar'],
    nearby: ['ajmer'],
    stateHubs: ['jodhpur', 'udaipur', 'kota'],
    stateName: 'rajasthan',
  },
};

/**
 * Calculates Indian Location Relevance & Proximity Score (0 to 30)
 */
function evaluateLocationProximity(jobLoc: string, userLocInput: string, isJobRemote: boolean): { score: number; reason: string } {
  const jobText = (jobLoc || '').toLowerCase();
  const userInput = (userLocInput || '').trim().toLowerCase();

  // If user explicitly chose Remote
  if (userInput.includes('remote') || userInput === '') {
    if (isJobRemote || jobText.includes('remote') || jobText.includes('anywhere')) {
      return { score: 30, reason: '✓ Remote (India)' };
    }
    return { score: 20, reason: '✓ India-based Role' };
  }

  // Find which cluster the user's input matches
  let matchedClusterKey: string | null = null;
  for (const [key, cluster] of Object.entries(CLUSTERS)) {
    if (userInput.includes(key) || cluster.primary.some(p => userInput.includes(p))) {
      matchedClusterKey = key;
      break;
    }
  }

  // 1. Direct string match with user input
  if (jobText.includes(userInput) && userInput.length > 2) {
    const capitalized = userLocInput.split(' ')[0];
    return { score: 30, reason: `✓ ${capitalized} (Exact Match)` };
  }

  // If cluster found, check tiers
  if (matchedClusterKey) {
    const cluster = CLUSTERS[matchedClusterKey];

    // Tier 1: Primary metro / municipal area
    if (cluster.primary.some(p => jobText.includes(p))) {
      const matchName = cluster.primary.find(p => jobText.includes(p))!;
      return { score: 30, reason: `✓ ${matchName.toUpperCase()} (Exact Match)` };
    }

    // Tier 2: Directly neighboring hubs (e.g. Navi Mumbai / Thane for Mumbai)
    if (cluster.nearby.some(n => jobText.includes(n))) {
      const matchName = cluster.nearby.find(n => jobText.includes(n))!;
      return { score: 22, reason: `✓ ${matchName.toUpperCase()} (Nearby Hub)` };
    }

    // Tier 3: Same state / regional hubs (e.g. Pune for Mumbai, or Maharashtra)
    if (jobText.includes(cluster.stateName) || cluster.stateHubs.some(s => jobText.includes(s))) {
      return { score: 16, reason: `✓ ${cluster.stateName.toUpperCase()} Region` };
    }
  }

  // Tier 4: Remote job in India
  if (isJobRemote || jobText.includes('remote')) {
    return { score: 18, reason: '✓ Remote (India-wide)' };
  }

  // Tier 5: Other Indian city
  const allIndianKeywords = ['india', 'maharashtra', 'karnataka', 'tamil nadu', 'telangana', 'delhi', 'haryana', 'uttar pradesh', 'gujarat', 'madhya pradesh', 'west bengal'];
  if (allIndianKeywords.some(k => jobText.includes(k))) {
    return { score: 12, reason: '✓ India-based Opportunity' };
  }

  // Outside India
  return { score: 4, reason: 'International Location' };
}

/**
 * Calculates a genuine Job Match Score based on user preferences and Indian locality
 */
export function calculateJobMatch(job: RawJobItem, preferences: JobPreference): JobMatchResult {
  const matchReasons: string[] = [];
  const fullText = `${job.title} ${job.company} ${job.location} ${job.description} ${job.skills.join(' ')}`.toLowerCase();

  // 1. LOCATION PROXIMITY (Weight: 30 points)
  const locResult = evaluateLocationProximity(job.location, preferences.location, job.isRemote);
  const locationScore = locResult.score;
  matchReasons.push(locResult.reason);

  // 2. SKILL MATCH (Weight: 35 points)
  const userSkills = preferences.skills.filter(s => s.trim().length > 0);
  let matchedSkillsCount = 0;
  for (const s of userSkills) {
    const sLower = s.trim().toLowerCase();
    if (fullText.includes(sLower) || job.skills.some(js => js.toLowerCase().includes(sLower))) {
      matchedSkillsCount++;
    }
  }

  const skillRatio = userSkills.length > 0 ? matchedSkillsCount / userSkills.length : 0.8;
  const skillPoints = Math.round(skillRatio * 35);

  if (userSkills.length > 0) {
    matchReasons.push(`✓ ${matchedSkillsCount}/${userSkills.length} Skills Matched`);
  } else {
    matchReasons.push('✓ Relevant Core Skills Matched');
  }

  // 3. EXPERIENCE MATCH (Weight: 15 points)
  let expPoints = 15;
  const isFresherUser = preferences.experience === 'Fresher' || preferences.experience === '0–1 Years';
  const isSeniorJob = /\b(senior|lead|principal|staff|architect|5\+|7\+|10\+)\b/i.test(job.title);
  const isEntryJob = /\b(junior|associate|graduate|entry|fresher|intern|trainee|0-1|1-2)\b/i.test(
    `${job.title} ${job.description}`
  );

  let isFresherFriendly = false;
  if (isFresherUser) {
    if (isSeniorJob) {
      expPoints = 5;
    } else {
      expPoints = 15;
      isFresherFriendly = isEntryJob || !isSeniorJob;
      matchReasons.push('✓ Fresher Friendly');
    }
  } else {
    expPoints = 15;
    matchReasons.push('✓ Experience Matched');
  }

  // 4. WORK PREFERENCE MATCH (Weight: 12 points)
  let workPrefPoints = 8;
  const prefLower = preferences.workPreference.toLowerCase();
  const jobWorkTypeLower = (job.workType || '').toLowerCase();

  if (jobWorkTypeLower.includes(prefLower) || fullText.includes(prefLower)) {
    workPrefPoints = 12;
    matchReasons.push(`✓ ${preferences.workPreference}`);
  } else if (preferences.workPreference === 'Full-time' && !jobWorkTypeLower.includes('part-time')) {
    workPrefPoints = 12;
    matchReasons.push('✓ Full-time');
  }

  // 5. ROLE RELEVANCE (Weight: 8 points)
  let rolePoints = 8;
  const roleLower = preferences.role.toLowerCase();
  const roleKeywords = roleLower.split(' ').filter(w => w.length > 2);
  const matchesRole = roleKeywords.some(kw => job.title.toLowerCase().includes(kw));
  if (!matchesRole) {
    rolePoints = 3;
  }

  const rawTotal = locationScore + skillPoints + expPoints + workPrefPoints + rolePoints;
  // Bounded between 50% and 98%
  const matchPercentage = Math.min(98, Math.max(50, rawTotal));

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    workType: job.workType,
    salary: job.salary || 'Salary not specified',
    postedAt: job.postedAt,
    skills: job.skills,
    matchPercentage,
    matchReasons: matchReasons.slice(0, 4),
    skillsMatchedCount: matchedSkillsCount,
    skillsTotalCount: userSkills.length,
    isFresherFriendly,
    applyUrl: job.applyUrl,
    applySource: job.applySource,
    isExactUrl: job.isExactUrl,
    description: job.description,
    isRemote: job.isRemote,
    locationScore,
  };
}

/**
 * Searches jobs via backend API (/api/jobs) with India-first prioritization
 */
export async function searchJobs(preferences: JobPreference): Promise<JobSearchResponse> {
  const params = new URLSearchParams();
  if (preferences.role) params.set('role', preferences.role);
  if (preferences.skills.length > 0) params.set('skills', preferences.skills.join(','));
  if (preferences.experience) params.set('experience', preferences.experience);
  if (preferences.workPreference) params.set('workPreference', preferences.workPreference);
  if (preferences.location) {
    params.set('location', preferences.location);
  }
  if (preferences.company) params.set('company', preferences.company);
  params.set('indiaOnly', preferences.indiaOnly !== false ? 'true' : 'false');

  const response = await fetch(`/api/jobs?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Network error while searching jobs.');
  }

  const data = await response.json();
  const rawJobs: RawJobItem[] = Array.isArray(data.jobs) ? data.jobs : [];

  // Calculate genuine match score for every job
  const scoredJobs: JobMatchResult[] = rawJobs
    .map(job => calculateJobMatch(job, preferences))
    // Local-first sorting: First sort by location proximity, then by overall match score
    .sort((a, b) => {
      // Prioritize nearby/exact city matches
      if (b.locationScore !== a.locationScore) {
        return b.locationScore - a.locationScore;
      }
      return b.matchPercentage - a.matchPercentage;
    });

  return {
    success: true,
    source: data.source || 'verified_catalog',
    message: data.message,
    total: scoredJobs.length,
    jobs: scoredJobs,
  };
}
