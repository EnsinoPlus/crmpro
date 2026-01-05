
import React, { useState, useRef } from 'react';

interface ProfileProps {
  user: any;
  onUpdate: (data: any) => void;
  onToast: (msg: string, type?: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    role: user?.role || 'Senior Account Manager',
    bio: user?.bio || 'Especialista em fechamento de contas Enterprise e gestão estratégica de clientes VIP.',
    location: user?.location || 'São Paulo, Brasil',
    skills: user?.skills || ['Negociação', 'CRM Pro', 'Análise de IA', 'Relatórios', 'Gestão de Crise']
  });

  const [newSkill, setNewSkill] = useState('');

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(val);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      onToast("Nome e E-mail são obrigatórios", "info");
      return;
    }
    onUpdate(formData);
    setIsEditing(false);
    onToast("Perfil atualizado com sucesso!", "success");
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      role: user?.role || 'Senior Account Manager',
      bio: user?.bio || 'Especialista em fechamento de contas Enterprise e gestão estratégica de clientes VIP.',
      location: user?.location || 'São Paulo, Brasil',
      skills: user?.skills || ['Negociação', 'CRM Pro', 'Análise de IA', 'Relatórios', 'Gestão de Crise']
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onToast("A imagem deve ter no máximo 2MB", "info");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
        onToast("Foto carregada com sucesso! Não esqueça de salvar.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s: string) => s !== skillToRemove) });
  };

  const userStats = [
    { label: 'Leads Convertidos', value: '142', icon: '🎯', color: 'bg-blue-500' },
    { label: 'Receita Gerada', value: formatCurrency(1200000), icon: '💰', color: 'bg-emerald-500' },
    { label: 'Nível de Satisfação', value: '4.9/5', icon: '⭐', color: 'bg-orange-500' },
  ];

  const recentActivity = [
    { id: 1, action: 'Fechou contrato com Lumina Creative', time: 'Há 2 horas', icon: '🤝' },
    { id: 2, action: 'Atualizou status de 5 leads VIP', time: 'Há 5 horas', icon: '📈' },
    { id: 3, action: 'Gerou relatório de análise IA', time: 'Ontem às 14:30', icon: '✨' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic">Meu Perfil</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Informações profissionais e conquistas de carreira.</p>
        </div>
        <div className="flex gap-3">
          {isEditing && (
            <button 
              onClick={handleCancel}
              className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
          )}
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
              isEditing 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
            }`}
          >
            {isEditing ? '✓ Salvar Alterações' : '✎ Editar Perfil'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer" onClick={triggerUpload}>
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl mb-6 overflow-hidden ring-4 ring-white dark:ring-slate-800 transition-all group-hover:ring-blue-500/50 group-hover:scale-[1.02]">
                {formData.avatar ? (
                  <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <span>{formData.name.charAt(0)}</span>
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-black uppercase tracking-widest">Alterar</span>
                </div>
              </div>
              <div className="absolute bottom-6 right-0 bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-blue-600">
                <span className="text-sm">📷</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{formData.name}</h3>
            <p className="text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mt-1">{formData.role}</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-4 italic leading-relaxed px-4">"{formData.bio}"</p>
            
            <div className="w-full h-px bg-slate-50 dark:bg-slate-800 my-8"></div>
            
            <div className="w-full space-y-4 text-left px-2">
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 group">
                <span className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm group-hover:text-blue-500 transition-colors">📧</span>
                <span className="text-sm font-medium truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 group">
                <span className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm group-hover:text-blue-500 transition-colors">📍</span>
                <span className="text-sm font-medium">{formData.location}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 group">
                <span className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-sm group-hover:text-blue-500 transition-colors">🏢</span>
                <span className="text-sm font-medium">Minha Empresa LTDA</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">🏆</div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status do Especialista</p>
             <h4 className="text-xl font-black mt-1">Vendedor de Elite</h4>
             <div className="mt-6 flex gap-2">
                <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase">Top 1%</div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase">Pro+</div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userStats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm group hover:scale-105 transition-all">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-lg mb-4 shadow-lg shadow-slate-200 dark:shadow-none`}>
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            {isEditing ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-xl font-black text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4 flex items-center gap-3">
                  <span className="text-blue-600">✎</span> Ajustar Informações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white font-bold text-sm border-none outline-none focus:ring-2 ring-blue-500 transition-all"
                      placeholder="seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                    <input 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white font-bold text-sm border-none outline-none focus:ring-2 ring-blue-500 transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo / Título</label>
                    <input 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white font-bold text-sm border-none outline-none focus:ring-2 ring-blue-500 transition-all"
                      placeholder="Ex: Diretor Comercial"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Localização</label>
                    <input 
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white font-bold text-sm border-none outline-none focus:ring-2 ring-blue-500 transition-all"
                      placeholder="Cidade, País"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio Profissional</label>
                    <textarea 
                      rows={4}
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white font-medium text-sm border-none outline-none focus:ring-2 ring-blue-500 resize-none transition-all"
                      placeholder="Conte um pouco sobre sua trajetória..."
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gerenciar Competências</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill: string) => (
                      <span key={skill} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest group">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Adicionar nova competência..."
                      className="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl dark:text-white text-xs font-bold border-none outline-none focus:ring-2 ring-blue-500 transition-all"
                    />
                    <button 
                      onClick={addSkill}
                      className="px-6 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                <h3 className="text-xl font-black text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4 flex justify-between items-center">
                   Atividade Recente
                   <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Tempo Real</span>
                </h3>
                <div className="space-y-6">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center gap-6 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-[1.5rem] transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.action}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-wider">{item.time}</p>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-all text-slate-300 translate-x-[-10px] group-hover:translate-x-0">→</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Competências Técnicas</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-transparent">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
