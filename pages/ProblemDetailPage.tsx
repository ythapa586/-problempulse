
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Users, Activity, MessageSquare, 
  ThumbsUp, Share2, Lightbulb, ShieldAlert, CheckCircle2,
  Building, Landmark, Rocket, ShieldCheck, History, Info,
  TrendingUp, Clock, DollarSign, Award, AlertTriangle, Loader2,
  FileText, Camera, ShieldX, BarChart3, ListChecks, Gavel, HandMetal,
  Network, Search, CheckCircle, BrainCircuit, Scale
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Problem, SolutionEvaluation, Stakeholder } from '../types';
import { LifecycleTracker } from '../components/LifecycleTracker';
import { generateSolutions, evaluateSolution } from '../services/geminiService';

interface ProblemDetailPageProps {
  problems: Problem[];
}

export const ProblemDetailPage: React.FC<ProblemDetailPageProps> = ({ problems }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loadingSolutions, setLoadingSolutions] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    const found = problems.find(p => p.id === id);
    if (found) {
      setProblem(found);
    }
  }, [id, problems]);

  if (!problem) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
      <p className="font-bold text-slate-500">Retrieving problem context...</p>
    </div>
  );

  const isCrisisEscalated = (problem.thresholdLevel || 0) >= 80;

  // Ethical Trade-off Data (Mocked based on problem)
  const tradeOffData = [
    { subject: 'Speed', A: 80, full: 100 },
    { subject: 'Cost', A: 60, full: 100 },
    { subject: 'Equity', A: 90, full: 100 },
    { subject: 'Sustainability', A: 70, full: 100 },
    { subject: 'Scale', A: 50, full: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-black text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {isCrisisEscalated && (
        <div className="mb-8 p-4 bg-rose-600 text-white rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <div className="font-black uppercase text-xs tracking-widest">Immediate Attention Required</div>
              <div className="text-sm font-bold opacity-90">Crisis threshold exceeded ({problem.thresholdLevel}%). Global priority activated.</div>
            </div>
          </div>
          <HandMetal className="w-6 h-6 opacity-50" />
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Problem Card */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
               {problem.credibility === 'Verified' ? <ShieldCheck className="w-5 h-5 text-emerald-500" /> : <ShieldAlert className="w-5 h-5 text-amber-500" />}
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase text-slate-400 leading-none">Credibility</span>
                 <span className="text-xs font-bold">{problem.credibilityScore}% Verified</span>
               </div>
             </div>
            <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight">{problem.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-12 border-l-4 border-indigo-500 pl-6">
              {problem.summary}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-slate-100 dark:border-slate-800">
              <Metric icon={<MapPin className="w-5 h-5" />} label="Location" value={problem.location} />
              <Metric icon={<Users className="w-5 h-5" />} label="Impacted" value={problem.affectedPopulation} />
              <Metric icon={<Activity className="w-5 h-5" />} label="Status" value={problem.lifecycle} />
            </div>
          </section>

          {/* Ethical Trade-off Visualizer */}
          <section className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                    {/* Use Scale instead of Balance */}
                    <Scale className="w-6 h-6 text-indigo-500" />
                    Ethical Trade-off Analysis
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Measuring the alignment of proposed solutions with societal values.</p>
               </div>
             </div>
             <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tradeOffData}>
                         <PolarGrid stroke="#e2e8f0" />
                         <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                         <Radar name="Leading Solution" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                      </RadarChart>
                   </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                      <div className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Top Strength</div>
                      <div className="text-sm font-bold">Unprecedented Equity Focus</div>
                      <p className="text-xs text-emerald-700/70 mt-1">This path prioritizes marginalized communities over raw speed of implementation.</p>
                   </div>
                   <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl">
                      <div className="text-[10px] font-black uppercase text-rose-600 tracking-widest mb-1">Key Trade-off</div>
                      <div className="text-sm font-bold">Limited Immediate Scale</div>
                      <p className="text-xs text-rose-700/70 mt-1">The proposed micro-nodes require significant time to cover the entire {problem.location} region.</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Accountability Map Section */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight mb-8">
                <Network className="w-6 h-6 text-indigo-500" />
                Accountability Map
             </h2>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                      <Landmark className="w-3 h-3" /> Regulatory Authorities
                   </h3>
                   {problem.stakeholders.filter(s => s.type === 'Government' || s.type === 'Expert').map((s, idx) => (
                      <StakeholderCard key={idx} stakeholder={s} />
                   ))}
                </div>
                <div className="space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                      <Rocket className="w-3 h-3" /> Field Action & Startups
                   </h3>
                   {problem.stakeholders.filter(s => s.type === 'NGO' || s.type === 'Startup').map((s, idx) => (
                      <StakeholderCard key={idx} stakeholder={s} />
                   ))}
                </div>
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action Delay Risk */}
          <div className="bg-slate-950 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl" />
             <div className="flex items-center justify-between mb-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Action Delay Risk</div>
                <div className="flex items-center gap-1 text-rose-500 font-black text-xs">
                   <AlertTriangle className="w-3 h-3" /> CRITICAL
                </div>
             </div>
             <div className="flex items-end gap-3 mb-6">
                <div className="text-5xl font-black">9.4</div>
                <div className="text-xs font-bold text-slate-500 pb-2">/ 10.0 Escalation Velocity</div>
             </div>
             <div className="space-y-3 mb-8">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500 w-[94%]" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">
                  Delayed intervention will increase affected population by 12% weekly based on current socio-economic triggers.
                </p>
             </div>
             <button 
                onClick={() => navigate('/submit', { state: { sourceProblem: problem } })}
                className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl transition-all"
              >
                <Rocket className="w-5 h-5" />
                Intervene Now
              </button>
          </div>

          {/* Decision History Log */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Decision History Log
             </h3>
             <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                   <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-white dark:border-slate-900" />
                   <div className="text-[10px] font-black uppercase text-slate-400">Failed Prototype</div>
                   <div className="text-xs font-bold mt-1">Regional Ban Attempt</div>
                   <p className="text-[10px] text-slate-500 mt-1">Failed due to lack of cross-border enforcement infrastructure.</p>
                </div>
                <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                   <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900" />
                   <div className="text-[10px] font-black uppercase text-slate-400">Pilot Success</div>
                   <div className="text-xs font-bold mt-1">Community Sensor Grid</div>
                   <p className="text-[10px] text-slate-500 mt-1">Increased data visibility by 40% in Zone 4 sectors.</p>
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black uppercase tracking-tight">System Summary</h3>
                <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded">HEALTHY</div>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                Pulse monitoring identifies systemic vulnerabilities in {problem.category} sectors for the {problem.location} region.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StakeholderCard = ({ stakeholder }: { stakeholder: Stakeholder }) => (
  <div className="group p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
    <div className="flex items-start justify-between mb-3">
       <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${
             stakeholder.type === 'Government' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
             {stakeholder.type === 'Government' ? <Building className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          </div>
          <div>
             <div className="text-sm font-black group-hover:text-indigo-600 transition-colors">{stakeholder.name}</div>
             <div className="text-[10px] font-black uppercase text-slate-400 mt-0.5">{stakeholder.type}</div>
          </div>
       </div>
    </div>
    <div className="text-[10px] text-slate-500 font-bold uppercase mt-4">Role: {stakeholder.role}</div>
  </div>
);

const Metric = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl">
      {icon}
    </div>
    <div>
      <div className="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">{label}</div>
      <div className="font-black text-sm leading-none">{value}</div>
    </div>
  </div>
);
