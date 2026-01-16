
import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Packages from './components/Packages';
import BookingManager from './components/BookingManager';
import Finance from './components/Finance';
import VendorManager from './components/VendorManager';
import Reports from './components/Reports';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('te_auth');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('te_auth', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('te_auth');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'packages': return <Packages user={user} />;
      case 'bookings': return <BookingManager user={user} />;
      case 'finance': return <Finance user={user} />;
      case 'vendors': return <VendorManager />;
      case 'reports': return <Reports />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar 
          role={user.role} 
          currentView={view} 
          setView={setView} 
          onLogout={handleLogout} 
        />
      </div>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white h-full" onClick={e => e.stopPropagation()}>
            <Sidebar 
              role={user.role} 
              currentView={view} 
              setView={setView} 
              onLogout={handleLogout} 
              closeMobile={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                {view.replace('-', ' ')}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
