
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, BrainCircuit, Globe, Send, ShieldAlert, Loader2 } from 'lucide-react';
import { simplifyProblem } from '../services/geminiService';
import { CATEGORIES } from '../constants';

export const SubmitSolutionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!description || description.length < 20) return;
    setIsAnalyzing(true);
    try {
      const data = await simplifyProblem(description);
      setAnalyzedData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = () => {
    // In a real app, save to DB. For demo, just return to dashboard.
    alert("Impact submission recorded! Our AI agents are now verifying data and notifying relevant innovators.");
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Spot a Problem? <span className="text-indigo-600">Power the Solution.</span></h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Describe an emerging issue you've noticed locally or online. Our AI will help categorize, simplify, and broadcast it to the global community of innovators.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="block text-sm font-bold uppercase text-slate-500 mb-4 tracking-wider">
              Problem Description
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., I've noticed a significant increase in discarded electronic waste along the riverbanks in my city, affecting water quality and local wildlife..."
              className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg resize-none mb-6"
            />
            
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || description.length < 20}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI is Analyzing Context...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  Simplify with AI
                </>
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-xl">AI Assistant View</h3>
            </div>

            {analyzedData ? (
              <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Proposed Title</div>
                  <div className="text-lg font-bold">{analyzedData.title}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Detected Severity</div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                    {analyzedData.severity || 'Medium'}
                  </span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Estimated Impact</div>
                  <div className="text-sm text-slate-300">{analyzedData.affectedPopulation}</div>
                </div>
                
                <div className="mt-auto pt-8 border-t border-slate-800">
                  <button 
                    onClick={handleFinalSubmit}
                    className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Confirm & Publish
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Globe className="w-16 h-16 mb-4" />
                <p className="text-sm">Enter your description and click 'Simplify' to see AI analysis results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
