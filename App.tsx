
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import AIAnalytics from './components/AIAnalytics';
import Settings from './components/Settings';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import WelcomeModal from './components/WelcomeModal';
import CommandPalette from './components/CommandPalette';
import { Customer, ViewType } from './types';

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João Silva', email: 'joao@techflow.com', company: 'TechFlow Solutions', status: 'Ativo', value: 12500, phone: '(11) 99999-9999', lastContact: '2023-10-25', notes: 'Cliente recorrente.', priority: 'Alta' },
  { id: '2', name: 'Maria Santos', email: 'maria@lumina.io', company: 'Lumina Creative', status: 'Lead', value: 4500, phone: '(21) 98888-8888', lastContact: '2023-10-20', notes: 'Interessada no plano Enterprise.', priority: 'Média' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('crm_theme') as 'light' | 'dark') || 'light';
  });
  
  const [toasts, setToasts] = useState<{id: number, msg: string, type: string}[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('crm_theme', theme);
  }, [theme]);

  // Global Keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Recupera sessão ativa e dados persistentes
  useEffect(() => {
    const savedSession = localStorage.getItem('crm_active_session') || sessionStorage.getItem('crm_active_session');
    if (savedSession) {
      try {
        const userData = JSON.parse(savedSession);
        setUser(userData);
        setIsAuthenticated(true);
        
        const userKey = `crm_data_${btoa(userData.email)}`;
        const savedCustomers = localStorage.getItem(userKey);
        setCustomers(savedCustomers ? JSON.parse(savedCustomers) : INITIAL_CUSTOMERS);
        
        const reportKey = `crm_report_${btoa(userData.email)}`;
        const savedReport = localStorage.getItem(reportKey);
        if (savedReport) setAiReport(savedReport);
        
      } catch (e) {
        localStorage.removeItem('crm_active_session');
      }
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const welcomeKey = `crm_welcome_seen_${btoa(user.email)}`;
      const hasSeenWelcome = localStorage.getItem(welcomeKey);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const userKey = `crm_data_${btoa(user.email)}`;
      localStorage.setItem(userKey, JSON.stringify(customers));
      
      const reportKey = `crm_report_${btoa(user.email)}`;
      if (aiReport) localStorage.setItem(reportKey, aiReport);
    }
  }, [customers, aiReport, isAuthenticated, user]);

  const addToast = (msg: string, type: string = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleCloseWelcome = () => {
    if (user?.email) {
      const welcomeKey = `crm_welcome_seen_${btoa(user.email)}`;
      localStorage.setItem(welcomeKey, 'true');
    }
    setShowWelcome(false);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    if (userData.remember) {
      localStorage.setItem('crm_active_session', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('crm_active_session', JSON.stringify(userData));
    }
    
    const userKey = `crm_data_${btoa(userData.email)}`;
    const savedCustomers = localStorage.getItem(userKey);
    setCustomers(savedCustomers ? JSON.parse(savedCustomers) : INITIAL_CUSTOMERS);

    const reportKey = `crm_report_${btoa(userData.email)}`;
    const savedReport = localStorage.getItem(reportKey);
    setAiReport(savedReport || null);

    setView('dashboard');
    addToast(`Bem-vindo, ${userData.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_active_session');
    sessionStorage.removeItem('crm_active_session');
    setIsAuthenticated(false);
    setUser(null);
    setCustomers([]);
    setAiReport(null);
    setView('dashboard');
    addToast("Sessão encerrada.", "info");
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast("Cliente removido.");
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    addToast("Cliente adicionado.");
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    addToast("Dados atualizados.");
  };

  const handleUpdateUser = (updatedData: any) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    const storage = newUser.remember ? localStorage : sessionStorage;
    storage.setItem('crm_active_session', JSON.stringify(newUser));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    addToast(`Modo ${theme === 'light' ? 'Escuro' : 'Claro'} ativado.`);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const renderView = () => {
    switch(view) {
      case 'dashboard': return <Dashboard customers={customers} onNavigate={setView} />;
      case 'customers': return <CustomerList customers={customers} onDelete={handleDeleteCustomer} onAdd={handleAddCustomer} onUpdate={handleUpdateCustomer} onToast={addToast} />;
      case 'analytics': return <AIAnalytics customers={customers} insight={aiReport} setInsight={setAiReport} onToast={addToast} />;
      case 'settings': return <Settings onToast={addToast} theme={theme} onThemeChange={setTheme} />;
      case 'profile': return <Profile user={user} onUpdate={handleUpdateUser} onToast={addToast} />;
      default: return <Dashboard customers={customers} onNavigate={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Sidebar currentView={view} setView={setView} onLogout={handleLogout} user={user} />
      
      <main className="flex-1 ml-64 min-h-screen relative">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="text-slate-400 dark:text-slate-500 text-sm hidden md:block uppercase tracking-widest font-black text-[9px]">
              Sessão Ativa: <span className="text-blue-600 dark:text-blue-400">{user?.email}</span>
            </div>
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 group hover:border-blue-500 transition-all"
            >
              <span className="text-xs">🔍</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Comandos</span>
              <kbd className="text-[9px] font-black bg-white dark:bg-slate-900 px-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400">⌘K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl pr-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>{user?.name?.charAt(0)}</span>}
            </div>
            <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{user?.name}</p>
          </div>
        </header>

        <div className="p-4 sm:p-8 animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>

      {/* Modais e Componentes Globais */}
      {showWelcome && <WelcomeModal userName={user?.name} onConfirm={handleCloseWelcome} />}
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)}
        setView={setView}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-xs animate-in slide-in-from-right-full duration-300 ${t.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
