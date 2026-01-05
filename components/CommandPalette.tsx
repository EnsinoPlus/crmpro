
import React, { useState, useEffect, useRef } from 'react';
import { ViewType } from '../types';

interface Command {
  id: string;
  label: string;
  category: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewType) => void;
  toggleTheme: () => void;
  onLogout: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, setView, toggleTheme, onLogout }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'dash', label: 'Ir para Dashboard', category: 'Navegação', icon: '📊', action: () => setView('dashboard') },
    { id: 'cust', label: 'Ver Base de Clientes', category: 'Navegação', icon: '👥', action: () => setView('customers') },
    { id: 'ai', label: 'Gerar Dossiê de IA', category: 'Inteligência', icon: '✨', action: () => setView('analytics') },
    { id: 'prof', label: 'Ver Meu Perfil', category: 'Usuário', icon: '👤', action: () => setView('profile') },
    { id: 'theme', label: 'Alternar Tema (Light/Dark)', category: 'Sistema', icon: '🌓', action: toggleTheme },
    { id: 'set', label: 'Configurações do Sistema', category: 'Sistema', icon: '⚙️', action: () => setView('settings') },
    { id: 'exit', label: 'Encerrar Sessão', category: 'Sistema', icon: '🚪', action: onLogout },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) || 
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <span className="text-xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="O que você deseja executar?"
            className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-slate-800 dark:text-white placeholder:text-slate-400"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
          />
          <div className="flex gap-1">
            <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[10px] font-black text-slate-400 border border-slate-200 dark:border-slate-700">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-3 custom-scrollbar">
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              {filteredCommands.map((cmd, index) => (
                <button
                  key={cmd.id}
                  onClick={() => { cmd.action(); onClose(); }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    selectedIndex === index 
                      ? 'bg-blue-600 text-white shadow-lg scale-[1.01]' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{cmd.icon}</span>
                    <div className="text-left">
                      <p className={`text-sm font-black uppercase tracking-tight ${selectedIndex === index ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {cmd.label}
                      </p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedIndex === index ? 'text-blue-100' : 'text-slate-400'}`}>
                        {cmd.category}
                      </p>
                    </div>
                  </div>
                  {selectedIndex === index && <span className="text-xs font-black uppercase tracking-widest opacity-70">Executar ↵</span>}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 italic">
              Nenhum comando encontrado para "{search}"
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center gap-4">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Atalho Global: <span className="text-blue-600">CMD + K</span> para abrir a Central</p>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
