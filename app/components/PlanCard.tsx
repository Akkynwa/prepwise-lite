import { Calendar, BookOpen } from 'lucide-react';

interface PlanCardProps {
  subject: string;
  topics: string;
  examDate: string;
  planContent: {
    title: string;
    weeks: Array<{
      weekNumber: number;
      focus: string;
      milestones: string[];
    }>;
  };
}

export default function PlanCard({ subject, topics, examDate, planContent }: PlanCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
        <h3 className="text-xl font-bold tracking-tight mb-2">{planContent.title || subject}</h3>
        <div className="flex flex-wrap gap-4 text-xs text-indigo-100">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {topics.slice(0, 50)}...</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Exam: {examDate}</span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {planContent.weeks?.map((week) => (
          <div key={week.weekNumber} className="relative pl-6 border-l-2 border-indigo-100 dark:border-zinc-800 last:border-none pb-2">
            <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-indigo-600" />
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">Week {week.weekNumber}: {week.focus}</h4>
            <ul className="mt-1.5 space-y-1">
              {week.milestones?.map((milestone, idx) => (
                <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">{milestone}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}