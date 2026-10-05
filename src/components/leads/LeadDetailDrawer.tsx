import React, { useState } from 'react';
import { 
  X, Sparkles, User, Building2, Mail, Phone, Calendar, 
  DollarSign, CheckCircle2, ArrowRight, Copy, Check, 
  Trash2, Edit3, MessageSquare, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Lead } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';
import { useNavigation } from '../../context/NavigationContext';
import { useToast } from '../../context/ToastContext';

interface LeadDetailDrawerProps {
  leadId: string | null;
  onClose: () => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ leadId, onClose }) => {
  const { leads, updateLead, deleteLead, analyzeLeadWithAI, convertLeadToDeal } = useCRM();
  const { navigate } = useNavigation();
  const { addToast } = useToast();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  const lead = leads.find(l => l.id === leadId);

  if (!lead) return null;

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    await analyzeLeadWithAI(lead.id);
    setIsAnalyzing(false);
    addToast('AI Intelligence Updated', `Fresh intelligence analysis generated for ${lead.name}.`);
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    addToast('Copied to Clipboard', 'Suggested message ready to paste.');
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleConvert = () => {
    const deal = convertLeadToDeal(lead.id);
    addToast('Converted to Deal', `Created deal "${deal.title}".`);
    onClose();
    navigate('deals', deal.id);
  };

  const handleSaveNotes = () => {
    updateLead(lead.id, { notes: notesContent });
    setIsEditingNotes(false);
    addToast('Notes Saved', 'Lead notes updated.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                {lead.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{lead.name}</h2>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    lead.status === 'qualified' ? 'bg-emerald-100 text-emerald-800' :
                    lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {lead.title || 'Decision Maker'} at <span className="font-semibold text-slate-800">{lead.companyName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleConvert}
                disabled={lead.status === 'converted'}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Convert to Deal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI LEAD INTELLIGENCE CARD (Core Requirement) */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 border border-indigo-700/50 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300">
                    <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      AI Lead Intelligence
                    </h3>
                    <p className="text-[11px] text-slate-300">Automated deal qualification & requirement extraction</p>
                  </div>
                </div>

                <button
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition"
                >
                  <RefreshCw className={`w-3 h-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
                </button>
              </div>

              {lead.aiAnalysis ? (
                <div className="space-y-4 text-xs">
                  {/* Score & Reasoning */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
                    <div className="shrink-0 text-center">
                      <div className="text-3xl font-extrabold text-emerald-400">
                        {lead.aiAnalysis.score}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Lead Score</span>
                    </div>
                    <div className="border-l border-white/10 pl-3.5">
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {lead.aiAnalysis.reasoning}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                        <span>Budget: <strong className="text-white">{lead.aiAnalysis.estimatedBudget}</strong></span>
                        <span>•</span>
                        <span>Timeline: <strong className="text-white">{lead.aiAnalysis.timeline}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <p className="text-slate-300 leading-relaxed font-normal">
                      {lead.aiAnalysis.summary}
                    </p>
                  </div>

                  {/* Extracted Requirements */}
                  <div>
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1.5">
                      Extracted Requirements & Scope:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {lead.aiAnalysis.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3 rounded-xl bg-indigo-900/60 border border-indigo-500/30">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                      Recommended Next Action:
                    </span>
                    <p className="text-white font-medium">
                      {lead.aiAnalysis.recommendedAction}
                    </p>
                  </div>

                  {/* Suggested Follow-up Message */}
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Suggested Follow-Up Draft:
                      </span>
                      <button
                        onClick={() => handleCopyDraft(lead.aiAnalysis?.suggestedFollowUp || '')}
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-300 hover:text-white"
                      >
                        {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDraft ? 'Copied' : 'Copy Draft'}</span>
                      </button>
                    </div>
                    <p className="text-slate-200 italic leading-relaxed text-xs">
                      "{lead.aiAnalysis.suggestedFollowUp}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-300 mb-2">No AI intelligence generated for this lead yet.</p>
                  <button
                    onClick={handleRunAIAnalysis}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition"
                  >
                    Generate AI Score & Scope
                  </button>
                </div>
              )}
            </div>

            {/* Quick Contact & Lead Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Work Email</span>
                <a href={`mailto:${lead.email}`} className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </a>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{lead.phone || 'Not provided'}</span>
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Source</span>
                <span className="text-xs font-semibold text-slate-800">{lead.source}</span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Estimated Value</span>
                <span className="text-xs font-bold text-emerald-600">₹{lead.estimatedValue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">Lead Notes & Context</span>
                {!isEditingNotes ? (
                  <button
                    onClick={() => {
                      setNotesContent(lead.notes || '');
                      setIsEditingNotes(true);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  rows={3}
                  value={notesContent}
                  onChange={e => setNotesContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lead.notes || 'No notes added yet.'}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-2">Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm(`Delete lead "${lead.name}"?`)) {
                  deleteLead(lead.id);
                  onClose();
                  addToast('Lead Deleted', `${lead.name} has been removed.`);
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Lead</span>
            </button>

            <button
              onClick={() => {
                navigate('communications');
                onClose();
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Draft Email to {lead.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
