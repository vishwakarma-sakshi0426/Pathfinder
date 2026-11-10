import { motion } from 'framer-motion';
import {
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import type { RoadmapMapping } from '@/data/roadmapMappings';

interface RoadmapReadyCardProps {
  mapping: RoadmapMapping;
  onContinue: () => void;
  onCustomAiRoadmap: () => void;
}

export default function RoadmapReadyCard({
  mapping,
  onContinue,
  onCustomAiRoadmap
}: RoadmapReadyCardProps) {
  return (
    <motion.div
      className="p-8 mb-12 bg-white border shadow-md rounded-2xl border-stone-200/80 backdrop-blur-sm"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header section with badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-stone-100">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide text-teal-800 rounded-full bg-teal-50 border border-teal-200/70">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
            Your Roadmap Is Ready
          </span>
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-stone-500 rounded-full bg-stone-100">
            External Learning Resource
          </span>
        </div>
        <div className="text-xs font-medium text-stone-400">
          Powered by <span className="font-semibold text-stone-600">roadmap.sh</span>
        </div>
      </div>

      {/* Main Roadmap Information */}
      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-600 sm:text-3xl">
            {mapping.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            We&apos;ve identified the right learning path based on your requirements.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/60">
          <p className="text-sm text-stone-700 leading-relaxed">
            {mapping.description}
          </p>

          {mapping.estimatedWeeks && (
            <div className="flex items-center mt-3 text-xs font-medium text-stone-500">
              <Clock className="w-4 h-4 mr-1.5 text-teal-600" />
              <span>Recommended Duration: {mapping.estimatedWeeks}</span>
            </div>
          )}
        </div>

        {/* Key Curriculum Highlights */}
        {mapping.highlights && mapping.highlights.length > 0 && (
          <div className="pt-2">
            <h4 className="flex items-center text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              Key Topics &amp; Milestones Included
            </h4>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {mapping.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start p-2.5 rounded-lg bg-stone-50/50 border border-stone-100 text-xs text-stone-700"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-2 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to action buttons */}
        <div className="pt-6 mt-6 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition duration-200 ease-in-out bg-teal-600 rounded-xl shadow-md hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Continue to Roadmap</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </motion.button>

            <a
              href={mapping.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-3 text-xs font-medium text-stone-600 transition-colors bg-stone-100 rounded-xl hover:bg-stone-200 hover:text-stone-800"
            >
              <span>{mapping.title} Roadmap</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={onCustomAiRoadmap}
            className="text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline py-2 sm:py-0 text-center sm:text-right"
          >
            Explore step-by-step stages below ↓
          </button>
        </div>
      </div>
    </motion.div>
  );
}
