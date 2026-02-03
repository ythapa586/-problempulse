
import React from 'react';
import { Circle, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { LifecycleStatus } from '../types';

interface LifecycleTrackerProps {
  timeline: { date: string; event: string; status: LifecycleStatus }[];
}

const statusIcons: Record<LifecycleStatus, React.ReactNode> = {
  Emerging: <Circle className="w-5 h-5 text-indigo-400" />,
  Escalating: <TrendingUp className="w-5 h-5 text-rose-500" />,
  Stabilizing: <AlertCircle className="w-5 h-5 text-amber-500" />,
  Resolved: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
};

export const LifecycleTracker: React.FC<LifecycleTrackerProps> = ({ timeline }) => {
  return (
    <div className="relative pl-8 space-y-8 before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {timeline.map((item, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-[30px] p-1 bg-white dark:bg-slate-950 rounded-full border border-slate-100 dark:border-slate-800 z-10">
            {statusIcons[item.status]}
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.date}</div>
            <div className="font-bold text-sm mb-1">{item.event}</div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
