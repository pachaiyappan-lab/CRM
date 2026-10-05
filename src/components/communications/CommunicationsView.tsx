import React, { useState } from 'react';
import { 
  MessageSquare, Mail, Phone, Calendar, Sparkles, 
  Send, Plus, Check, Copy, Trash2, ArrowRight, User 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { GeminiService } from '../../services/geminiService';
import { Communication, CommunicationType } from '../../types/crm';

export const CommunicationsView: React.FC = () => {
  const { communications, addCommunication, contacts, leads } = useCRM();
  const { addToast } = useToast();

  const [filterType, setFilterType] = useState<'all' | CommunicationType>('all');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Email Composer & AI Assistant State
  const [recipientEmail, setRecipientEmail] = useState('sarah.jenkins@brightlabs.io');
  const [recipientName, setRecipientName] = useState('Sarah Jenkins');
  const [recipientCompany, setRecipientCompany] = useState('BrightLabs Interactive');
  const [emailSubject, setEmailSubject] = useState('Following up on proposal review');
  const [emailBody, setEmailBody] = useState(
    "Hi Sarah,\n\nI hope your week is going great!\n\nJust wanted to follow up and see if you had any questions on the proposal we shared on Friday. Let me know if tomorrow 3:00 PM works for our quick 15-minute walkthrough.\n\nBest regards,\nAlex Morgan"
  );
  const [aiInstruction, setAiInstruction] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  const filtered = communications.filter(c => filterType === 'all' || c.type === filterType);

  const handleAIAssist = async (action: 'generate' | 'rewrite' | 'professional' | 'friendly' | 'shorten' | 'clarity' | 'followup') => {
    setIsAILoading(true);
    try {
      const result = await GeminiService.processEmailDraft({
        action,
        instruction: aiInstruction || undefined,
        existingContent: emailBody,
        recipientName,
        recipientCompany,
        subject: emailSubject
      });
      setEmailSubject(result.subject);
      setEmailBody(result.body);
      addToast('AI Email Refined', `Draft updated with ${action} tone.`);
    } catch {
      addToast('Error', 'Failed to update email draft', 'error');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    addCommunication({
      type: 'email',
      direction: 'outbound',
      subject: emailSubject,
      content: emailBody,
      senderName: 'Alex Morgan',
      recipientName: `${recipientName} (${recipientEmail})`,
      tags: ['AI Assisted', 'Outbound']
    });

    addToast('Email Dispatched', `Message sent to ${recipientEmail}.`);
    setIsComposerOpen(false);
    setAiInstruction('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Unified Communications Hub
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {communications.length} Interactions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete interaction timeline across client emails, discovery calls, notes, and AI email assistant.
          </p>
        </div>

        <button
          onClick={() => setIsComposerOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Compose with AI</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        {(['all', 'email', 'call', 'meeting', 'note'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filterType === type ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type} {type === 'all' ? `(${communications.length})` : `(${communications.filter(c => c.type === type).length})`}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map(comm => (
          <div key={comm.id} className="p-5 hover:bg-slate-50/70 transition flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              comm.type === 'email' ? 'bg-indigo-50 text-indigo-700' :
              comm.type === 'call' ? 'bg-emerald-50 text-emerald-700' :
              comm.type === 'meeting' ? 'bg-purple-50 text-purple-700' :
              'bg-amber-50 text-amber-700'
            }`}>
              {comm.type === 'email' && <Mail className="w-5 h-5" />}
              {comm.type === 'call' && <Phone className="w-5 h-5" />}
              {comm.type === 'meeting' && <Calendar className="w-5 h-5" />}
              {comm.type === 'note' && <MessageSquare className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    comm.direction === 'inbound' ? 'bg-blue-100 text-blue-800' :
                    comm.direction === 'outbound' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {comm.direction} {comm.type}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {comm.subject || `${comm.type.toUpperCase()} Log`}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {new Date(comm.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-wrap">
                {comm.content}
              </p>

              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                <span>From: <strong className="text-slate-700">{comm.senderName}</strong></span>
                <span>•</span>
                <span>To: <strong className="text-slate-700">{comm.recipientName}</strong></span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-slate-700">No interaction history</p>
            <p className="text-xs text-slate-500 mt-1">Compose an email or log a call to start tracking.</p>
          </div>
        )}
      </div>

      {/* AI EMAIL COMPOSER MODAL (Core Feature) */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">AI Email Assistant & Composer</h2>
                  <p className="text-xs text-slate-500">Generate, rewrite, and refine client emails with one click.</p>
                </div>
              </div>
              <button onClick={() => setIsComposerOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            {/* AI Assistant Quick Toolbar */}
            <div className="p-3.5 bg-gradient-to-r from-indigo-950 to-slate-900 rounded-xl text-white space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                <span>AI Transformation Tools:</span>
                {isAILoading && <span className="animate-pulse">Refining with Gemini...</span>}
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAIAssist('followup')}
                  disabled={isAILoading}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
                >
                  Generate Follow-up
                </button>
                <button
                  type="button"
                  onClick={() => handleAIAssist('friendly')}
                  disabled={isAILoading}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
                >
                  Make Friendly
                </button>
                <button
                  type="button"
                  onClick={() => handleAIAssist('professional')}
                  disabled={isAILoading}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
                >
                  Make Professional
                </button>
                <button
                  type="button"
                  onClick={() => handleAIAssist('shorten')}
                  disabled={isAILoading}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
                >
                  Shorten Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleAIAssist('clarity')}
                  disabled={isAILoading}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
                >
                  Improve Clarity
                </button>
              </div>

              {/* Natural Language Prompt */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Or type custom instruction (e.g. 'Ask Sarah if she has reviewed the proposal')..."
                  value={aiInstruction}
                  onChange={e => setAiInstruction(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white placeholder:text-slate-400 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => handleAIAssist('generate')}
                  disabled={isAILoading || !aiInstruction.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition disabled:opacity-50"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendEmail} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Body (User Reviews Before Sending)</label>
                <textarea
                  rows={8}
                  required
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
