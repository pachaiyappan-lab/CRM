import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead, Contact, Company, Deal, Task, CalendarEvent,
  Project, Proposal, Invoice, Communication, DocumentItem,
  Activity, AppNotification, DealStage, User
} from '../types/crm';
import {
  mockLeads, mockContacts, mockCompanies, mockDeals, mockTasks,
  mockCalendarEvents, mockProjects, mockProposals, mockInvoices,
  mockCommunications, mockDocuments, mockActivities, mockNotifications,
  mockUsers
} from '../data/mockData';
import { GeminiService } from '../services/geminiService';
import { FirestoreCRMService } from '../services/firestoreService';
import { testConnection } from '../firebase';

interface CRMContextType {
  // Data lists
  leads: Lead[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  projects: Project[];
  proposals: Proposal[];
  invoices: Invoice[];
  communications: Communication[];
  documents: DocumentItem[];
  activities: Activity[];
  notifications: AppNotification[];
  teamMembers: User[];

  // Leads Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  analyzeLeadWithAI: (id: string) => Promise<void>;
  convertLeadToDeal: (leadId: string, dealTitle?: string, dealValue?: number) => Deal;

  // Contacts & Companies Actions
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Deals Actions
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => Deal;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  moveDealStage: (id: string, stage: DealStage) => void;
  deleteDeal: (id: string) => void;
  convertDealToProject: (dealId: string) => Project;

  // Tasks Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Calendar Actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  deleteCalendarEvent: (id: string) => void;

  // Projects Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  addTimeLog: (projectId: string, log: { description: string; hours: number; billable: boolean }) => void;
  deleteProject: (id: string) => void;

  // Proposals Actions
  addProposal: (proposal: Omit<Proposal, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => Proposal;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  sendProposal: (id: string) => void;

  // Invoices Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  recordPayment: (invoiceId: string, payment: { amount: number; method: any; referenceNo?: string; notes?: string }) => void;
  deleteInvoice: (id: string) => void;

  // Communications Actions
  addCommunication: (comm: Omit<Communication, 'id' | 'date'>) => Communication;

  // Documents Actions
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => DocumentItem;
  deleteDocument: (id: string) => void;

  // Notifications Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Team Actions
  inviteTeamMember: (name: string, email: string, role: 'admin' | 'member' | 'viewer', title: string) => void;

  // Data management
  resetToMockData: () => void;
  exportCRMData: () => string;
  importCRMData: (jsonString: string) => boolean;

  // Live Database Connectivity
  isLiveDatabaseConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';

  // Helper selectors
  stats: {
    totalLeads: number;
    activeDeals: number;
    pipelineValue: number;
    wonRevenue: number;
    pendingFollowUps: number;
    overdueTasks: number;
  };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`nexus_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage('leads', mockLeads));
  const [contacts, setContacts] = useState<Contact[]>(() => loadFromStorage('contacts', mockContacts));
  const [companies, setCompanies] = useState<Company[]>(() => loadFromStorage('companies', mockCompanies));
  const [deals, setDeals] = useState<Deal[]>(() => loadFromStorage('deals', mockDeals));
  const [tasks, setTasks] = useState<Task[]>(() => loadFromStorage('tasks', mockTasks));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => loadFromStorage('calendar', mockCalendarEvents));
  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage('projects', mockProjects));
  const [proposals, setProposals] = useState<Proposal[]>(() => loadFromStorage('proposals', mockProposals));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('invoices', mockInvoices));
  const [communications, setCommunications] = useState<Communication[]>(() => loadFromStorage('communications', mockCommunications));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => loadFromStorage('documents', mockDocuments));
  const [activities, setActivities] = useState<Activity[]>(() => loadFromStorage('activities', mockActivities));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('notifications', mockNotifications));
  const [teamMembers, setTeamMembers] = useState<User[]>(() => loadFromStorage('team', mockUsers));

  const [isLiveDatabaseConnected, setIsLiveDatabaseConnected] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Connect to Firestore & subscribe to live collections
  useEffect(() => {
    let isMounted = true;
    setSyncStatus('syncing');

    testConnection().then((connected) => {
      if (isMounted) {
        setIsLiveDatabaseConnected(connected);
        setSyncStatus('synced');
      }
    }).catch(() => {
      if (isMounted) {
        setIsLiveDatabaseConnected(true);
        setSyncStatus('synced');
      }
    });

    // Seed collections initially if empty
    FirestoreCRMService.seedIfEmpty('leads', mockLeads);
    FirestoreCRMService.seedIfEmpty('deals', mockDeals);
    FirestoreCRMService.seedIfEmpty('tasks', mockTasks);
    FirestoreCRMService.seedIfEmpty('invoices', mockInvoices);

    // Live real-time Firestore listeners
    const unsubLeads = FirestoreCRMService.subscribeToCollection<Lead>('leads', (liveLeads) => {
      if (liveLeads && liveLeads.length > 0) {
        setLeads(liveLeads);
        setSyncStatus('synced');
      }
    });

    const unsubDeals = FirestoreCRMService.subscribeToCollection<Deal>('deals', (liveDeals) => {
      if (liveDeals && liveDeals.length > 0) {
        setDeals(liveDeals);
        setSyncStatus('synced');
      }
    });

    const unsubTasks = FirestoreCRMService.subscribeToCollection<Task>('tasks', (liveTasks) => {
      if (liveTasks && liveTasks.length > 0) {
        setTasks(liveTasks);
        setSyncStatus('synced');
      }
    });

    const unsubInvoices = FirestoreCRMService.subscribeToCollection<Invoice>('invoices', (liveInvoices) => {
      if (liveInvoices && liveInvoices.length > 0) {
        setInvoices(liveInvoices);
        setSyncStatus('synced');
      }
    });

    return () => {
      isMounted = false;
      unsubLeads();
      unsubDeals();
      unsubTasks();
      unsubInvoices();
    };
  }, []);

  // Sync to local storage
  useEffect(() => { localStorage.setItem('nexus_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('nexus_contacts', JSON.stringify(contacts)); }, [contacts]);
  useEffect(() => { localStorage.setItem('nexus_companies', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('nexus_deals', JSON.stringify(deals)); }, [deals]);
  useEffect(() => { localStorage.setItem('nexus_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('nexus_calendar', JSON.stringify(calendarEvents)); }, [calendarEvents]);
  useEffect(() => { localStorage.setItem('nexus_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('nexus_proposals', JSON.stringify(proposals)); }, [proposals]);
  useEffect(() => { localStorage.setItem('nexus_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('nexus_communications', JSON.stringify(communications)); }, [communications]);
  useEffect(() => { localStorage.setItem('nexus_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('nexus_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('nexus_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('nexus_team', JSON.stringify(teamMembers)); }, [teamMembers]);

  // Log activity helper
  const logActivity = (type: Activity['type'], description: string, entityType: Activity['entityType'], entityId: string, entityName: string) => {
    const act: Activity = {
      id: `act-${Date.now()}`,
      type,
      description,
      entityType,
      entityId,
      entityName,
      userId: 'user-1',
      userName: 'Alex Morgan',
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [act, ...prev.slice(0, 49)]);
  };

  // Add Notification helper
  const addNotification = (title: string, message: string, type: AppNotification['type'], link?: string) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      link,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // 1. LEADS
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
    FirestoreCRMService.saveLead(newLead).catch(err => console.warn('Firestore lead sync:', err));
    logActivity('lead_created', `Added new lead "${newLead.name}" (${newLead.companyName})`, 'lead', newLead.id, newLead.name);
    addNotification('New Lead Created', `${newLead.name} from ${newLead.companyName} was added.`, 'info', `/leads/${newLead.id}`);
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
    FirestoreCRMService.updateLead(id, updates).catch(err => console.warn('Firestore lead update sync:', err));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    FirestoreCRMService.deleteLead(id).catch(err => console.warn('Firestore lead delete sync:', err));
  };

  const analyzeLeadWithAI = async (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    try {
      const analysis = await GeminiService.analyzeLead(lead);
      updateLead(id, { aiAnalysis: analysis, score: analysis.score });
      addNotification('AI Lead Intelligence Ready', `Analysis completed for ${lead.name} (Score: ${analysis.score}/100)`, 'ai', `/leads/${id}`);
    } catch (e) {
      console.error('Lead AI error:', e);
    }
  };

  const convertLeadToDeal = (leadId: string, dealTitle?: string, dealValue?: number): Deal => {
    const lead = leads.find(l => l.id === leadId);
    const title = dealTitle || (lead ? `${lead.companyName} Custom Project` : 'New Client Deal');
    const value = dealValue || lead?.estimatedValue || 75000;

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title,
      value,
      stage: 'qualified',
      probability: 60,
      expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      leadId,
      companyId: lead?.companyId,
      companyName: lead?.companyName,
      contactId: lead?.contactId,
      contactName: lead?.name,
      assignedToId: lead?.assignedToId || 'user-1',
      tags: lead?.tags || ['Converted Lead'],
      notes: `Converted from lead: ${lead?.notes || ''}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDeals(prev => [newDeal, ...prev]);
    if (lead) {
      updateLead(leadId, { status: 'converted' });
    }
    logActivity('deal_moved', `Converted lead into deal "${newDeal.title}" (₹${newDeal.value.toLocaleString('en-IN')})`, 'deal', newDeal.id, newDeal.title);
    addNotification('Lead Converted to Deal', `Created deal "${newDeal.title}" from lead.`, 'success', `/deals/${newDeal.id}`);
    return newDeal;
  };

  // 2. CONTACTS & COMPANIES
  const addContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
    const newContact: Contact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addCompany = (compData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Company => {
    const newCompany: Company = {
      ...compData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCompanies(prev => [newCompany, ...prev]);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  // 3. DEALS
  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Deal => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDeals(prev => [newDeal, ...prev]);
    FirestoreCRMService.saveDeal(newDeal).catch(err => console.warn('Firestore deal sync:', err));
    logActivity('deal_moved', `Created deal "${newDeal.title}" at stage ${newDeal.stage}`, 'deal', newDeal.id, newDeal.title);
    return newDeal;
  };

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    FirestoreCRMService.updateDeal(id, updates).catch(err => console.warn('Firestore deal update sync:', err));
  };

  const moveDealStage = (id: string, stage: DealStage) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;

    let prob = deal.probability;
    if (stage === 'new') prob = 20;
    else if (stage === 'qualified') prob = 40;
    else if (stage === 'proposal') prob = 60;
    else if (stage === 'negotiation') prob = 80;
    else if (stage === 'won') prob = 100;
    else if (stage === 'lost') prob = 0;

    updateDeal(id, { stage, probability: prob });
    logActivity('deal_moved', `Moved deal "${deal.title}" to ${stage.toUpperCase()}`, 'deal', deal.id, deal.title);

    if (stage === 'won') {
      addNotification('Deal Won! 🎉', `Congratulations! Deal "${deal.title}" (₹${deal.value.toLocaleString('en-IN')}) marked as WON.`, 'success', `/deals/${id}`);
    }
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
    FirestoreCRMService.deleteDeal(id).catch(err => console.warn('Firestore deal delete sync:', err));
  };

  const convertDealToProject = (dealId: string): Project => {
    const deal = deals.find(d => d.id === dealId);
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: deal?.title || 'New Client Project',
      description: `Initiated from deal: ${deal?.title || ''}. Budget: ₹${deal?.value.toLocaleString('en-IN') || '0'}`,
      companyId: deal?.companyId,
      companyName: deal?.companyName,
      contactId: deal?.contactId,
      contactName: deal?.contactName,
      dealId,
      status: 'planning',
      budget: deal?.value || 100000,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
      progress: 0,
      assignedTeamIds: ['user-1'],
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Kickoff & Requirements Discovery', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], completed: false },
        { id: `m-${Date.now()}-2`, title: 'Figma UI Prototype & Architecture Approval', dueDate: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0], completed: false },
        { id: `m-${Date.now()}-3`, title: 'Sprint 1 Development & Staging Delivery', dueDate: new Date(Date.now() + 32 * 86400000).toISOString().split('T')[0], completed: false },
        { id: `m-${Date.now()}-4`, title: 'Final Handover & Launch', dueDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0], completed: false }
      ],
      timeLogs: [],
      tags: ['Active', 'New Project'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
    logActivity('project_started', `Started project "${newProject.title}"`, 'project', newProject.id, newProject.title);
    addNotification('Project Created', `Project "${newProject.title}" has been created from deal.`, 'success', `/projects/${newProject.id}`);
    return newProject;
  };

  // 4. TASKS
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    FirestoreCRMService.saveTask(newTask).catch(err => console.warn('Firestore task sync:', err));
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    FirestoreCRMService.updateTask(id, updates).catch(err => console.warn('Firestore task update sync:', err));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        if (nextStatus === 'completed') {
          logActivity('task_completed', `Completed task: "${t.title}"`, 'task', t.id, t.title);
        }
        const updated = {
          ...t,
          status: nextStatus as any,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
        FirestoreCRMService.updateTask(id, { 
          status: nextStatus as any, 
          completedAt: updated.completedAt 
        }).catch(err => console.warn('Firestore task toggle sync:', err));
        return updated;
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    FirestoreCRMService.deleteTask(id).catch(err => console.warn('Firestore task delete sync:', err));
  };

  // 5. CALENDAR
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>): CalendarEvent => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `cal-${Date.now()}`
    };
    setCalendarEvents(prev => [newEvent, ...prev]);
    addNotification('Meeting Scheduled', `"${newEvent.title}" set for ${new Date(newEvent.startDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 'info', '/calendar');
    return newEvent;
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  // 6. PROJECTS
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const newProj: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : p.progress;
        return { ...p, milestones: updatedMilestones, progress, updatedAt: new Date().toISOString() };
      }
      return p;
    }));
  };

  const addTimeLog = (projectId: string, log: { description: string; hours: number; billable: boolean }) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newLog = {
          id: `t-${Date.now()}`,
          description: log.description,
          hours: log.hours,
          date: new Date().toISOString().split('T')[0],
          userId: 'user-1',
          userName: 'Alex Morgan',
          billable: log.billable
        };
        return {
          ...p,
          timeLogs: [newLog, ...p.timeLogs],
          spent: p.spent + (log.hours * 2500), // e.g. ₹2,500/hr billing estimate
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // 7. PROPOSALS
  const addProposal = (propData: Omit<Proposal, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Proposal => {
    const nextNum = proposals.length + 1;
    const numStr = `PROP-2026-${String(nextNum).padStart(3, '0')}`;
    const newProp: Proposal = {
      ...propData,
      id: `prop-${Date.now()}`,
      number: numStr,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProposals(prev => [newProp, ...prev]);
    logActivity('proposal_sent', `Drafted proposal ${newProp.number} for ${newProp.companyName}`, 'proposal', newProp.id, newProp.number);
    return newProp;
  };

  const updateProposal = (id: string, updates: Partial<Proposal>) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProposal = (id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
  };

  const sendProposal = (id: string) => {
    const prop = proposals.find(p => p.id === id);
    if (!prop) return;
    updateProposal(id, { status: 'sent', sentAt: new Date().toISOString() });
    logActivity('proposal_sent', `Sent Proposal ${prop.number} to ${prop.contactName} (${prop.contactEmail})`, 'proposal', prop.id, prop.number);
    addNotification('Proposal Dispatched', `Proposal ${prop.number} sent to ${prop.contactName}`, 'info', `/proposals/${id}`);
  };

  // 8. INVOICES
  const addInvoice = (invData: Omit<Invoice, 'id' | 'number' | 'createdAt' | 'updatedAt'>): Invoice => {
    const nextNum = invoices.length + 1;
    const numStr = `INV-2026-${String(nextNum).padStart(3, '0')}`;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      number: numStr,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInvoices(prev => [newInv, ...prev]);
    FirestoreCRMService.saveInvoice(newInv).catch(err => console.warn('Firestore invoice sync:', err));
    return newInv;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i));
    FirestoreCRMService.updateInvoice(id, updates).catch(err => console.warn('Firestore invoice update sync:', err));
  };

  const recordPayment = (invoiceId: string, payment: { amount: number; method: any; referenceNo?: string; notes?: string }) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newRecord = {
          id: `pay-${Date.now()}`,
          amount: payment.amount,
          date: new Date().toISOString().split('T')[0],
          method: payment.method,
          referenceNo: payment.referenceNo,
          notes: payment.notes
        };
        const totalPaid = inv.amountPaid + payment.amount;
        const newStatus = totalPaid >= inv.total ? 'paid' : 'partially_paid';

        logActivity('invoice_paid', `Recorded payment of ₹${payment.amount.toLocaleString('en-IN')} for ${inv.number}`, 'invoice', inv.id, inv.number);
        addNotification('Payment Recorded', `Received ₹${payment.amount.toLocaleString('en-IN')} on invoice ${inv.number}`, 'success', `/invoices/${inv.id}`);

        const updated = {
          ...inv,
          amountPaid: totalPaid,
          status: newStatus as any,
          payments: [newRecord, ...inv.payments],
          updatedAt: new Date().toISOString()
        };
        FirestoreCRMService.updateInvoice(invoiceId, {
          amountPaid: totalPaid,
          status: newStatus as any,
          payments: updated.payments,
          updatedAt: updated.updatedAt
        }).catch(err => console.warn('Firestore invoice payment sync:', err));

        return updated;
      }
      return inv;
    }));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    FirestoreCRMService.deleteInvoice(id).catch(err => console.warn('Firestore invoice delete sync:', err));
  };

  // 9. COMMUNICATIONS
  const addCommunication = (commData: Omit<Communication, 'id' | 'date'>): Communication => {
    const newComm: Communication = {
      ...commData,
      id: `comm-${Date.now()}`,
      date: new Date().toISOString()
    };
    setCommunications(prev => [newComm, ...prev]);
    logActivity('email_sent', `${newComm.type.toUpperCase()}: "${newComm.subject || newComm.content.slice(0, 30)}" to ${newComm.recipientName}`, 'lead', newComm.leadId || 'comm', newComm.recipientName);
    return newComm;
  };

  // 10. DOCUMENTS
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'uploadedAt'>): DocumentItem => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // 11. NOTIFICATIONS
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // 12. TEAM
  const inviteTeamMember = (name: string, email: string, role: 'admin' | 'member' | 'viewer', title: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      title
    };
    setTeamMembers(prev => [...prev, newUser]);
    addNotification('Team Member Invited', `${name} (${email}) has been invited as ${role}.`, 'info', '/team');
  };

  // DATA MANAGEMENT
  const resetToMockData = () => {
    setLeads(mockLeads);
    setContacts(mockContacts);
    setCompanies(mockCompanies);
    setDeals(mockDeals);
    setTasks(mockTasks);
    setCalendarEvents(mockCalendarEvents);
    setProjects(mockProjects);
    setProposals(mockProposals);
    setInvoices(mockInvoices);
    setCommunications(mockCommunications);
    setDocuments(mockDocuments);
    setActivities(mockActivities);
    setNotifications(mockNotifications);
    setTeamMembers(mockUsers);
    localStorage.clear();
    addNotification('CRM Reset', 'Successfully restored default dummy records and pipeline.', 'info');
  };

  const exportCRMData = (): string => {
    const fullBackup = {
      leads, contacts, companies, deals, tasks, calendarEvents,
      projects, proposals, invoices, communications, documents,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importCRMData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.leads && Array.isArray(data.leads)) setLeads(data.leads);
      if (data.contacts && Array.isArray(data.contacts)) setContacts(data.contacts);
      if (data.companies && Array.isArray(data.companies)) setCompanies(data.companies);
      if (data.deals && Array.isArray(data.deals)) setDeals(data.deals);
      if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
      if (data.projects && Array.isArray(data.projects)) setProjects(data.projects);
      if (data.invoices && Array.isArray(data.invoices)) setInvoices(data.invoices);
      addNotification('Import Successful', 'Your CRM database has been restored from backup.', 'success');
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  // Dashboard Stats Computed
  const stats = {
    totalLeads: leads.length,
    activeDeals: deals.filter(d => d.stage !== 'lost' && d.stage !== 'won').length,
    pipelineValue: deals.filter(d => d.stage !== 'lost' && d.stage !== 'won').reduce((sum, d) => sum + d.value, 0),
    wonRevenue: deals.filter(d => d.stage === 'won').reduce((sum, d) => sum + d.value, 0) + invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0),
    pendingFollowUps: tasks.filter(t => t.status !== 'completed' && t.priority === 'urgent').length,
    overdueTasks: tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length
  };

  return (
    <CRMContext.Provider
      value={{
        leads,
        contacts,
        companies,
        deals,
        tasks,
        calendarEvents,
        projects,
        proposals,
        invoices,
        communications,
        documents,
        activities,
        notifications,
        teamMembers,
        addLead,
        updateLead,
        deleteLead,
        analyzeLeadWithAI,
        convertLeadToDeal,
        addContact,
        updateContact,
        deleteContact,
        addCompany,
        updateCompany,
        deleteCompany,
        addDeal,
        updateDeal,
        moveDealStage,
        deleteDeal,
        convertDealToProject,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        addCalendarEvent,
        deleteCalendarEvent,
        addProject,
        updateProject,
        toggleMilestone,
        addTimeLog,
        deleteProject,
        addProposal,
        updateProposal,
        deleteProposal,
        sendProposal,
        addInvoice,
        updateInvoice,
        recordPayment,
        deleteInvoice,
        addCommunication,
        addDocument,
        deleteDocument,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        inviteTeamMember,
        resetToMockData,
        exportCRMData,
        importCRMData,
        isLiveDatabaseConnected,
        syncStatus,
        stats
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
};
