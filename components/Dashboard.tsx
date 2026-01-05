
import React from 'react';
import { Customer, ViewType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  customers: Customer[];
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ customers, onNavigate }) => {
  const totalValue = customers.reduce((acc, c) => acc + c.value, 0);
  const activeCount = customers.filter(c => c.status === 'Ativo').length;
  const leadCount = customers.filter(c => c.status === 'Lead').length;

  const chartData = [
    { name: 'Ativos', value: activeCount, color: '#10b981' },
    { name: 'Leads', value: leadCount, color: '#f59e0b' },
    { name: 'Inativos', value: customers.length - activeCount - leadCount, color: '#ef4444' },
  ];

  const revenueData = customers.slice(0, 5).map(c => ({
    name: c.name,
    valor: c.value
  }));

  const stats = [
    { label: 'Total de Clientes', value: customers.length, color: 'text-blue-600', bg: 'hover:bg-blue-50', icon: '👥', view: 'customers' as ViewType },
    { label: 'Valor da Carteira', value: `R$ ${totalValue.toLocaleString()}`, color: 'text-emerald-600', bg: 'hover:bg-emerald-50', icon: '💰', view: 'analytics' as ViewType },
    { label: 'Clientes Ativos', value: activeCount, color: 'text-indigo-600', bg: 'hover:bg-indigo-50', icon: '✅', view: 'customers' as ViewType },
    { label: 'Novos Leads', value: leadCount, color: 'text-orange-600', bg: 'hover:bg-orange-50', icon: '🔥', view: 'customers' as ViewType },
  ];

  return (
    <div className="p-4">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-800">Visão Geral</h2>
        <p className="text-slate-500 font-medium">Insights rápidos sobre sua base estratégica.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.view)}
            className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all duration-300 text-left group hover:-translate-y-1 hover:shadow-xl ${stat.bg}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-slate-300 group-hover:text-slate-400 transition-colors">→</span>
            </div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800">Distribuição de Status</h3>
            <button onClick={() => onNavigate('analytics')} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Ver IA</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {chartData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800">Top Clientes por Valor</h3>
            <button onClick={() => onNavigate('customers')} className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest">Ver Todos</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="valor" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
