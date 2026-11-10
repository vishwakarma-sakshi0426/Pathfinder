import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Trophy,
  Award,
  Code,
  Flame,
  ChevronRight,
  Plus,
  X,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import {
  getCareerProgress,
  switchTargetCareer,
  toggleMissionTask,
  boostSkill,
  addProofOfProgress,
  calculateCareerReadiness,
  getSkillStatus,
  computeNextBestMove,
  CAREER_ROLE_TEMPLATES,
  type CareerProgressState,
  type CareerSkill,
  type NextBestMove
} from '@/services/careerProgressService';

export default function Progress() {
  const navigate = useNavigate();
  const [careerState, setCareerState] = useState<CareerProgressState>(getCareerProgress);
  const [selectedProofFilter, setSelectedProofFilter] = useState<string>('All');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showNextMoveModal, setShowNextMoveModal] = useState(false);
  const [showAddProofModal, setShowAddProofModal] = useState(false);
  const [celebrationToast, setCelebrationToast] = useState<string | null>(null);

  // New Proof form state
  const [newProofTitle, setNewProofTitle] = useState('');
  const [newProofType, setNewProofType] = useState<'Project' | 'Challenge' | 'Certification'>('Project');
  const [newProofDetail, setNewProofDetail] = useState('');

  // Sync state and listen for cross-page events
  useEffect(() => {
    const handleUpdate = () => {
      setCareerState(getCareerProgress());
    };

    window.addEventListener('pathfinder-career-progress-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('pathfinder-career-progress-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Auto-dismiss celebration toast
  useEffect(() => {
    if (!celebrationToast) return;
    const timer = setTimeout(() => setCelebrationToast(null), 4000);
    return () => clearTimeout(timer);
  }, [celebrationToast]);

  // Derived metrics
  const careerReadiness = useMemo(() => {
    return calculateCareerReadiness(careerState.skills);
  }, [careerState.skills]);

  const skillsMasteredCount = useMemo(() => {
    return careerState.skills.filter(s => s.progress >= 70).length;
  }, [careerState.skills]);

  const skillGapsCount = useMemo(() => {
    return careerState.skills.filter(s => s.progress < 50).length;
  }, [careerState.skills]);

  const nextBestMove: NextBestMove = useMemo(() => {
    return computeNextBestMove(careerState.targetCareer, careerState.skills);
  }, [careerState.targetCareer, careerState.skills]);

  // Skills divided into Strong/Developing vs Needs Work
  const { strongSkills, gapSkills } = useMemo(() => {
    const strong: CareerSkill[] = [];
    const gaps: CareerSkill[] = [];
    careerState.skills.forEach(s => {
      if (s.progress >= 50) strong.push(s);
      else gaps.push(s);
    });
    return { strongSkills: strong, gapSkills: gaps };
  }, [careerState.skills]);

  // Biggest opportunity skill
  const biggestOpportunitySkill = useMemo(() => {
    const sorted = [...careerState.skills].sort((a, b) => a.progress - b.progress);
    return sorted[0] || null;
  }, [careerState.skills]);

  // Strongest skill
  const strongestSkill = useMemo(() => {
    const sorted = [...careerState.skills].sort((a, b) => b.progress - a.progress);
    return sorted[0] || null;
  }, [careerState.skills]);

  // Filtered Proof items
  const filteredProof = useMemo(() => {
    if (selectedProofFilter === 'All') return careerState.proofOfProgress;
    return careerState.proofOfProgress.filter(p => p.type === selectedProofFilter);
  }, [careerState.proofOfProgress, selectedProofFilter]);

  // Skill for Turn Skills Into Proof
  const skillForProof = useMemo(() => {
    // Find skill that has high progress (>=60) to encourage turning it into proof
    const learned = careerState.skills.filter(s => s.progress >= 60);
    return learned[0] || careerState.skills[0];
  }, [careerState.skills]);

  // Handlers
  const handleToggleTask = useCallback((taskId: string) => {
    const updated = toggleMissionTask(taskId);
    setCareerState(updated);
    const task = updated.weeklyMission.tasks.find(t => t.id === taskId);
    if (task && task.completed) {
      setCelebrationToast(`Task completed! Career Readiness increased by +${task.impact}%.`);
    }
  }, []);

  const handleRoleSelect = (roleName: string) => {
    const updated = switchTargetCareer(roleName);
    setCareerState(updated);
    setShowRoleModal(false);
    setCelebrationToast(`Target Career set to ${roleName}! Skill requirements updated.`);
  };

  const handleCompleteNextMove = () => {
    if (!nextBestMove) return;
    const updated = boostSkill(nextBestMove.skillName, 15);
    setCareerState(updated);
    addProofOfProgress({
      title: `Completed: ${nextBestMove.recommendation}`,
      type: 'Challenge',
      timeAgo: 'Just now',
      verified: true,
      detail: `Closed skill gap in ${nextBestMove.skillName} (+${nextBestMove.expectedImpact}% Career Readiness).`,
      skillTag: nextBestMove.skillName,
    });
    setCareerState(getCareerProgress());
    setShowNextMoveModal(false);
    setCelebrationToast(`Great job! +${nextBestMove.expectedImpact}% Career Readiness added.`);
  };

  const handleAddCustomProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofTitle.trim()) return;

    addProofOfProgress({
      title: newProofTitle.trim(),
      type: newProofType,
      timeAgo: 'Just now',
      verified: true,
      detail: newProofDetail.trim() || 'Verified career evidence completed.',
    });

    setCareerState(getCareerProgress());
    setNewProofTitle('');
    setNewProofDetail('');
    setShowAddProofModal(false);
    setCelebrationToast(`Proof of Progress logged successfully!`);
  };

  const handleSkillAction = (skill: CareerSkill) => {
    // Boost skill progress by +10%
    const updated = boostSkill(skill.name, 10);
    setCareerState(updated);
    setCelebrationToast(`Practiced ${skill.name}! Progress upgraded to ${Math.min(100, skill.progress + 10)}%.`);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-16">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {celebrationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 text-sm font-semibold text-white bg-teal-700 rounded-xl shadow-lg border border-teal-600 backdrop-blur-md"
            role="status"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse flex-shrink-0" />
            <span>{celebrationToast}</span>
            <button
              onClick={() => setCelebrationToast(null)}
              className="p-1 hover:bg-teal-800 rounded transition ml-2 text-white/80"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* =========================================================================
            HEADER BLOCK
            ========================================================================= */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-100/80 rounded-full">
              <Compass className="w-3.5 h-3.5 text-teal-700" />
              Pathfinder Career Operating System
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
              Your Career Control Center
            </h1>
            <p className="mt-1.5 text-stone-600 text-sm sm:text-base max-w-2xl">
              Track your skills, close your gaps, and move closer to your career goal.
            </p>
          </div>

          {/* QUICK TARGET ROLE BADGE */}
          <div className="flex items-center gap-3 self-center sm:self-auto">
            <div className="bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-xs flex items-center gap-2">
              <Target className="w-4 h-4 text-teal-600" />
              <div className="text-left">
                <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Target Role
                </div>
                <div className="text-sm font-bold text-stone-900">
                  {careerState.targetCareer}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
            >
              Switch Role
            </button>
          </div>
        </div>

        {/* =========================================================================
            TOP 4 SUMMARY CARDS (DYNAMIC)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. CAREER READINESS */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                Career Readiness
              </span>
              <div className="p-2 bg-teal-50 rounded-lg text-teal-700">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-teal-700">
                  {careerReadiness}%
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  {careerReadiness >= 75 ? 'Job-Ready' : careerReadiness >= 50 ? 'On Track' : 'Building'}
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Overall progress toward your target role
              </p>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${careerReadiness}%` }}
              />
            </div>
          </motion.div>

          {/* 2. SKILLS MASTERED */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                Skills Mastered
              </span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-stone-900">
                {skillsMasteredCount} / {careerState.skills.length}
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Required skills developed (≥ 70%)
              </p>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(skillsMasteredCount / (careerState.skills.length || 1)) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* 3. SKILL GAPS */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                Skill Gaps
              </span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600">
                  {skillGapsCount}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  critical gaps
                </span>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Skills that need attention (&lt; 50%)
              </p>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(skillGapsCount / (careerState.skills.length || 1)) * 100}%` }}
              />
            </div>
          </motion.div>

          {/* 4. NEXT MILESTONE / TARGET CAREER */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                Next Milestone
              </span>
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Trophy className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-stone-900 truncate">
                {careerState.targetCareer}
              </div>
              <p className="mt-1 text-xs text-stone-500">
                Target career goal
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-teal-700">
              <button
                onClick={() => setShowRoleModal(true)}
                className="hover:underline flex items-center gap-1"
              >
                Change Role <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <Link to="/roadmap" className="hover:underline text-stone-500">
                View Roadmap →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* =========================================================================
            MAIN DASHBOARD 2-COLUMN LAYOUT
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* =======================================================================
              LEFT COLUMN (COL 1-7)
              1. CAREER SKILL MAP
              2. THIS WEEK'S CAREER MISSION
              3. PROOF OF PROGRESS
              4. WHAT YOU'RE MISSING (CAREER GAP DETECTOR)
              ======================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. CAREER SKILL MAP */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <span>Career Skill Map</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                      {careerState.targetCareer}
                    </span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    See how your current skills compare with the requirements of your target role.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Strong</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500" /> Good</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Dev</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Gap</span>
                </div>
              </div>

              {/* Skill Bars List */}
              <div className="space-y-4 pt-2">
                {careerState.skills.map((skill) => {
                  const status = getSkillStatus(skill.progress);
                  const statusColor =
                    status === 'Strong' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    status === 'Good' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                    status === 'Developing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200';

                  const barColor =
                    status === 'Strong' ? 'bg-emerald-500' :
                    status === 'Good' ? 'bg-teal-500' :
                    status === 'Developing' ? 'bg-amber-500' :
                    'bg-rose-500';

                  return (
                    <div key={skill.id} className="group">
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <span className="font-semibold text-stone-800 group-hover:text-teal-700 transition-colors">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${statusColor}`}>
                            {status}
                          </span>
                          <span className="font-bold text-stone-700 w-9 text-right">
                            {skill.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          className={`h-full rounded-full ${barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.progress}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Opportunity Banner */}
              {biggestOpportunitySkill && (
                <div className="mt-6 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span>
                      Your biggest opportunity:{' '}
                      <strong className="text-teal-900 font-bold">{biggestOpportunitySkill.name}</strong> ({biggestOpportunitySkill.progress}%)
                    </span>
                  </div>
                  <button
                    onClick={() => handleSkillAction(biggestOpportunitySkill)}
                    className="font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Boost Skill <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. THIS WEEK'S CAREER MISSION */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-0.5">
                    Active Mission
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">
                    This Week's Career Mission
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {careerState.weeklyMission.title}
                  </p>
                </div>
                <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-bold text-amber-800 flex items-center gap-1.5 self-start sm:self-auto">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Reward: {careerState.weeklyMission.rewardText}</span>
                </div>
              </div>

              {/* Mission Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
                  <span>Mission Completion</span>
                  <span>{careerState.weeklyMission.progress}%</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${careerState.weeklyMission.progress}%` }}
                  />
                </div>
              </div>

              {/* Interactive Functional Checklist */}
              <div className="space-y-2.5">
                {careerState.weeklyMission.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-teal-50/50 border-teal-200 text-stone-600'
                        : 'bg-white border-stone-200 hover:border-teal-300 text-stone-900 shadow-2xs'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 flex-shrink-0 focus:outline-none"
                      aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      ) : (
                        <div className="w-4 h-4 rounded border-2 border-stone-300 hover:border-teal-500" />
                      )}
                    </button>
                    <div className="flex-1 text-xs">
                      <span className={task.completed ? 'line-through text-stone-500' : 'font-medium'}>
                        {task.text}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                      +{task.impact}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500">
                <span>Click any task to mark completed & claim readiness</span>
                <span className="font-semibold text-teal-700">
                  {careerState.weeklyMission.tasks.filter(t => t.completed).length} of {careerState.weeklyMission.tasks.length} done
                </span>
              </div>
            </div>

            {/* 3. PROOF OF PROGRESS */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Proof of Progress
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Verified evidence from projects, challenges, and certifications.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProofModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs transition self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Proof
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1.5 border-b border-stone-100 pb-3 mb-4 text-xs">
                {['All', 'Project', 'Challenge', 'Certification'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedProofFilter(filter)}
                    className={`px-3 py-1 rounded-md font-semibold transition ${
                      selectedProofFilter === filter
                        ? 'bg-teal-600 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {filter === 'All' ? 'All Proof' : `${filter}s`}
                  </button>
                ))}
              </div>

              {/* Proof Items List */}
              <div className="space-y-3">
                {filteredProof.length > 0 ? (
                  filteredProof.map((proof) => (
                    <div
                      key={proof.id}
                      className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-teal-200 transition-all flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-teal-100/70 text-teal-800 rounded-lg mt-0.5">
                          {proof.type === 'Project' ? (
                            <Code className="w-4 h-4" />
                          ) : proof.type === 'Challenge' ? (
                            <Zap className="w-4 h-4" />
                          ) : (
                            <Award className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">
                              {proof.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-semibold uppercase">
                              {proof.type}
                            </span>
                          </div>
                          {proof.detail && (
                            <p className="text-[11px] text-stone-600 mt-0.5">
                              {proof.detail}
                            </p>
                          )}
                          <div className="text-[10px] text-stone-500 mt-1 flex items-center gap-2">
                            <span>{proof.timeAgo}</span>
                            {proof.skillTag && (
                              <span className="text-teal-700 font-semibold">
                                • {proof.skillTag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-stone-500">
                    No proof recorded for this filter. Complete a project or challenge to generate evidence!
                  </div>
                )}
              </div>
            </div>

            {/* 4. WHAT YOU'RE MISSING (CAREER GAP DETECTOR) */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-stone-900">
                  What You're Missing
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Critical skills for {careerState.targetCareer} categorized into strengths and active gaps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* STRONG COLUMN */}
                <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Strong / Developed ({strongSkills.length})</span>
                  </div>
                  <div className="space-y-2">
                    {strongSkills.map((skill: CareerSkill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-emerald-100 text-xs shadow-2xs"
                      >
                        <span className="font-semibold text-stone-800">{skill.name}</span>
                        <span className="font-bold text-emerald-600">{skill.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GAPS COLUMN */}
                <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Needs Work / Gaps ({gapSkills.length})</span>
                  </div>
                  <div className="space-y-2">
                    {gapSkills.map((skill: CareerSkill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-rose-100 text-xs shadow-2xs"
                      >
                        <div>
                          <span className="font-semibold text-stone-800 block">{skill.name}</span>
                          <span className="text-[10px] text-rose-600 font-bold">{skill.progress}% (Gap)</span>
                        </div>
                        <button
                          onClick={() => handleSkillAction(skill)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded transition cursor-pointer"
                        >
                          Work on it →
                        </button>
                      </div>
                    ))}
                    {gapSkills.length === 0 && (
                      <div className="text-center py-4 text-xs font-medium text-emerald-700">
                        Awesome! No critical skill gaps detected.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* =======================================================================
              RIGHT COLUMN (COL 8-12)
              1. NEXT BEST MOVE (UNIQUE PROMINENT FEATURE)
              2. CAREER INSIGHTS
              3. TURN SKILLS INTO PROOF (UNIQUE FEATURE)
              4. LEARNING CONSISTENCY (COMPACT STREAK)
              ======================================================================= */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. UNIQUE FEATURE — NEXT BEST MOVE */}
            <motion.div
              whileHover={{ y: -2 }}
              className="p-6 bg-gradient-to-br from-teal-800 to-teal-900 rounded-xl shadow-md text-white relative overflow-hidden"
            >
              {/* Background ambient badge */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-teal-600/30 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase bg-teal-700/80 text-teal-200 rounded-full border border-teal-600/60 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Your Next Best Move
                </span>
                <span className="text-xs font-bold text-amber-300">
                  +{nextBestMove.expectedImpact}% Readiness
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white leading-snug">
                {nextBestMove.title}
              </h3>
              <p className="text-xs text-teal-100/90 mt-1.5 leading-relaxed">
                {nextBestMove.reason}
              </p>

              {/* Current vs Target status */}
              <div className="my-4 p-3.5 bg-teal-950/60 rounded-xl border border-teal-700/60 text-xs space-y-2">
                <div className="flex justify-between items-center text-teal-200">
                  <span>Current: <strong>{nextBestMove.skillName}</strong></span>
                  <span className="font-mono text-amber-300 font-bold">{nextBestMove.currentProgress}%</span>
                </div>
                <div className="w-full bg-teal-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${nextBestMove.currentProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-teal-300">
                  Recommended: <strong className="text-white">{nextBestMove.recommendation}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNextMoveModal(true)}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-teal-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{nextBestMove.actionText}</span>
                </button>
                <Link
                  to="/quiz"
                  className="px-3 py-2.5 text-xs font-semibold text-white bg-teal-700/70 hover:bg-teal-700 rounded-lg border border-teal-600/80 transition"
                >
                  Quiz Mode
                </Link>
              </div>
            </motion.div>

            {/* 2. CAREER INSIGHTS */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-stone-900">
                  Career Insights
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Actionable intelligence derived from your active skill profile.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* STRONGEST SKILL */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Strongest Skill
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">
                      {strongestSkill?.name || 'JavaScript'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {strongestSkill?.progress || 85}%
                    </span>
                  </div>
                </div>

                {/* BIGGEST GAP */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                    Biggest Gap
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">
                      {biggestOpportunitySkill?.name || 'Testing'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                      {biggestOpportunitySkill?.progress || 42}%
                    </span>
                  </div>
                </div>

                {/* CAREER OPPORTUNITY */}
                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-stone-700 leading-relaxed">
                  <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-1">
                    Career Opportunity
                  </div>
                  <p>
                    You have solid foundation fundamentals, but need more project proof in{' '}
                    <strong>{biggestOpportunitySkill?.name || 'Testing'}</strong> to reach 85%+ job readiness for {careerState.targetCareer}.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. UNIQUE FEATURE — TURN SKILLS INTO PROOF */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold text-teal-800 bg-teal-100 rounded uppercase">
                  Proof Engine
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  {skillForProof.progress}% Learned
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900">
                Turn Skills Into Proof
              </h3>
              <div className="my-2 p-3 bg-stone-50 rounded-lg border border-stone-200/70">
                <div className="font-bold text-stone-900 text-sm">{skillForProof.name}</div>
                <p className="text-xs text-stone-600 mt-1 italic">
                  "You've learned it. Now prove it."
                </p>
              </div>

              <div className="p-2.5 mb-4 bg-amber-50/80 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 font-medium">
                💡 <strong>Career Axiom:</strong> Learning ≠ Proof. Skill + Evidence = Career Value.
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="py-2.5 px-3 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs transition text-center cursor-pointer"
                >
                  Build a Project
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="py-2.5 px-3 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition text-center cursor-pointer"
                >
                  Take Challenge
                </button>
              </div>
            </div>

            {/* 4. LEARNING CONSISTENCY (COMPACT STREAK) */}
            <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Learning Consistency
                  </h3>
                  <p className="text-xs text-stone-500">
                    Weekly habit and momentum tracker
                  </p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60">
                  <div className="text-lg font-extrabold text-stone-900">{careerState.streak.currentStreak}d</div>
                  <div className="text-[10px] text-stone-500 font-medium">Current</div>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60">
                  <div className="text-lg font-extrabold text-stone-900">{careerState.streak.longestStreak}d</div>
                  <div className="text-[10px] text-stone-500 font-medium">Longest</div>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60">
                  <div className="text-lg font-extrabold text-teal-700">{careerState.streak.totalDays}d</div>
                  <div className="text-[10px] text-stone-500 font-medium">Total Days</div>
                </div>
              </div>

              {/* Weekly Day Circles (Mon - Sun) */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-2">
                  <span>This Week's Activity</span>
                  <span>{careerState.streak.activeDaysThisWeek}/7 days</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const isActive = careerState.streak.weeklyDays[i];
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {isActive ? '✓' : ''}
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: SWITCH TARGET CAREER
          ========================================================================= */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  Select Your Target Role
                </h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-stone-600 mb-4">
                Switching roles dynamically recalculates your required skills, career readiness, gaps, and weekly mission.
              </p>

              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                {Object.keys(CAREER_ROLE_TEMPLATES).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between ${
                      careerState.targetCareer === role
                        ? 'border-teal-500 bg-teal-50/70 text-teal-900 font-bold'
                        : 'border-stone-200 hover:border-teal-300 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{role}</div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {CAREER_ROLE_TEMPLATES[role].skills.length} core required skills
                      </div>
                    </div>
                    {careerState.targetCareer === role && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 2: NEXT BEST MOVE ACTION
          ========================================================================= */}
      <AnimatePresence>
        {showNextMoveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Next Best Move Action
                </h3>
                <button
                  onClick={() => setShowNextMoveModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-900">
                  <div className="font-bold text-sm mb-1">{nextBestMove.recommendation}</div>
                  <p>{nextBestMove.reason}</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between">
                    <span>Target Skill:</span>
                    <strong className="text-stone-900">{nextBestMove.skillName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Level:</span>
                    <strong className="text-amber-600">{nextBestMove.currentProgress}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Boost:</span>
                    <strong className="text-emerald-600">+{nextBestMove.expectedImpact}% Career Readiness</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={handleCompleteNextMove}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition"
                >
                  Complete Task &amp; Claim Boost
                </button>
                <button
                  onClick={() => {
                    setShowNextMoveModal(false);
                    navigate('/quiz');
                  }}
                  className="py-2.5 px-4 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                >
                  Open Quiz
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 3: BUILD A PROJECT SPEC PROMPT
          ========================================================================= */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-teal-600" />
                  Project Specification: {skillForProof.name} Proof
                </h3>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-900">
                  <div className="font-bold text-sm">Real-World Project Challenge</div>
                  <p className="mt-1 text-xs">
                    Build a production-grade <strong>{skillForProof.name}</strong> interactive dashboard with modular state management and responsive UI.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-800">Key Deliverables:</div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                    <li>Clean component hierarchy with TypeScript types</li>
                    <li>Responsive layouts adhering to accessibility standards</li>
                    <li>Comprehensive documentation and public GitHub repository</li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => {
                    addProofOfProgress({
                      title: `Built ${skillForProof.name} Showcase Project`,
                      type: 'Project',
                      timeAgo: 'Just now',
                      verified: true,
                      detail: `Production architecture project demonstrating ${skillForProof.name}.`,
                      skillTag: skillForProof.name,
                    });
                    setCareerState(getCareerProgress());
                    setShowProjectModal(false);
                    setCelebrationToast(`Project logged into Proof of Progress!`);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition"
                >
                  Mark Project as Completed
                </button>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="py-2.5 px-4 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL 4: ADD CUSTOM PROOF ITEM
          ========================================================================= */}
      <AnimatePresence>
        {showAddProofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex justify-between items-center pb-3 border-b border-stone-200 mb-4">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600" />
                  Log Career Evidence
                </h3>
                <button
                  onClick={() => setShowAddProofModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCustomProof} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Proof Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack E-Commerce API, LeetCode 100 Days"
                    value={newProofTitle}
                    onChange={(e) => setNewProofTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Evidence Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Project', 'Challenge', 'Certification'] as const).map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setNewProofType(type)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${
                          newProofType === type
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Details / Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GitHub repo link, course URL, or summary"
                    value={newProofDetail}
                    onChange={(e) => setNewProofDetail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-stone-900"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition"
                  >
                    Save Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProofModal(false)}
                    className="py-2.5 px-4 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}