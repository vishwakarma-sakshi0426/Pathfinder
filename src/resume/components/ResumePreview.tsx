import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Loader2 } from 'lucide-react';
import type { FormDataType, ResumeTemplate } from '../types';
import { RESUME_TEMPLATES } from '../constants';
import { ResumeRenderer } from '../templates';
import { exportToPDF } from '../pdfExport';

interface ResumePreviewProps {
  formData: FormDataType;
  template: ResumeTemplate;
  onClose: () => void;
  onSelectTemplate?: (template: ResumeTemplate) => void;
}

export const ResumePreview = React.memo(function ResumePreview({
  formData,
  template,
  onClose,
  onSelectTemplate,
}: ResumePreviewProps) {
  const [currentTemplate, setCurrentTemplate] = useState<ResumeTemplate>(template);
  const [isExporting, setIsExporting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTemplate(template);
  }, [template]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTemplateChange = (tpl: ResumeTemplate) => {
    setCurrentTemplate(tpl);
    if (onSelectTemplate) {
      onSelectTemplate(tpl);
    }
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    try {
      setIsExporting(true);
      await exportToPDF(formData, printRef.current);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Failed to generate PDF. Error: ' + message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Resume preview"
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="relative w-full max-w-6xl bg-stone-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-stone-800"
      >
        {/* TOP CONTROLS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6 bg-stone-950 border-b border-stone-800 text-white">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Resume Preview</span>
              <span className="text-xs px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/60 font-medium">
                {currentTemplate.name} Template
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              Interactive A4 rendered preview based on the reference design specification
            </p>
          </div>

          {/* Template Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
            {RESUME_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleTemplateChange(tpl)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentTemplate.id === tpl.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                {tpl.name}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500 shadow transition disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download PDF
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 rounded-lg transition-colors hover:text-white hover:bg-stone-800"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE DESK CANVAS PREVIEW */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-stone-900/90 flex justify-center items-start">
          <div className="transform scale-[0.75] sm:scale-[0.85] md:scale-95 lg:scale-100 origin-top transition-transform duration-200 shadow-2xl">
            <div ref={printRef}>
              <ResumeRenderer templateId={currentTemplate.id} data={formData} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-3 bg-stone-950 border-t border-stone-800 text-xs text-stone-400">
          <div>
            Format: Standard A4 (210mm × 297mm) • Real Selectable Content
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-stone-300 rounded hover:text-white hover:bg-stone-800 transition"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});