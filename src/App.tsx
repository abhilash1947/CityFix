import { useState, useEffect } from 'react';
import { AuthPage } from './components/Auth/AuthPage';
import { Navbar } from './components/Layout/Navbar';
import { CitizenDashboard } from './components/Dashboard/CitizenDashboard';
import { AuthorityDashboard } from './components/Dashboard/AuthorityDashboard';
import { AuthorityAnalytics } from './components/Analytics/AuthorityAnalytics';
import { ReportIssue } from './components/Issues/ReportIssue';
import { useAuth } from './hooks/useAuth';
import { ProfilePage } from './components/ProfilePage';

function App() {
  const { user, loading, userRole, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    if (isAuthenticated && userRole === 'authority') {
      setCurrentView('authority-dashboard');
    } else if (isAuthenticated) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onSuccess={() => setCurrentView('dashboard')} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <CitizenDashboard onNavigate={setCurrentView} />;
      case 'authority-dashboard':
        return <AuthorityDashboard />;
      case 'report':
        return <ReportIssue />;
      case 'profile':
  return <ProfilePage />;

      case 'analytics':
        return <AuthorityAnalytics />;
      default:
        return userRole === 'authority' ? <AuthorityDashboard /> : <CitizenDashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;