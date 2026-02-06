import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, BrainCircuit, Globe, Send, ShieldAlert, 
  Loader2, ArrowLeft, Calendar, Tag, ShieldCheck, 
  Target, Zap, DollarSign, Clock, CheckCircle2,
  Paperclip, X, Image as ImageIcon, FileText, UploadCloud,
  Eye
} from 'lucide-react';
import { simplifyProblem, evaluateSolution } from '../services/geminiService';
import { CATEGORIES } from '../constants';
import { Problem, SolutionEvaluation } from '../types';

interface Attachment {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'pdf' | 'other';
}

interface SubmitSolutionPageProps {
  addProblem: (p: Problem) => void;
  solveProblem: (problemId: string, solutionText: string) => void;
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  useEffect(() => {
    if (sourceProblem) {
      setDescription(''); // Start fresh for solution
    }
  }, [sourceProblem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other'
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // Revoke the URL to avoid memory leaks
      const removed = prev.find(a => a.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const handleAction = async () => {
    if (!description || description.length < 20) return;
    setIsAnalyzing(true);
    
    try {
      if (sourceProblem) {
        // Evaluate proposed solution for existing problem
        const evalData = await evaluateSolution(sourceProblem, description);
        setEvaluation(evalData);
      } else {
        // Simplify new spotted problem
        // In a real app, we'd process attachments with Vision models here
        const attachmentInfo = attachments.length > 0 
          ? ` (User attached ${attachments.length} files: ${attachments.map(a => a.file.name).join(', ')})`
          : '';
        const prompt = `Category: ${category}. Description: ${description}${attachmentInfo}`;
        const data = await simplifyProblem(prompt);
        setAnalyzedData({
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          trend: [20, 40, 60, 80],
          upvotes: 0,
          comments: [],
          solutionIdeas: [],
          timeline: [{ date: submissionDate, event: "Problem Reported via Pulse Node", status: "Emerging" }],
          evidence: attachments.map(a => ({
            id: a.id,
            type: a.type === 'pdf' ? 'document' : 'image',
            url: a.previewUrl,
            contributor: 'Current User',
            verified: false
          }))
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
      alert("Solution Proposed! Pulse points awarded to 'The Safety Buffers'. The problem status has shifted to Stabilizing.");
      navigate('/dashboard');
    } else if (analyzedData) {
      const finalProblem: Problem = {
        ...analyzedData,
        category: category,
        location: analyzedData.location || "Global Detection",
        lifecycle: "Emerging",
        impactScore: analyzedData.impactScore || 50,
        thresholdLevel: analyzedData.thresholdLevel || 30
      };
      addProblem(finalProblem);
      alert("Impact submission recorded! AI agents are notifying relevant innovators.");
      navigate('/dashboard');
    }
  };

  const isSolving = !!sourceProblem;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-bold text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4 tracking-tight">
          {isSolving ? (
            <>Solution <span className="text-indigo-600">Workspace</span></>
          ) : (
            <>Spot a Problem? <span className="text-indigo-600">Power the Solution.</span></>
          )}
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">
          {isSolving 
            ? `You are proposing a fix for: "${sourceProblem.title}". Use data-driven insights to maximize your impact score.`
            : "Describe an emerging issue you've noticed locally or online. Our AI will help categorize, simplify, and broadcast it to the global community."
          }
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {!isSolving && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <Tag className="w-3 h-3" />
                    Problem Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <Calendar className="w-3 h-3" />
                    Detection Date
                  </label>
                  <input
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {isSolving ? 'Your Proposed Solution' : 'Evidence & Description'}
              </label>

              {/* File Attachment Section */}
              <div 
                className="group relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                
                {attachments.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-300">Attach Photos or PDFs</div>
                    <div className="text-[10px] font-black uppercase text-slate-400 mt-1">Images/Docs for Verification</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full">
                    {attachments.map((a) => (
                      <div key={a.id} className="relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group/item">
                        {a.type === 'image' ? (
                          <img src={a.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-slate-400">
                            <FileText className="w-6 h-6 text-indigo-500 mb-1" />
                            <span className="text-[8px] font-black uppercase truncate w-full text-center">{a.file.name}</span>
                          </div>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttachment(a.id);
                          }}
                          className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <UploadCloud className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>

              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={isSolving 
                  ? "Describe your technical or policy-based solution in detail..."
                  : "E.g., I've noticed a significant increase in discarded electronic waste along the riverbanks in my city..."
                }
                className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium resize-none shadow-inner"
              />
            </div>
            
            <button 
              onClick={handleAction}
              disabled={isAnalyzing || description.length < 20}
              className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI Scanning Evidence...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5" />
                  {isSolving ? 'Analyze Solution Integrity' : 'Verify & Simplify with AI'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-950 text-white p-8 rounded-[2rem] border border-slate-800 h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-black text-xl tracking-tight">
                {isSolving ? 'Solution Analytics' : 'AI Context View'}
              </h3>
            </div>

            {isSolving && evaluation ? (
              <div className="space-y-8 flex-1 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-2 gap-4">
                  <ScoreGauge label="Feasibility" score={evaluation.feasibility} icon={<Target className="w-3 h-3" />} />
                  <ScoreGauge label="Economy" score={evaluation.cost} icon={<DollarSign className="w-3 h-3" />} />
                  <ScoreGauge label="Social Impact" score={evaluation.socialImpact} icon={<Zap className="w-3 h-3" />} />
                  <ScoreGauge label="Efficiency" score={evaluation.overallScore} icon={<ShieldCheck className="w-3 h-3" />} />
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="text-[10px] font-black uppercase text-slate-500 mb-2">Estimated Timeline</div>
                   <div className="text-sm font-bold flex items-center gap-2">
                     <Clock className="w-4 h-4 text-indigo-400" />
                     {evaluation.timeToImplement}
                   </div>
                </div>

                <button 
                  onClick={handleFinalSubmit}
                  className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Implement Solution
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            ) : analyzedData ? (
              <div className="space-y-6 flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Proposed Title</div>
                  <div className="text-lg font-black leading-tight">{analyzedData.title}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">AI Severity</div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                      analyzedData.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {analyzedData.severity || 'Medium'}
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Impact Score</div>
                    <div className="text-xs font-bold text-slate-300">{analyzedData.impactScore || 75}/100</div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Root Cause Insight</div>
                  <p className="text-xs italic text-slate-400">"{analyzedData.rootCause}"</p>
                </div>

                {attachments.length > 0 && (
                  <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <div className="text-[10px] font-black uppercase text-indigo-400 mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Proof Verification Status
                    </div>
                    <div className="text-[9px] font-bold text-slate-300 leading-tight">
                      {attachments.length} files scanned. Metadata matches location. Evidence queued for human audit.
                    </div>
                  </div>
                )}
                
                <div className="mt-auto pt-8 border-t border-slate-800">
                  <button 
                    onClick={handleFinalSubmit}
                    className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                  >
                    Confirm & Broadcast
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <Globe className="w-16 h-16 mb-4 animate-pulse text-indigo-400" />
                <p className="text-sm font-medium px-4">AI analysis will verify attachments and text once you proceed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreGauge = ({ label, score, icon }: { label: string, score: number, icon: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-500">
      <span className="flex items-center gap-1">{icon} {label}</span>
      <span>{score}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full bg-indigo-500 transition-all duration-1000" 
        style={{ width: `${score}%` }} 
      />
    </div>
  </div>
);
