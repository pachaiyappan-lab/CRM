import React, { useState } from 'react';
import { 
  FolderKanban, Plus, Clock, CheckCircle2, DollarSign, 
  Play, Pause, Calendar, Users, ChevronRight, Trash2, 
  Check, FileText, Sparkles 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { Project, ProjectStatus } from '../../types/crm';

export const ProjectsView: React.FC = () => {
  const { projects, addProject, toggleMilestone, addTimeLog, deleteProject } = useCRM();
  const { addToast } = useToast();

  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);
  const [logDesc, setLogDesc] = useState('');
  const [logHours, setLogHours] = useState('2');
  const [logBillable, setLogBillable] = useState(true);

  // Active timer simulation
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStopAndSaveTimer = () => {
    setIsTimerRunning(false);
    const hrs = Math.max(0.25, parseFloat((timerSeconds / 3600).toFixed(2)));
    if (selectedProject) {
      addTimeLog(selectedProject.id, {
        description: 'Tracked focused sprint session',
        hours: hrs,
        billable: true
      });
      addToast('Time Logged', `Recorded ${hrs} billable hours.`);
    }
    setTimerSeconds(0);
  };

  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !logDesc) return;
    addTimeLog(selectedProject.id, {
      description: logDesc,
      hours: parseFloat(logHours) || 1,
      billable: logBillable
    });
    addToast('Time Log Added', `${logHours} hours logged.`);
    setIsTimeLogModalOpen(false);
    setLogDesc('');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Projects & Delivery
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {projects.length} Active Projects
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track milestones, deliverables, billable hours, budget consumption, and client sign-offs.
          </p>
        </div>

        {/* Live Timer Stopwatch */}
        <div className="flex items-center gap-3 bg-slate-900 text-white p-2 px-3.5 rounded-2xl shadow-sm self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-sm font-bold tracking-wider">
              {formatTimer(timerSeconds)}
            </span>
          </div>
          {!isTimerRunning ? (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={handleStopAndSaveTimer}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
            >
              <Pause className="w-3 h-3 fill-current" />
              <span>Log & Stop</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Projects List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Projects ({projects.length})
          </h2>

          {projects.map(proj => {
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{proj.title}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    proj.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-3">
                  {proj.companyName || 'Independent'}
                </p>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Milestones progress</span>
                    <span className="font-bold text-slate-900">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Budget: <strong className="text-slate-800">₹{proj.budget.toLocaleString('en-IN')}</strong>
                  </span>
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    {proj.milestones.filter(m => m.completed).length}/{proj.milestones.length} Delivered
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Project Full Details */}
        {selectedProject && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedProject.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: <strong className="text-slate-800">{selectedProject.companyName}</strong> ({selectedProject.contactName})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimeLogModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Log Hours</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete project?')) {
                      deleteProject(selectedProject.id);
                      setSelectedProject(projects.find(p => p.id !== selectedProject.id) || null);
                      addToast('Project Deleted', 'Project removed.');
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Financial & Time Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Contract Budget</span>
                <span className="text-base font-extrabold text-slate-900">₹{selectedProject.budget.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Estimated Cost</span>
                <span className="text-base font-extrabold text-slate-900">₹{selectedProject.spent.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Completion</span>
                <span className="text-base font-extrabold text-indigo-600">{selectedProject.progress}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Deadline</span>
                <span className="text-base font-bold text-slate-800">{selectedProject.endDate}</span>
              </div>
            </div>

            {/* Project Milestones Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Project Milestones & Deliverables
                </h3>
                <span className="text-xs text-slate-400">Click checkmark to toggle status</span>
              </div>

              <div className="space-y-2">
                {selectedProject.milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(selectedProject.id, m.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                      m.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        m.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'
                      }`}>
                        {m.completed && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs font-semibold truncate ${m.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {m.title}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 shrink-0">
                      Target: {m.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Tracking History */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Logged Sprint Hours ({selectedProject.timeLogs.reduce((acc, t) => acc + t.hours, 0)} hrs)
                </h3>
                <button
                  onClick={() => setIsTimeLogModalOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  + Add Log
                </button>
              </div>

              <div className="space-y-2">
                {selectedProject.timeLogs.map(log => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{log.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{log.date} by {log.userName}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{log.hours} hrs</span>
                      <span className="block text-[10px] text-emerald-600 font-semibold">{log.billable ? 'Billable' : 'Internal'}</span>
                    </div>
                  </div>
                ))}

                {selectedProject.timeLogs.length === 0 && (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No time logs recorded yet. Use the live stopwatch or click "Log Hours".
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Log Modal */}
      {isTimeLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Log Project Hours</h2>
            <form onSubmit={handleSaveManualLog} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design token updates and checkout QA testing"
                  value={logDesc}
                  onChange={e => setLogDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hours Spent</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    required
                    value={logHours}
                    onChange={e => setLogHours(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="billable"
                    checked={logBillable}
                    onChange={e => setLogBillable(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="billable" className="text-xs font-semibold text-slate-700">Billable to Client</label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimeLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
