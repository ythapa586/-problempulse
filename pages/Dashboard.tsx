
import React, { useState, useMemo } from 'react';
import { Search, Filter, Map as MapIcon, Grid, List, Globe, ArrowUpRight, Radio, SortAsc, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { ProblemCard } from '../components/ProblemCard';
import { ImpactHeatmap } from '../components/ImpactHeatmap';
import { Problem } from '../types';

interface DashboardProps {
  problems: Problem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ problems }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRadar, setShowRadar] = useState(false);
  const [sortMode, setSortMode] = useState<'Urgency' | 'Impact' | 'Newest'>('Urgency');

  const filteredProblems = useMemo(() => {
    let list = problems.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortMode === 'Urgency') {
      list = [...list].sort((a, b) => (b.thresholdLevel || 0) - (a.thresholdLevel || 0));
    } else if (sortMode === 'Impact') {
      list = [...list].sort((a, b) => b.impactScore - a.impactScore);
    } else if (sortMode === 'Newest') {
      list = [...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return list;
  }, [activeCategory, searchQuery, sortMode, problems]);

  return (
    <div className="space-y-8 px-4">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3 tracking-tight">
            Problem Pulse Dashboard
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse" title="Live Scanning Active" />
          </h1>
          <p className="text-slate-500 font-medium">Global AI detection & real-time risk prioritization.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search active pulses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-full md:w-64 text-sm font-medium"
            />
          </div>
          
          <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
             {(['Urgency', 'Impact', 'Newest'] as const).map(mode => (
               <button 
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  sortMode === mode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'
                }`}
               >
                 {mode}
               </button>
             ))}
          </div>

          <button 
            onClick={() => setShowRadar(!showRadar)}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 font-black text-sm ${
              showRadar 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Radio className="w-5 h-5" />
            Radar View
          </button>
        </div>
      </div>

      {showRadar && <ImpactHeatmap problems={filteredProblems} />}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatItem label="Global Problems" value={problems.length.toString()} delta="+12%" icon={<Globe className="w-3 h-3" />} />
        <StatItem label="Verified Sources" value="1.4k" delta="+8%" icon={<Sparkles className="w-3 h-3" />} />
        <StatItem label="Innovation Gaps" value="842" delta="+18%" icon={<Zap className="w-3 h-3" />} />
        <StatItem label="Active Radar" value="94" delta="Live" icon={<TrendingUp className="w-3 h-3" />} />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all uppercase tracking-wider ${
              activeCategory === cat 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-indigo-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Problem Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.length > 0 ? (
          filteredProblems.map(p => (
            <ProblemCard key={p.id} problem={p} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black mb-2 text-slate-400 uppercase tracking-widest">No active pulse in this category</h3>
            <p className="text-sm text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatItem = ({ label, value, delta, icon }: { label: string, value: string, delta: string, icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
      {icon}
      {label}
    </div>
    <div className="flex items-end gap-2">
      <div className="text-2xl font-black tracking-tight">{value}</div>
      <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded mb-1 flex items-center uppercase">
        {delta}
      </div>
    </div>
  </div>
);
