import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ServersPage from './components/dashboard/ServersPage';
import ConnectionsPage from './components/dashboard/ConnectionsPage';
import ConversationsPage from './components/dashboard/ConversationsPage';
import AnalyticsPage from './components/dashboard/AnalyticsPage';
import LogsPage from './components/dashboard/LogsPage';
import OrganizationPage from './components/dashboard/OrganizationPage';
import SubscriptionPage from './components/dashboard/SubscriptionPage';
import SettingsPage from './components/dashboard/SettingsPage';
import ProfilePage from './components/dashboard/ProfilePage';
import CRMPage from './components/dashboard/CRMPage';
import AgendaPage from './components/dashboard/AgendaPage';
import FollowUpPage from './components/dashboard/FollowUpPage';
import CalendarPage from './components/dashboard/CalendarPage';
import AutomationPage from './components/dashboard/AutomationPage';

// Landing page components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import ProblemsSection from './components/ProblemsSection';
import HowItWorksSection from './components/HowItWorksSection';
import UseCasesSection from './components/UseCasesSection';
import Calculator from './components/Calculator';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2D0B55] via-[#3D1565] to-[#2D0B55] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF7A00]"></div>
      </div>
    );
  }

  // Get current path
  const path = window.location.pathname;

  // Show login page
  if (path === '/login') {
    return <LoginPage />;
  }

  // Check authentication for dashboard pages
  const dashboardPages = [
    '/dashboard', '/crm', '/agenda', '/calendar', '/follow-up', '/automation', '/servers', '/connections', '/conversations', 
    '/analytics', '/logs', '/organization', '/subscription', 
    '/settings', '/profile'
  ];

  if (dashboardPages.includes(path)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return null;
    }

    // Show appropriate dashboard page
    switch (path) {
      case '/dashboard':
        return <DashboardPage />;
      case '/crm':
        return <CRMPage />;
      case '/agenda':
        return <AgendaPage />;
      case '/calendar':
        return <CalendarPage />;
      case '/follow-up':
        return <FollowUpPage />;
      case '/automation':
        return <AutomationPage />;
      case '/servers':
        return <ServersPage />;
      case '/connections':
        return <ConnectionsPage />;
      case '/conversations':
        return <ConversationsPage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/logs':
        return <LogsPage />;
      case '/organization':
        return <OrganizationPage />;
      case '/subscription':
        return <SubscriptionPage />;
      case '/settings':
        return <SettingsPage />;
      case '/profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  }

  // Show landing page for root and unknown routes
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />
      <ProblemsSection />
      <HowItWorksSection />
      <UseCasesSection />
      <Calculator />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;