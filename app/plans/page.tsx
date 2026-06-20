'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import PlanCard from '../components/PlanCard';
import { ChevronLeft } from 'lucide-react';

export default function PlansArchive() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPlans(data);
    };
    fetchPlans();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition">
          <ChevronLeft className="w-4 h-4" /> Return to Workspace Engine
        </Link>
        
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Saved Routines</h1>
          <p className="text-zinc-500 text-sm mt-1">Historically committed data configuration pipelines inside Supabase</p>
        </div>

        {plans.length === 0 ? (
          <p className="text-zinc-400 text-sm">No historical generation datasets found inside the selected collection engine.</p>
        ) : (
          <div className="grid gap-6">
            {plans.map((row) => (
              <PlanCard 
                key={row.id}
                subject={row.subject}
                topics={row.topics}
                examDate={row.exam_date}
                planContent={row.plan_content}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}