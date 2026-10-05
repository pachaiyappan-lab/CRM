import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  PieChart, Calendar, ArrowUpRight, Filter 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const AnalyticsView: React.FC = () => {
  const { leads, deals, invoices, teamMembers } = useCRM();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'year'>('30d');

  // Lead sources breakdown
  const sources = ['Website', 'Referral', 'LinkedIn', 'Inbound', 'Cold Outreach'] as const;
  const sourceStats = sources.map(source => {
    const count = leads.filter(l => l.source === source).length;
    const value = leads.filter(l => l.source === source).reduce((sum, l) => sum + l.estimatedValue, 0);
    return { source, count, value };
  });

  const totalLeadValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0) || 1;

  // Pipeline stage distribution
  const stageStats = [
    { stage: 'New', count: deals.filter(d => d.stage === 'new').length, val: deals.filter(d => d.stage === 'new').reduce((s, d) => s + d.value, 0) },
    { stage: 'Qualified', count: deals.filter(d => d.stage === 'qualified').length, val: deals.filter(d => d.stage === 'qualified').reduce((s, d) => s + d.value, 0) },
    { stage: 'Proposal', count: deals.filter(d => d.stage === 'proposal').length, val: deals.filter(d => d.stage === 'proposal').reduce((s, d) => s + d.value, 0) },
    { stage: 'Negotiation', count: deals.filter(d => d.stage === 'negotiation').length, val: deals.filter(d => d.stage === 'negotiation').reduce((s, d) => s + d.value, 0) },
    { stage: 'Won', count: deals.filter(d => d.stage === 'won').length, val: deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0) },
    { stage: 'Lost', count: deals.filter(d => d.stage === 'lost').length, val: deals.filter(d => d.stage === 'lost').reduce((s, d) => s + d.value, 0) }
  ];

  const wonTotal = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);
  const activePipelineTotal = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              CRM Analytics & Business Intelligence
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time conversion performance, acquisition channels, pipeline velocity, and revenue forecasts.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['30d', '90d', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setTimeRange(period)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                timeRange === period ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {period === '30d' ? 'Last 30 Days' : period === '90d' ? 'Last Quarter' : 'Year to Date'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pipeline Win Rate</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {deals.length > 0 ? Math.round((deals.filter(d => d.stage === 'won').length / deals.length) * 100) : 0}%
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" /> Top quartile performance
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Deals In Flight</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{(activePipelineTotal / 100000).toFixed(1)}L
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {deals.filter(d => !['won', 'lost'].includes(d.stage)).length} active opportunities
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Deal Size</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₹{deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length).toLocaleString('en-IN') : 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all closed & active deals</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Avg Lead-to-Deal Cycle</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">
            18 Days
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            -4 days vs previous period
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Lead Acquisition Channels</h2>
              <p className="text-xs text-slate-500">Volume and budget value by inbound origin</p>
            </div>
            <span className="text-xs text-indigo-600 font-bold">{leads.length} Leads</span>
          </div>

          <div className="space-y-3 pt-2">
            {sourceStats.map(item => {
              const percentage = Math.round((item.value / totalLeadValue) * 100);
              return (
                <div key={item.source}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{item.source} ({item.count} leads)</span>
                    <span className="font-bold text-slate-900">₹{item.value.toLocaleString('en-IN')} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.source === 'Referral' ? 'bg-emerald-500' :
                        item.source === 'Inbound' ? 'bg-indigo-500' :
                        item.source === 'Website' ? 'bg-cyan-500' :
                        'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Pipeline Stage Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Deal Pipeline Velocity by Stage</h2>
              <p className="text-xs text-slate-500">Value distribution across sales stages</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Stage Value</span>
          </div>

          <div className="space-y-3 pt-2">
            {stageStats.map(st => (
              <div key={st.stage} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${
                    st.stage === 'Won' ? 'bg-emerald-500' :
                    st.stage === 'Negotiation' ? 'bg-amber-500' :
                    st.stage === 'Proposal' ? 'bg-purple-500' :
                    st.stage === 'Lost' ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <span className="font-bold text-slate-900">{st.stage}</span>
                    <span className="text-[11px] text-slate-400 block">{st.count} deal(s)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{st.val.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance Overview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Team Performance & Pipeline Ownership</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {teamMembers.map(member => {
            const memberLeads = leads.filter(l => l.assignedToId === member.id);
            const memberDeals = deals.filter(d => d.assignedToId === member.id);
            const memberValue = memberDeals.reduce((s, d) => s + d.value, 0);

            return (
              <div key={member.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name[0]
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{member.name}</h3>
                    <p className="text-[11px] text-slate-500">{member.title || member.role}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{memberDeals.length} Deals Managed</span>
                  <span className="font-bold text-slate-900">₹{(memberValue / 100000).toFixed(1)}L</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
