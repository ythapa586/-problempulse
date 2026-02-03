
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Cpu, Lightbulb, Users, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 animate-bounce">
          <Zap className="w-4 h-4" />
          <span>Real-time Problem Detection Live</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight">
          Turn Global Challenges into <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">
            Localized Innovation.
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          ProblemPulse uses advanced AI to monitor the pulse of the planet, simplifying complex global issues into actionable insights for the next generation of innovators.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/dashboard" 
            className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group"
          >
            Explore the Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/submit" 
            className="px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            Submit a Problem
          </Link>
        </div>

        {/* Mockup Floating Items */}
        <div className="mt-20 relative w-full max-w-4xl">
          <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 border-[8px] border-slate-200 dark:border-slate-800 shadow-2xl">
            <img src="https://picsum.photos/seed/pulse/1200/800" alt="Platform Preview" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white text-left max-w-md">
                  <div className="flex items-center gap-2 mb-2 text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Critical Alert</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Microplastic Surge in Coastal Fisheries</h3>
                  <p className="text-sm text-slate-300">AI has detected a 24% spike in social discussion and reported data regarding marine contamination.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Globe className="w-6 h-6" />}
          title="Global Detection"
          description="Real-time monitoring of news, forums, and satellite data to identify emerging crises before they hit mainstream."
        />
        <FeatureCard 
          icon={<Cpu className="w-6 h-6" />}
          title="AI Simplification"
          description="Complex socio-economic problems broken down into root causes, affected demographics, and clear summaries."
        />
        <FeatureCard 
          icon={<Lightbulb className="w-6 h-6" />}
          title="Action Hub"
          description="Connecting problem identifiers with solvers, startups, and NGOs to drive tangible local impact."
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

import { AlertTriangle } from 'lucide-react';
