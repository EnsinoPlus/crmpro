
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
  user: any;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, user }) => {
  const items = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: '📊' },
    { id: 'customers' as ViewType, label: 'Clientes', icon: '👥' },
    { id: 'analytics' as ViewType, label: 'Análises IA', icon: '✨' },
    { id: 'settings' as ViewType, label: 'Configurações', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-slate-900 dark:bg-black h-screen text-white flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="p-6 border-b border-slate-800 dark:border-slate-900">
        <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">C</div>
          CRM Pro
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-bold">Sistema Inteligente</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center px-6 py-4 text-sm transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-600' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className="text-xl mr-3 opacity-80">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 dark:border-slate-900 space-y-4">
        <div className="flex justify-center">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Atalho:</span>
             <kbd className="text-[10px] font-black text-blue-400 tracking-tighter">⌘K</kbd>
           </div>
        </div>

        <button 
          onClick={() => setView('profile')}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all group border border-transparent text-left ${
            currentView === 'profile' ? 'bg-blue-600/20 border-blue-600/50' : 'bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0">
            {user?.avatar && user.avatar.startsWith('http') ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0) || '👤'}</span>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold truncate text-slate-100">{user?.name || 'Usuário'}</p>
            <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider font-bold">VER PERFIL</p>
          </div>
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-slate-400 hover:text-white hover:bg-red-500/90 rounded-xl transition-all border border-slate-800 hover:border-red-500 shadow-sm uppercase tracking-widest"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
