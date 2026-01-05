
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import AIAnalytics from './components/AIAnalytics';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import { Customer, ViewType } from './types';

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: 'João Silva', email: 'joao@techflow.com', company: 'TechFlow Solutions', status: 'Ativo', value: 12500, phone: '(11) 99999-9999', lastContact: '2023-10-25', notes: 'Cliente recorrente.' },
  { id: '2', name: 'Maria Santos', email: 'maria@lumina.io', company: 'Lumina Creative', status: 'Lead', value: 4500, phone: '(21) 98888-8888', lastContact: '2023-10-20', notes: 'Interessada no plano Enterprise.' },
  { id: '3', name: 'Ricardo Pereira', email: 'ricardo@logix.com', company: 'Logix Cargo', status: 'Inativo', value: 8900, phone: '(31) 97777-7777', lastContact: '2023-05-15', notes: 'Pausou contrato.' },
  { id: '4', name: 'Ana Costa', email: 'ana@greenworld.br', company: 'GreenWorld Ecopack', status: 'Ativo', value: 25000, phone: '(41) 96666-6666', lastContact: '2023-10-24', notes: 'Maior conta sustentável.' },
  { id: '5', name: 'Paulo Souza', email: 'paulo@nexus.net', company: 'Nexus Tech', status: 'Lead', value: 3200, phone: '(19) 95555-5555', lastContact: '2023-10-26', notes: 'Indicação.' },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toasts, setToasts] = useState<{id: number, msg: string, type: string}[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToast = (msg: string, type: string = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('crm_user', JSON.stringify(userData));
    addToast(`Login realizado como ${userData.name}`);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setShowUserMenu(false);
    localStorage.removeItem('crm_user');
    addToast("Sessão encerrada", "info");
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast("Cliente removido com sucesso");
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    addToast("Novo cliente adicionado!");
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const renderView = () => {
    switch(view) {
      case 'dashboard': return <Dashboard customers={customers} onNavigate={setView} />;
      case 'customers': return <CustomerList customers={customers} onDelete={handleDeleteCustomer} onAdd={handleAddCustomer} onToast={addToast} />;
      case 'analytics': return <AIAnalytics customers={customers} />;
      case 'settings': return <Settings onToast={addToast} />;
      default: return <Dashboard customers={customers} onNavigate={setView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700">
      <Sidebar currentView={view} setView={setView} onLogout={handleLogout} user={user} />
      
      <main className="flex-1 ml-64 min-h-screen relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-slate-200/20">
          <div className="text-slate-400 text-sm hidden md:block">
            Empresa: <strong className="text-slate-700 font-semibold">Minha Empresa LTDA</strong>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 ml-auto">
            {/* Notificações */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className={`p-2 rounded-xl transition-all duration-200 ${showNotifications ? 'bg-blue-50 text-blue-600 scale-110' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              >
                <span className="text-xl">🔔</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="flex items-center justify-between px-6 mb-4">
                    <h4 className="font-bold text-slate-800">Notificações</h4>
                    <button onClick={() => addToast("Notificações marcadas como lidas", "info")} className="text-[10px] text-blue-600 font-black hover:underline uppercase">Limpar</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="px-6 py-4 hover:bg-slate-50 cursor-pointer border-l-4 border-blue-500 transition-colors">
                      <p className="text-xs font-bold text-slate-800">Meta Mensal Atingida! 🚀</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Parabéns! Sua carteira atingiu R$ 54.100.</p>
                    </div>
                    <div className="px-6 py-4 hover:bg-slate-50 cursor-pointer border-l-4 border-orange-400 transition-colors">
                      <p className="text-xs font-bold text-slate-800">Novo Lead via IA</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Paulo Souza foi identificado como alta prioridade.</p>
                    </div>
                  </div>
                  <div className="mt-2 px-6 pt-4 border-t border-slate-50">
                    <button onClick={() => { setView('analytics'); setShowNotifications(false); }} className="w-full text-center text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Ver Análises</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200"></div>
            
            {/* Menu de Usuário (O botão da imagem) */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-3 p-1.5 pl-3 rounded-2xl transition-all duration-200 group ${showUserMenu ? 'bg-slate-100 ring-2 ring-blue-100' : 'hover:bg-slate-50'}`}
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user?.name}</p>
                  <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">PLANO PRO</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform overflow-hidden">
                  {user?.avatar || (user?.name?.charAt(0) || 'A')}
                </div>
                <span className={`text-[10px] text-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-2 border-b border-slate-50 mb-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Logado como</p>
                    <p className="text-xs text-slate-600 truncate font-medium">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setView('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                  >
                    <span className="group-hover:scale-120 transition-transform">👤</span> Meu Perfil
                  </button>
                  <button 
                    onClick={() => { setView('settings'); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                  >
                    <span className="group-hover:rotate-45 transition-transform">⚙️</span> Configurações
                  </button>
                  <div className="my-2 border-t border-slate-50"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all font-bold group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">🚪</span> Sair da Conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>

      {/* Toast System */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 animate-in slide-in-from-right-full duration-300 border-b-4 ${t.type === 'success' ? 'bg-emerald-500 border-emerald-700' : 'bg-blue-600 border-blue-800'}`}>
            {t.type === 'success' ? '✅' : 'ℹ️'} {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
