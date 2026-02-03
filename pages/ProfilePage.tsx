
import React, { useState } from 'react';
import { 
  Award, Target, Zap, TrendingUp, MessageSquare, 
  History, ChevronDown, ChevronUp, X, ShieldCheck, 
  Globe, Clock, Fingerprint, ExternalLink, Activity, 
  BarChart3, CheckCircle2, ShieldAlert, Rocket, Database
} from 'lucide-react';

interface ActivityRecord {
  id: string;
  text: string;
  time: string;
  type: 'upvote' | 'solution' | 'comment';
  details: string;
  impact: string;
  points: number;
}

interface ImpactDetail {
  id: string;
  title: string;
  metric: string;
  status: string;
  date: string;
  category?: string;
}

const ACTIVITIES: ActivityRecord[] = [
  { 
    id: 'a1', 
    text: "Upvoted 'Microplastic Surge'", 
    time: "2 hours ago", 
    type: 'upvote',
    details: "Your vote contributed to the escalation of this problem to 'High' status in the Environmental category.",
    impact: "+15 Community Awareness Score",
    points: 10
  },
  { 
    id: 'a2', 
    text: "Submitted solution for 'Urban Heat'", 
    time: "Yesterday", 
    type: 'solution',
    details: "Proposed a vertical garden network utilizing recycled greywater for the Metropolitan Area pulse.",
    impact: "Potential 2.4°C cooling effect identified by AI",
    points: 150
  },
  { 
    id: 'a3', 
    text: "Commented on 'Artisan Skills'", 
    time: "3 days ago", 
    type: 'comment',
    details: "Suggested a blockchain-based traceability system for heritage crafts to ensure fair payment to creators.",
    impact: "Connected with 3 local NGOs",
    points: 25
  },
];

const SPOTTED_PROBLEMS: ImpactDetail[] = [
  { id: 'p1', title: 'Riverbank E-Waste Accumulation', metric: '94% Credibility', status: 'Verified', date: 'Oct 12, 2025' },
  { id: 'p2', title: 'Local School Digital Gap', metric: '82% Credibility', status: 'In Review', date: 'Nov 02, 2025' },
  { id: 'p3', title: 'Illegal Loggings Zone 4', metric: '98% Credibility', status: 'Action Taken', date: 'Nov 15, 2025' },
];

const PROPOSED_SOLUTIONS: ImpactDetail[] = [
  { id: 's1', title: 'Modular Solar Desalination', metric: 'Feasibility: 88%', status: 'Prototyping', date: 'Sep 20, 2025' },
  { id: 's2', title: 'AI-Mesh Traffic Logic', metric: 'Feasibility: 72%', status: 'Submitted', date: 'Oct 05, 2025' },
  { id: 's3', title: 'Waste-to-Biofuel Local Loop', metric: 'Feasibility: 91%', status: 'Piloting', date: 'Nov 10, 2025' },
];

const IMPACT_BREAKDOWN: ImpactDetail[] = [
  { id: 'i1', title: 'Lives Benefited', metric: '12,400+', status: 'Health/Social', date: 'Real-time' },
  { id: 'i2', title: 'Carbon Diverted', metric: '4.2 Tons', status: 'Environmental', date: 'Monthly' },
  { id: 'i3', title: 'Policy Influenced', metric: '2 Bills', status: 'Economy/Legal', date: 'Annual' },
];

export const ProfilePage: React.FC = () => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [modalView, setModalView] = useState<{ type: 'problems' | 'solutions' | 'impact', data: ImpactDetail[] } | null>(null);

  const extraBadges = [
    { icon: "🎓", name: "Problem Solver", color: "bg-orange-50 text-orange-600" },
    { icon: "🤝", name: "Collaborator", color: "bg-cyan-50 text-cyan-600" },
    { icon: "📢", name: "Voice of Reason", color: "bg-rose-50 text-rose-600" },
    { icon: "🛠️", name: "Builder", color: "bg-slate-50 text-slate-600" },
    { icon: "📊", name: "Data Analyst", color: "bg-indigo-50 text-indigo-600" },
    { icon: "💡", name: "Ideator", color: "bg-yellow-50 text-yellow-600" },
    { icon: "🛡️", name: "Guardian", color: "bg-emerald-50 text-emerald-600" },
    { icon: "🚀", name: "Launch Pad", color: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/user/200" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-900">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Verified Impact Architect</div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">The Safety Buffers</h1>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900 dark:text-slate-100">12,450</span> Pulse Points
              </div>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
              <div className="text-sm text-slate-500 font-medium">
                Rank <span className="font-black text-indigo-600">#42</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <MetricCard 
            label="Problems Spotted" 
            value="14" 
            icon={<Target className="text-rose-500 w-6 h-6" />} 
            onClick={() => setModalView({ type: 'problems', data: SPOTTED_PROBLEMS })}
          />
          <MetricCard 
            label="Solutions Proposed" 
            value="38" 
            icon={<TrendingUp className="text-indigo-500 w-6 h-6" />} 
            onClick={() => setModalView({ type: 'solutions', data: PROPOSED_SOLUTIONS })}
          />
          <MetricCard 
            label="Community Impact" 
            value="45.2k" 
            icon={<Zap className="text-amber-500 w-6 h-6" />} 
            onClick={() => setModalView({ type: 'impact', data: IMPACT_BREAKDOWN })}
          />
        </div>

        {/* Badges Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-tight">Innovation Badges</h3>
            {showAllBadges && (
              <button 
                onClick={() => setShowAllBadges(false)}
                className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1"
              >
                Show Less <ChevronUp className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 transition-all duration-500 ease-in-out">
            <Badge icon="🌍" name="Global Scout" color="bg-blue-50 text-blue-600" />
            <Badge icon="🌿" name="Eco Warrior" color="bg-emerald-50 text-emerald-600" />
            <Badge icon="🤖" name="AI Whisperer" color="bg-purple-50 text-purple-600" />
            <Badge icon="⚡" name="Early Adopter" color="bg-amber-50 text-amber-600" />
            
            {showAllBadges ? (
              extraBadges.map((b, idx) => (
                <div key={idx} className="animate-in fade-in zoom-in duration-300">
                  <Badge icon={b.icon} name={b.name} color={b.color} />
                </div>
              ))
            ) : (
              <button 
                onClick={() => setShowAllBadges(true)}
                className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 font-black hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95 group"
              >
                <span className="group-hover:hidden">+8</span>
                <ChevronDown className="hidden group-hover:block w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
            <History className="w-5 h-5 text-indigo-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {ACTIVITIES.map((activity) => (
              <button 
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="w-full text-left"
              >
                <ActivityItem 
                  text={activity.text} 
                  time={activity.time} 
                  icon={activity.type === 'upvote' ? <TrendingUp className="w-4 h-4" /> : activity.type === 'solution' ? <Target className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />} 
                />
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-tight">
             <Award className="w-5 h-5 text-amber-500" />
             Top Contributor Perks
          </h3>
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 mb-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <span>You're in the top 1% of contributors this month. Exclusive perks unlocked:</span>
          </div>
          <ul className="space-y-3 text-sm font-bold">
            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Direct access to NGO partnerships
            </li>
            <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Early beta for AI prediction engine
            </li>
          </ul>
        </section>
      </div>

      {/* Activity Insight Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in duration-300">
            <div className="relative p-10">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tight">Proof of Impact</h2>
                   <div className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-1">
                      <Fingerprint className="w-3 h-3" /> Verified Node Contribution
                   </div>
                </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="text-[10px] font-black uppercase text-slate-400 mb-2">Activity Description</div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedActivity.text}</p>
                 </div>
                 <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">{selectedActivity.details}</p>
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                       <Zap className="w-4 h-4 fill-current" />
                       {selectedActivity.impact}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Vault Modal */}
      {modalView && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in duration-300">
            <div className="relative p-10">
              <button 
                onClick={() => setModalView(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 rounded-3xl bg-slate-950 text-white flex items-center justify-center border border-white/10">
                   <Database className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tight uppercase">
                      Verification Vault
                   </h2>
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Immutable Contribution Ledger
                   </div>
                </div>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                 {modalView.data.map((item) => (
                   <div key={item.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-indigo-400 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                         <div className="text-sm font-black group-hover:text-indigo-600 transition-colors">{item.title}</div>
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 rounded-full text-[9px] font-black uppercase border border-slate-100 dark:border-slate-700">
                            {item.status}
                         </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase">
                         <span>{item.metric}</span>
                         <span>{item.date}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, icon, onClick }: { label: string, value: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-all hover:scale-105 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl group border-transparent hover:border-indigo-400 active:scale-95"
  >
    <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-2xl font-black mb-1 group-hover:text-indigo-600 transition-colors">{value}</div>
    <div className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{label}</div>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[8px] font-black uppercase text-indigo-500">
       View Verified Log <ChevronDown className="w-2 h-2 rotate-[-90deg]" />
    </div>
  </button>
);

const Badge = ({ icon, name, color }: { icon: string, name: string, color: string }) => (
  <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-sm shadow-sm hover:scale-110 cursor-default active:scale-95 ${color}`}>
    <span className="text-lg">{icon}</span>
    {name}
  </div>
);

const ActivityItem = ({ text, time, icon }: { text: string, time: string, icon: React.ReactNode }) => (
  <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-indigo-600 transition-colors">{text}</div>
      <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest flex items-center gap-1 mt-0.5">
        <Clock className="w-2.5 h-2.5" /> {time}
      </div>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
       <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
       </div>
    </div>
  </div>
);
