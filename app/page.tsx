'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import StudyForm from './components/StudyForm';
import PlanCard from './components/PlanCard';
import { ArrowRight,LogOut, Loader2, Sparkles, Database } from 'lucide-react';

export interface StudyPlanContent {
  title: string;
  weeks: Array<{
    weekNumber: number;
    focus: string;
    milestones: string[];
  }>;
}

export interface GeneratedPlan {
  subject: string;
  topics: string;
  examDate: string;
  intensity: string;
  plan_content: StudyPlanContent;
}

export default function Home() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Authenticated State Gatekeeper
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setCheckingAuth(false);
      }
    };
    checkUserSession();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handleSave = async () => {
    if (!currentPlan) return;
    setSaving(true);
    
    const { error } = await supabase.from('study_plans').insert([
      {
        subject: currentPlan.subject,
        topics: currentPlan.topics,
        exam_date: currentPlan.examDate,
        intensity: currentPlan.intensity, // Persisting your new metadata option
        plan_content: currentPlan.plan_content,
      },
    ]);

    setSaving(false);
    if (!error) {
      setSaved(true);
    } else {
      alert('Error: Persistent layer payload distribution failed.');
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/10 selection:text-indigo-500">
      {/* Premium background design gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-r from-indigo-500/5 to-violet-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Modern Nav / Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-zinc-50 dark:via-zinc-100 dark:to-zinc-300">
                PrepWise AI
              </h1>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 font-medium tracking-wide">
              Smart Engine Custom Syllabus Scheduling Generation Matrix
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <Link 
              href="/plans" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Archive Vault <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Bento Two-Column Execution Grid */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          
          {/* Form Control Column */}
          <div className="md:col-span-2">
            <StudyForm 
              onPlanGenerated={(plan: GeneratedPlan) => { 
                setCurrentPlan(plan); 
                setSaved(false); 
              }} 
            />
          </div>
          
          {/* Generated Result Output Column */}
          <div className="md:col-span-3 space-y-4">
            {currentPlan ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <PlanCard 
                  subject={currentPlan.subject} 
                  topics={currentPlan.topics} 
                  examDate={currentPlan.examDate} 
                  planContent={currentPlan.plan_content} 
                />
                
                <button
                  onClick={handleSave}
                  disabled={saved || saving}
                  className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border transition-all duration-200 active:scale-[0.99] ${
                    saved 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-200 shadow-sm'
                  }`}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
                  ) : (
                    <Database className={`w-4 h-4 ${saved ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  )}
                  <span>
                    {saving ? 'Syncing Schema State...' : saved ? 'Committed into Database' : 'Commit & Save Academic Plan'}
                  </span>
                </button>
              </div>
            ) : (
              /* Beautiful Glassmorphism Pattern Empty State Box */
              <div className="border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl h-[420px] flex flex-col items-center justify-center text-center p-8 bg-zinc-50/30 dark:bg-zinc-900/10 backdrop-blur-sm">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl mb-4 text-zinc-400 dark:text-zinc-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                  Engine Idle State
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">
                  Fill detail parameters into the generator schema engine block to visualize your personalized tracking workspace.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}