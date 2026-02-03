
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, TrendingUp, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Problem, Severity } from '../types';
import { TrendChart } from './TrendChart';

interface ProblemCardProps {
  problem: Problem;
}

const severityColors: Record<Severity, string> = {
  Low: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  Medium: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  High: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30',
  Critical: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
};

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-1">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit ${severityColors[problem.severity]}`}>
            {problem.severity}
          </span>
          <div className="flex items-center gap-1 mt-1">
            {problem.credibility === 'Verified' ? (
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-3 h-3 text-amber-500" />
            )}
            <span className="text-[10px] font-bold text-slate-400 uppercase">{problem.lifecycle}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
          <MapPin className="w-3 h-3" />
          {problem.location}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {problem.title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
        {problem.summary}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold mb-1">
            <Users className="w-3 h-3" />
            Impacted
          </div>
          <div className="text-sm font-semibold">{problem.affectedPopulation}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold mb-1">
            <TrendingUp className="w-3 h-3" />
            Trend
          </div>
          <TrendChart 
            data={problem.trend} 
            color={problem.severity === 'Critical' ? '#f43f5e' : '#6366f1'} 
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap gap-1">
          {problem.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 font-medium">
              #{tag}
            </span>
          ))}
        </div>
        <Link 
          to={`/problem/${problem.id}`}
          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:gap-2 transition-all"
        >
          Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
