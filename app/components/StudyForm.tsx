'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { GeneratedPlan } from '../page'; // Adjust the relative path if your file structure is different

interface StudyFormProps {
  onPlanGenerated: (plan: GeneratedPlan) => void;
}

export default function StudyForm({ onPlanGenerated }: StudyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ subject: '', topics: '', examDate: '' });

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
        // The object passed here matches the structure required by GeneratedPlan
        onPlanGenerated({
          subject: formData.subject,
          topics: formData.topics,
          examDate: formData.examDate,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Subject</label>
        <input 
          type="text" 
          required
          placeholder="e.g., Advanced Econometrics"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Topics to cover</label>
        <textarea 
          required
          rows={3}
          placeholder="e.g., Time series analysis, Autocorrelation, Heteroskedasticity"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
          value={formData.topics}
          onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Exam Date</label>
        <input 
          type="date" 
          required
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={formData.examDate}
          onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition duration-200"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {loading ? 'Synthesizing Custom Plan...' : 'Generate AI Study Plan'}
      </button>
    </form>
  );
}