
import React, { useMemo } from 'react';
import { Customer, ViewType } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, ComposedChart, Bar, Line, Legend, BarChart
} from 'recharts';

interface DashboardProps {
  customers: Customer[];
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ customers, onNavigate }) => {
  const totalValue = customers.reduce((acc, c) => acc + c.value, 0);
  const activeCount = customers.filter(c => c.status === 'Ativo').length;
  const leadCount = customers.filter(c => c.status === 'Lead').length;
  const inactiveCount = customers.filter(c => c.status === 'Inativo').length;
  const highPriority = customers.filter(c => c.priority === 'Alta').length;
  
  // Helpers de Formatação
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      notation: 'compact',
      maximumFractionDigits: 1 
    }).format(val);

  // Inteligência de Dados
  const paretoData = useMemo(() => {
    const sorted = [...customers].sort((a, b) => b.value - a.value);
    const top20Count = Math.max(1, Math.ceil(customers.length * 0.2));
    const top20Value = sorted.slice(0, top20Count).reduce((acc, c) => acc + c.value, 0);
    const percentage = customers.length > 0 ? (top20Value / totalValue) * 100 : 0;
    return { percentage: Math.round(percentage), count: top20Count };
  }, [customers, totalValue]);

  // Fix: Definition of topRelationship which was missing and causing a compilation error
  const topRelationship = useMemo(() => {
    return [...customers]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [customers]);

  const churnRisk = useMemo(() => {
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    return customers.filter(c => 
      c.status === 'Ativo' && new Date(c.lastContact) < fortyFiveDaysAgo
    );
  }, [customers]);

  const funnelData = [
    { name: 'Leads', value: leadCount, fill: '#6366f1' },
    { name: 'Ativos', value: activeCount, fill: '#10b981' },
    { name: 'Inativos', value: inactiveCount, fill: '#f43f5e' },
  ];

  const avgEngagement = customers.length > 0 
    ? Math.round((activeCount / customers.length) * 100) 
    : 0;

  const hybridData = [
    { month: 'Jan', revenue: totalValue * 0.7, customers: Math.floor(activeCount * 0.8) },
    { month: 'Fev', revenue: totalValue * 0.75, customers: Math.floor(activeCount * 0.85) },
    { month: 'Mar', revenue: totalValue * 0.82, customers: Math.floor(activeCount * 0.9) },
    { month: 'Abr', revenue: totalValue * 0.9, customers: Math.floor(activeCount * 0.95) },
    { month: 'Mai', revenue: totalValue, customers: activeCount },
  ];

  const stats = [
    { label: 'Receita Total', value: formatCompact(totalValue), trend: '+12.5%', detail: 'vs mês ant.', icon: '💰', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ticket Médio', value: formatCompact(customers.length > 0 ? totalValue / customers.length : 0), trend: '+5.2%', detail: 'Crescimento de valor', icon: '📈', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'LTV Projetado', value: formatCompact(totalValue * 1.5), trend: '+8.1%', detail: 'Previsão 12 meses', icon: '💎', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Conversão', value: `${customers.length > 0 ? Math.round((activeCount/customers.length)*100) : 0}%`, trend: '+2.4%', detail: 'Eficiência de vendas', icon: '🎯', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header Híbrido */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic">Performance <span className="text-blue-600">360°</span></h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            Análise em tempo real de <span className="font-black text-slate-700 dark:text-slate-200">Saúde Financeira</span> e <span className="font-black text-blue-500">Retenção</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('analytics')}
            className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            ✨ Gerar Relatório Executivo
          </button>
        </div>
      </div>

      {/* KPI Grid com Tendências */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden transition-all hover:shadow-lg">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 ${stat.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                {stat.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{stat.trend}</span>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <h4 className={`text-3xl font-black ${stat.color} dark:text-white mt-1`}>{stat.value}</h4>
              <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tighter italic">{stat.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Gráficos e Inteligência */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico Principal de Crescimento */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic">Evolução de <span className="text-blue-600">Receita & Base</span></h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Correlação Mensal</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={hybridData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                <YAxis yAxisId="left" hide />
                <YAxis yAxisId="right" hide orientation="right" />
                <Tooltip 
                  formatter={(value: number, name: string) => [name.includes('Receita') ? formatCurrency(value) : value, name]}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '20px' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Receita (R$)" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="customers" name="Clientes Ativos" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widgets Laterais de Inteligência */}
        <div className="lg:col-span-4 space-y-8">
          {/* Análise de Pareto */}
          <div className="bg-slate-900 dark:bg-black p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Análise de Pareto (80/20)</h4>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-5xl font-black italic">{paretoData.percentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-tighter">da sua receita</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-medium">
              Apenas <span className="text-blue-400 font-black">{paretoData.count} clientes</span> representam {paretoData.percentage}% do seu faturamento total.
            </p>
            <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${paretoData.percentage}%` }}></div>
            </div>
          </div>

          {/* Funil de Conversão */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Saúde do Funil</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} width={60} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-black uppercase text-slate-400">
               <span>Início: {leadCount} Leads</span>
               <span className="text-emerald-500">Conversão: {avgEngagement}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Relacionamento & Churn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Clientes Estratégicos */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black italic text-slate-800 dark:text-white">🏆 Key <span className="text-blue-600">Accounts</span></h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Maiores faturamentos ativos</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {topRelationship.map((c) => (
              <div key={c.id} className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-800 dark:text-white">{c.name}</h4>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{c.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">{formatCurrency(c.value)}</p>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${c.priority === 'Alta' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    Prioridade {c.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerta de Churn & Ação */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
           {churnRisk.length > 0 && (
             <div className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl animate-pulse">
               Atenção Crítica
             </div>
           )}
           <div className="mb-8">
              <h3 className="text-xl font-black text-slate-800 dark:text-white italic">Radar de <span className="text-red-500">Churn</span></h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Clientes Ativos Sem Contato (+45 dias)</p>
           </div>
           
           <div className="space-y-4">
              {churnRisk.length > 0 ? churnRisk.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-[2rem] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-lg shadow-sm">
                    ⚠️
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[11px] font-black text-slate-800 dark:text-white uppercase truncate">{item.name}</h5>
                    <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter">Último contato: {item.lastContact}</p>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Saudável. Nenhum cliente em risco imediato.</p>
                </div>
              )}
           </div>

           {churnRisk.length > 0 && (
             <button 
              onClick={() => onNavigate('customers')}
              className="w-full mt-6 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
             >
               Ver Todos os Riscos
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
