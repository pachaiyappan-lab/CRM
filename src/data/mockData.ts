import { 
  User, Workspace, Lead, Contact, Company, Deal, Task, 
  CalendarEvent, Project, Proposal, Invoice, Communication, 
  DocumentItem, Activity, AppNotification 
} from '../types/crm';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Matthew Parker',
    email: 'matthew@yourcompany.com',
    role: 'admin',
    title: 'Founder & Store Owner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'user-2',
    name: 'Devon Vance',
    email: 'devon@nexuscrm.io',
    role: 'member',
    title: 'Senior Account Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43211'
  },
  {
    id: 'user-3',
    name: 'Priya Sharma',
    email: 'priya@nexuscrm.io',
    role: 'member',
    title: 'Technical Project Lead',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98765 43212'
  }
];

export const mockWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Your Company',
  currency: '$',
  currencyCode: 'USD',
  taxRate: 10,
  taxName: 'Sales Tax (10%)',
  ownerId: 'user-1',
  logo: '@'
};

export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'BrightLabs Interactive',
    domain: 'brightlabs.io',
    industry: 'FinTech / SaaS',
    size: '11-50',
    website: 'https://brightlabs.io',
    phone: '+91 80 4123 9988',
    address: 'Koramangala 4th Block, Bangalore 560034',
    revenue: '₹5 Cr - ₹10 Cr',
    assignedToId: 'user-1',
    tags: ['High Value', 'SaaS', 'React'],
    notes: 'Fast-growing Bangalore B2B fintech needing full design system revamp and scalable web platform.',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-25T14:30:00Z'
  },
  {
    id: 'comp-2',
    name: 'Zenith Logistics',
    domain: 'zenithlogistics.com',
    industry: 'Supply Chain',
    size: '51-200',
    website: 'https://zenithlogistics.com',
    phone: '+91 22 2847 1100',
    address: 'Andheri East, Mumbai 400069',
    revenue: '₹25 Cr+',
    assignedToId: 'user-2',
    tags: ['Enterprise', 'ERP', 'Logistics'],
    notes: 'Looking to build an automated client portal for freight booking and live GPS tracking.',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-09-26T11:15:00Z'
  },
  {
    id: 'comp-3',
    name: 'Kavita Organics',
    domain: 'kavitaorganics.in',
    industry: 'E-Commerce / D2C',
    size: '1-10',
    website: 'https://kavitaorganics.in',
    phone: '+91 11 4987 2323',
    address: 'Hauz Khas, New Delhi 110016',
    revenue: '₹1 Cr - ₹3 Cr',
    assignedToId: 'user-3',
    tags: ['Shopify', 'D2C', 'Mobile App'],
    notes: 'Premium organic skincare brand scaling up for festive season sales.',
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-27T16:00:00Z'
  },
  {
    id: 'comp-4',
    name: 'Apex Health Systems',
    domain: 'apexhealth.org',
    industry: 'Healthcare',
    size: '51-200',
    website: 'https://apexhealth.org',
    phone: '+91 44 2499 5566',
    address: 'T. Nagar, Chennai 600017',
    revenue: '₹15 Cr+',
    assignedToId: 'user-1',
    tags: ['Healthcare', 'HIPAA', 'Portal'],
    notes: 'Multi-speciality clinic network requesting patient engagement mobile web app.',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  }
];

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@brightlabs.io',
    phone: '+91 98450 12345',
    title: 'Head of Product & Design',
    companyId: 'comp-1',
    companyName: 'BrightLabs Interactive',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/sarah-jenkins-bright',
    tags: ['Decision Maker', 'Product'],
    notes: 'Very responsive on Slack and email. Prefers modern clean UI and React component library.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedToId: 'user-1',
    createdAt: '2026-09-01T10:15:00Z',
    updatedAt: '2026-09-25T14:30:00Z'
  },
  {
    id: 'contact-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@zenithlogistics.com',
    phone: '+91 98200 54321',
    title: 'VP of Technology & Operations',
    companyId: 'comp-2',
    companyName: 'Zenith Logistics',
    location: 'Mumbai, India',
    linkedin: 'linkedin.com/in/rajesh-kumar-tech',
    tags: ['Technical Buyer', 'Logistics'],
    notes: 'Evaluating vendors for 6-month digital transformation roadmap.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedToId: 'user-2',
    createdAt: '2026-08-15T09:30:00Z',
    updatedAt: '2026-09-26T11:15:00Z'
  },
  {
    id: 'contact-3',
    name: 'Ananya Deshmukh',
    email: 'ananya@kavitaorganics.in',
    phone: '+91 98111 23456',
    title: 'Co-Founder & CMO',
    companyId: 'comp-3',
    companyName: 'Kavita Organics',
    location: 'New Delhi, India',
    tags: ['Founder', 'Marketing'],
    notes: 'Wants lightning-fast checkout flow and conversion optimization.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedToId: 'user-3',
    createdAt: '2026-09-10T12:30:00Z',
    updatedAt: '2026-09-27T16:00:00Z'
  },
  {
    id: 'contact-4',
    name: 'Dr. Vikram Sethi',
    email: 'dr.sethi@apexhealth.org',
    phone: '+91 94440 98765',
    title: 'Medical Director',
    companyId: 'comp-4',
    companyName: 'Apex Health Systems',
    location: 'Chennai, India',
    tags: ['Executive', 'Clinical'],
    notes: 'Approved the initial architecture proposal. Waiting for legal NDA signoff.',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    assignedToId: 'user-1',
    createdAt: '2026-07-20T10:30:00Z',
    updatedAt: '2026-09-20T10:00:00Z'
  }
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@brightlabs.io',
    phone: '+91 98450 12345',
    companyName: 'BrightLabs Interactive',
    title: 'Head of Product',
    source: 'Referral',
    status: 'qualified',
    score: 92,
    estimatedValue: 95000,
    assignedToId: 'user-1',
    tags: ['React', 'Design System', 'High Budget'],
    notes: 'Sarah reached out through referral. Needs full web app redesign and CMS overhaul. Budget ₹75K–₹1L.',
    aiAnalysis: {
      summary: 'Sarah from BrightLabs is seeking an end-to-end web redesign with modern React frontend, Headless CMS, and high-performance SEO.',
      score: 92,
      reasoning: 'Verified decision maker, explicit budget range (₹75K–₹1L), urgency for Q4 launch, and strong technical fit.',
      requirements: ['React 19 SPA Architecture', 'Tailwind CSS Design System', 'Headless CMS Integration', 'SEO & Core Web Vitals optimization'],
      estimatedBudget: '₹75,000 – ₹1,00,000',
      timeline: '4 - 6 weeks',
      recommendedAction: 'Send customized scope proposal & schedule 20-min contract walkthrough call.',
      suggestedFollowUp: 'Hi Sarah, following up on our review call with the updated proposal breakdown for the React design system. Let me know if tomorrow 3 PM works to finalize.',
      analyzedAt: '2026-09-27T09:00:00Z'
    },
    lastContactedAt: '2026-09-25T14:30:00Z',
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-27T09:00:00Z',
    companyId: 'comp-1',
    contactId: 'contact-1'
  },
  {
    id: 'lead-2',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@zenithlogistics.com',
    phone: '+91 98200 54321',
    companyName: 'Zenith Logistics',
    title: 'VP of Technology',
    source: 'LinkedIn',
    status: 'qualifying',
    score: 84,
    estimatedValue: 240000,
    assignedToId: 'user-2',
    tags: ['Enterprise', 'ERP', 'Portal'],
    notes: 'Enterprise fleet tracking client portal. Need integration with legacy PostgreSQL backend.',
    aiAnalysis: {
      summary: 'Zenith Logistics requires a freight booking & tracking portal with role-based dispatch permissions.',
      score: 84,
      reasoning: 'Substantial budget (₹2.4L), enterprise security requirements, currently benchmarking against 2 competing agencies.',
      requirements: ['Live GPS Map Tracking', 'Driver & Consignment Management', 'Postgres Database API', 'Exportable PDF manifests'],
      estimatedBudget: '₹2,00,000 – ₹2,50,000',
      timeline: '8 - 10 weeks',
      recommendedAction: 'Deliver technical architecture whitepaper and compliance checklist.',
      suggestedFollowUp: 'Hi Rajesh, sharing the technical overview addressing your data isolation and PostgreSQL replication questions.',
      analyzedAt: '2026-09-26T11:00:00Z'
    },
    lastContactedAt: '2026-09-24T16:00:00Z',
    createdAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-26T11:00:00Z',
    companyId: 'comp-2',
    contactId: 'contact-2'
  },
  {
    id: 'lead-3',
    name: 'Ananya Deshmukh',
    email: 'ananya@kavitaorganics.in',
    phone: '+91 98111 23456',
    companyName: 'Kavita Organics',
    title: 'Co-Founder & CMO',
    source: 'Inbound',
    status: 'new',
    score: 76,
    estimatedValue: 60000,
    assignedToId: 'user-3',
    tags: ['E-Commerce', 'Shopify', 'Immediate'],
    notes: 'Submitted contact form requesting mobile checkout optimization before Diwali sale.',
    aiAnalysis: {
      summary: 'D2C skincare brand needing rapid conversion rate optimization and WhatsApp automated notifications.',
      score: 76,
      reasoning: 'Immediate timeline (needs delivery in 2 weeks), high buying intent, founder-led decision.',
      requirements: ['Mobile UX Audit', 'Fast Checkout & UPI Gateway', 'Automated WhatsApp Order Updates'],
      estimatedBudget: '₹50,000 – ₹65,000',
      timeline: '2 weeks',
      recommendedAction: 'Call today to capture catalog specs and propose 14-day rapid sprint.',
      suggestedFollowUp: 'Hi Ananya, saw your note regarding mobile checkout speed. We can deliver this before October 15th.',
      analyzedAt: '2026-09-28T07:15:00Z'
    },
    createdAt: '2026-09-28T07:00:00Z',
    updatedAt: '2026-09-28T07:15:00Z',
    companyId: 'comp-3',
    contactId: 'contact-3'
  },
  {
    id: 'lead-4',
    name: 'Karthik Raman',
    email: 'karthik@cloudscale.tech',
    phone: '+91 97110 33445',
    companyName: 'CloudScale DevOps',
    title: 'Founder & CEO',
    source: 'Website',
    status: 'contacted',
    score: 68,
    estimatedValue: 120000,
    assignedToId: 'user-1',
    tags: ['B2B', 'SaaS', 'Marketing Site'],
    notes: 'Inquired about interactive documentation and customer playground.',
    aiAnalysis: {
      summary: 'DevOps startup seeking interactive docs and modern dark-mode landing page.',
      score: 68,
      reasoning: 'Seed-funded startup, tech-savvy founder, decision dependent on upcoming investor board meeting.',
      requirements: ['Interactive Terminal Component', 'Markdown Documentation Engine', 'Stripe Billing Integration'],
      estimatedBudget: '₹1,00,000 – ₹1,30,000',
      timeline: '4 weeks',
      recommendedAction: 'Send portfolio examples of devtool websites and schedule demo.',
      suggestedFollowUp: 'Hi Karthik, here are 3 interactive documentation sites we built with similar tech stacks.',
      analyzedAt: '2026-09-27T14:00:00Z'
    },
    lastContactedAt: '2026-09-21T10:00:00Z', // 7 days ago! Stagnant
    createdAt: '2026-09-19T11:20:00Z',
    updatedAt: '2026-09-27T14:00:00Z'
  },
  {
    id: 'lead-5',
    name: 'Meera Iyer',
    email: 'meera@nuralabs.ai',
    phone: '+91 99887 66554',
    companyName: 'Nura Labs AI',
    title: 'Product VP',
    source: 'Cold Outreach',
    status: 'new',
    score: 58,
    estimatedValue: 180000,
    assignedToId: 'user-2',
    tags: ['AI', 'Dashboard', 'In Review'],
    notes: 'Interested in AI prompt playground frontend interface.',
    createdAt: '2026-09-27T18:00:00Z',
    updatedAt: '2026-09-27T18:00:00Z'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'BrightLabs Web Platform & Design System',
    value: 95000,
    stage: 'proposal',
    probability: 80,
    expectedCloseDate: '2026-10-05',
    leadId: 'lead-1',
    companyId: 'comp-1',
    companyName: 'BrightLabs Interactive',
    contactId: 'contact-1',
    contactName: 'Sarah Jenkins',
    assignedToId: 'user-1',
    tags: ['High Win Rate', 'React', 'Design System'],
    notes: 'Proposal v2 sent with React component library deliverables. Sarah promised signoff by Monday.',
    aiInsight: 'Deal momentum is strong. Win probability increased by 15% following technical Q&A session. Recommend follow-up on signature.',
    createdAt: '2026-09-22T10:00:00Z',
    updatedAt: '2026-09-27T15:00:00Z'
  },
  {
    id: 'deal-2',
    title: 'Zenith Fleet Management Portal',
    value: 240000,
    stage: 'negotiation',
    probability: 70,
    expectedCloseDate: '2026-10-15',
    leadId: 'lead-2',
    companyId: 'comp-2',
    companyName: 'Zenith Logistics',
    contactId: 'contact-2',
    contactName: 'Rajesh Kumar',
    assignedToId: 'user-2',
    tags: ['Enterprise', 'Postgres', 'Quarterly Target'],
    notes: 'Negotiating milestone payment schedule: 40% advance, 30% alpha demo, 30% production rollout.',
    aiInsight: 'High value deal (₹2.4L). Final hurdle is milestone release terms. Suggest offering 3 months free post-launch bug warranty to close before Oct 15.',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-27T12:00:00Z'
  },
  {
    id: 'deal-3',
    title: 'Apex Patient Engagement PWA',
    value: 175000,
    stage: 'won',
    probability: 100,
    expectedCloseDate: '2026-09-15',
    companyId: 'comp-4',
    companyName: 'Apex Health Systems',
    contactId: 'contact-4',
    contactName: 'Dr. Vikram Sethi',
    assignedToId: 'user-1',
    tags: ['Won', 'Healthcare', 'Active Project'],
    notes: 'Contract executed! Advance payment of ₹75,000 received. Converted to active project.',
    aiInsight: 'Won deal. Upsell opportunity: telehealth appointment video chat add-on in Phase 2.',
    createdAt: '2026-08-20T09:00:00Z',
    updatedAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'deal-4',
    title: 'Kavita Organics E-Commerce Sprint',
    value: 60000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: '2026-10-02',
    leadId: 'lead-3',
    companyId: 'comp-3',
    companyName: 'Kavita Organics',
    contactId: 'contact-3',
    contactName: 'Ananya Deshmukh',
    assignedToId: 'user-3',
    tags: ['E-Commerce', 'Quick Win'],
    notes: 'Qualifying scope for checkout conversion overhaul. High urgency.',
    aiInsight: 'Quick win potential. Ananya wants immediate start. Send condensed 1-page proposal today.',
    createdAt: '2026-09-28T08:00:00Z',
    updatedAt: '2026-09-28T08:00:00Z'
  },
  {
    id: 'deal-5',
    title: 'CloudScale DevOps Interactive Docs',
    value: 120000,
    stage: 'new',
    probability: 40,
    expectedCloseDate: '2026-10-25',
    leadId: 'lead-4',
    companyName: 'CloudScale DevOps',
    contactName: 'Karthik Raman',
    assignedToId: 'user-1',
    tags: ['SaaS', 'DevTools'],
    notes: 'Initial scoping conversation scheduled.',
    aiInsight: 'Lead has not replied to last touchpoint in 7 days. Action needed: re-engage with case study.',
    createdAt: '2026-09-21T10:00:00Z',
    updatedAt: '2026-09-21T10:00:00Z'
  },
  {
    id: 'deal-6',
    title: 'FinEdge Mobile Loan App Prototype',
    value: 85000,
    stage: 'lost',
    probability: 0,
    expectedCloseDate: '2026-09-10',
    companyName: 'FinEdge Microfinance',
    contactName: 'Rohan Varma',
    assignedToId: 'user-2',
    tags: ['Lost', 'Fintech'],
    notes: 'Client decided to hire full-time in-house Flutter developer instead.',
    lostReason: 'Client chose in-house hiring over external agency.',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-12T16:00:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Follow up with Sarah on BrightLabs proposal review',
    description: 'Call Sarah to review proposal deliverables and answer any queries regarding React 19 architecture.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-09-28', // Today!
    assignedToId: 'user-1',
    relatedToType: 'lead',
    relatedToId: 'lead-1',
    relatedToTitle: 'Sarah Jenkins (BrightLabs)',
    createdAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'task-2',
    title: 'Overdue: Send PostgreSQL security checklist to Rajesh Kumar',
    description: 'Ensure data residency and encryption specifications are documented for Zenith Logistics.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-09-26', // Overdue!
    assignedToId: 'user-2',
    relatedToType: 'deal',
    relatedToId: 'deal-2',
    relatedToTitle: 'Zenith Fleet Management Portal',
    createdAt: '2026-09-24T11:00:00Z'
  },
  {
    id: 'task-3',
    title: 'Prepare Phase 1 Milestone demo for Apex Health Systems',
    description: 'Walk Dr. Vikram through patient login, appointment booking UI, and responsive mobile preview.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-09-30',
    assignedToId: 'user-1',
    relatedToType: 'project',
    relatedToId: 'proj-1',
    relatedToTitle: 'Apex Patient Engagement PWA',
    createdAt: '2026-09-25T09:00:00Z'
  },
  {
    id: 'task-4',
    title: 'Draft rapid 14-day sprint proposal for Kavita Organics',
    description: 'Include mobile checkout audit, Shopify app setup, and payment gateway speed optimizations.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-29',
    assignedToId: 'user-3',
    relatedToType: 'lead',
    relatedToId: 'lead-3',
    relatedToTitle: 'Ananya Deshmukh (Kavita Organics)',
    createdAt: '2026-09-28T08:10:00Z'
  },
  {
    id: 'task-5',
    title: 'Send GST Tax Invoice #INV-2026-004 to Zenith Logistics',
    description: 'Send advance invoice for preliminary architecture review.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-09-27',
    assignedToId: 'user-2',
    relatedToType: 'deal',
    relatedToId: 'deal-2',
    relatedToTitle: 'Zenith Fleet Management Portal',
    completedAt: '2026-09-27T16:30:00Z',
    createdAt: '2026-09-26T14:00:00Z'
  },
  {
    id: 'task-6',
    title: 'Re-engage CloudScale DevOps (no response for 7 days)',
    description: 'Send follow-up email showcasing interactive developer playground demo.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-29',
    assignedToId: 'user-1',
    relatedToType: 'lead',
    relatedToId: 'lead-4',
    relatedToTitle: 'Karthik Raman (CloudScale)',
    createdAt: '2026-09-28T06:00:00Z'
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Sarah Jenkins - BrightLabs Proposal Review & Q&A',
    description: 'Walkthrough of scope, React component architecture, and final pricing.',
    startDate: '2026-09-28T15:00:00Z', // Today 3:00 PM
    endDate: '2026-09-28T15:45:00Z',
    type: 'meeting',
    relatedToType: 'lead',
    relatedToId: 'lead-1',
    attendees: ['alex@nexuscrm.io', 'sarah.jenkins@brightlabs.io'],
    location: 'Google Meet',
    meetLink: 'https://meet.google.com/abc-crm-xyz'
  },
  {
    id: 'cal-2',
    title: 'Apex Health Systems - Sprint 1 Check-in',
    description: 'Review responsive patient dashboard progress and appointment calendar.',
    startDate: '2026-09-29T11:00:00Z',
    endDate: '2026-09-29T12:00:00Z',
    type: 'meeting',
    relatedToType: 'project',
    relatedToId: 'proj-1',
    attendees: ['alex@nexuscrm.io', 'priya@nexuscrm.io', 'dr.sethi@apexhealth.org'],
    location: 'Zoom',
    meetLink: 'https://zoom.us/j/9876543210'
  },
  {
    id: 'cal-3',
    title: 'Follow-up Call: Rajesh Kumar (Zenith Logistics)',
    description: 'Discuss PostgreSQL database SLA & milestone sign-offs.',
    startDate: '2026-09-30T16:30:00Z',
    endDate: '2026-09-30T17:00:00Z',
    type: 'followup',
    relatedToType: 'deal',
    relatedToId: 'deal-2',
    attendees: ['devon@nexuscrm.io', 'rajesh.k@zenithlogistics.com'],
    location: 'Phone Call'
  },
  {
    id: 'cal-4',
    title: 'Apex Patient Portal Milestone 1 Delivery Deadline',
    description: 'Deliver Phase 1 staging link for medical staff UAT testing.',
    startDate: '2026-10-02T18:00:00Z',
    endDate: '2026-10-02T19:00:00Z',
    type: 'project_milestone',
    relatedToType: 'project',
    relatedToId: 'proj-1',
    attendees: ['alex@nexuscrm.io', 'priya@nexuscrm.io']
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Apex Patient Engagement PWA',
    description: 'Modern patient portal enabling online doctor appointment booking, lab results viewing, and telemedicine tele-consultation.',
    companyId: 'comp-4',
    companyName: 'Apex Health Systems',
    contactId: 'contact-4',
    contactName: 'Dr. Vikram Sethi',
    dealId: 'deal-3',
    status: 'in_progress',
    budget: 175000,
    spent: 68000,
    startDate: '2026-09-18',
    endDate: '2026-11-15',
    progress: 42,
    assignedTeamIds: ['user-1', 'user-3'],
    milestones: [
      { id: 'm-1', title: 'Architecture & Wireframes Approval', dueDate: '2026-09-24', completed: true },
      { id: 'm-2', title: 'Patient Authentication & Profile Management', dueDate: '2026-10-02', completed: false },
      { id: 'm-3', title: 'Doctor Appointment Booking Engine', dueDate: '2026-10-18', completed: false },
      { id: 'm-4', title: 'Lab Test Reports & PDF Generator', dueDate: '2026-10-31', completed: false },
      { id: 'm-5', title: 'Production Security Audit & Launch', dueDate: '2026-11-15', completed: false }
    ],
    timeLogs: [
      { id: 't-1', description: 'Patient dashboard wireframing in Figma', hours: 14, date: '2026-09-22', userId: 'user-1', userName: 'Alex Morgan', billable: true },
      { id: 't-2', description: 'React appointment calendar component development', hours: 22, date: '2026-09-25', userId: 'user-3', userName: 'Priya Sharma', billable: true },
      { id: 't-3', description: 'API schema and security headers setup', hours: 8, date: '2026-09-26', userId: 'user-1', userName: 'Alex Morgan', billable: true }
    ],
    tags: ['Healthcare', 'React PWA', 'Active'],
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-27T16:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'Kavita Organics Brand Refresh & E-Commerce',
    description: 'High-converting mobile-first storefront redesign and checkout funnel optimization.',
    companyId: 'comp-3',
    companyName: 'Kavita Organics',
    contactId: 'contact-3',
    contactName: 'Ananya Deshmukh',
    status: 'planning',
    budget: 60000,
    spent: 0,
    startDate: '2026-10-01',
    endDate: '2026-10-16',
    progress: 10,
    assignedTeamIds: ['user-3'],
    milestones: [
      { id: 'm-21', title: 'Shopify Checkout Optimization', dueDate: '2026-10-08', completed: false },
      { id: 'm-22', title: 'Mobile Speed & Core Web Vitals < 1.2s', dueDate: '2026-10-14', completed: false }
    ],
    timeLogs: [],
    tags: ['E-Commerce', 'Shopify'],
    createdAt: '2026-09-28T08:00:00Z',
    updatedAt: '2026-09-28T08:00:00Z'
  }
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop-1',
    number: 'PROP-2026-001',
    title: 'Website Redesign & Custom React Design System',
    dealId: 'deal-1',
    leadId: 'lead-1',
    companyId: 'comp-1',
    companyName: 'BrightLabs Interactive',
    contactId: 'contact-1',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah.jenkins@brightlabs.io',
    status: 'sent',
    overview: 'BrightLabs is scaling its fintech offering and requires a world-class, responsive web presence with an enterprise design system built on React and Tailwind CSS.',
    scopeOfWork: 'Complete UX audit, responsive UI Figma prototype, production React component library, Headless CMS integration, and performance tuning for 95+ Google Lighthouse score.',
    deliverables: [
      'Comprehensive Design System in Figma (Typography, Colors, 40+ Components)',
      'Clean Modular React 19 Frontend with TypeScript',
      'Integration with Contentful / Strapi Headless CMS',
      'Automated SEO meta generator and OpenGraph cards',
      '2 Weeks Post-launch hypercare and team onboarding'
    ],
    timeline: '4 - 6 weeks from kickoff date',
    items: [
      { id: 'item-1', description: 'UX Discovery, Wireframes & High-Fidelity UI Design System', quantity: 1, rate: 35000, amount: 35000 },
      { id: 'item-2', description: 'React 19 Frontend Engineering & Headless CMS Integration', quantity: 1, rate: 45000, amount: 45000 },
      { id: 'item-3', description: 'SEO Optimization, Core Web Vitals & Analytics Setup', quantity: 1, rate: 15000, amount: 15000 }
    ],
    subtotal: 95000,
    discount: 5000,
    taxRate: 18,
    taxAmount: 16200,
    total: 106200,
    terms: '50% upon agreement execution, 30% on staging delivery, 20% on final domain launch. Proposal valid for 14 days.',
    validUntil: '2026-10-12',
    sentAt: '2026-09-26T14:00:00Z',
    createdAt: '2026-09-25T11:00:00Z',
    updatedAt: '2026-09-26T14:00:00Z'
  },
  {
    id: 'prop-2',
    number: 'PROP-2026-002',
    title: 'Zenith Logistics Enterprise Fleet Tracking Portal',
    dealId: 'deal-2',
    leadId: 'lead-2',
    companyId: 'comp-2',
    companyName: 'Zenith Logistics',
    contactId: 'contact-2',
    contactName: 'Rajesh Kumar',
    contactEmail: 'rajesh.k@zenithlogistics.com',
    status: 'draft',
    overview: 'Full-stack fleet tracking and freight dispatcher application with live GPS mapping and role-based driver manifests.',
    scopeOfWork: 'Backend API integration with PostgreSQL, real-time map tracking, driver dispatch console, and client self-service portal.',
    deliverables: [
      'Live Dispatcher Console with Google Maps GPS tracking',
      'PostgreSQL database sync & enterprise role-based access control',
      'Automated PDF consignment invoice and manifest generator',
      '30-day automated backup & failover infrastructure setup'
    ],
    timeline: '8 weeks',
    items: [
      { id: 'item-21', description: 'Dispatcher Dashboard & Live GPS Tracking Map UI', quantity: 1, rate: 120000, amount: 120000 },
      { id: 'item-22', description: 'PostgreSQL Backend API & RBAC Security Layer', quantity: 1, rate: 80000, amount: 80000 },
      { id: 'item-23', description: 'Automated Manifest Engine & Cloud Deployment', quantity: 1, rate: 40000, amount: 40000 }
    ],
    subtotal: 240000,
    discount: 10000,
    taxRate: 18,
    taxAmount: 41400,
    total: 271400,
    terms: '40% advance, 30% alpha staging, 30% production rollout.',
    validUntil: '2026-10-20',
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'INV-2026-001',
    projectId: 'proj-1',
    dealId: 'deal-3',
    companyId: 'comp-4',
    companyName: 'Apex Health Systems',
    contactId: 'contact-4',
    contactName: 'Dr. Vikram Sethi',
    contactEmail: 'dr.sethi@apexhealth.org',
    clientAddress: 'Apex Towers, T. Nagar, Chennai 600017',
    clientGstNo: '33AAACA1234F1Z5',
    status: 'paid',
    issueDate: '2026-09-18',
    dueDate: '2026-09-25',
    items: [
      { id: 'inv-item-1', description: 'Kickoff Advance (40%) - Patient Engagement PWA Architecture', quantity: 1, rate: 70000, amount: 70000 },
      { id: 'inv-item-2', description: 'Figma UI Component Kit & UX Discovery', quantity: 1, rate: 15000, amount: 15000 }
    ],
    subtotal: 85000,
    taxRate: 18,
    taxAmount: 15300,
    discount: 0,
    total: 100300,
    amountPaid: 100300,
    payments: [
      {
        id: 'pay-1',
        amount: 100300,
        date: '2026-09-20',
        method: 'Bank Transfer',
        referenceNo: 'HDFC-NEFT-99882211',
        notes: 'Full payment received via NEFT.'
      }
    ],
    notes: 'Thank you for your business! Phase 1 design completed.',
    terms: 'Payment due within 7 days of invoice date. 18% GST applicable.',
    createdAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-20T14:00:00Z'
  },
  {
    id: 'inv-2',
    number: 'INV-2026-002',
    projectId: 'proj-1',
    dealId: 'deal-3',
    companyId: 'comp-4',
    companyName: 'Apex Health Systems',
    contactId: 'contact-4',
    contactName: 'Dr. Vikram Sethi',
    contactEmail: 'dr.sethi@apexhealth.org',
    clientAddress: 'Apex Towers, T. Nagar, Chennai 600017',
    clientGstNo: '33AAACA1234F1Z5',
    status: 'sent',
    issueDate: '2026-09-27',
    dueDate: '2026-10-04',
    items: [
      { id: 'inv-item-3', description: 'Sprint 1 Milestone (30%) - Patient Portal & Appointment Engine', quantity: 1, rate: 52500, amount: 52500 }
    ],
    subtotal: 52500,
    taxRate: 18,
    taxAmount: 9450,
    discount: 0,
    total: 61950,
    amountPaid: 0,
    payments: [],
    notes: 'Sprint 1 milestone demo approved by medical board.',
    terms: 'Payment due on or before 4th October 2026.',
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'inv-3',
    number: 'INV-2026-003',
    companyId: 'comp-2',
    companyName: 'Zenith Logistics',
    contactId: 'contact-2',
    contactName: 'Rajesh Kumar',
    contactEmail: 'rajesh.k@zenithlogistics.com',
    clientAddress: 'Andheri East, Mumbai 400069',
    clientGstNo: '27AAACZ4321P1Z9',
    status: 'overdue',
    issueDate: '2026-09-10',
    dueDate: '2026-09-24', // Overdue!
    items: [
      { id: 'inv-item-4', description: 'Technical Architecture & PostgreSQL Feasibility Audit', quantity: 1, rate: 30000, amount: 30000 }
    ],
    subtotal: 30000,
    taxRate: 18,
    taxAmount: 5400,
    discount: 0,
    total: 35400,
    amountPaid: 0,
    payments: [],
    notes: 'Please expedite payment of overdue invoice.',
    terms: 'Overdue by 4 days.',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-25T09:00:00Z'
  }
];

export const mockCommunications: Communication[] = [
  {
    id: 'comm-1',
    type: 'email',
    direction: 'outbound',
    subject: 'Proposal & Scope: BrightLabs Website Redesign',
    content: 'Hi Sarah, it was great speaking with you yesterday. Attached is our detailed proposal (PROP-2026-001) outlining the React component system, Headless CMS integration, and 5-week launch timeline.',
    leadId: 'lead-1',
    contactId: 'contact-1',
    companyId: 'comp-1',
    senderName: 'Alex Morgan',
    recipientName: 'Sarah Jenkins',
    date: '2026-09-26T14:15:00Z',
    tags: ['Proposal', 'Follow-up']
  },
  {
    id: 'comm-2',
    type: 'email',
    direction: 'inbound',
    subject: 'Re: Proposal & Scope: BrightLabs Website Redesign',
    content: 'Thanks Alex! The proposal looks very thorough. The leadership team loves the Figma previews. We just have two quick questions on Contentful API rate limits. Can we hop on a quick call Monday at 3 PM?',
    leadId: 'lead-1',
    contactId: 'contact-1',
    companyId: 'comp-1',
    senderName: 'Sarah Jenkins',
    recipientName: 'Alex Morgan',
    date: '2026-09-27T08:45:00Z',
    tags: ['Positive Feedback', 'Call Request']
  },
  {
    id: 'comm-3',
    type: 'call',
    direction: 'outbound',
    subject: 'Discovery Call: Fleet Management Architecture',
    content: 'Spoke with Rajesh Kumar for 35 mins. Discussed GPS tracking latency and PostgreSQL sync frequency. Rajesh requested NDA and compliance checklist before board meeting.',
    leadId: 'lead-2',
    contactId: 'contact-2',
    companyId: 'comp-2',
    senderName: 'Devon Vance',
    recipientName: 'Rajesh Kumar',
    date: '2026-09-24T16:00:00Z',
    tags: ['Discovery', 'Architecture']
  },
  {
    id: 'comm-4',
    type: 'note',
    direction: 'internal',
    subject: 'Strategy note: Kavita Organics speed audit',
    content: 'Ananya is very sensitive about mobile checkout bounce rates. If we can prove 35% speed improvement on mobile demo, deal will close on the spot without price resistance.',
    leadId: 'lead-3',
    contactId: 'contact-3',
    companyId: 'comp-3',
    senderName: 'Priya Sharma',
    recipientName: 'Team',
    date: '2026-09-28T07:45:00Z',
    tags: ['Internal', 'Strategy']
  }
];

export const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'BrightLabs Website Proposal v2.pdf',
    fileType: 'proposal',
    fileSize: '2.4 MB',
    relatedToType: 'proposal',
    relatedToId: 'prop-1',
    relatedToName: 'PROP-2026-001 (BrightLabs)',
    uploadedBy: 'Alex Morgan',
    uploadedAt: '2026-09-26T14:00:00Z'
  },
  {
    id: 'doc-2',
    title: 'Apex Health Systems - Master Services Agreement.pdf',
    fileType: 'contract',
    fileSize: '1.8 MB',
    relatedToType: 'project',
    relatedToId: 'proj-1',
    relatedToName: 'Apex Patient Engagement PWA',
    uploadedBy: 'Alex Morgan',
    uploadedAt: '2026-09-18T10:00:00Z'
  },
  {
    id: 'doc-3',
    title: 'Invoice-INV-2026-001-Apex-Health.pdf',
    fileType: 'invoice',
    fileSize: '420 KB',
    relatedToType: 'invoice',
    relatedToId: 'inv-1',
    relatedToName: 'INV-2026-001',
    uploadedBy: 'Alex Morgan',
    uploadedAt: '2026-09-18T11:00:00Z'
  },
  {
    id: 'doc-4',
    title: 'Zenith Logistics Technical Audit Report.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    relatedToType: 'deal',
    relatedToId: 'deal-2',
    relatedToName: 'Zenith Fleet Management Portal',
    uploadedBy: 'Devon Vance',
    uploadedAt: '2026-09-24T17:00:00Z'
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'proposal_sent',
    description: 'Sent Proposal PROP-2026-001 (₹1,06,200) to Sarah Jenkins',
    entityType: 'proposal',
    entityId: 'prop-1',
    entityName: 'BrightLabs Proposal',
    userId: 'user-1',
    userName: 'Alex Morgan',
    timestamp: '2026-09-26T14:00:00Z'
  },
  {
    id: 'act-2',
    type: 'invoice_paid',
    description: 'Recorded payment of ₹1,00,300 for Invoice INV-2026-001 from Apex Health Systems',
    entityType: 'invoice',
    entityId: 'inv-1',
    entityName: 'INV-2026-001',
    userId: 'user-1',
    userName: 'Alex Morgan',
    timestamp: '2026-09-20T14:00:00Z'
  },
  {
    id: 'act-3',
    type: 'deal_moved',
    description: 'Moved deal "Zenith Fleet Management Portal" to Negotiation stage',
    entityType: 'deal',
    entityId: 'deal-2',
    entityName: 'Zenith Fleet Portal',
    userId: 'user-2',
    userName: 'Devon Vance',
    timestamp: '2026-09-27T12:00:00Z'
  },
  {
    id: 'act-4',
    type: 'lead_created',
    description: 'Captured new high-priority lead: Ananya Deshmukh (Kavita Organics)',
    entityType: 'lead',
    entityId: 'lead-3',
    entityName: 'Kavita Organics',
    userId: 'user-3',
    userName: 'Priya Sharma',
    timestamp: '2026-09-28T07:00:00Z'
  }
];

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'AI Lead Intelligence',
    message: 'High priority lead Sarah Jenkins (BrightLabs) scored 92. Proposal review meeting today at 3:00 PM.',
    type: 'ai',
    read: false,
    link: '/leads/lead-1',
    timestamp: '2026-09-28T08:00:00Z'
  },
  {
    id: 'notif-2',
    title: 'Invoice Overdue Alert',
    message: 'Invoice INV-2026-003 for Zenith Logistics (₹35,400) is 4 days overdue.',
    type: 'warning',
    read: false,
    link: '/invoices/inv-3',
    timestamp: '2026-09-28T07:30:00Z'
  },
  {
    id: 'notif-3',
    title: 'Follow-up Reminder',
    message: 'Karthik Raman (CloudScale DevOps) has not been contacted for 7 days.',
    type: 'info',
    read: false,
    link: '/leads/lead-4',
    timestamp: '2026-09-28T06:00:00Z'
  },
  {
    id: 'notif-4',
    title: 'Payment Received',
    message: '₹1,00,300 received from Apex Health Systems for kickoff invoice.',
    type: 'success',
    read: true,
    link: '/invoices/inv-1',
    timestamp: '2026-09-20T14:00:00Z'
  }
];
