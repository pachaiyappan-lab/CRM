import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, CheckCircle2, ArrowRight, 
  Clock, AlertTriangle, DollarSign, Users, Check, 
  RotateCcw, ExternalLink, HelpCircle 
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useNavigation } from '../../context/NavigationContext';
import { useToast } from '../../context/ToastContext';
import { GeminiService } from '../../services/geminiService';
import { AICopilotMessage, AICopilotAction } from '../../types/crm';

export const AICopilotPage: React.FC = () => {
  const { leads, deals, tasks, invoices, proposals, projects, addTask, updateTask } = useCRM();
  const { navigate } = useNavigation();
  const { addToast } = useToast();

  const [messages, setMessages] = useState<AICopilotMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content: `Hello! I am your **Gemini 2.0 Flash AI Copilot** embedded inside NexusCRM. I have real-time context of your client leads, pipeline deals, follow-up deadlines, and invoices.\n\nAsk me for sales strategies, lead qualification assessments, follow-up emails, or pipeline analysis. Remember: **I will suggest actions and wait for your confirmation before touching any records!**`,
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [executedActionIds, setExecutedActionIds] = useState<string[]>([]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isProcessing) return;

    const userMsg: AICopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    try {
      const response = await GeminiService.processCopilotQuery(q, {
        leads, deals, tasks, invoices, proposals, projects
      });
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Sorry, I encountered an issue processing your CRM query. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ENFORCE AI ACTION RULE: AI suggests -> User reviews -> User confirms -> Action executes
  const handleExecuteAction = (action: AICopilotAction) => {
    if (executedActionIds.includes(action.id)) return;

    if (action.type === 'create_tasks') {
      if (action.payload?.tasks) {
        action.payload.tasks.forEach((t: any) => addTask(t));
        addToast('Action Executed', `Created ${action.payload.tasks.length} follow-up task(s).`);
      } else if (action.payload?.taskIds) {
        action.payload.taskIds.forEach((id: string) => {
          updateTask(id, { dueDate: new Date().toISOString().split('T')[0] });
        });
        addToast('Action Executed', `Rescheduled tasks to today.`);
      }
    } else if (action.type === 'draft_email') {
      addToast('Composer Ready', 'Launching AI email assistant.');
      navigate('communications');
    }

    setExecutedActionIds(prev => [...prev, action.id]);
  };

  const samplePrompts = [
    'Show me all overdue follow-ups',
    'Which deals are worth more than ₹1 lakh?',
    'Summarize my relationship with BrightLabs',
    'Which leads haven\'t responded in 7 days?',
    'Create follow-up tasks for these leads',
    'Draft an email to Sarah'
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Nexus AI Copilot
              </h1>
              <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Gemini 2.0 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Natural language CRM intelligence, sales optimization, and confirmed action execution.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `msg-${Date.now()}`,
                sender: 'assistant',
                content: 'Chat session cleared. How can I assist with your business today?',
                timestamp: 'Just now'
              }
            ]);
            setExecutedActionIds([]);
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Suggestions:
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(prompt)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/40 transition shadow-2xs whitespace-nowrap shrink-0"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xs'
                }`}
              >
                {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`space-y-3 max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Text Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Returned Record Cards */}
                {msg.recordsFound && msg.recordsFound.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-1">
                    {msg.recordsFound.map(record => (
                      <div
                        key={record.id}
                        onClick={() => navigate(`${record.type}s` as any, record.id)}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-xs text-slate-900 truncate">{record.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{record.subtitle}</p>
                        </div>
                        {record.value && (
                          <span className="font-extrabold text-xs text-slate-900 shrink-0">
                            {record.value}
                          </span>
                        )}
                        {record.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                            {record.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ACTION CARDS (Rule: AI Suggests -> User reviews -> User confirms -> Action executes) */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="w-full space-y-2 pt-1">
                    {msg.actions.map(action => {
                      const isDone = executedActionIds.includes(action.id);
                      return (
                        <div
                          key={action.id}
                          className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-950 shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                              <span>AI Action Proposal</span>
                            </div>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                              Review Required
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{action.title}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">{action.description}</p>
                          </div>

                          <div className="pt-2 flex items-center justify-end gap-2">
                            {isDone ? (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                                <Check className="w-3.5 h-3.5" />
                                <span>Action Executed</span>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleExecuteAction(action)}
                                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
                                >
                                  <span>Execute Action</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Analyzing CRM records and planning actions...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md shrink-0 flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSendQuery();
          }}
          placeholder="Ask a question or organize records (e.g. 'Which leads haven\'t responded in 7 days?')..."
          className="flex-1 text-xs px-3 py-2 bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSendQuery()}
          disabled={!inputQuery.trim() || isProcessing}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
