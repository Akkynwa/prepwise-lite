'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import StudyForm from './components/StudyForm';
import PlanCard from './components/PlanCard';
import { ArrowRight, CheckCircle2, LogOut, Loader2 } from 'lucide-react';

// Define the precise structure matching your AI generation payload
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
  plan_content: StudyPlanContent;
}

export default function Home() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<GeneratedPlan | null>(null);
  const [saved, setSaved] = useState(false);
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
    
    const { error } = await supabase.from('study_plans').insert([
      {
        subject: currentPlan.subject,
        topics: currentPlan.topics,
        exam_date: currentPlan.examDate,
        plan_content: currentPlan.plan_content,
      },
    ]);

    if (!error) {
      setSaved(true);
    } else {
      alert('Error: Persistent layer payload distribution failed.');
    }
  };

  // Prevent UI flashing by rendering a clean centered loader while confirming session status
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">PrepWise AI</h1>
            <p className="text-zinc-500 text-sm mt-1">Smart Engine Custom Syllabus Scheduling Generation Matrix</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <Link href="/plans" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition">
              View Archive Vault <ArrowRight className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-2">
            <StudyForm onPlanGenerated={(plan: GeneratedPlan) => { setCurrentPlan(plan); setSaved(false); }} />
          </div>
          <div className="md:col-span-3 space-y-4">
            {currentPlan ? (
              <>
                <PlanCard 
                  subject={currentPlan.subject} 
                  topics={currentPlan.topics} 
                  examDate={currentPlan.examDate} 
                  planContent={currentPlan.plan_content} 
                />
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 border text-sm font-medium border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-60 transition"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {saved ? 'Saved to Supabase Account' : 'Commit & Save Academic Plan'}
                </button>
              </>
            ) : (
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl h-64 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-sm text-center p-6">
                Fill details parameters into the generator schema engine to build localized tracking.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}