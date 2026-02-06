
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Globe, Send, 
  Loader2, ArrowLeft, Calendar, Tag, ShieldCheck, 
  Target, Zap, DollarSign, Clock, CheckCircle2, Rocket,
  Upload, X, Image as ImageIcon, FileText, Camera
} from 'lucide-react';
import { simplifyProblem, evaluateSolution } from '../services/geminiService';
import { CATEGORIES } from '../constants';
import { Problem, SolutionEvaluation, Evidence } from '../types';

interface SubmitSolutionPageProps {
  addProblem: (p: Problem) => void;
  solveProblem: (problemId: string, solutionText: string) => void;
}

interface FileAttachment {
  id: string;
  file: File;
  preview: string;
}

export const SubmitSolutionPage: React.FC<SubmitSolutionPageProps> = ({ addProblem, solveProblem }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceProblem = location.state?.sourceProblem as Problem | undefined;
  
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>(sourceProblem?.category || CATEGORIES[0]);
  const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<SolutionEvaluation | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

  useEffect(() => {
    if (sourceProblem) {
      setDescription(''); 
    }
  }, [sourceProblem]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const removed = prev.find(a => a.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter(a => a.id !== id);
    });
  };

  const handleAction = async () => {
    if (!description || description.length < 20) return;
    setIsAnalyzing(true);
    
    try {
      if (sourceProblem) {
        const evalData = await evaluateSolution(sourceProblem, description);
        setEvaluation(evalData);
      } else {
        const data = await simplifyProblem(description);
        setAnalyzedData({
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          trend: [20, 35, 50, 65, 80],
          upvotes: 1,
          comments: [],
          solutionIdeas: [],
          timeline: [{ date: submissionDate, event: "Pulse Node Established", status: "Emerging" }]
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = () => {
    if (sourceProblem) {
      solveProblem(sourceProblem.id, description);
      navigate('/dashboard');
    } else if (analyzedData) {
      const finalEvidence: Evidence[] = attachments.map(a => ({
        id: a.id,
        url: a.preview,
        type: a.file.type.includes('image') ? 'image' : 'pdf',
        fileName: a.file.name
      }));

      const finalProblem: Problem = {
        ...analyzedData,
        category: category,
        location: analyzedData.location || "Global Detection",
        lifecycle: "Emerging",
        impactScore: analyzedData.impactScore || 50,
        thresholdLevel: 30,
        evidence: finalEvidence
      };
      addProblem(finalProblem);
      navigate('/dashboard');
    }
  };

  const isSolving = !!sourceProblem;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-black text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          {isSolving ? 'Propose Intervention' : <>Spot a Problem? <span className="text-indigo-600">Attach Evidence.</span></>}
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
          {isSolving 
            ? `Helping resolve: ${sourceProblem.title}. AI will evaluate your proposal's system-wide impact.`
            : "Describe the challenge and attach photos or documents. Our AI cross-verifies your report with global data sets."
          }
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            {!isSolving && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Sector Category" value={category} options={CATEGORIES} onChange={setCategory} />
                <Field label="Detection Date" value={submissionDate} type="date" onChange={setSubmissionDate} />
              </div>
            )}

            {/* Evidence Upload Section */}
            {!isSolving && (
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  Evidence Vault (Optional Photos/PDFs)
                </label>
                <div 
                  className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    multiple 
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                  
                  {attachments.length === 0 ? (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-indigo-500" />
                      </div>
                      <p className="text-sm font-black text-slate-600 dark:text-slate-300">Drag & Drop Evidence</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Photos of the problem site</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
                      {attachments.map(a => (
                        <div key={a.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white group/thumb">
                          <img src={a.preview} className="w-full h-full object-cover" alt="Preview" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeAttachment(a.id); }}
                            className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                         <Upload className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                {isSolving ? 'Your Solution Proposal' : 'Detailed Situation Report'}
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isSolving ? "Detail your intervention strategy..." : "Explain what you witnessed. Be as specific as possible about the location and impact..."}
                className="w-full h-56 p-8 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 outline-none text-lg font-medium resize-none shadow-inner transition-all"
              />
            </div>
            
            <button 
              onClick={handleAction}
              disabled={isAnalyzing || description.length < 20}
              className="w-full py-5 rounded-3xl bg-indigo-600 text-white font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI Scanning Evidence & Context...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-6 h-6" />
                  {isSolving ? 'Evaluate Impact Protocol' : 'Simplify Problem Node'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-950 text-white p-10 rounded-[2.5rem] border border-slate-800 h-full flex flex-col relative overflow-hidden sticky top-24">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-3 mb-10">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="font-black text-xl tracking-tight uppercase">AI Pulse Monitor</h3>
            </div>

            {analyzedData ? (
              <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-8 duration-700">
                <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">AI-Synthesized Title</div>
                  <div className="text-2xl font-black leading-tight tracking-tight">{analyzedData.title}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-[9px] text-slate-500 font-black uppercase mb-1">Severity Rating</div>
                      <div className="text-rose-500 font-black">{analyzedData.severity}</div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-[9px] text-slate-500 font-black uppercase mb-1">Impact Score</div>
                      <div className="text-indigo-400 font-black">{analyzedData.impactScore || 75}/100</div>
                   </div>
                </div>

                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Root Cause Insight</div>
                  <p className="text-sm font-bold text-slate-300 italic leading-relaxed">"{analyzedData.rootCause}"</p>
                </div>

                {attachments.length > 0 && (
                   <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <div className="text-[10px] font-black uppercase text-emerald-500">
                        {attachments.length} Evidence Items Attached
                      </div>
                   </div>
                )}
                
                <div className="mt-auto pt-10 border-t border-slate-800">
                  <button 
                    onClick={handleFinalSubmit}
                    className="w-full py-5 bg-emerald-500 text-white font-black rounded-[2rem] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                  >
                    Broadcast Pulse Node
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : evaluation ? (
              <div className="space-y-10 flex-1 animate-in fade-in slide-in-from-right-8">
                 <div className="grid grid-cols-2 gap-6">
                    <ScoreStat label="Feasibility" value={evaluation.feasibility} />
                    <ScoreStat label="Social Value" value={evaluation.socialImpact} />
                    <ScoreStat label="Cost Score" value={evaluation.cost} />
                    <ScoreStat label="System Fit" value={evaluation.overallScore} />
                 </div>
                 <div className="text-sm font-black bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                      <Clock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Implementation Loop</div>
                      {evaluation.timeToImplement}
                    </div>
                 </div>
                 <button 
                    onClick={handleFinalSubmit}
                    className="w-full py-5 bg-emerald-500 text-white font-black rounded-[2rem] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                  >
                    Commit Intervention
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <Globe className="w-24 h-24 mb-6 animate-pulse text-indigo-500" />
                <p className="text-sm font-black uppercase tracking-widest">Awaiting Pulse Stream</p>
                <p className="max-w-[200px] mt-2 text-[10px] font-medium text-slate-500">Provide a report to activate real-time AI cross-verification.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, options, onChange, type = 'text', disabled = false }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</label>
    {options ? (
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        disabled={disabled}
        className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none border-none disabled:opacity-40 appearance-none cursor-pointer"
      >
        {options.map((o: any) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        disabled={disabled} 
        className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-6 py-4 font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none border-none disabled:opacity-40" 
      />
    )}
  </div>
);

const ScoreStat = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-3">
     <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-tight">
        <span>{label}</span>
        <span>{value}%</span>
     </div>
     <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${value}%` }} />
     </div>
  </div>
);
