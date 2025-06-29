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

  // Show login page only if explicitly on /login route
  if (path === '/login') {
    return <LoginPage />;
  }

  // Show dashboard pages directly (bypass authentication for development)
  switch (path) {
    case '/dashboard':
      return <DashboardPage />;
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
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;