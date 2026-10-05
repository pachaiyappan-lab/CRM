export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type LeadStatus = 'new' | 'contacted' | 'qualifying' | 'qualified' | 'unqualified' | 'converted';

export type DealStage = 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';

export type InvoiceStatus = 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export type CommunicationType = 'email' | 'call' | 'meeting' | 'note' | 'sms' | 'whatsapp';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  title?: string;
  phone?: string;
  authProvider?: 'google' | 'email' | 'demo';
}

export interface Workspace {
  id: string;
  name: string;
  currency: string; // e.g. '₹', '$', '€'
  currencyCode: string; // 'INR', 'USD', etc.
  taxRate: number; // default GST % e.g. 18
  taxName: string; // e.g. 'GST' or 'VAT'
  logo?: string;
  ownerId: string;
}

export interface AILeadAnalysis {
  summary: string;
  score: number; // 0 - 100
  reasoning: string;
  requirements: string[];
  estimatedBudget: string;
  timeline: string;
  recommendedAction: string;
  suggestedFollowUp: string;
  analyzedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  title?: string;
  source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Outreach' | 'Inbound' | 'Event' | 'Other';
  status: LeadStatus;
  score?: number; // 0 to 100
  estimatedValue: number;
  assignedToId?: string;
  tags: string[];
  notes?: string;
  aiAnalysis?: AILeadAnalysis;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  contactId?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  companyId?: string;
  companyName?: string;
  location?: string;
  linkedin?: string;
  notes?: string;
  tags: string[];
  avatar?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry: string;
  size: '1-10' | '11-50' | '51-200' | '200+';
  website?: string;
  phone?: string;
  address?: string;
  revenue?: string;
  assignedToId?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number; // 0 to 100
  expectedCloseDate: string;
  leadId?: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  assignedToId?: string;
  tags: string[];
  notes?: string;
  lostReason?: string;
  aiInsight?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assignedToId?: string;
  relatedToType?: 'lead' | 'contact' | 'deal' | 'project' | 'company';
  relatedToId?: string;
  relatedToTitle?: string;
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  completedAt?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string;
  type: 'meeting' | 'followup' | 'task_deadline' | 'project_milestone';
  relatedToType?: 'lead' | 'contact' | 'deal' | 'project';
  relatedToId?: string;
  attendees: string[];
  location?: string;
  meetLink?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectTimeLog {
  id: string;
  description: string;
  hours: number;
  date: string;
  userId: string;
  userName: string;
  billable: boolean;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  status: ProjectStatus;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  progress: number; // 0 to 100
  assignedTeamIds: string[];
  milestones: ProjectMilestone[];
  timeLogs: ProjectTimeLog[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Proposal {
  id: string;
  number: string; // e.g. PROP-2026-001
  title: string;
  dealId?: string;
  leadId?: string;
  companyId?: string;
  companyName: string;
  contactId?: string;
  contactName: string;
  contactEmail: string;
  status: ProposalStatus;
  overview: string;
  scopeOfWork: string;
  deliverables: string[];
  timeline: string;
  items: ProposalItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  terms: string;
  validUntil: string;
  sentAt?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: 'Bank Transfer' | 'UPI' | 'Credit Card' | 'PayPal' | 'Cash' | 'Stripe';
  referenceNo?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  number: string; // e.g. INV-2026-0104
  projectId?: string;
  dealId?: string;
  companyId?: string;
  companyName: string;
  contactId?: string;
  contactName: string;
  contactEmail: string;
  clientAddress?: string;
  clientGstNo?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  payments: PaymentRecord[];
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Communication {
  id: string;
  type: CommunicationType;
  direction: 'inbound' | 'outbound' | 'internal';
  subject?: string;
  content: string;
  leadId?: string;
  contactId?: string;
  companyId?: string;
  dealId?: string;
  senderName: string;
  recipientName: string;
  date: string;
  tags?: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  fileType: 'pdf' | 'docx' | 'sheet' | 'image' | 'contract' | 'archive' | 'proposal' | 'invoice';
  fileSize: string;
  url?: string;
  relatedToType?: 'lead' | 'contact' | 'deal' | 'project' | 'proposal' | 'invoice';
  relatedToId?: string;
  relatedToName?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'deal_moved' | 'proposal_sent' | 'invoice_paid' | 'task_completed' | 'email_sent' | 'project_started' | 'note_added';
  description: string;
  entityType: 'lead' | 'deal' | 'proposal' | 'invoice' | 'task' | 'project';
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
  read: boolean;
  link?: string;
  timestamp: string;
}

export interface AICopilotAction {
  id: string;
  type: 'create_tasks' | 'draft_email' | 'schedule_followup' | 'update_lead_status' | 'create_deal';
  title: string;
  description: string;
  payload: any;
  status: 'pending' | 'executed' | 'cancelled';
}

export interface AICopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actions?: AICopilotAction[];
  recordsFound?: {
    type: 'lead' | 'deal' | 'task' | 'proposal' | 'invoice';
    id: string;
    title: string;
    subtitle: string;
    value?: string;
    badge?: string;
  }[];
}
