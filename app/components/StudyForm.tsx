'use client';

import { useState } from 'react';
import { Sparkles, Loader2, BookOpen, Calendar, FileText, Flame, Shield, Zap } from 'lucide-react';
import { GeneratedPlan } from '../page';

interface StudyFormProps {
  onPlanGenerated: (plan: GeneratedPlan) => void;
}

export default function StudyForm({ onPlanGenerated }: StudyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    subject: '', 
    topics: '', 
    examDate: '',
    intensity: 'Balanced'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.data) {
        onPlanGenerated({
          subject: formData.subject,
          topics: formData.topics,
          examDate: formData.examDate,
          intensity: formData.intensity,
          plan_content: result.data,
        });
      } else {
        alert('Generation failed. Please verify configurations.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const intensityOptions = [
    {
      id: 'Cram Mode',
      title: 'Cram Mode',
      desc: 'Aggressive, high workload.',
      icon: Flame,
      badgeStyles: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 'Balanced',
      title: 'Balanced',
      desc: 'Steady, structured pacing.',
      icon: Shield,
      badgeStyles: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      id: 'Deep Dive',
      title: 'Deep Dive',
      desc: 'Detailed breakdowns.',
      icon: Zap,
      badgeStyles: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20'
    }
  ];

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl"
    >
      {/* Subject Input Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <BookOpen className="w-3.5 h-3.5" /> Subject
        </label>
        <input 
          type="text" 
          required
          placeholder="e.g., Advanced Econometrics"
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900/80 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>

      {/* Topics Textarea Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <FileText className="w-3.5 h-3.5" /> Topics to cover
        </label>
        <textarea 
          required
          rows={3}
          placeholder="e.g., Time series analysis, Autocorrelation, Heteroskedasticity"
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900/80 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 resize-none"
          value={formData.topics}
          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
        />
      </div>
      
      {/* Dynamic Intensity Level Interactive Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">
          Pacing Intensity
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {intensityOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = formData.intensity === opt.id;
            
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormData({ ...formData, intensity: opt.id })}
                className={`flex flex-col items-start p-4 text-left rounded-xl border transition-all duration-200 focus:outline-none ${
                  isSelected 
                    ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className={`p-2 rounded-lg mb-3 border ${opt.badgeStyles}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  {opt.title}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-snug">
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exam Date Input Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <Calendar className="w-3.5 h-3.5" /> Exam Date
        </label>
        <input 
          type="date" 
          required
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-900/80 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200"
          value={formData.examDate}
          onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-indigo-600/50 disabled:to-violet-600/50 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-xl dark:shadow-none hover:-translate-y-[1px] active:translate-y-0 disabled:pointer-events-none transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Synthesizing Custom Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
              <span>Generate AI Study Plan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}