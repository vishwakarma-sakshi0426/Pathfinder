import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Layers,
  Clock,
  Sparkles,
  Compass
} from 'lucide-react';
import { ROADMAP_MAPPINGS, type RoadmapMapping } from '@/data/roadmapMappings';

export default function RoadmapViewer() {
  const [searchParams] = useSearchParams();
  const roadmapId = searchParams.get('id') || 'dsa';

  const mapping: RoadmapMapping = ROADMAP_MAPPINGS[roadmapId] || ROADMAP_MAPPINGS.dsa;

  const [attemptEmbed, setAttemptEmbed] = useState(false);

  const handleOpenExternal = () => {
    window.open(mapping.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm">
        <div className="max-w-6xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Back link and Title */}
            <div className="flex items-center space-x-4">
              <Link
                to="/roadmap"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors bg-stone-100 rounded-lg hover:bg-stone-200 hover:text-stone-900"
                aria-label="Back to Pathfinder Roadmap Generator"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                ← Back to Pathfinder
              </Link>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-stone-900 sm:text-xl">
                    {mapping.title}
                  </h1>
                  <span className="hidden px-2 py-0.5 text-xs font-medium text-teal-800 rounded bg-teal-50 border border-teal-200 sm:inline-block">
                    External Learning Resource
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Open Action */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleOpenExternal}
                className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white transition-all bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 hover:shadow"
              >
                <span>Open Roadmap</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fallback & Overview Experience (Strictly respects X-Frame-Options SAMEORIGIN) */}
          <div className="overflow-hidden bg-white border shadow-md rounded-2xl border-stone-200/80">
            {/* Banner Top */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-300" />
                  Your roadmap is ready
                </span>
                <span className="text-xs text-teal-200">
                  Powered by <strong className="text-white">roadmap.sh</strong>
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                {mapping.title}
              </h2>
              <p className="mt-2 text-sm text-teal-100 max-w-2xl leading-relaxed">
                {mapping.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-teal-600/50">
                <button
                  onClick={handleOpenExternal}
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-teal-900 transition-transform bg-white rounded-xl shadow-lg hover:bg-teal-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Open Roadmap ↗</span>
                </button>

                <p className="text-xs text-teal-200">
                  Continue to the roadmap on roadmap.sh for the complete interactive tree.
                </p>
              </div>
            </div>

            {/* Curriculum Breakdown & Guidance */}
            <div className="p-6 sm:p-8 bg-white space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    <Clock className="w-4 h-4 mr-1.5 text-teal-600" />
                    Estimated Commitment
                  </div>
                  <div className="text-base font-bold text-stone-800 mt-1">
                    {mapping.estimatedWeeks || '12 - 16 weeks'}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Self-paced learning recommendation</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    <Layers className="w-4 h-4 mr-1.5 text-teal-600" />
                    Curriculum Scope
                  </div>
                  <div className="text-base font-bold text-stone-800 mt-1">
                    Comprehensive Path
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Foundational to advanced patterns</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-600" />
                    Resource Attribution
                  </div>
                  <div className="text-base font-bold text-stone-800 mt-1">
                    Community Verified
                  </div>
                  <div className="text-xs text-stone-500 mt-1">roadmap.sh open curriculum</div>
                </div>
              </div>

              {/* Milestones / Highlights */}
              <div>
                <h3 className="flex items-center text-sm font-semibold text-stone-800 mb-3">
                  <Compass className="w-4 h-4 mr-2 text-teal-600" />
                  What you will learn in this roadmap:
                </h3>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {mapping.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start p-3 rounded-lg bg-stone-50 border border-stone-200/60 text-xs sm:text-sm text-stone-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2.5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seamless Action Box */}
              <div className="p-5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-teal-900">
                    Ready to begin your journey?
                  </h4>
                  <p className="text-xs text-teal-700">
                    Click below to open the full interactive roadmap with checklists, articles, and quizzes.
                  </p>
                </div>
                <button
                  onClick={handleOpenExternal}
                  className="inline-flex items-center px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 rounded-lg shadow hover:bg-teal-700 transition duration-150 flex-shrink-0"
                >
                  <span>Open Roadmap ↗</span>
                </button>
              </div>

              {/* Optional embedded iframe attempt check (Strict adherence to CSP & browser security) */}
              <div className="pt-4 border-t border-stone-100 text-center">
                {!attemptEmbed ? (
                  <button
                    type="button"
                    onClick={() => setAttemptEmbed(true)}
                    className="text-xs text-stone-400 hover:text-stone-600 transition-colors underline"
                  >
                    Check browser embedded viewer compatibility
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-left">
                    <p className="text-xs text-stone-600 mb-2">
                      <strong>Security Policy Notice:</strong> <span className="font-mono">roadmap.sh</span> protects its content with strict <span className="font-mono">X-Frame-Options: SAMEORIGIN</span> headers. Modern web security prevents third-party sites from framing their pages to protect user sessions.
                    </p>
                    <p className="text-xs text-stone-500">
                      Pathfinder respects all CSP and iframe restrictions. You can access the complete roadmap anytime using the button above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
