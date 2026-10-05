import React, { useState } from 'react';
import { 
  FileSpreadsheet, Plus, Sparkles, Send, Printer, 
  Trash2, CheckCircle2, Clock, DollarSign, Eye, Edit2, 
  FileText, ArrowRight, Download 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { GeminiService } from '../../services/geminiService';
import { Proposal, ProposalItem } from '../../types/crm';

export const ProposalsView: React.FC = () => {
  const { proposals, addProposal, updateProposal, deleteProposal, sendProposal, companies } = useCRM();
  const { addToast } = useToast();

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposals[0] || null);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // AI Generator Inputs
  const [aiClientName, setAiClientName] = useState('Sarah Jenkins');
  const [aiCompanyName, setAiCompanyName] = useState('BrightLabs Interactive');
  const [aiProjectTitle, setAiProjectTitle] = useState('Custom Web Platform & Design System');
  const [aiRequirements, setAiRequirements] = useState('Responsive React 19 web app, Headless CMS integration, Tailwind UI tokens, high SEO performance.');
  const [aiBudget, setAiBudget] = useState('95000');
  const [aiTimeline, setAiTimeline] = useState('4 - 6 weeks');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAIProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAI(true);
    try {
      const generated = await GeminiService.generateProposal({
        clientName: aiClientName,
        companyName: aiCompanyName,
        projectTitle: aiProjectTitle,
        requirements: aiRequirements,
        budget: parseFloat(aiBudget) || 80000,
        timeline: aiTimeline
      });

      const newProp = addProposal({ ...generated, status: 'draft' });
      setSelectedProposal(newProp);
      setIsAIGeneratorOpen(false);
      addToast('AI Proposal Drafted', `Generated proposal ${newProp.number} for ${newProp.companyName}.`);
    } catch {
      addToast('Error', 'Failed to generate proposal draft', 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSend = (propId: string) => {
    sendProposal(propId);
    if (selectedProposal && selectedProposal.id === propId) {
      setSelectedProposal({ ...selectedProposal, status: 'sent', sentAt: new Date().toISOString() });
    }
    addToast('Proposal Sent', 'Proposal dispatched to client.');
  };

  const handleAccept = (propId: string) => {
    updateProposal(propId, { status: 'accepted', acceptedAt: new Date().toISOString() });
    if (selectedProposal && selectedProposal.id === propId) {
      setSelectedProposal({ ...selectedProposal, status: 'accepted', acceptedAt: new Date().toISOString() });
    }
    addToast('Proposal Accepted! 🎉', 'Client accepted the proposal.');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Client Proposals & Scopes
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {proposals.length} Proposals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Craft high-converting B2B scopes of work, pricing schedules, deliverable timelines, and instant PDF proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Generator button */}
          <button
            onClick={() => setIsAIGeneratorOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
            <span>AI Proposal Generator</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Proposals List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            All Proposals
          </h2>

          {proposals.map(prop => {
            const isSelected = selectedProposal?.id === prop.id;
            return (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-600">{prop.number}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    prop.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                    prop.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {prop.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 mb-1">
                  {prop.title}
                </h3>
                <p className="text-xs text-slate-500 truncate mb-3">
                  {prop.companyName} ({prop.contactName})
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="font-extrabold text-slate-900">
                    ₹{prop.total.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Valid till {prop.validUntil}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Proposal Preview & Actions */}
        {selectedProposal && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            {/* Top Preview Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600">{selectedProposal.number}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    selectedProposal.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {selectedProposal.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedProposal.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPrintViewOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF / Print</span>
                </button>

                {selectedProposal.status === 'draft' && (
                  <button
                    onClick={() => handleSend(selectedProposal.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Proposal</span>
                  </button>
                )}

                {selectedProposal.status === 'sent' && (
                  <button
                    onClick={() => handleAccept(selectedProposal.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Accepted</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document Content View */}
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed border border-slate-100 rounded-xl p-5 bg-slate-50/30">
              {/* Client & Studio Details */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prepared For</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedProposal.contactName}</p>
                  <p className="font-medium text-slate-600">{selectedProposal.companyName}</p>
                  <p className="text-slate-500">{selectedProposal.contactEmail}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Issued By</span>
                  <p className="font-bold text-slate-900 text-sm">Nexus Digital Studio</p>
                  <p className="text-slate-500">Alex Morgan, Founder</p>
                  <p className="text-slate-400">alex@nexuscrm.io</p>
                </div>
              </div>

              {/* Project Overview */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1.5 tracking-wider">
                  1. Executive Overview
                </h4>
                <p className="text-slate-600">{selectedProposal.overview}</p>
              </div>

              {/* Scope of Work */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1.5 tracking-wider">
                  2. Scope of Work & Deliverables
                </h4>
                <p className="text-slate-600 mb-2">{selectedProposal.scopeOfWork}</p>
                <div className="space-y-1.5 pl-2">
                  {selectedProposal.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Table */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-2 tracking-wider">
                  3. Commercial Investment Schedule
                </h4>
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Rate</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedProposal.items.map(item => (
                        <tr key={item.id}>
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600">₹{item.rate.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-slate-50/70 border-t border-slate-200 space-y-1 text-right text-xs">
                    <div className="flex justify-end gap-6 text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-900">₹{selectedProposal.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {selectedProposal.discount > 0 && (
                      <div className="flex justify-end gap-6 text-emerald-600 font-semibold">
                        <span>Discount:</span>
                        <span>-₹{selectedProposal.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-end gap-6 text-slate-600">
                      <span>GST (18%):</span>
                      <span className="font-semibold text-slate-900">₹{selectedProposal.taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-end gap-6 text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
                      <span>Total Investment:</span>
                      <span className="text-indigo-600">₹{selectedProposal.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1 tracking-wider">
                  4. Payment Terms & Timeline
                </h4>
                <p className="text-slate-600">{selectedProposal.terms}</p>
                <p className="text-slate-500 text-[11px] mt-1">Timeline: <strong>{selectedProposal.timeline}</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI PROPOSAL GENERATOR MODAL */}
      {isAIGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">AI Proposal Generator</h2>
                  <p className="text-xs text-slate-500">Provide high-level parameters; AI creates full scope, deliverables & pricing.</p>
                </div>
              </div>
              <button onClick={() => setIsAIGeneratorOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateAIProposal} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={aiClientName}
                    onChange={e => setAiClientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={aiCompanyName}
                    onChange={e => setAiCompanyName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={aiProjectTitle}
                  onChange={e => setAiProjectTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements & Objectives *</label>
                <textarea
                  rows={3}
                  required
                  value={aiRequirements}
                  onChange={e => setAiRequirements(e.target.value)}
                  placeholder="Detail tech stack, integrations, key user stories..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={aiBudget}
                    onChange={e => setAiBudget(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Timeline</label>
                  <input
                    type="text"
                    value={aiTimeline}
                    onChange={e => setAiTimeline(e.target.value)}
                    placeholder="e.g. 4 - 6 weeks"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAIGeneratorOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingAI}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAI ? 'Generating Full Proposal...' : 'Generate Proposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT / EXPORT PDF MODAL */}
      {isPrintViewOpen && selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none">
            <div className="no-print flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-slate-600">Print Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintViewOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Proposal Printable Body */}
            <div className="space-y-6 text-slate-800">
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nexus Studio</h1>
                  <p className="text-xs text-slate-500">Premium Digital Engineering & Architecture</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-indigo-600">{selectedProposal.number}</span>
                  <p className="text-xs text-slate-500">Valid until: {selectedProposal.validUntil}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedProposal.title}</h2>
                <p className="text-xs text-slate-600 mt-1">{selectedProposal.overview}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Scope & Deliverables</h3>
                <p className="text-xs text-slate-600 mb-3">{selectedProposal.scopeOfWork}</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-2">
                  {selectedProposal.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Pricing Breakdown</h3>
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedProposal.items.map(item => (
                      <tr key={item.id}>
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right font-semibold">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-2 text-right text-xs space-y-1">
                  <p>Subtotal: ₹{selectedProposal.subtotal.toLocaleString('en-IN')}</p>
                  <p>GST (18%): ₹{selectedProposal.taxAmount.toLocaleString('en-IN')}</p>
                  <p className="text-sm font-bold text-slate-900 pt-1 border-t">
                    Total: ₹{selectedProposal.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t text-xs text-slate-500">
                <p>Terms: {selectedProposal.terms}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
