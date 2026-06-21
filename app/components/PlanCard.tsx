'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, BookOpen, Download, FileText, FileCode, Loader2, Sparkles, CheckCircle2, Flag } from 'lucide-react';
import { exportToPDF as exportPlanToPDF, exportToDocx as exportPlanToDocx } from '@/utils/exportData';

interface PlanCardProps {
  subject?: string;
  topics?: string;
  examDate?: string;
  loading?: boolean;
  planContent?: {
    title: string;
    weeks: Array<{
      weekNumber: number;
      focus: string;
      milestones: string[];
    }>;
  };
}

export default function PlanCard({ 
  subject = '', 
  topics = '', 
  examDate = '', 
  loading = false, 
  planContent 
}: PlanCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const displayTitle = planContent?.title || subject;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type: 'pdf' | 'docx') => {
    if (!planContent) return;
    const payload = {
      title: displayTitle,
      content: `Subject: ${subject}\nTopics: ${topics}\nExam Date: ${examDate}`,
      headers: ['Week', 'Focus', 'Milestones'],
      rows: (planContent.weeks || []).map((week) => [
        week.weekNumber.toString(),
        week.focus,
        week.milestones.join(', '),
      ]),
    };

    if (type === 'pdf') exportPlanToPDF(payload);
    if (type === 'docx') exportPlanToDocx(payload);
    setDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl animate-pulse min-h-[480px]">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          <div className="md:w-1/3 space-y-4 border-r border-zinc-100 dark:border-zinc-800 pr-4">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="space-y-2 pt-4">
              <div className="h-10 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
              <div className="h-10 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl" />
            </div>
          </div>
          <div className="md:w-2/3 space-y-4 flex-1">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
            <div className="h-24 bg-zinc-100 dark:bg-zinc-800/40 rounded-xl" />
            <div className="h-24 bg-zinc-100 dark:bg-zinc-800/40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!planContent) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Top Meta Panel */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-1 min-w-0">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/10">
            Syllabus Core Framework
          </span>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 truncate" title={displayTitle}>
            {displayTitle}
          </h3>
        </div>

        {/* Action Export Button Container */}
        <div className="relative inline-block text-left self-start sm:self-center" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all shadow-sm active:scale-98"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span>Export Matrix</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl z-50 overflow-hidden divide-y divide-zinc-50 dark:divide-zinc-800/50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
              <div className="py-1">
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex items-center w-full px-4 py-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-left gap-2.5"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  <span>Download as PDF Report</span>
                </button>
                <button
                  onClick={() => handleExport('docx')}
                  className="flex items-center w-full px-4 py-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors text-left gap-2.5"
                >
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <span>Download as Word Docx</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Structural Layout Split Flex */}
      <div className="flex flex-col md:flex-row h-[480px]">
        
        {/* Left Navigation Pillar: Quick Week Trackers */}
        <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 p-4 overflow-y-auto shrink-0 space-y-1.5 scrollbar-none">
          <div className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase px-2 mb-2">
            Timeline Index
          </div>
          {planContent.weeks?.map((week) => {
            const isSelected = activeWeek === week.weekNumber;
            return (
              <button
                key={week.weekNumber}
                type="button"
                onClick={() => setActiveWeek(week.weekNumber)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-semibold' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 text-sm'
                }`}
              >
                <span className="truncate pr-2">Week {week.weekNumber}</span>
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-200' : 'text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Execution Track: Dedicated Focus Workspace Container */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white dark:bg-zinc-900 scrollbar-thin scrollbar-thumb-zinc-100 dark:scrollbar-thumb-zinc-800">
          {planContent.weeks?.filter(w => w.weekNumber === activeWeek).map((week) => (
            <div key={week.weekNumber} className="space-y-6 animate-in fade-in-40 duration-200">
              
              {/* Highlight Focus Header Block */}
              <div className="p-4 rounded-xl bg-indigo-500/[0.03] dark:bg-indigo-500/[0.01] border border-indigo-500/10 flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Primary Objective
                  </h4>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5 leading-relaxed">
                    {week.focus}
                  </p>
                </div>
              </div>

              {/* Milestones Decongested Track Grid */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Actionable Milestones
                </h5>
                <div className="grid grid-cols-1 gap-2.5">
                  {week.milestones?.map((milestone, idx) => (
                    <div 
                      key={idx}
                      className="group flex items-start gap-3 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-950/30 hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-200"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 group-hover:border-indigo-500/30 group-hover:text-indigo-500 transition-colors mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                        {milestone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Bottom Layout Meta Footer */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 px-6 bg-zinc-50/30 dark:bg-zinc-950/10 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0 font-medium">
        <div className="flex items-center gap-1.5 min-w-0">
          <BookOpen className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
          <span className="truncate" title={topics}>Scope: {topics}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>Deadline: {examDate}</span>
        </div>
      </div>

    </div>
  );
}