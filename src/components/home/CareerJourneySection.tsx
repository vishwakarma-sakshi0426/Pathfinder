import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Target,
  Compass,
  Map,
  TrendingUp,
  FileText,
  Trophy,
  Sparkles
} from 'lucide-react';

interface JourneyStage {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isDestination?: boolean;
}

const STAGES: JourneyStage[] = [
  {
    step: '01',
    title: 'Assess Yourself',
    description: 'Understand your skills, interests, strengths, and career preferences.',
    icon: Target
  },
  {
    step: '02',
    title: 'Explore Careers',
    description: 'Discover career paths and roles that match your profile.',
    icon: Compass
  },
  {
    step: '03',
    title: 'Generate Roadmap',
    description: 'Get a personalized step-by-step roadmap showing what to learn and when.',
    icon: Map
  },
  {
    step: '04',
    title: 'Build Skills',
    description: 'Follow your roadmap, build relevant skills, complete projects, and improve.',
    icon: TrendingUp
  },
  {
    step: '05',
    title: 'Create Resume',
    description: 'Turn your skills and projects into a professional, job-ready resume.',
    icon: FileText
  },
  {
    step: '06',
    title: 'Get Hired',
    description: 'Use your preparation to apply confidently and move toward your target role.',
    icon: Trophy,
    isDestination: true
  }
];

export default function CareerJourneySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800"
    >
      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight text-white mb-4">
            One Platform. Your Entire{' '}
            <span className="text-amber-400 font-medium">Career Journey.</span>
          </h2>
          <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto leading-relaxed">
            From discovering your strengths to becoming job-ready — everything you need in one place.
          </p>
        </motion.div>

        {/* Journey Timeline Container */}
        <div className="relative">
          {/* Desktop Horizontal Connecting Line */}
          <div
            className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-teal-400/40 via-teal-300/50 to-amber-400/80 z-0"
            aria-hidden="true"
          />

          {/* Mobile/Tablet Vertical Connecting Line */}
          <div
            className="lg:hidden absolute top-6 bottom-6 left-6 sm:left-7 w-0.5 bg-gradient-to-b from-teal-400/50 via-teal-300/50 to-amber-400/80 z-0"
            aria-hidden="true"
          />

          {/* Stages Grid / List */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 sm:gap-6 lg:gap-4 relative z-10">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <motion.div
                  key={stage.step}
                  initial={{ opacity: 0, y: 25 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                  className="relative flex flex-col group pl-14 sm:pl-16 lg:pl-0"
                >
                  {/* Numbered Indicator Node */}
                  <div className="absolute left-0 top-0 lg:static lg:mb-5 lg:mx-auto flex items-center justify-center">
                    {stage.isDestination ? (
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 border-2 border-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-400/30 transition-transform duration-200 group-hover:scale-110">
                        <span className="text-xs font-extrabold text-stone-900 tracking-wider">
                          {stage.step}
                        </span>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-900/90 border-2 border-teal-300/70 text-teal-100 shadow-md backdrop-blur-sm transition-all duration-200 group-hover:border-white group-hover:bg-teal-700 group-hover:scale-105">
                        <span className="text-xs font-bold tracking-wider">
                          {stage.step}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stage Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col justify-between h-full p-4 sm:p-5 rounded-xl shadow-md transition-all duration-200 ${
                      stage.isDestination
                        ? 'bg-white border-2 border-amber-400/90 shadow-amber-500/10 ring-2 ring-amber-400/20'
                        : 'bg-white border border-stone-100 hover:border-teal-200 hover:shadow-lg'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon + Indicator Label */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            stage.isDestination
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        {stage.isDestination ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 rounded-md">
                            <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-600" />
                            Destination
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-teal-700">
                            Stage {stage.step}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-sm sm:text-base font-bold mb-1.5 leading-snug ${
                          stage.isDestination ? 'text-stone-900' : 'text-stone-800'
                        }`}
                      >
                        {stage.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs leading-relaxed text-stone-600">
                        {stage.description}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
