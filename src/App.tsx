import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CRMProvider } from './context/CRMContext';
import { ToastProvider } from './context/ToastContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AppLayout } from './components/layout/AppLayout';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadsListView } from './components/leads/LeadsListView';
import { DealsView } from './components/deals/DealsView';
import { ContactsView } from './components/contacts/ContactsView';
import { CompaniesView } from './components/companies/CompaniesView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProposalsView } from './components/proposals/ProposalsView';
import { InvoicesView } from './components/invoices/InvoicesView';
import { CommunicationsView } from './components/communications/CommunicationsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AICopilotPage } from './components/ai/AICopilotPage';
import { TeamView } from './components/team/TeamView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthView } from './components/auth/AuthView';
import { OnboardingWizard } from './components/auth/OnboardingWizard';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isOnboarded } = useAuth();
  const { currentRoute } = useNavigation();

  // If not authenticated, show modern SaaS login/register
  if (!isAuthenticated) {
    return <AuthView onSuccess={() => {}} />;
  }

  // If new user and not onboarded, show onboarding wizard
  if (!isOnboarded) {
    return <OnboardingWizard onComplete={() => {}} />;
  }

  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadsListView />;
      case 'deals':
        return <DealsView />;
      case 'contacts':
        return <ContactsView />;
      case 'companies':
        return <CompaniesView />;
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'projects':
        return <ProjectsView />;
      case 'proposals':
        return <ProposalsView />;
      case 'invoices':
        return <InvoicesView />;
      case 'communications':
        return <CommunicationsView />;
      case 'documents':
        return <DocumentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai':
        return <AICopilotPage />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <AppLayout>{renderActiveRoute()}</AppLayout>;
};

export default function App() {
  return (
    <AuthProvider>
      <CRMProvider>
        <ToastProvider>
          <NavigationProvider>
            <MainAppContent />
          </NavigationProvider>
        </ToastProvider>
      </CRMProvider>
    </AuthProvider>
  );
}
