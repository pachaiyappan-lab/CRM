import React, { useState } from 'react';
import { 
  Calendar as CalIcon, Plus, Clock, Video, Phone, 
  MapPin, CheckCircle2, ChevronLeft, ChevronRight, 
  Sparkles, Trash2, ExternalLink 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useToast } from '../../context/ToastContext';
import { GeminiService } from '../../services/geminiService';
import { CalendarEvent } from '../../types/crm';

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, addTask } = useCRM();
  const { addToast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isMeetingNotesOpen, setIsMeetingNotesOpen] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 16));
  const [eventType, setEventType] = useState<'meeting' | 'followup' | 'task_deadline'>('meeting');
  const [eventLocation, setEventLocation] = useState('Google Meet');
  const [eventDesc, setEventDesc] = useState('');

  // AI Meeting Assistant State
  const [rawNotes, setRawNotes] = useState('');
  const [isProcessingNotes, setIsProcessingNotes] = useState(false);
  const [aiMeetingResult, setAiMeetingResult] = useState<any>(null);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    addCalendarEvent({
      title: eventTitle,
      description: eventDesc,
      startDate: new Date(eventDate).toISOString(),
      endDate: new Date(new Date(eventDate).getTime() + 45 * 60000).toISOString(),
      type: eventType,
      attendees: ['client@example.com'],
      location: eventLocation,
      meetLink: eventLocation.includes('Meet') ? 'https://meet.google.com/xyz-demo-crm' : undefined
    });

    addToast('Meeting Scheduled', `"${eventTitle}" added to calendar.`);
    setIsScheduleOpen(false);
    setEventTitle(''); setEventDesc('');
  };

  const handleProcessMeetingNotes = async () => {
    if (!rawNotes.trim()) return;
    setIsProcessingNotes(true);
    try {
      const result = await GeminiService.processMeetingNotes(rawNotes);
      setAiMeetingResult(result);
      addToast('AI Summary Ready', 'Extracted decisions and action items.');
    } catch {
      addToast('Error', 'Failed to process notes', 'error');
    } finally {
      setIsProcessingNotes(false);
    }
  };

  const handleCreateTasksFromAI = () => {
    if (!aiMeetingResult?.actionItems) return;
    aiMeetingResult.actionItems.forEach((item: any) => {
      addTask({
        title: item.title,
        description: `Generated from meeting transcript. Assignee: ${item.assignee}`,
        priority: item.priority || 'high',
        dueDate: item.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        status: 'todo'
      });
    });
    addToast('Tasks Created', `Added ${aiMeetingResult.actionItems.length} action items to your CRM.`);
    setIsMeetingNotesOpen(false);
    setAiMeetingResult(null);
    setRawNotes('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Calendar & Client Meetings
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {calendarEvents.length} Events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Coordinate client discovery calls, review sessions, deadlines, and convert meeting transcripts into CRM tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Meeting Assistant Button */}
          <button
            onClick={() => setIsMeetingNotesOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>AI Meeting Notes</span>
          </button>

          <button
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 px-3">
              {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-1 rounded-lg hover:bg-white text-slate-600 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            Today
          </button>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['month', 'week', 'day'] as const).map(type => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                viewType === type ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Events Schedule Stream & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Schedule Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Upcoming Agenda & Sessions</h2>
            <span className="text-xs text-slate-400">Chronological</span>
          </div>

          <div className="space-y-3">
            {calendarEvents.map(event => (
              <div 
                key={event.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    event.type === 'meeting' ? 'bg-indigo-50 text-indigo-700' :
                    event.type === 'followup' ? 'bg-amber-50 text-amber-700' :
                    'bg-purple-50 text-purple-700'
                  }`}>
                    {event.type === 'meeting' ? <Video className="w-5 h-5" /> : <CalIcon className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{event.title}</h3>
                    {event.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                          {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>

                      {event.location && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{event.location}</span>
                        </span>
                      )}

                      {event.meetLink && (
                        <a
                          href={event.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <span>Join Meeting</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    deleteCalendarEvent(event.id);
                    addToast('Event Removed', 'Calendar event deleted.');
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {calendarEvents.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-slate-700">No events scheduled</p>
                <p className="text-xs text-slate-500 mt-1">Click "Schedule Event" to add a client meeting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Meeting Assistant & Integrations */}
        <div className="space-y-4">
          {/* AI Assistant Banner Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border border-indigo-800 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                AI Meeting Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              Paste meeting recordings or unformatted meeting notes. The AI extracts a summary, confirmed decisions, and generates follow-up tasks with one click!
            </p>
            <button
              onClick={() => setIsMeetingNotesOpen(true)}
              className="w-full py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm"
            >
              Analyze Notes / Transcript
            </button>
          </div>

          {/* Calendar Integrations Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Calendar Integrations
            </h3>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">Google Calendar</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Connected
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">Zoom / Google Meet</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Auto-links Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Schedule Event / Meeting</h2>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discovery Call with Client"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="meeting">Client Meeting</option>
                    <option value="followup">Follow-up Call</option>
                    <option value="task_deadline">Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={e => setEventLocation(e.target.value)}
                    placeholder="Google Meet, Zoom, Phone"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Outline key discussion points..."
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI MEETING ASSISTANT MODAL (Core Feature) */}
      {isMeetingNotesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">AI Meeting Assistant</h2>
                  <p className="text-xs text-slate-500">Generate summaries, key decisions, and executable CRM tasks.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMeetingNotesOpen(false);
                  setAiMeetingResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {!aiMeetingResult ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Paste Raw Meeting Notes or Transcript:
                </label>
                <textarea
                  rows={8}
                  placeholder="e.g. Call with Sarah from BrightLabs. Discussed 5-week launch timeline. Sarah agreed to React 19 architecture and 50% advance. Devon to deliver wireframes by Friday, Alex to send contract..."
                  value={rawNotes}
                  onChange={e => setRawNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed font-mono"
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRawNotes(`Discovery Sync with Rajesh Kumar (Zenith Logistics):
Discussed enterprise freight tracking portal. Rajesh emphasized that live GPS tracking latency must be under 2 seconds. Legacy PostgreSQL database synchronization frequency was confirmed as hourly. Rajesh confirmed budget of ₹2.4 Lakhs with 40% advance payment terms.
Action Items:
1. Devon to send PostgreSQL data security architecture document by Thursday.
2. Priya to prepare live GPS interactive demo prototype by next Tuesday.
3. Schedule contract signing walkthrough on Friday.`);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Load Sample Meeting Transcript
                  </button>

                  <button
                    onClick={handleProcessMeetingNotes}
                    disabled={isProcessingNotes || !rawNotes.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isProcessingNotes ? 'Analyzing with AI...' : 'Generate Summary & Tasks'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                {/* Summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 uppercase text-[10px] block mb-1">
                    Meeting Summary:
                  </span>
                  <p className="text-slate-700 leading-relaxed">{aiMeetingResult.summary}</p>
                </div>

                {/* Key Points & Decisions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 uppercase text-[10px] block mb-2">
                      Key Discussion Points:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {aiMeetingResult.keyPoints?.map((p: string, i: number) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900 uppercase text-[10px] block mb-2">
                      Decisions Made:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside">
                      {aiMeetingResult.decisions?.map((d: string, i: number) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Extracted Tasks (Rule: User reviews -> User confirms -> Action executes) */}
                <div>
                  <span className="font-bold text-slate-900 uppercase text-[10px] block mb-2">
                    Action Items Ready for CRM Tasks:
                  </span>
                  <div className="space-y-2">
                    {aiMeetingResult.actionItems?.map((item: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-900 truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {item.assignee}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            Due {item.dueDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setAiMeetingResult(null)}
                    className="text-xs font-semibold text-slate-600 hover:underline"
                  >
                    ← Edit Transcript
                  </button>

                  <button
                    onClick={handleCreateTasksFromAI}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create {aiMeetingResult.actionItems?.length || 0} CRM Tasks</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
