import React, { useState, useEffect } from 'react';
import { X, Users, DollarSign, CheckSquare, Calendar, FileText, Sparkles } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { Priority, LeadStatus, DealStage } from '../../types/crm';

export const GlobalAddModal: React.FC = () => {
  const { isGlobalAddOpen, setGlobalAddOpen, globalAddInitialType } = useNavigation();
  const { addLead, addDeal, addTask, addCalendarEvent, companies, contacts } = useCRM();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'lead' | 'deal' | 'task' | 'meeting'>('lead');

  // Form states
  // Lead
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadValue, setLeadValue] = useState('75000');
  const [leadSource, setLeadSource] = useState<any>('Website');
  const [leadNotes, setLeadNotes] = useState('');

  // Deal
  const [dealTitle, setDealTitle] = useState('');
  const [dealValue, setDealValue] = useState('100000');
  const [dealStage, setDealStage] = useState<DealStage>('qualified');
  const [dealCompany, setDealCompany] = useState('');
  const [dealCloseDate, setDealCloseDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  // Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskDesc, setTaskDesc] = useState('');

  // Meeting
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [meetLocation, setMeetLocation] = useState('Google Meet');

  useEffect(() => {
    if (globalAddInitialType) {
      if (['lead', 'deal', 'task', 'meeting'].includes(globalAddInitialType)) {
        setActiveTab(globalAddInitialType as any);
      }
    }
  }, [globalAddInitialType, isGlobalAddOpen]);

  if (!isGlobalAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'lead') {
      if (!leadName || !leadCompany) return;
      const created = addLead({
        name: leadName,
        email: leadEmail || `${leadName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: leadPhone,
        companyName: leadCompany,
        source: leadSource,
        status: 'new',
        estimatedValue: parseFloat(leadValue) || 50000,
        tags: ['New Inbound'],
        notes: leadNotes
      });
      addToast('Lead Added Successfully', `${created.name} (${created.companyName}) has been created.`);
    } else if (activeTab === 'deal') {
      if (!dealTitle) return;
      const created = addDeal({
        title: dealTitle,
        value: parseFloat(dealValue) || 50000,
        stage: dealStage,
        probability: dealStage === 'proposal' ? 60 : 40,
        expectedCloseDate: dealCloseDate,
        companyName: dealCompany || 'Independent Client',
        tags: ['New Deal'],
        notes: 'Created via quick action'
      });
      addToast('Deal Created', `"${created.title}" added to pipeline.`);
    } else if (activeTab === 'task') {
      if (!taskTitle) return;
      addTask({
        title: taskTitle,
        description: taskDesc,
        status: 'todo',
        priority: taskPriority,
        dueDate: taskDueDate
      });
      addToast('Task Created', `"${taskTitle}" added to task list.`);
    } else if (activeTab === 'meeting') {
      if (!meetTitle) return;
      addCalendarEvent({
        title: meetTitle,
        startDate: new Date(meetDate).toISOString(),
        endDate: new Date(new Date(meetDate).getTime() + 45 * 60000).toISOString(),
        type: 'meeting',
        attendees: ['client@example.com'],
        location: meetLocation
      });
      addToast('Meeting Scheduled', `"${meetTitle}" added to calendar.`);
    }

    setGlobalAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Tabs */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('lead')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'lead' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Lead</span>
            </button>
            <button
              onClick={() => setActiveTab('deal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'deal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Deal</span>
            </button>
            <button
              onClick={() => setActiveTab('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'task' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Task</span>
            </button>
            <button
              onClick={() => setActiveTab('meeting')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'meeting' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Meeting</span>
            </button>
          </div>
          <button
            onClick={() => setGlobalAddOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {activeTab === 'lead' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Patel"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Tech Labs"
                    value={leadCompany}
                    onChange={e => setLeadCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="maya@acme.com"
                    value={leadEmail}
                    onChange={e => setLeadEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="75000"
                    value={leadValue}
                    onChange={e => setLeadValue(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={leadSource}
                    onChange={e => setLeadSource(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Inbound">Inbound</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={leadPhone}
                    onChange={e => setLeadPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Client needs React SPA redesign, Tailwind design tokens, and launch by next month..."
                  value={leadNotes}
                  onChange={e => setLeadNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {activeTab === 'deal' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BrightLabs Custom Design System"
                  value={dealTitle}
                  onChange={e => setDealTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Value (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="100000"
                    value={dealValue}
                    onChange={e => setDealValue(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Stage</label>
                  <select
                    value={dealStage}
                    onChange={e => setDealStage(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="new">New Opportunity</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Company</label>
                  <input
                    type="text"
                    placeholder="BrightLabs Interactive"
                    value={dealCompany}
                    onChange={e => setDealCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Closing Date</label>
                  <input
                    type="date"
                    value={dealCloseDate}
                    onChange={e => setDealCloseDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'task' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title / Follow-up *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Follow up on proposal signoff call"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Agenda</label>
                <textarea
                  rows={2}
                  placeholder="Add notes for this follow-up..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </>
          )}

          {activeTab === 'meeting' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scope Walkthrough & Milestones"
                  value={meetTitle}
                  onChange={e => setMeetTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={meetDate}
                    onChange={e => setMeetDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Platform</label>
                  <input
                    type="text"
                    value={meetLocation}
                    onChange={e => setMeetLocation(e.target.value)}
                    placeholder="Google Meet, Zoom, Phone"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setGlobalAddOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
