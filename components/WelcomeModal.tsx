
import React from 'react';

interface WelcomeModalProps {
  userName: string;
  onConfirm: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ userName, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 overflow-hidden">
      {/* Overlay com desfoque profundo */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-700"></div>
      
      {/* Card de Boas-vindas */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[4rem] shadow-[0_35px_100px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        
        {/* Detalhes Decorativos */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        
        <div className="relative p-12 md:p-20 text-center flex flex-col items-center">
          {/* Ícone Pulsante */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl transform -rotate-6 transition-transform hover:rotate-0 duration-500">
              🚀
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none mb-6">
            Seja muito bem-vindo, <br />
            <span className="text-blue-600">{userName.split(' ')[0]}!</span>
          </h2>
          
          <div className="space-y-6 max-w-md">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
              Ficamos honrados em ter você no <span className="font-black italic text-slate-800 dark:text-slate-100">CRM PRO</span>. 
              Sua jornada para um relacionamento inteligente com clientes começa agora.
            </p>
            
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">
              Analise dados, gere insights com IA e escale seus resultados com a melhor tecnologia do mercado.
            </p>
          </div>

          <div className="mt-14 w-full">
            <button 
              onClick={onConfirm}
              className="group relative w-full md:w-auto px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Começar Jornada Executiva</span>
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
            <p className="mt-6 text-[9px] text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest">
              Obrigado por escolher o futuro da gestão comercial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
