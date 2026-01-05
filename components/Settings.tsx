
import React, { useState } from 'react';

interface SettingsProps {
  onToast: (msg: string, type?: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onToast }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'servidor' | 'seguranca'>('geral');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      onToast("Configurações atualizadas!", "success");
      setLoading(false);
    }, 1200);
  };

  const systemConfig = {
    supabaseUrl: "https://frdxswlgrjjfgpwblplp.supabase.co",
    status: "Conectado",
    version: "2.4.0-stable",
    lastSync: new Date().toLocaleString('pt-BR')
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Configurações</h2>
        <p className="text-slate-500 font-medium">Controle total da sua infraestrutura.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navegação Lateral */}
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: 'geral', label: 'Preferências', icon: '⚙️' },
            { id: 'servidor', label: 'Infraestrutura', icon: '🌐' },
            { id: 'seguranca', label: 'Segurança', icon: '🛡️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-1' 
                  : 'text-slate-400 hover:bg-white hover:text-slate-600'
              }`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-300">
            {activeTab === 'geral' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-6">Informações Organizacionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Fantasia</label>
                      <input type="text" defaultValue="Minha Empresa LTDA" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                      <input type="email" defaultValue="contato@empresa.com.br" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 font-bold outline-none" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4">Idioma do Sistema</h4>
                  <div className="flex gap-3">
                    {['Português (BR)', 'English', 'Español'].map(lang => (
                      <button key={lang} onClick={() => onToast(`Idioma alterado para ${lang}`, "info")} className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all ${lang.includes('BR') ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'servidor' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-800">Status do Cluster</h3>
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Serviço Online</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Endpoints de API</p>
                    <p className="text-sm font-bold text-slate-700 break-all">{systemConfig.supabaseUrl}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Última Sincronização</p>
                    <p className="text-sm font-bold text-slate-700">{systemConfig.lastSync}</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                  <h4 className="text-blue-800 font-black text-xs uppercase mb-2">Ação do Desenvolvedor</h4>
                  <p className="text-blue-600 text-xs font-medium mb-4 leading-relaxed">Reinicializar o túnel de conexão com o banco de dados Supra.</p>
                  <button onClick={() => onToast("Reiniciando túnel do servidor...", "info")} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200">Resetar Conexão</button>
                </div>
              </div>
            )}

            {activeTab === 'seguranca' && (
              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-800">Proteção de Dados</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 border-2 border-slate-50 rounded-3xl hover:border-blue-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">📱</div>
                      <div>
                        <p className="font-bold text-slate-800">Autenticação 2FA</p>
                        <p className="text-xs text-slate-400">Proteja sua conta com SMS ou App.</p>
                      </div>
                    </div>
                    <button onClick={() => onToast("Redirecionando para configuração 2FA", "info")} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Configurar</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 border-2 border-slate-50 rounded-3xl hover:border-red-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-xl">🔑</div>
                      <div>
                        <p className="font-bold text-slate-800">Resetar Senha Master</p>
                        <p className="text-xs text-slate-400">Troque a senha de acesso administrativo.</p>
                      </div>
                    </div>
                    <button onClick={() => onToast("E-mail de redefinição enviado!", "success")} className="px-5 py-2.5 border-2 border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Redefinir</button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end gap-3">
              <button disabled={loading} onClick={handleSave} className="bg-blue-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-200 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Salvar Tudo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
