import React, { useState } from 'react';
import { 
  CheckSquare, Plus, Search, Calendar, AlertTriangle, 
  Clock, CheckCircle2, Repeat, Trash2, Filter, Kanban, List, 
  Edit3, X, Save
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNavigation } from '../../context/NavigationContext';
import { useToast } from '../../context/ToastContext';
import { Task, Priority, TaskStatus } from '../../types/crm';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, toggleTaskStatus, deleteTask } = useCRM();
  const { openGlobalAddWithType } = useNavigation();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'urgent' | 'completed'>('all');
  const [search, setSearch] = useState('');

  // Inline Quick Add state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickDueDate, setQuickDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickPriority, setQuickPriority] = useState<Priority>('medium');

  // Edit Task Modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editStatus, setEditStatus] = useState<TaskStatus>('todo');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      dueDate: quickDueDate,
      priority: quickPriority,
      status: 'todo',
    });

    addToast('Task Created', `"${quickTitle.trim()}" added to your list.`);
    setQuickTitle('');
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    updateTask(editingTask.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      dueDate: editDueDate,
      priority: editPriority,
      status: editStatus,
      completedAt: editStatus === 'completed' ? new Date().toISOString() : undefined
    });

    addToast('Task Updated', `Changes to "${editTitle.trim()}" saved.`);
    setEditingTask(null);
  };

  const filtered = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase())) ||
      (task.relatedToTitle && task.relatedToTitle.toLowerCase().includes(search.toLowerCase()));

    const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
    const isToday = task.dueDate === todayStr;

    if (!matchesSearch) return false;

    if (filter === 'overdue') return isOverdue;
    if (filter === 'today') return isToday;
    if (filter === 'urgent') return task.priority === 'urgent' || task.priority === 'high';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const overdueCount = tasks.filter(t => t.status !== 'completed' && t.dueDate < todayStr).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Tasks & Follow-up Actions
            </h1>
            {overdueCount > 0 ? (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                {overdueCount} Overdue
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                All on track
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily freelancer priorities, client follow-up reminders, milestones, and recurring actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <button
            onClick={() => openGlobalAddWithType('task')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filter === 'overdue' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filter === 'today' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Due Today
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filter === 'urgent' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Urgent / High
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              filter === 'completed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Inline Quick-Add Task Box */}
      <form 
        onSubmit={handleQuickAdd}
        className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Quick add a new task (e.g. Follow up on design deliverable)..."
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={quickDueDate}
            onChange={e => setQuickDueDate(e.target.value)}
            className="text-xs px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-slate-900"
          />

          <select
            value={quickPriority}
            onChange={e => setQuickPriority(e.target.value as any)}
            className="text-xs px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:border-slate-900"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>

          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </form>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filtered.map(task => {
            const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
            return (
              <div 
                key={task.id}
                className={`p-4 flex items-start justify-between gap-3 hover:bg-slate-50/80 transition ${
                  task.status === 'completed' ? 'bg-slate-50/50 opacity-70' : ''
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-indigo-600" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-xs font-bold leading-tight ${
                        task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </p>
                      {task.isRecurring && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          <Repeat className="w-2.5 h-2.5" />
                          <span>{task.recurringInterval || 'Weekly'}</span>
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-slate-500">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Due: {task.dueDate} {isOverdue && '(Overdue)'}</span>
                      </span>

                      {task.relatedToTitle && (
                        <span className="text-slate-400">
                          Related to: <strong className="text-slate-700">{task.relatedToTitle}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' :
                    task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                    task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded transition"
                    title="Edit Task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      addToast('Task Deleted', 'Task removed.');
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No tasks found</p>
              <p className="text-xs text-slate-500 mt-1">Create follow-ups or check off remaining items.</p>
            </div>
          )}
        </div>
      )}

      {/* KANBAN BOARD VIEW (To Do, In Progress, Review, Completed) */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {(['todo', 'in_progress', 'review', 'completed'] as TaskStatus[]).map(status => {
            const statusTasks = filtered.filter(t => t.status === status);
            const statusLabels: Record<TaskStatus, string> = {
              todo: 'To Do',
              in_progress: 'In Progress',
              review: 'In Review',
              completed: 'Completed'
            };

            return (
              <div key={status} className="bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {statusLabels[status]}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                    {statusTasks.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[160px]">
                  {statusTasks.map(task => (
                    <div 
                      key={task.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p 
                          onClick={() => handleOpenEdit(task)}
                          className={`text-xs font-bold leading-tight cursor-pointer hover:text-indigo-600 ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}
                        >
                          {task.title}
                        </p>
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="text-slate-400 hover:text-indigo-600 p-0.5"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-500">{task.dueDate}</span>
                        <select
                          value={task.status}
                          onChange={e => updateTask(task.id, { status: e.target.value as any })}
                          className="font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Prog</option>
                          <option value="review">Review</option>
                          <option value="completed">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Edit Task Details</h3>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Add context or checklists..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 font-semibold text-slate-800"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (editingTask) {
                      deleteTask(editingTask.id);
                      addToast('Task Deleted', 'Task removed.');
                      setEditingTask(null);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
