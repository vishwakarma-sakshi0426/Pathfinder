import { useState, useRef, useCallback, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, FileText, BookOpen, Link as LinkIcon, Code, Users,
  Lightbulb, ChevronRight, Download, Save, Plus, X, CheckCircle, HelpCircle, PanelLeftOpen, Tag, Trash2,
  Sparkles, Compass
} from 'lucide-react';
import { detectRoadmap, type RoadmapMapping } from '@/data/roadmapMappings';
import RoadmapReadyCard from '@/components/roadmap/RoadmapReadyCard';
import RoadmapTransitionModal from '@/components/roadmap/RoadmapTransitionModal';
import { syncFromRoadmap, addProofOfProgress } from '@/services/careerProgressService';

interface ProfessionTemplate {
  name: string;
  goals: string[];
}

interface RoadmapData {
  roadmap: RoadmapStage[];
  flashcards: Flashcard[];
}

interface RoadmapStage {
  stage: string;
  description: string;
  skills: string[];
  resources: RoadmapResource[];
}

interface RoadmapResource {
  name: string;
  type: string;
  link: string;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface SavedRoadmap {
  id: number;
  date: string;
  profession: string;
  goal: string;
  data: RoadmapData;
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const PROFESSION_TEMPLATES: ProfessionTemplate[] = [
  { name: 'Software Developer', goals: ['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Mobile'] },
  { name: 'Data Scientist', goals: ['Machine Learning', 'Big Data', 'NLP', 'Computer Vision', 'Analytics'] },
  { name: 'Designer', goals: ['UI/UX', 'Product Design', 'Graphic Design', 'Motion Graphics', 'Branding'] },
  { name: 'Project Manager', goals: ['Agile', 'Scrum', 'Waterfall', 'Product Management', 'Program Management'] },
  { name: 'Marketing Professional', goals: ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Analytics'] }
];

const GOAL_TEMPLATES: string[] = [
  'Advance to a senior position in my field',
  'Transition to a leadership role',
  'Learn the latest technologies',
  'Switch to a different specialization',
  'Prepare for freelance/consulting work',
  'Develop skills for remote work opportunities'
];

const DEFAULT_SKILL_CATEGORIES: string[] = [
  'Technical Skills',
  'Soft Skills',
  'Industry Knowledge',
  'Tools & Technologies',
  'Leadership',
  'Communication',
  'Project Management'
];

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  return (
    <div className="inline-flex relative items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocusCapture={() => setIsVisible(true)}
      onBlurCapture={() => setIsVisible(false)}
      tabIndex={0}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {isVisible && (
        <div id={tooltipId} role="tooltip" className="absolute z-10 p-2 text-xs text-white rounded shadow-lg bg-gray-700/90 -top-8 min-w-[200px]">
          {content}
        </div>
      )}
    </div>
  );
}

function isValidUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

function isValidSavedRoadmap(item: unknown): item is SavedRoadmap {
  if (typeof item !== 'object' || item === null) return false;
  const r = item as Record<string, unknown>;
  if (typeof r.id !== 'number') return false;
  if (typeof r.date !== 'string') return false;
  if (typeof r.profession !== 'string') return false;
  if (typeof r.goal !== 'string') return false;
  if (typeof r.data !== 'object' || r.data === null) return false;
  const d = r.data as Record<string, unknown>;
  if (!Array.isArray(d.roadmap)) return false;
  if (!Array.isArray(d.flashcards)) return false;
  return true;
}

function generateMockRoadmap(
  professionOrTopic: string,
  skillSections: string[],
  match?: RoadmapMapping | null
): RoadmapData {
  const isDsa = match?.id === 'dsa' || /dsa|data\s*structure|algorithm/i.test(professionOrTopic);
  const isFrontend = match?.id === 'frontend' || match?.id === 'react' || /frontend|front-end|react/i.test(professionOrTopic);
  const isBackend = match?.id === 'backend' || /backend|back-end|node|api/i.test(professionOrTopic);
  const isDevOps = match?.id === 'devops' || /devops|cloud|sre/i.test(professionOrTopic);
  const isAi = match?.id === 'machinelearning' || match?.id === 'aiengineer' || /machine learning|ai|artificial intelligence/i.test(professionOrTopic);

  let foundationResources: RoadmapResource[] = [
    { name: 'Coursera Fundamentals', type: 'Course', link: 'https://coursera.org' },
    { name: 'MDN Web Docs & Tutorials', type: 'Website', link: 'https://developer.mozilla.org' }
  ];
  let intermediateResources: RoadmapResource[] = [
    { name: 'Udemy Advanced Course', type: 'Course', link: 'https://udemy.com' },
    { name: 'Industry Tech Blogs', type: 'Website', link: 'https://medium.com' }
  ];
  let advancedResources: RoadmapResource[] = [
    { name: 'Advanced Professional Certification', type: 'Course', link: 'https://coursera.org' },
    { name: 'Conference Talks & Engineering Blogs', type: 'Website', link: 'https://youtube.com' }
  ];
  let expertResources: RoadmapResource[] = [
    { name: 'Executive Leadership Program', type: 'Course', link: 'https://linkedin.com/learning' },
    { name: 'ArXiv & Industry Research Papers', type: 'Website', link: 'https://arxiv.org' }
  ];

  if (isDsa) {
    foundationResources = [
      { name: 'Coursera Algorithms Specialization', type: 'Course', link: 'https://coursera.org' },
      { name: 'GeeksforGeeks DSA Tutorials & Blogs', type: 'Website', link: 'https://geeksforgeeks.org' }
    ];
    intermediateResources = [
      { name: 'Udemy Master the Coding Interview', type: 'Course', link: 'https://udemy.com' },
      { name: 'NeetCode & LeetCode Practice Blogs', type: 'Website', link: 'https://leetcode.com' }
    ];
    advancedResources = [
      { name: 'Advanced Competitive Programming Course', type: 'Course', link: 'https://coursera.org' },
      { name: 'CP-Algorithms & Codeforces Blogs', type: 'Website', link: 'https://cp-algorithms.com' }
    ];
    expertResources = [
      { name: 'MIT OpenCourseWare Design and Analysis of Algorithms', type: 'Course', link: 'https://ocw.mit.edu' },
      { name: 'ACM & ArXiv Algorithm Research Papers', type: 'Website', link: 'https://arxiv.org' }
    ];
  } else if (isFrontend) {
    foundationResources = [
      { name: 'Meta Front-End Developer Certificate', type: 'Course', link: 'https://coursera.org' },
      { name: 'MDN Web Docs & Guides', type: 'Website', link: 'https://developer.mozilla.org' }
    ];
    intermediateResources = [
      { name: 'Udemy Complete React & Modern JS Bootcamp', type: 'Course', link: 'https://udemy.com' },
      { name: 'web.dev & CSS-Tricks Blogs', type: 'Website', link: 'https://web.dev' }
    ];
    advancedResources = [
      { name: 'Frontend Masters Web Performance Architecture', type: 'Course', link: 'https://frontendmasters.com' },
      { name: 'Smashing Magazine & Web Dev Tech Blogs', type: 'Website', link: 'https://smashingmagazine.com' }
    ];
    expertResources = [
      { name: 'System Architecture for Front-End Engineers', type: 'Course', link: 'https://coursera.org' },
      { name: 'W3C Standards & Chrome Developers Blog', type: 'Website', link: 'https://developer.chrome.com/blog' }
    ];
  } else if (isBackend) {
    foundationResources = [
      { name: 'Backend Development Fundamentals', type: 'Course', link: 'https://coursera.org' },
      { name: 'MDN Server-Side & HTTP Guides', type: 'Website', link: 'https://developer.mozilla.org' }
    ];
    intermediateResources = [
      { name: 'Udemy Microservices & REST API Mastery', type: 'Course', link: 'https://udemy.com' },
      { name: 'Martin Fowler Architecture Blogs', type: 'Website', link: 'https://martinfowler.com' }
    ];
    advancedResources = [
      { name: 'Distributed Systems Certification', type: 'Course', link: 'https://coursera.org' },
      { name: 'High Scalability & ByteByteGo Tech Blogs', type: 'Website', link: 'https://bytebytego.com' }
    ];
    expertResources = [
      { name: 'Cloud Native Architecture Mastery', type: 'Course', link: 'https://linkedin.com/learning' },
      { name: 'ACM Distributed Computing Papers', type: 'Website', link: 'https://arxiv.org' }
    ];
  } else if (isDevOps) {
    foundationResources = [
      { name: 'Linux & DevOps Fundamentals (Coursera)', type: 'Course', link: 'https://coursera.org' },
      { name: 'DevOps Institute & Linux Foundation Blogs', type: 'Website', link: 'https://linuxfoundation.org' }
    ];
    intermediateResources = [
      { name: 'Docker & Kubernetes Mastery (Udemy)', type: 'Course', link: 'https://udemy.com' },
      { name: 'The New Stack & Cloud Native Blogs', type: 'Website', link: 'https://thenewstack.io' }
    ];
    advancedResources = [
      { name: 'Certified Kubernetes Administrator (CKA)', type: 'Course', link: 'https://coursera.org' },
      { name: 'Google SRE Books & Best Practices', type: 'Website', link: 'https://sre.google/books/' }
    ];
    expertResources = [
      { name: 'Enterprise Cloud Architecture Certification', type: 'Course', link: 'https://linkedin.com/learning' },
      { name: 'USENIX & DevOps Enterprise Summit Papers', type: 'Website', link: 'https://usenix.org' }
    ];
  } else if (isAi) {
    foundationResources = [
      { name: 'DeepLearning.AI Machine Learning Specialization', type: 'Course', link: 'https://coursera.org' },
      { name: 'Towards Data Science & Google AI Blogs', type: 'Website', link: 'https://towardsdatascience.com' }
    ];
    intermediateResources = [
      { name: 'Deep Learning with PyTorch (Udemy)', type: 'Course', link: 'https://udemy.com' },
      { name: 'Hugging Face Documentation & Blog', type: 'Website', link: 'https://huggingface.co/blog' }
    ];
    advancedResources = [
      { name: 'Generative AI & LLM Systems Specialization', type: 'Course', link: 'https://coursera.org' },
      { name: 'OpenAI & Google DeepMind Research Publications', type: 'Website', link: 'https://arxiv.org' }
    ];
    expertResources = [
      { name: 'AI Engineering Leadership & MLOps Strategy', type: 'Course', link: 'https://linkedin.com/learning' },
      { name: 'NeurIPS & ICML Conference Papers', type: 'Website', link: 'https://neurips.cc' }
    ];
  }

  const stages: RoadmapStage[] = [
    {
      stage: 'Foundation (Beginner)',
      description: `Build core fundamentals and essential skills for ${professionOrTopic}.`,
      skills: ['Problem Solving', 'Communication', 'Basic Tools'].concat(skillSections.slice(0, 2)),
      resources: foundationResources
    },
    {
      stage: 'Intermediate',
      description: `Develop specialized skills and hands-on domain competencies for ${professionOrTopic}.`,
      skills: ['Advanced Concepts', 'Team Collaboration', 'Project Management'].concat(skillSections.slice(2, 4)),
      resources: intermediateResources
    },
    {
      stage: 'Advanced',
      description: `Master complex topics, architecture, and production practices in ${professionOrTopic}.`,
      skills: ['Architecture', 'Mentorship', 'Strategic Thinking'].concat(skillSections.slice(4)),
      resources: advancedResources
    },
    {
      stage: 'Expert',
      description: `Lead, innovate, and drive strategic impact in ${professionOrTopic}.`,
      skills: ['Leadership', 'Innovation', 'Industry Influence'],
      resources: expertResources
    }
  ];

  const flashcards: Flashcard[] = [
    { question: `What is the most important skill for a ${professionOrTopic}?`, answer: 'Continuous learning and adaptability.' },
    { question: `How do you stay updated in ${professionOrTopic}?`, answer: 'Follow industry blogs, attend conferences, and practice regularly.' },
    { question: `What makes a great ${professionOrTopic}?`, answer: 'Technical excellence combined with strong soft skills.' },
    { question: `How to handle challenges in ${professionOrTopic}?`, answer: 'Break problems down, seek mentorship, and iterate solutions.' }
  ];

  return { roadmap: stages, flashcards };
}

export default function Roadmap() {
  const navigate = useNavigate();
  const [profession, setProfession] = useState('');
  const [userInput, setUserInput] = useState('');
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzingText, setAnalyzingText] = useState<string | null>(null);
  const [detectedRoadmap, setDetectedRoadmap] = useState<RoadmapMapping | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [customAiLoading, setCustomAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProfessionTemplate | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>(() => {
    try {
      const saved = localStorage.getItem('savedRoadmaps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(isValidSavedRoadmap);
      }
    } catch {
      // ignore invalid localStorage
    }
    return [];
  });
  const [isCopied, setIsCopied] = useState(false);
  const [skillSections, setSkillSections] = useState<string[]>([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [showSectionInput, setShowSectionInput] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmapData(null);
    setDetectedRoadmap(null);
    setNoMatchFound(false);

    try {
      // Phase 1: Analyzing requirements
      setAnalyzingText('Analyzing your requirements...');
      await new Promise(resolve => setTimeout(resolve, 600));

      // Phase 2: Finding the right learning path
      setAnalyzingText('Finding the right learning path...');
      await new Promise(resolve => setTimeout(resolve, 600));

      const match = detectRoadmap(profession, userInput, skillSections);

      // Generate the structured personalized roadmap with Beginner, Intermediate, Advanced, Expert stages and course & blog links
      const targetTopic = match?.title || profession || userInput || 'Software Engineering';
      const breakdown = generateMockRoadmap(targetTopic, skillSections, match);
      setRoadmapData(breakdown);

      if (match) {
        setDetectedRoadmap(match);
        setNoMatchFound(false);
      } else {
        setDetectedRoadmap(null);
        setNoMatchFound(false);
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
      setAnalyzingText(null);
    }
  }, [profession, userInput, skillSections]);

  const handleGenerateCustomAiRoadmap = useCallback(async () => {
    setCustomAiLoading(true);
    setError(null);
    setNoMatchFound(false);
    setDetectedRoadmap(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      const response = generateMockRoadmap(profession || 'General', skillSections);

      if (!response || !response.roadmap || !response.flashcards) {
        throw new Error('Incomplete or invalid data received');
      }
      if (!Array.isArray(response.roadmap) || !Array.isArray(response.flashcards)) {
        throw new Error('Invalid data format');
      }

      setRoadmapData(response);
      setTimeout(() => {
        roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setCustomAiLoading(false);
    }
  }, [profession, skillSections]);

  const handleContinueToRoadmap = useCallback(() => {
    if (!detectedRoadmap) return;
    setShowTransitionModal(true);
  }, [detectedRoadmap]);

  const handleTransitionComplete = useCallback(() => {
    setShowTransitionModal(false);
    if (detectedRoadmap) {
      navigate(`/roadmap/view?id=${detectedRoadmap.id}`);
    }
  }, [detectedRoadmap, navigate]);

  const getResourceIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'book': return <BookOpen className="mr-2 w-4 h-4 text-teal-600" aria-hidden="true" />;
      case 'course': return <Code className="mr-2 w-4 h-4 text-purple-600" aria-hidden="true" />;
      case 'website': return <LinkIcon className="mr-2 w-4 h-4 text-blue-600" aria-hidden="true" />;
      case 'tool': return <Users className="mr-2 w-4 h-4 text-orange-600" aria-hidden="true" />;
      case 'conference': return <Users className="mr-2 w-4 h-4 text-red-600" aria-hidden="true" />;
      default: return <FileText className="mr-2 w-4 h-4 text-gray-500" aria-hidden="true" />;
    }
  };

  const selectProfessionTemplate = useCallback((template: ProfessionTemplate) => {
    setProfession(template.name);
    setSelectedTemplate(template);
    setShowTemplates(false);
  }, []);

  const insertGoal = useCallback((goal: string) => {
    setUserInput(goal);
  }, []);

  const addSkillSection = useCallback(() => {
    if (newSectionName.trim() !== '') {
      setSkillSections(prev => [...prev, newSectionName.trim()]);
      setNewSectionName('');
      setShowSectionInput(false);
    }
  }, [newSectionName]);

  const removeSkillSection = useCallback((index: number) => {
    setSkillSections(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addDefaultSkillSection = useCallback((section: string) => {
    setSkillSections(prev => {
      if (prev.includes(section)) return prev;
      return [...prev, section];
    });
  }, []);

  const saveRoadmap = useCallback(() => {
    if (!roadmapData || !profession) return;

    const newSavedRoadmap: SavedRoadmap = {
      id: Date.now() + Math.random(),
      date: new Date().toLocaleDateString(),
      profession,
      goal: userInput,
      data: roadmapData
    };

    setSavedRoadmaps(prev => {
      const updated = [...prev, newSavedRoadmap];
      try {
        localStorage.setItem('savedRoadmaps', JSON.stringify(updated));
      } catch {
        // ignore quota errors
      }
      return updated;
    });

    // Synchronize into the Career Control Center
    try {
      const extractedSkills = roadmapData.roadmap.flatMap(r => r.skills || []);
      syncFromRoadmap(profession, extractedSkills);
      addProofOfProgress({
        title: `Generated Career Roadmap: ${profession}`,
        type: 'Milestone',
        timeAgo: 'Just now',
        verified: true,
        detail: `Created a personalized ${roadmapData.roadmap.length}-stage learning trajectory.`,
      });
    } catch (e) {
      console.warn('Could not sync roadmap to career progress', e);
    }
  }, [roadmapData, profession, userInput]);

  const loadRoadmap = useCallback((savedRoadmap: SavedRoadmap) => {
    setProfession(savedRoadmap.profession);
    setUserInput(savedRoadmap.goal);
    setRoadmapData(savedRoadmap.data);
    setDetectedRoadmap(null);
    setNoMatchFound(false);

    try {
      syncFromRoadmap(savedRoadmap.profession);
    } catch {
      // ignore
    }
  }, []);

  const deleteSavedRoadmap = useCallback((id: number) => {
    setSavedRoadmaps(prev => {
      const updated = prev.filter(roadmap => roadmap.id !== id);
      try {
        localStorage.setItem('savedRoadmaps', JSON.stringify(updated));
      } catch {
        // ignore quota errors
      }
      return updated;
    });
  }, []);

  const copyToClipboard = useCallback(() => {
    if (!roadmapData) return;

    const text = `Career Roadmap for ${profession}\nGoal: ${userInput}\n\n` +
      roadmapData.roadmap.map((stage, i) =>
        `STAGE ${i + 1}: ${stage.stage}\n${stage.description}\n\nSkills:\n` +
        stage.skills.map(skill => `- ${skill}`).join('\n') +
        `\n\nResources:\n` +
        stage.resources.map(res => `- ${res.name} (${res.type}): ${res.link}`).join('\n')
      ).join('\n\n');

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [roadmapData, profession, userInput]);

  const exportToPDF = useCallback(async () => {
    if (!roadmapRef.current) return;
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf')
      ]);
      const canvas = await html2canvas(roadmapRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`roadmap_${profession.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    } catch {
      setError('Failed to export PDF. Please try again.');
    }
  }, [profession]);

  return (
    <motion.div
      className="container px-4 py-10 mx-auto max-w-5xl font-sans bg-gradient-to-br from-stone-50 to-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="mb-8 text-3xl font-bold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 sm:text-4xl lg:text-5xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 80 }}
      >
        Career Roadmap Generator
        <span className="block mt-2 text-base font-medium text-gray-600 sm:text-lg">
          Create your personalized path to success
        </span>
      </motion.h1>

      {savedRoadmaps.length > 0 && (
        <motion.div
          className="p-6 mb-8 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <details>
            <summary className="flex items-center text-sm font-medium text-teal-700 cursor-pointer hover:text-teal-600">
              <PanelLeftOpen className="mr-2 w-4 h-4" aria-hidden="true" />
              Your Saved Roadmaps ({savedRoadmaps.length})
            </summary>
            <div className="mt-4 space-y-3">
              {savedRoadmaps.map(roadmap => (
                <motion.div
                  key={roadmap.id}
                  className="flex justify-between items-center p-4 rounded-lg border border-stone-200/70 bg-stone-50/50 hover:bg-stone-50 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">{roadmap.profession}</div>
                    <div className="text-xs text-stone-500">{roadmap.goal}</div>
                    <div className="text-xs text-stone-400">Saved on {roadmap.date}</div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => loadRoadmap(roadmap)}
                      className="p-2 text-teal-600 rounded-lg transition-colors hover:bg-teal-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Load roadmap"
                    >
                      <FileText size={16} aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteSavedRoadmap(roadmap.id)}
                      className="p-2 text-rose-500 rounded-lg transition-colors hover:bg-rose-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Delete roadmap"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </details>
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="p-8 mb-12 space-y-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="relative">
          <div className="flex justify-between items-center">
            <label htmlFor="profession" className="block mb-2 text-sm font-medium text-stone-700">
              Your Profession:
              <Tooltip content="Enter your current role or the profession you're interested in">
                <HelpCircle className="inline-block ml-1 w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
              </Tooltip>
            </label>
            <button
              type="button"
              className="px-2 py-1 text-xs font-medium text-teal-700 rounded-md transition-colors bg-teal-50/70 hover:bg-teal-100/80"
              onClick={() => setShowTemplates(!showTemplates)}
              aria-expanded={showTemplates}
            >
              {showTemplates ? 'Hide Templates' : 'Browse Templates'}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="px-3 py-2.5 w-full text-sm rounded-lg border shadow-sm transition duration-150 ease-in-out border-stone-200 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
              required
              placeholder="e.g., Software Engineer, Graphic Designer"
            />
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  className="overflow-y-auto absolute z-10 p-2 mt-1 w-full max-h-48 bg-white rounded-md border shadow-md border-stone-200"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {PROFESSION_TEMPLATES.map(template => (
                    <button
                      type="button"
                      key={template.name}
                      className="block p-2 w-full text-left rounded-md hover:bg-stone-50"
                      onClick={() => selectProfessionTemplate(template)}
                    >
                      <div className="text-sm font-medium text-stone-800">{template.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.goals.slice(0, 3).map(goal => (
                          <span key={goal} className="px-1.5 py-0.5 text-xs text-teal-700 rounded bg-teal-50/70">
                            {goal}
                          </span>
                        ))}
                        {template.goals.length > 3 && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-stone-100 text-stone-600">
                            +{template.goals.length - 3} more
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label htmlFor="userInput" className="block mb-2 text-sm font-medium text-stone-700">
            What are your career goals or areas of focus?
            <Tooltip content="Describe what you want to achieve or learn about your career path">
              <HelpCircle className="inline-block ml-1 w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
            </Tooltip>
          </label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="px-3 py-2.5 w-full text-sm rounded-lg border shadow-sm transition duration-150 ease-in-out border-stone-200 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
            rows={3}
            required
            placeholder="e.g., 'Transition into AI/ML', 'Become a senior frontend developer', 'Improve project management skills'"
          />

          <div className="mt-2">
            <p className="mb-1 text-xs font-medium text-stone-500">Quick templates:</p>
            <div className="flex flex-wrap gap-2">
              {(selectedTemplate?.goals || GOAL_TEMPLATES.slice(0, 4)).map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => insertGoal(goal)}
                  className="px-2 py-1 text-xs rounded-md transition-colors bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-stone-700">
              Skill Categories You Want Included
              <Tooltip content="Add specific skill categories you'd like to see in your roadmap">
                <HelpCircle className="inline-block ml-1 w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
              </Tooltip>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center mb-2">
            {skillSections.map((section, index) => (
              <div key={`${section}-${index}`} className="flex items-center px-2 py-1 text-xs text-teal-700 bg-teal-50 rounded-md">
                <Tag size={12} className="mr-1" aria-hidden="true" />
                {section}
                <button
                  type="button"
                  onClick={() => removeSkillSection(index)}
                  className="ml-1.5 text-teal-500 hover:text-teal-700"
                  aria-label={`Remove ${section}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            ))}

            {showSectionInput ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="px-2 py-1 w-40 text-xs rounded-l-md border border-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  placeholder="Category name..."
                />
                <button
                  type="button"
                  onClick={addSkillSection}
                  className="px-2 py-1 text-xs text-white bg-teal-600 rounded-r-md border border-teal-600 hover:bg-teal-700"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSectionInput(true)}
                className="flex items-center px-2 py-1 text-xs text-teal-600 bg-teal-50 rounded-md transition-colors hover:bg-teal-100"
              >
                <Plus size={12} className="mr-1" aria-hidden="true" /> Add Category
              </button>
            )}
          </div>

          <div className="mt-2">
            <p className="mb-1 text-xs font-medium text-stone-500">Suggested categories:</p>
            <div className="flex flex-wrap gap-1">
              {DEFAULT_SKILL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => addDefaultSkillSection(category)}
                  disabled={skillSections.includes(category)}
                  className={`px-1.5 py-0.5 text-xs rounded ${
                    skillSections.includes(category)
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          className={`w-full flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white transition duration-300 ease-in-out rounded-lg shadow-sm ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" aria-hidden="true" />
              {analyzingText || 'Generating Roadmap...'}
            </>
          ) : 'Generate Roadmap'}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div
            className="p-4 mb-8 text-sm text-red-800 bg-red-50 rounded-lg border-red-200 shadow-sm border-l-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            role="alert"
          >
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intelligent Detected Roadmap Result */}
      <AnimatePresence>
        {detectedRoadmap && (
          <div ref={resultRef}>
            <RoadmapReadyCard
              mapping={detectedRoadmap}
              onContinue={handleContinueToRoadmap}
              onCustomAiRoadmap={() => {
                roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* No Match Found State */}
      <AnimatePresence>
        {noMatchFound && (
          <motion.div
            ref={resultRef}
            className="p-8 mb-12 text-center bg-white border shadow-md rounded-2xl border-stone-200/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-teal-50 text-teal-600 border border-teal-100">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 sm:text-2xl">
              No Matching Roadmap Found
            </h3>
            <p className="max-w-md mx-auto mt-2 text-sm text-stone-600">
              We couldn&apos;t find a dedicated roadmap for this requirement.
            </p>
            <div className="mt-6">
              <motion.button
                type="button"
                onClick={handleGenerateCustomAiRoadmap}
                disabled={customAiLoading}
                className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-md transition duration-200 ${
                  customAiLoading
                    ? 'bg-stone-400 cursor-not-allowed'
                    : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg'
                }`}
                whileHover={{ scale: customAiLoading ? 1 : 1.02 }}
                whileTap={{ scale: customAiLoading ? 1 : 0.98 }}
              >
                {customAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Custom AI Roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Custom AI Roadmap
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth Transition Modal */}
      {detectedRoadmap && (
        <RoadmapTransitionModal
          isOpen={showTransitionModal}
          roadmapTitle={detectedRoadmap.title}
          onComplete={handleTransitionComplete}
        />
      )}

      <AnimatePresence>
        {roadmapData && (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.08 }}
            ref={roadmapRef}
          >
            <div className="flex flex-col gap-3 justify-between items-center mb-5 sm:flex-row">
              <motion.h2
                className="text-2xl font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 sm:text-2xl"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your Personalized Career Roadmap
              </motion.h2>

              <div className="flex space-x-2">
                <Tooltip content="Save this roadmap for future reference">
                  <motion.button
                    onClick={saveRoadmap}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-blue-700 rounded-md transition-colors bg-blue-50/80 hover:bg-blue-100/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Save className="mr-1 w-3.5 h-3.5" aria-hidden="true" /> Save
                  </motion.button>
                </Tooltip>

                <Tooltip content="Copy roadmap text to clipboard">
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-purple-700 rounded-md transition-colors bg-purple-50/80 hover:bg-purple-100/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isCopied ? (
                      <><CheckCircle className="mr-1 w-3.5 h-3.5" aria-hidden="true" /> Copied!</>
                    ) : (
                      <><FileText className="mr-1 w-3.5 h-3.5" aria-hidden="true" /> Copy</>
                    )}
                  </motion.button>
                </Tooltip>

                <Tooltip content="Export as PDF">
                  <motion.button
                    onClick={exportToPDF}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-green-700 rounded-md transition-colors bg-green-50/80 hover:bg-green-100/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download className="mr-1 w-3.5 h-3.5" aria-hidden="true" /> Export
                  </motion.button>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-5">
              {roadmapData.roadmap?.map((stage, index) => (
                <motion.div
                  key={index}
                  className="overflow-hidden bg-white rounded-lg border shadow-sm transition-shadow duration-200 border-stone-100 hover:shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  <div className="p-4 bg-gradient-to-r from-teal-50/70 to-blue-50/50">
                    <h3 className="flex items-center mb-1 text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-blue-600 sm:text-lg">
                      <span className="flex justify-center items-center mr-2 w-6 h-6 text-sm font-medium text-white rounded-full bg-teal-600/90">{index + 1}</span> {stage.stage || `Stage ${index + 1}`}
                    </h3>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <p className="text-stone-600">{stage.description || 'No description provided.'}</p>

                    {stage.skills && stage.skills.length > 0 && (
                      <div>
                        <h4 className="flex items-center mb-1 text-sm font-medium text-teal-700">
                          <Lightbulb className="mr-1.5 w-4 h-4" aria-hidden="true" />
                          Skills to Develop:
                        </h4>
                        <ul className="space-y-1 text-stone-600">
                          {stage.skills.map((skill, skillIndex) => (
                            <li key={skillIndex} className="flex items-center">
                              <ChevronRight className="flex-shrink-0 mr-1 w-3.5 h-3.5 text-teal-500" aria-hidden="true" />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {stage.resources && stage.resources.length > 0 && (
                      <div>
                        <h4 className="flex items-center mb-1 text-sm font-medium text-teal-700">
                          <BookOpen className="mr-1.5 w-4 h-4" aria-hidden="true" />
                          Recommended Resources:
                        </h4>
                        <ul className="space-y-1.5 text-stone-600">
                          {stage.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="flex items-center">
                              {getResourceIcon(resource.type)}
                              <a
                                href={isValidUrl(resource.link) ? resource.link : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                              >
                                {resource.name || 'Unnamed Resource'} {resource.type ? `(${resource.type})` : ''}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {roadmapData.flashcards && roadmapData.flashcards.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (roadmapData.roadmap?.length || 0) * 0.08 }}
              >
                <h2 className="mt-12 mb-5 text-xl font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 sm:text-2xl">
                  Key Concept Flashcards
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {roadmapData.flashcards.map((flashcard, index) => (
                    <motion.div
                      key={index}
                      className="p-4 space-y-2 text-sm bg-white rounded-lg border shadow-sm transition-shadow duration-200 border-stone-100 hover:shadow-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (roadmapData.roadmap?.length || 0) * 0.08 + index * 0.04 }}
                    >
                      <div>
                        <h3 className="mb-1 text-xs font-medium tracking-wide text-teal-600 uppercase">Question:</h3>
                        <p className="text-stone-700">{flashcard.question || 'No question provided.'}</p>
                      </div>
                      <hr className="border-stone-100" />
                      <div>
                        <h3 className="mb-1 text-xs font-medium tracking-wide text-teal-600 uppercase">Answer:</h3>
                        <p className="text-stone-500">{flashcard.answer || 'No answer provided.'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
