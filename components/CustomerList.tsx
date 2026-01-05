
import React, { useState, useMemo, useRef } from 'react';
import { Customer, Activity } from '../types';

interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onAdd: (customer: Customer) => void;
  onUpdate: (customer: Customer) => void;
  onToast: (msg: string, type?: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onDelete, onAdd, onUpdate, onToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('none');

  const [formData, setFormData] = useState({ 
    name: '', email: '', company: '', value: 0, phone: '', 
    status: 'Lead', notes: '', priority: 'Média', newActivity: '', activityType: 'note' as Activity['type'],
    cpfCnpj: '', website: '', industry: 'Tecnologia', leadSource: 'Indicação',
    cep: '', street: '', number: '', city: '', state: ''
  });

  const [activityLog, setActivityLog] = useState<Activity[]>([]);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingActivityText, setEditingActivityText] = useState('');
  
  const timelineRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, "");
    if (!rawValue) rawValue = "0";
    const numericValue = Number(rawValue) / 100;
    setFormData({ ...formData, value: numericValue });
  };

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setFormData({
      name: customer.name,
      email: customer.email,
      company: customer.company,
      value: customer.value,
      phone: customer.phone,
      status: customer.status,
      notes: customer.notes || '',
      priority: customer.priority,
      newActivity: '',
      activityType: 'note',
      cpfCnpj: customer.cpfCnpj || '',
      website: customer.website || '',
      industry: customer.industry || 'Tecnologia',
      leadSource: customer.leadSource || 'Indicação',
      cep: customer.address?.cep || '',
      street: customer.address?.street || '',
      number: customer.address?.number || '',
      city: customer.address?.city || '',
      state: customer.address?.state || ''
    });
    setActivityLog(customer.activityLog || []);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      name: '', email: '', company: '', value: 0, phone: '', 
      status: 'Lead', notes: '', priority: 'Média', newActivity: '', activityType: 'note',
      cpfCnpj: '', website: '', industry: 'Tecnologia', leadSource: 'Indicação',
      cep: '', street: '', number: '', city: '', state: ''
    });
    setActivityLog([]);
  };

  const handleAddActivity = () => {
    if (!formData.newActivity.trim()) return;
    const newAct: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString('pt-BR'),
      text: formData.newActivity,
      type: formData.activityType
    };
    setActivityLog([newAct, ...activityLog]);
    setFormData({ ...formData, newActivity: '' });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email) {
      onToast("Nome e E-mail são obrigatórios.", "info");
      return;
    }

    setLoading(true);
    
    const customerData: Customer = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      status: formData.status as any,
      value: formData.value,
      lastContact: new Date().toISOString().split('T')[0],
      phone: formData.phone,
      notes: formData.notes,
      priority: formData.priority as any,
      activityLog: activityLog,
      cpfCnpj: formData.cpfCnpj,
      website: formData.website,
      industry: formData.industry,
      leadSource: formData.leadSource,
      address: {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        city: formData.city,
        state: formData.state
      }
    };
    
    setTimeout(() => {
      if (editingId) onUpdate(customerData);
      else onAdd(customerData);
      setShowModal(false);
      setLoading(false);
      resetForm();
    }, 400);
  };

  const getActivityConfig = (type: Activity['type']) => {
    switch(type) {
      case 'call': return { icon: '📞', label: 'Ligação', color: 'bg-orange-500', lightColor: 'bg-orange-50 text-orange-600' };
      case 'email': return { icon: '📧', label: 'E-mail', color: 'bg-indigo-500', lightColor: 'bg-indigo-50 text-indigo-600' };
      default: return { icon: '📝', label: 'Nota', color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600' };
    }
  };

  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(lowerTerm) || c.company.toLowerCase().includes(lowerTerm));
    }
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    return result;
  }, [customers, searchTerm, statusFilter]);

  return (
    <div className="p-4 transition-all">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tight uppercase">Base de <span className="text-blue-600">Clientes</span></h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestão inteligente de relacionamento</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
          + NOVO CLIENTE
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 mb-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Pesquisar..." 
          className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none dark:text-white font-bold text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none text-[10px] font-black uppercase text-slate-500">
          <option value="all">TODOS STATUS</option>
          <option value="Ativo">ATIVOS</option>
          <option value="Lead">LEADS</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Contrato</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredCustomers.map((c) => (
              <tr key={c.id} onClick={() => handleEdit(c)} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors group">
                <td className="px-8 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">{c.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">{c.email}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-600 dark:text-slate-400">{c.company}</p>
                  <span className={`text-[8px] font-black uppercase ${c.status === 'Ativo' ? 'text-emerald-500' : 'text-blue-500'}`}>{c.status}</span>
                </td>
                <td className="px-8 py-6 text-right font-black text-slate-800 dark:text-slate-100">{formatCurrency(c.value)}</td>
                <td className="px-8 py-6 text-right" onClick={e => e.stopPropagation()}>
                   <button onClick={() => onDelete(c.id)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-950 w-full max-w-[90rem] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[92vh] border border-white/10 animate-in zoom-in-95 duration-300">
            
            {/* LADO ESQUERDO: FORMULÁRIO COMPLETO */}
            <div className="w-full md:w-[45%] p-10 md:p-14 border-r border-slate-100 dark:border-slate-800 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase">Dados <span className="text-blue-600">Completos</span></h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Todos os registros necessários para o perfil</p>
                </div>
                {/* BOTÃO DE FECHAR (X) EM EVIDÊNCIA */}
                <button 
                  onClick={() => setShowModal(false)} 
                  className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center text-xl font-black border-2 border-red-100 dark:border-red-800/50 hover:scale-110 active:scale-95 group"
                  title="Fechar Janela"
                >
                  <span className="group-hover:rotate-90 transition-transform duration-300">✕</span>
                </button>
              </div>

              <form className="space-y-10 pb-10">
                {/* Seção 1: Identificação Básica */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-blue-500">👤</span>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Identificação Básica</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Nome Completo</label>
                      <input placeholder="seu nome completo" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">CPF / CNPJ</label>
                      <input placeholder="000.000.000-00" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.cpfCnpj} onChange={e => setFormData({...formData, cpfCnpj: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">E-mail Corporativo</label>
                      <input className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Telefone / WhatsApp</label>
                      <input placeholder="(11) 99999-9999" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Seção 2: Dados Profissionais e Financeiros */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-emerald-500">💼</span>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profissional & Financeiro</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Empresa</label>
                      <input className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Website</label>
                      <input placeholder="www.empresa.com" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Setor / Indústria</label>
                      <select className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                        <option>Tecnologia</option>
                        <option>Varejo</option>
                        <option>Saúde</option>
                        <option>Educação</option>
                        <option>Indústria</option>
                        <option>Serviços</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Valor Contrato (R$)</label>
                      <input type="text" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-emerald-500 font-black text-sm shadow-sm" value={new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(formData.value)} onChange={handleValueChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Origem do Lead</label>
                      <select className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.leadSource} onChange={e => setFormData({...formData, leadSource: e.target.value})}>
                        <option>Indicação</option>
                        <option>LinkedIn</option>
                        <option>Google Ads</option>
                        <option>Outbound</option>
                        <option>Redes Sociais</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Status</label>
                      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {['Lead', 'Ativo'].map(s => (
                          <button key={s} type="button" onClick={() => setFormData({...formData, status: s as any})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.status === s ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>{s}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção 3: Localização */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-orange-500">📍</span>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Localização</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">CEP</label>
                      <input placeholder="00000-000" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Cidade / Estado</label>
                      <input placeholder="Ex: São Paulo, SP" className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={`${formData.city}, ${formData.state}`} onChange={e => {
                        const [city, state] = e.target.value.split(',').map(s => s.trim());
                        setFormData({...formData, city: city || '', state: state || ''});
                      }} />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Endereço Completo</label>
                      <input placeholder="Rua, Número, Complemento..." className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl dark:text-white outline-none focus:ring-2 ring-blue-500 font-bold text-sm shadow-sm" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="button" onClick={() => handleSubmit()} disabled={loading} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                    {loading ? 'Salvando...' : '✓ Confirmar Cadastro'}
                  </button>
                </div>
              </form>
            </div>

            {/* LADO DIREITO: INTERAÇÕES E HISTÓRICO */}
            <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/30 p-10 md:p-14 flex flex-col overflow-hidden">
               <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                 <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Timeline de <span className="text-blue-600">Interações</span></h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Registro cronológico de pontos de contato</p>
                 </div>
                 
                 <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800">
                   {(['note', 'call', 'email'] as Activity['type'][]).map(t => {
                     const config = getActivityConfig(t);
                     const active = formData.activityType === t;
                     return (
                       <button key={t} type="button" onClick={() => setFormData({...formData, activityType: t})} className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${active ? `${config.color} text-white shadow-lg scale-105` : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                         <span className="text-lg">{config.icon}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
                       </button>
                     );
                   })}
                 </div>
               </div>

               {/* ÁREA DE NOTAS ESTRATÉGICAS */}
               <div className="mb-10">
                 <div className="bg-white dark:bg-slate-900/80 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative group">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Notas Estratégicas e Perfil de Comportamento</p>
                   <textarea placeholder="Dores do cliente, metas de longo prazo, perfil de tomada de decisão..." className="w-full h-32 bg-transparent outline-none dark:text-white font-medium text-base resize-none leading-relaxed" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                 </div>
               </div>

               {/* TIMELINE */}
               <div className="flex-1 flex flex-col min-h-0">
                  <div ref={timelineRef} className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
                    {activityLog.length > 0 ? activityLog.map((log) => {
                      const config = getActivityConfig(log.type);
                      return (
                        <div key={log.id} className="relative pl-14 group">
                          <div className={`absolute left-0 top-1 w-10 h-10 rounded-2xl ${config.color} flex items-center justify-center text-lg shadow-xl z-10`}>{config.icon}</div>
                          <div className="absolute left-5 top-11 bottom-[-32px] w-0.5 bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>
                          <div className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 group-hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.lightColor}`}>{config.label}</span>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.date}</p>
                            </div>
                            <p className="text-base font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">{log.text}</p>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 italic">
                        <div className="text-7xl mb-6 grayscale">📜</div>
                        <p className="text-sm font-black uppercase tracking-widest">Nenhum registro encontrado</p>
                      </div>
                    )}
                  </div>

                  {/* INPUT RÁPIDO */}
                  <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <input type="text" placeholder={`Registrar ${getActivityConfig(formData.activityType).label.toLowerCase()} agora...`} className="flex-1 bg-transparent py-4 dark:text-white font-bold text-lg outline-none px-6" value={formData.newActivity} onChange={e => setFormData({...formData, newActivity: e.target.value})} onKeyPress={e => e.key === 'Enter' && handleAddActivity()} />
                      <button onClick={handleAddActivity} className="bg-blue-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.03] transition-all">REGISTRAR</button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
