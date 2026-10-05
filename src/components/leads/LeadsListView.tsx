import React, { useState } from 'react';
import { 
  Users, Search, Filter, Plus, Download, Sparkles, 
  ArrowUpDown, MoreHorizontal, ChevronRight, Phone, Mail, 
  Building2, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNavigation } from '../../context/NavigationContext';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { LeadStatus } from '../../types/crm';
import { useToast } from '../../context/ToastContext';

export const LeadsListView: React.FC = () => {
  const { leads, convertLeadToDeal } = useCRM();
  const { openGlobalAddWithType, selectedId, navigate } = useNavigation();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [sortBy, setSortBy] = useState<'value' | 'score' | 'date'>('score');
  const [activeDrawerLeadId, setActiveDrawerLeadId] = useState<string | null>(selectedId);

  // Sync if selectedId from URL changes
  React.useEffect(() => {
    if (selectedId) setActiveDrawerLeadId(selectedId);
  }, [selectedId]);

  // Filtering
  const filtered = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'value') return b.estimatedValue - a.estimatedValue;
    if (sortBy === 'score') return (b.score || 0) - (a.score || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const exportCSV = () => {
    const headers = ['Name', 'Company', 'Title', 'Email', 'Phone', 'Source', 'Status', 'Score', 'Estimated Value', 'Created At'];
    const rows = sorted.map(l => [
      `"${l.name}"`,
      `"${l.companyName}"`,
      `"${l.title || ''}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.score || ''}"`,
      `"${l.estimatedValue}"`,
      `"${l.createdAt}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexus_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Exported', 'Downloaded leads spreadsheet.');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Leads & Inbound Inquiries
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {leads.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Qualify incoming prospects with real-time AI scoring, budget estimation, and automated next actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => openGlobalAddWithType('lead')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['all', 'new', 'qualifying', 'qualified', 'converted'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st} {st === 'all' ? `(${leads.length})` : `(${leads.filter(l => l.status === st).length})`}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads, companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none font-medium"
          >
            <option value="score">Sort by AI Score</option>
            <option value="value">Sort by Value</option>
            <option value="date">Sort by Recent</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Prospect</th>
              <th className="py-3 px-4">Company & Source</th>
              <th className="py-3 px-4">AI Score & Fit</th>
              <th className="py-3 px-4">Budget Value</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map(lead => (
              <tr 
                key={lead.id}
                onClick={() => setActiveDrawerLeadId(lead.id)}
                className="hover:bg-slate-50/80 transition cursor-pointer group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {lead.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {lead.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{lead.title || 'Client'}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-semibold text-slate-800">{lead.companyName}</p>
                  <span className="text-[10px] text-slate-400">{lead.source}</span>
                </td>

                <td className="py-3.5 px-4">
                  {lead.score ? (
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>{lead.score}/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 hidden xl:inline">
                        {lead.score >= 85 ? 'High Intent' : 'Warm Lead'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Pending analysis</span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-bold text-slate-900 text-xs">
                    ₹{lead.estimatedValue.toLocaleString('en-IN')}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'qualified' ? 'bg-emerald-100 text-emerald-800' :
                    lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                    lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {lead.status}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                    {lead.status !== 'converted' && (
                      <button
                        onClick={() => {
                          const deal = convertLeadToDeal(lead.id);
                          navigate('deals', deal.id);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                      >
                        Convert
                      </button>
                    )}
                    <button
                      onClick={() => setActiveDrawerLeadId(lead.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {sorted.map(lead => (
          <div
            key={lead.id}
            onClick={() => setActiveDrawerLeadId(lead.id)}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs active:bg-slate-50 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  {lead.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{lead.name}</h3>
                  <p className="text-xs text-slate-500">{lead.companyName}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                lead.status === 'qualified' ? 'bg-emerald-100 text-emerald-800' :
                lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                'bg-slate-100 text-slate-700'
              }`}>
                {lead.status}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">
                  ₹{lead.estimatedValue.toLocaleString('en-IN')}
                </span>
                {lead.score && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Score {lead.score}
                  </span>
                )}
              </div>
              <span className="text-indigo-600 font-semibold text-xs flex items-center gap-1">
                View AI details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No leads match your filter</p>
          <p className="text-xs text-slate-500 mt-1">Try changing status or search query.</p>
        </div>
      )}

      {/* Drawer */}
      <LeadDetailDrawer
        leadId={activeDrawerLeadId}
        onClose={() => setActiveDrawerLeadId(null)}
      />
    </div>
  );
};
