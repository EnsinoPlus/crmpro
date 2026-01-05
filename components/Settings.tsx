import React, { useState } from 'react';

interface SettingsProps {
  onToast: (msg: string, type?: string) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ onToast, theme, onThemeChange }) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'servidor' | 'seguranca' | 'github'>('geral');
  const [loading, setLoading] = useState(false);
  
  // Estados de Interface e Marca
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [companyName, setCompanyName] = useState('CRM Pro Gestão');
  
  // Estados de Git
  const [repoName, setRepoName] = useState('crm-pro-app');

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      onToast("Configurações aplicadas com sucesso!", "success");
      setLoading(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onToast("Comandos copiados!", "success");
  };

  const deployCommands = `# --- PASSO 1: GITHUB ---
git init
git add .
git commit -m "feat: crm pro production ready 🚀"
git branch -M main
git remote add origin https://github.com/seu-usuario/${repoName}.git
git push -u origin main

# --- PASSO 2: DOCKER (PRODUÇÃO) ---
# Compilar imagem
docker build -t ${repoName} .

# Rodar container (Porta 80)
docker run -d -p 8080:80 --name crm-prod ${repoName}`;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">Configurações</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Gestão de infraestrutura, dados e inteligência artificial.</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navegação Lateral */}
        <div className="w-full lg:w-72 space-y-2">
          {[
            { id: 'geral', label: 'Interface & Marca', icon: '🎨' },
            { id: 'github', label: 'Deploy & GitHub', icon: '🚀' },
            { id: 'servidor', label: 'Dados & Backups', icon: '💾' },
            { id: 'seguranca', label: 'Acesso & Segurança', icon: '🛡️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-left ${
                activeTab === tab.id 
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-2xl shadow-slate-200 dark:shadow-none translate-x-2' 
                  : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 border border-transparent hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              <span className="text-xl">{tab.icon}</span> {tab.label}
            </button>
          ))}
          
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 text-6xl opacity-20 rotate-12 group-hover:scale-110 transition-transform">⚙️</div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Infraestrutura</p>
            <p className="text-lg font-black mt-1">Pronto para Deploy</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest">Docker & Nginx Prontos</span>
            </div>
          </div>
        </div>

        {/* Área de Conteúdo */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-right-8 duration-500 transition-colors">
            
            {activeTab === 'geral' && (
              <div className="space-y-12">
                <section>
                  <div className="mb-8">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white">Identidade Visual</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Personalize a cara do CRM para o seu negócio</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cor Primária do CRM</label>
                        <div className="flex flex-wrap gap-3">
                          {['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#0f172a'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setPrimaryColor(color)}
                              className={`w-10 h-10 rounded-full border-4 transition-all transform hover:scale-110 ${primaryColor === color ? 'border-blue-200 dark:border-blue-500 scale-110 shadow-lg' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Organização</label>
                        <input 
                          type="text" 
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent focus:border-blue-500 dark:text-white outline-none font-bold text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[3rem] flex flex-col items-center justify-center">
                      <div className="w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden rounded-[2.5rem] transition-all">
                        <div className="h-12 border-b border-slate-50 dark:border-slate-800 px-6 flex items-center justify-between">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                          <div className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-2/3"></div>
                          <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full w-full"></div>
                          <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'github' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">🚀 Deploy & Versionamento</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Pipeline de publicação para o seu servidor</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Repositório</label>
                  <input 
                    type="text" 
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-transparent focus:border-blue-500 dark:text-white outline-none font-bold text-sm"
                    placeholder="ex: crm-pro-app"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute top-0 right-0 px-4 py-2 bg-slate-800 rounded-tr-[2rem] rounded-bl-2xl text-[9px] font-black text-emerald-400 uppercase tracking-widest">Terminal / Bash</div>
                  <pre className="bg-slate-950 text-slate-200 p-8 pt-12 rounded-[2rem] font-mono text-[11px] leading-relaxed overflow-x-auto border-4 border-slate-900 shadow-2xl custom-scrollbar">
                    {deployCommands}
                  </pre>
                  <button 
                    onClick={() => copyToClipboard(deployCommands)}
                    className="absolute bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                  >
                    Copiar Comandos
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">📂 Infraestrutura Pronta</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      O sistema já gerou os arquivos <code>Dockerfile</code>, <code>nginx.conf</code> e <code>.dockerignore</code> na raiz do projeto.
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">🛡️ Servidor Web Seguro</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Usamos Nginx para servir seus arquivos de forma estática, garantindo máxima velocidade e proteção contra ataques comuns.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">
                  Pronto para Sincronização
                 </p>
              </div>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full md:w-auto bg-slate-900 dark:bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                {loading ? "Processando..." : "Salvar & Aplicar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;