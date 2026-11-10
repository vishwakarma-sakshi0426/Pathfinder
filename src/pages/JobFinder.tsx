import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight,
  Filter,
  RefreshCw,
  Compass,
  CheckSquare,
  Square
} from 'lucide-react';
import {
  searchJobs,
  type JobPreference,
  type JobMatchResult,
} from '@/services/jobService';
import { getCareerProgress } from '@/services/careerProgressService';

export default function JobFinder() {
  const careerState = useMemo(() => getCareerProgress(), []);

  // Form State
  const [role, setRole] = useState(careerState.targetCareer || 'Frontend Developer');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(() => {
    if (careerState.skills && careerState.skills.length > 0) {
      return careerState.skills.slice(0, 4).map(s => s.name);
    }
    return ['React', 'JavaScript', 'HTML', 'CSS'];
  });
  const [experience, setExperience] = useState<JobPreference['experience']>('Fresher');
  const [workPreference, setWorkPreference] = useState<JobPreference['workPreference']>('Full-time');
  const [locationType, setLocationType] = useState<JobPreference['locationType']>('On-site');
  const [specificLocation, setSpecificLocation] = useState('Mumbai');
  const [indiaOnly, setIndiaOnly] = useState(true); // Default India-Only enabled
  const [company, setCompany] = useState('');

  // Search execution state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [jobResults, setJobResults] = useState<JobMatchResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter & Sort State
  const [sortBy, setSortBy] = useState<'best' | 'recent' | 'salary'>('best');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [locFilter, setLocFilter] = useState<string>('All');

  // Loading animation progression
  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 550);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Skill tag add/remove
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Indian Cities & Hub Presets
  const indianCityPresets = [
    'Mumbai',
    'Bangalore',
    'Delhi NCR',
    'Pune',
    'Hyderabad',
    'Remote',
    'Indore',
    'Chennai'
  ];

  // Perform search
  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!role.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const preferences: JobPreference = {
        role: role.trim(),
        skills,
        experience,
        workPreference,
        location: locationType === 'Remote' ? 'Remote' : (specificLocation.trim() || 'Mumbai'),
        locationType,
        indiaOnly,
        company: company.trim() || undefined,
      };

      const response = await searchJobs(preferences);
      setJobResults(response.jobs);
    } catch (err) {
      console.error('Job search failed:', err);
      setErrorMessage('Unable to fetch live job opportunities at the moment. Please try again shortly.');
      setJobResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [role, skills, experience, workPreference, locationType, specificLocation, indiaOnly, company]);

  // Run initial search on mount
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort results
  const filteredJobs = useMemo(() => {
    let result = [...jobResults];

    // Filter by work type
    if (typeFilter !== 'All') {
      result = result.filter(j =>
        j.workType.toLowerCase().includes(typeFilter.toLowerCase()) ||
        j.description.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    // Filter by location
    if (locFilter === 'Remote') {
      result = result.filter(j => j.isRemote || j.location.toLowerCase().includes('remote'));
    } else if (locFilter === 'On-site') {
      result = result.filter(j => !j.isRemote && !j.location.toLowerCase().includes('remote'));
    } else if (locFilter === 'Hybrid') {
      result = result.filter(j => j.location.toLowerCase().includes('hybrid') || j.description.toLowerCase().includes('hybrid'));
    }

    // Sort
    if (sortBy === 'best') {
      // Local proximity first, then score
      result.sort((a, b) => {
        if (b.locationScore !== a.locationScore) return b.locationScore - a.locationScore;
        return b.matchPercentage - a.matchPercentage;
      });
    } else if (sortBy === 'recent') {
      result.sort((a, b) => {
        const aScore = (a.postedAt || '').includes('Just') ? 10 : (a.postedAt || '').includes('1 day') ? 8 : 5;
        const bScore = (b.postedAt || '').includes('Just') ? 10 : (b.postedAt || '').includes('1 day') ? 8 : 5;
        return bScore - aScore;
      });
    } else if (sortBy === 'salary') {
      result.sort((a, b) => {
        const aHasSalary = a.salary && !a.salary.includes('not specified') ? 1 : 0;
        const bHasSalary = b.salary && !b.salary.includes('not specified') ? 1 : 0;
        return bHasSalary - aHasSalary;
      });
    }

    return result;
  }, [jobResults, typeFilter, locFilter, sortBy]);

  const scrollToPreferences = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* =========================================================================
            HEADER BLOCK
            ========================================================================= */}
        <div className="mb-8 border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 text-xs font-semibold tracking-wide text-teal-800 uppercase bg-teal-100/80 rounded-full">
            <Compass className="w-3.5 h-3.5 text-teal-700" />
            Pathfinder India &amp; Local Job Matcher
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Find Your Matched Jobs
          </h1>
          <p className="mt-1.5 text-stone-600 text-sm sm:text-base max-w-3xl">
            Discover verified tech opportunities in India and near your city, matched against your actual skills and experience level.
          </p>
        </div>

        {/* =========================================================================
            PREFERENCES FORM CARD
            ========================================================================= */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10">
          <form onSubmit={handleSearch} className="space-y-6">

            {/* 1. ROLE INPUT */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Job Domain / Target Role
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Analyst, Software Engineer"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-stone-900 text-sm font-medium transition"
              />
            </div>

            {/* 2. SKILLS TAGS */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Skills &amp; Technologies
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-stone-300 bg-stone-50/50 min-h-[48px]">
                {skills.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/80 text-teal-900 border border-teal-200 rounded-lg text-xs font-semibold"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="text-teal-700 hover:text-rose-600 transition ml-0.5"
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder={skills.length === 0 ? "Type skills (e.g. React, SQL) and press Enter" : "Add more skills..."}
                  className="flex-1 min-w-[140px] bg-transparent outline-none text-xs text-stone-800 placeholder-stone-400 py-1 px-1"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5">
                Type a skill and press <kbd className="px-1 py-0.5 bg-stone-200 rounded text-[10px]">Enter</kbd> to add.
              </p>
            </div>

            {/* 3. EXPERIENCE & WORK PREFERENCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Experience Level
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Fresher', '0–1 Years', '1–3 Years', '3–5 Years', '5+ Years'] as const).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setExperience(lvl)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition text-center ${
                        experience === lvl
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Preference */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Work Preference
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setWorkPreference(type)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition text-center ${
                        workPreference === type
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. LOCATION SELECTION WITH INDIAN CITIES */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Target Location / City in India
                </label>

                {/* INDIA ONLY CHECKBOX (Requirement 7) */}
                <button
                  type="button"
                  onClick={() => setIndiaOnly(!indiaOnly)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 cursor-pointer self-start sm:self-auto"
                >
                  {indiaOnly ? (
                    <CheckSquare className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                  <span>Show jobs in India only</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-2">
                  {(['On-site', 'Hybrid', 'Remote'] as const).map(mode => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => {
                        setLocationType(mode);
                        if (mode === 'Remote') setSpecificLocation('Remote');
                      }}
                      className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition text-center ${
                        locationType === mode
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* City Input */}
                <div className="md:col-span-2 relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={specificLocation}
                    onChange={(e) => setSpecificLocation(e.target.value)}
                    placeholder="Enter city (e.g. Mumbai, Bangalore, Pune, Delhi NCR, Remote)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-stone-900 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Quick Indian City Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] font-semibold text-stone-500 mr-1">Popular Indian Hubs:</span>
                {indianCityPresets.map(city => (
                  <button
                    type="button"
                    key={city}
                    onClick={() => {
                      setSpecificLocation(city);
                      if (city === 'Remote') setLocationType('Remote');
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                      specificLocation.toLowerCase() === city.toLowerCase()
                        ? 'bg-teal-50 text-teal-800 border-teal-300 font-bold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. OPTIONAL PREFERRED COMPANY */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Preferred Company (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Zepto, Swiggy, Razorpay, Tata, Infosys, Zomato"
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs outline-none focus:border-teal-500"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-100">
              <div className="text-xs text-stone-500">
                Prioritizes local companies &amp; startups in {specificLocation || 'India'} with direct application links.
              </div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Searching India Opportunities...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-amber-300" />
                    <span>FIND MY JOBS</span>
                  </>
                )}
              </motion.button>
            </div>

          </form>
        </div>

        {/* =========================================================================
            LOADING STATE (Requirement 9)
            ========================================================================= */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 mb-10 bg-white rounded-2xl border border-teal-200 shadow-sm text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-teal-200 border-t-teal-700 rounded-full animate-spin" />
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                Finding opportunities for you...
              </h3>
              <div className="max-w-md mx-auto space-y-2 text-xs text-stone-600 mt-4 text-left">
                <div className={`flex items-center gap-2 ${loadingStep >= 0 ? 'text-teal-800 font-semibold' : 'text-stone-400'}`}>
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Searching live jobs in {specificLocation || 'India'}</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 1 ? 'text-teal-800 font-semibold' : 'text-stone-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 1 ? 'text-teal-600' : 'text-stone-300'}`} />
                  <span>Matching your skills ({skills.slice(0, 3).join(', ')})</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 2 ? 'text-teal-800 font-semibold' : 'text-stone-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 2 ? 'text-teal-600' : 'text-stone-300'}`} />
                  <span>Checking experience ({experience}) &amp; work type</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 3 ? 'text-teal-800 font-semibold' : 'text-stone-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 3 ? 'text-teal-600' : 'text-stone-300'}`} />
                  <span>Prioritizing local &amp; Indian companies</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR STATE */}
        {errorMessage && !isLoading && (
          <div className="p-4 mb-8 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSearch()}
              className="font-bold underline text-teal-800 hover:text-teal-900 cursor-pointer ml-3"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =========================================================================
            RESULTS SECTION
            ========================================================================= */}
        {!isLoading && hasSearched && (
          <div>
            {/* RESULTS HEADER & FILTER CONTROLS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                  <span>Jobs Matched For You</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
                  </span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Local-first ordering for {specificLocation || 'India'} ranked by relevance &amp; match score
                </p>
              </div>

              {/* SORT & FILTER CONTROLS */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                {/* SORT */}
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-500 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="best">Best Match (Local First)</option>
                    <option value="recent">Most Recent</option>
                    <option value="salary">Highest Salary (₹)</option>
                  </select>
                </div>

                {/* WORK TYPE FILTER */}
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                  <Filter className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-500 font-medium">Type:</span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* LOCATION FILTER */}
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-stone-500 font-medium">Location:</span>
                  <select
                    value={locFilter}
                    onChange={(e) => setLocFilter(e.target.value)}
                    className="bg-transparent font-semibold text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="On-site">Local On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>

            {/* =====================================================================
                JOB CARDS LIST (Requirement 12: Matches prompt specification)
                ===================================================================== */}
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* CARD TOP ROW: Title & Match Score Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-stone-900 group-hover:text-teal-700 transition">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-600">
                            <span className="font-bold text-stone-900 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-stone-500" />
                              {job.company}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold text-[11px] border border-teal-200">
                              Source: {job.applySource}
                            </span>
                          </div>
                        </div>

                        {/* MATCH PERCENTAGE PILL */}
                        <div className="self-start sm:self-auto flex items-center gap-2">
                          <div className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-extrabold text-sm flex items-center gap-1.5 shadow-2xs">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>{job.matchPercentage}% Match</span>
                          </div>
                        </div>
                      </div>

                      {/* PILLS: Location (📍), Work Type (💼), Fresher (🎓), Salary (💰 in ₹) */}
                      <div className="flex flex-wrap items-center gap-2.5 my-3 text-xs">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
                          📍 {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
                          💼 {job.workType}
                        </span>
                        {job.isFresherFriendly && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                            🎓 Fresher
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                          💰 {job.salary}
                        </span>
                      </div>

                      {/* SKILL TAGS */}
                      <div className="flex flex-wrap items-center gap-1.5 my-2.5">
                        {job.skills.slice(0, 6).map((sk) => (
                          <span
                            key={sk}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-stone-100 text-stone-700"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* MATCH REASONS BREAKDOWN */}
                      <div className="my-3 pt-3 border-t border-stone-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
                        {job.matchReasons.map((reason, rIdx) => (
                          <span key={rIdx} className="font-semibold text-emerald-700 flex items-center gap-1">
                            {reason}
                          </span>
                        ))}
                      </div>

                      {/* DESCRIPTION SNIPPET */}
                      {job.description && (
                        <p className="text-xs text-stone-500 line-clamp-2 my-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* CARD FOOTER: Posted Date + REAL APPLY BUTTON */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Posted {job.postedAt || 'recently'}</span>
                      </div>

                      {/* EXACT JOB APPLY BUTTON (Requirement 4 & 5) */}
                      {job.applyUrl ? (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition cursor-pointer self-start sm:self-auto"
                        >
                          <span>{job.isExactUrl ? 'APPLY NOW' : 'VIEW JOB'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-stone-400 italic">Listing link unavailable</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="p-10 bg-white rounded-2xl border border-stone-200 shadow-xs text-center max-w-xl mx-auto">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">
                  No strong matches found.
                </h3>
                <p className="text-xs text-stone-600 mb-6">
                  We couldn't find active opportunities matching all your exact parameters right now.
                </p>

                <div className="p-4 bg-stone-50 rounded-xl text-left text-xs space-y-2 text-stone-700 mb-6">
                  <div className="font-bold text-stone-800">Helpful Suggestions:</div>
                  <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
                    <li>Try a broader job role (e.g. "Software Engineer" or "Web Developer")</li>
                    <li>Add more work types (enable Full-time and Internship)</li>
                    <li>Expand your location (select Remote or All India)</li>
                    <li>Remove some skill restrictions to capture wider listings</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={scrollToPreferences}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <span>MODIFY PREFERENCES</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
