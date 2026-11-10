import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoadmapTransitionModalProps {
  isOpen: boolean;
  roadmapTitle: string;
  onComplete: () => void;
}

export default function RoadmapTransitionModal({
  isOpen,
  roadmapTitle,
  onComplete
}: RoadmapTransitionModalProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Analyzing curriculum structure...');

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStatusText('Analyzing curriculum structure...');
      return;
    }

    const timer1 = setTimeout(() => {
      setProgress(40);
      setStatusText('Aligning learning milestones...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(80);
      setStatusText('Connecting to your personalized roadmap...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Roadmap ready!');
    }, 1350);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="w-full max-w-md p-8 text-center bg-white border shadow-2xl rounded-2xl border-stone-100"
            initial={{ scale: 0.92, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          >
            {/* Animated Compass Icon */}
            <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 rounded-full bg-teal-100/70"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-inner bg-gradient-to-tr from-teal-700 to-teal-500 text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <Compass className="w-8 h-8" />
                </motion.div>
              </div>
              <motion.div
                className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-sm text-teal-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles size={16} />
              </motion.div>
            </div>

            {/* Titles */}
            <h3 className="text-xl font-bold text-stone-800 sm:text-2xl">
              Preparing your learning path...
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Connecting you to your personalized roadmap
            </p>

            {/* Target Roadmap Badge */}
            <div className="inline-flex items-center px-3 py-1.5 mt-4 text-xs font-semibold text-teal-800 rounded-full bg-teal-50 border border-teal-200">
              <span className="w-2 h-2 mr-2 bg-teal-500 rounded-full animate-ping" />
              {roadmapTitle}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full h-2 overflow-hidden rounded-full bg-stone-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                />
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-stone-500">
                <span className="flex items-center">
                  {progress === 100 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600 inline" />
                  ) : null}
                  {statusText}
                </span>
                <span className="font-medium text-stone-700">{progress}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
