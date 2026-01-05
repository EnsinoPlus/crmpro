
import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerListProps {
  customers: Customer[];
  onDelete: (id: string) => void;
  onAdd: (customer: Customer) => void;
  onToast: (msg: string, type?: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onDelete, onAdd, onToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', value: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      company: formData.company,
      status: 'Lead',
      value: Number(formData.value),
      lastContact: new Date().toISOString().split('T')[0],
      phone: '',
      notes: ''
    };
    onAdd(newCustomer);
    setShowModal(false);
    setFormData({ name: '', email: '', company: '', value: '' });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Base de Clientes</h2>
          <p className="text-slate-500 font-medium">Total de {customers.length} registros encontrados.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onToast("Relatório PDF sendo gerado...", "info")} className="bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-2xl hover:bg-slate-50 transition font-bold text-sm shadow-sm">
            Exportar
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-200 font-black text-sm"
          >
            <span>+</span> NOVO CLIENTE
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empresa</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-600">{c.company}</td>
                <td className="px-8 py-5">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    c.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' :
                    c.status === 'Lead' ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-black text-slate-800">R$ {c.value.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onToast(`Abrindo editor para ${c.name}`, "info")} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Editar">✏️</button>
                    <button 
                      onClick={() => { if(window.confirm(`Deseja remover ${c.name} permanentemente?`)) onDelete(c.id) }}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Novo Cliente</h3>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">CRM Corporativo</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 transition text-2xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome Completo</label>
                  <input required type="text" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700" 
                         value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">E-mail</label>
                    <input required type="email" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 text-xs" 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Empresa</label>
                    <input required type="text" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-700 text-xs" 
                           value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valor Estimado (R$)</label>
                  <input required type="number" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-blue-600 text-lg" 
                         value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm hover:bg-blue-700 shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95 uppercase tracking-widest">
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
