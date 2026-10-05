import React, { useState, useEffect } from 'react';
import { 
  Search, X, Users, DollarSign, CheckSquare, 
  FileText, FolderKanban, Sparkles, ArrowRight 
} from 'lucide-react';
import { useNavigation, AppRoute } from '../../context/NavigationContext';
import { useCRM } from '../../context/CRMContext';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, navigate } = useNavigation();
  const { leads, deals, tasks, proposals, projects } = useCRM();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(q) || 
    l.companyName.toLowerCase().includes(q) ||
    l.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4);

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(q) || 
    (d.companyName && d.companyName.toLowerCase().includes(q))
  ).slice(0, 4);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(q)
  ).slice(0, 3);

  const filteredProposals = proposals.filter(p => 
    p.number.toLowerCase().includes(q) || 
    p.companyName.toLowerCase().includes(q) ||
    p.title.toLowerCase().includes(q)
  ).slice(0, 3);

  const handleSelect = (route: AppRoute, id?: string) => {
    navigate(route, id);
    setCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search leads, deals, tasks, proposals, or type a command..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick AI Suggestion */}
        <div className="p-2 bg-indigo-50/70 border-b border-indigo-100/80 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xs text-indigo-900 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Need natural language answers? Try AI Copilot</span>
          </div>
          <button
            onClick={() => handleSelect('ai')}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
          >
            <span>Open Copilot</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          {/* Quick Navigation Commands */}
          {!q && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                <button
                  onClick={() => handleSelect('dashboard')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleSelect('leads')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  All Leads
                </button>
                <button
                  onClick={() => handleSelect('deals')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Deals Pipeline
                </button>
                <button
                  onClick={() => handleSelect('tasks')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                  Tasks Board
                </button>
                <button
                  onClick={() => handleSelect('proposals')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-500" />
                  Proposals
                </button>
                <button
                  onClick={() => handleSelect('analytics')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition text-left"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  Analytics
                </button>
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Leads ({filteredLeads.length})
              </div>
              <div className="space-y-0.5">
                {filteredLeads.map(lead => (
                  <button
                    key={lead.id}
                    onClick={() => handleSelect('leads', lead.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{lead.name}</p>
                        <p className="text-[11px] text-slate-500">{lead.companyName} • ₹{lead.estimatedValue.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    {lead.score && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Score {lead.score}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {filteredDeals.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Deals ({filteredDeals.length})
              </div>
              <div className="space-y-0.5">
                {filteredDeals.map(deal => (
                  <button
                    key={deal.id}
                    onClick={() => handleSelect('deals', deal.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{deal.title}</p>
                        <p className="text-[11px] text-slate-500">{deal.companyName || 'Independent'} • {deal.stage.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      ₹{deal.value.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Tasks ({filteredTasks.length})
              </div>
              <div className="space-y-0.5">
                {filteredTasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleSelect('tasks', task.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-800">{task.title}</p>
                        <p className="text-[11px] text-slate-500">Due: {task.dueDate}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Proposals */}
          {filteredProposals.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Proposals ({filteredProposals.length})
              </div>
              <div className="space-y-0.5">
                {filteredProposals.map(prop => (
                  <button
                    key={prop.id}
                    onClick={() => handleSelect('proposals', prop.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{prop.number}: {prop.title}</p>
                        <p className="text-[11px] text-slate-500">{prop.companyName} • ₹{prop.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                      {prop.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && filteredLeads.length === 0 && filteredDeals.length === 0 && filteredTasks.length === 0 && filteredProposals.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No records found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try querying the AI Copilot to search across history and insights.</p>
              <button
                onClick={() => handleSelect('ai')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-sm hover:bg-indigo-500 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI Copilot
              </button>
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with arrows or click to open</span>
          <span className="hidden sm:inline">NexusCRM Unified Search</span>
        </div>
      </div>
    </div>
  );
};
