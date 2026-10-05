import React, { useState } from 'react';
import { 
  Kanban, List, Plus, DollarSign, Calendar, Building2, 
  Sparkles, ArrowRight, CheckCircle2, XCircle, Trash2, 
  ExternalLink, ChevronRight, Check
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNavigation } from '../../context/NavigationContext';
import { useToast } from '../../context/ToastContext';
import { Deal, DealStage } from '../../types/crm';

const STAGES: { id: DealStage; label: string; color: string; border: string; bg: string }[] = [
  { id: 'new', label: 'New Opportunity', color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50/40' },
  { id: 'qualified', label: 'Qualified', color: 'text-indigo-600', border: 'border-indigo-200', bg: 'bg-indigo-50/40' },
  { id: 'proposal', label: 'Proposal Sent', color: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50/40' },
  { id: 'negotiation', label: 'Negotiation', color: 'text-amber-600', border: 'border-amber-200', bg: 'bg-amber-50/40' },
  { id: 'won', label: 'Closed Won', color: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50/40' },
  { id: 'lost', label: 'Closed Lost', color: 'text-rose-600', border: 'border-rose-200', bg: 'bg-rose-50/40' }
];

export const DealsView: React.FC = () => {
  const { deals, moveDealStage, convertDealToProject, deleteDeal } = useCRM();
  const { openGlobalAddWithType, navigate, selectedId } = useNavigation();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(() => {
    return deals.find(d => d.id === selectedId) || null;
  });

  const totalPipeline = deals.filter(d => d.stage !== 'lost').reduce((sum, d) => sum + d.value, 0);

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    moveDealStage(dealId, newStage);
    addToast('Stage Updated', `Moved deal to ${newStage.toUpperCase()}.`);
  };

  const handleConvertToProject = (dealId: string) => {
    const proj = convertDealToProject(dealId);
    addToast('Project Created', `Started active project "${proj.title}".`);
    navigate('projects', proj.id);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Sales Pipeline & Deals
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ₹{(totalPipeline / 100000).toFixed(1)}L Active Value
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual stage progression, win probabilities, expected closing dates, and instant project conversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => openGlobalAddWithType('deal')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div 
                key={stage.id}
                className={`rounded-2xl border ${stage.border} ${stage.bg} p-3 flex flex-col min-w-[240px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${stage.color} tracking-tight`}>
                      {stage.label}
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/80 border border-slate-200 text-slate-600">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-700">
                    ₹{(stageTotal / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 min-h-[150px]">
                  {stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition leading-snug line-clamp-2">
                          {deal.title}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium truncate mb-2">
                        {deal.companyName || deal.contactName || 'Independent'}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-extrabold text-slate-900">
                          ₹{deal.value.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          deal.stage === 'won' ? 'bg-emerald-100 text-emerald-800' :
                          deal.stage === 'lost' ? 'bg-rose-100 text-rose-800' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {deal.probability}% Prob
                        </span>
                      </div>

                      {/* AI Quick Insight Snippet */}
                      {deal.aiInsight && (
                        <div className="mt-2.5 p-1.5 rounded-lg bg-indigo-50/70 text-[10px] text-indigo-900 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{deal.aiInsight}</span>
                        </div>
                      )}

                      {/* Quick stage mover controls */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]" onClick={e => e.stopPropagation()}>
                        <select
                          value={deal.stage}
                          onChange={e => handleStageChange(deal.id, e.target.value as any)}
                          className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none"
                        >
                          <option value="new">Move: New</option>
                          <option value="qualified">Move: Qualified</option>
                          <option value="proposal">Move: Proposal</option>
                          <option value="negotiation">Move: Negotiation</option>
                          <option value="won">Move: Won</option>
                          <option value="lost">Move: Lost</option>
                        </select>

                        {deal.stage === 'won' && (
                          <button
                            onClick={() => handleConvertToProject(deal.id)}
                            className="font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>Convert Proj</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200/80 rounded-xl">
                      <p className="text-[11px] text-slate-400">Empty stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Deal Title</th>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Win Prob</th>
                <th className="py-3 px-4">Close Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deals.map(deal => (
                <tr 
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {deal.title}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {deal.companyName || 'Independent'}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ₹{deal.value.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {deal.probability}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {deal.expectedCloseDate}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {deal.stage === 'won' ? (
                        <button
                          onClick={() => handleConvertToProject(deal.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                        >
                          Launch Project
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStageChange(deal.id, 'won')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        >
                          Mark Won
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DEAL DETAIL MODAL */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedDeal.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: <strong className="text-slate-800">{selectedDeal.companyName || 'Independent'}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSelectedDeal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* AI Deal Insight Card */}
            {selectedDeal.aiInsight && (
              <div className="p-4 rounded-xl bg-indigo-950 text-white border border-indigo-700/50">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase mb-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>AI Deal Intelligence & Next Best Step</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {selectedDeal.aiInsight}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Deal Value</span>
                <span className="text-sm font-extrabold text-slate-900">₹{selectedDeal.value.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Win Probability</span>
                <span className="text-sm font-bold text-indigo-600">{selectedDeal.probability}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Current Stage</span>
                <span className="text-xs font-bold text-slate-800 uppercase">{selectedDeal.stage}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Expected Close</span>
                <span className="text-xs font-bold text-slate-800">{selectedDeal.expectedCloseDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block mb-1">Deal Notes:</span>
              <p className="text-slate-600">{selectedDeal.notes || 'No notes added.'}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  deleteDeal(selectedDeal.id);
                  setSelectedDeal(null);
                  addToast('Deal Deleted', 'Removed from pipeline.');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Deal</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedDeal.stage !== 'won' && (
                  <button
                    onClick={() => {
                      handleStageChange(selectedDeal.id, 'won');
                      setSelectedDeal(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Mark as Won 🎉
                  </button>
                )}
                {selectedDeal.stage === 'won' && (
                  <button
                    onClick={() => {
                      handleConvertToProject(selectedDeal.id);
                      setSelectedDeal(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Launch as Project →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
