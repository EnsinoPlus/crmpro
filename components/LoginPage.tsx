
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [isRegistering]);

  const generateTestCustomers = (count: number = 25): Customer[] => {
    const firstNames = ["Gabriel", "Ana", "Lucas", "Julia", "Matheus", "Beatriz", "Pedro", "Larissa", "Thiago", "Camila", "Rodrigo", "Fernanda", "Bruno", "Isabela", "Vinícius", "Mariana"];
    const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Almeida", "Pereira", "Costa", "Carvalho"];
    const companies = ["TechNexus", "BioLogic", "Vanguarda Digital", "Global Log", "EcoMinds", "SkyLine Group", "Prime Solutions", "Innova Soft", "Delta Services"];
    const industries = ["Tecnologia", "Varejo", "Saúde", "Educação", "Indústria", "Serviços"];
    const sources = ["LinkedIn", "Indicação", "Google Ads", "Outbound", "Redes Sociais"];
    const cities = [["São Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"], ["Porto Alegre", "RS"], ["Salvador", "BA"]];
    
    return Array.from({ length: count }, (_, i) => {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const location = cities[Math.floor(Math.random() * cities.length)];
      const status = Math.random() > 0.4 ? 'Ativo' : 'Lead';
      
      // Data de contato aleatória nos últimos 60 dias
      const lastContactDate = new Date();
      lastContactDate.setDate(lastContactDate.getDate() - Math.floor(Math.random() * 60));

      return {
        id: `gen_${Math.random().toString(36).substr(2, 9)}`,
        name: `${fName} ${lName}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@${company.toLowerCase().replace(' ', '')}.com.br`,
        company: `${company} ${['S.A', 'LTDA', 'ME', 'Group'][Math.floor(Math.random() * 4)]}`,
        status: status,
        value: Math.floor(Math.random() * 85000) + 1200,
        lastContact: lastContactDate.toISOString().split('T')[0],
        phone: `(${Math.floor(11 + Math.random() * 88)}) 9${Math.floor(7000 + Math.random() * 2999)}-${Math.floor(1000 + Math.random() * 8999)}`,
        notes: "Cliente gerado automaticamente para análise de performance e testes de interface.",
        priority: Math.random() > 0.7 ? 'Alta' : Math.random() > 0.4 ? 'Média' : 'Baixa',
        cpfCnpj: `${Math.floor(10 + Math.random() * 89)}.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-${Math.floor(10 + Math.random() * 89)}`,
        website: `www.${company.toLowerCase().replace(' ', '')}.com.br`,
        industry: industries[Math.floor(Math.random() * industries.length)],
        leadSource: sources[Math.floor(Math.random() * sources.length)],
        address: { 
          cep: `${Math.floor(10000 + Math.random() * 80000)}-000`, 
          street: 'Logradouro de Teste', 
          city: location[0], 
          state: location[1] 
        },
        activityLog: [
          { 
            id: 'act_1', 
            date: lastContactDate.toLocaleString('pt-BR'), 
            text: 'Registro inicial do cliente no ecossistema CRM Pro.', 
            type: 'note' 
          }
        ]
      };
    });
  };

  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    
    if (!email || !password || (isRegistering && (!name || !confirmPassword))) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('crm_registered_users') || '{}');
      
      // Caso especial para o e-mail solicitado: almiritchelly@gmail.com
      if (email === 'almiritchelly@gmail.com' && !isRegistering) {
        if (!users[email]) {
          const specialUser = { 
            id: 'u_special_001', 
            name: 'Almir Itchelly', 
            email, 
            password: btoa(password), 
            avatar: `https://ui-avatars.com/api/?name=Almir+Itchelly&background=2563eb&color=fff`, 
            remember: rememberMe 
          };
          users[email] = specialUser;
          localStorage.setItem('crm_registered_users', JSON.stringify(users));
        }

        const userKey = `crm_data_${btoa(email)}`;
        if (!localStorage.getItem(userKey)) {
          localStorage.setItem(userKey, JSON.stringify(generateTestCustomers(50)));
        }
      }

      if (isRegistering) {
        if (users[email]) {
          setError('Este e-mail já está cadastrado.');
          setIsLoading(false);
          return;
        }
        const newUser = { id: 'u_' + Math.random().toString(36).substr(2, 9), name, email, password: btoa(password), avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`, remember: rememberMe };
        users[email] = newUser;
        localStorage.setItem('crm_registered_users', JSON.stringify(users));
        onLogin(newUser);
      } else {
        const user = users[email];
        if (!user || (email !== 'almiritchelly@gmail.com' && user.password !== btoa(password))) {
          setError('E-mail ou senha incorretos.');
          setIsLoading(false);
          return;
        }
        onLogin({ ...user, remember: rememberMe });
      }
    }, 1200);
  };

  const handleQuickAdminAccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      const adminData = { id: 'adm_001', name: 'Administrador Master', email: 'admin@crmpro.com', avatar: 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff', remember: true };
      const adminKey = `crm_data_${btoa(adminData.email)}`;
      localStorage.setItem(adminKey, JSON.stringify(generateTestCustomers(25)));
      onLogin(adminData);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-2xl mb-6 text-white text-4xl font-black italic transform -rotate-6">C</div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">CRM <span className="text-blue-500">PRO</span></h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Inteligência Comercial de Elite</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl relative border border-white/5">
          {isLoading && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-30 flex flex-col items-center justify-center rounded-[3rem] animate-pulse">
              <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Sincronizando Base de Dados...</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{isRegistering ? 'Cadastro' : 'Acesso'}</h2>
            {!isRegistering && (
              <button onClick={handleQuickAdminAccess} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition-all">
                ⚡ Demo Admin
              </button>
            )}
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase text-center border border-red-100 dark:border-red-900/30">{error}</div>}
            
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Nome Completo</label>
                <input required type="text" placeholder="seu nome completo" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white outline-none font-bold text-sm border border-transparent focus:border-blue-500 transition-all" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-4">E-mail</label>
              <input required type="email" placeholder="exemplo@email.com" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white outline-none font-bold text-sm border border-transparent focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Senha</label>
              <input required type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white outline-none font-bold text-sm border border-transparent focus:border-blue-500 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {isRegistering && (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Confirmar Senha</label>
                <input required type="password" placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl dark:text-white outline-none font-bold text-sm border border-transparent focus:border-blue-500 transition-all" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            )}

            <div className="flex items-center gap-3 px-2 py-2">
              <button type="button" onClick={() => setRememberMe(!rememberMe)} className={`w-10 h-5 rounded-full relative transition-colors ${rememberMe ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${rememberMe ? 'left-6' : 'left-1'}`}></div>
              </button>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manter conectado</span>
            </div>

            <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4">
              {isRegistering ? 'Finalizar Cadastro' : 'Entrar no Sistema'}
            </button>

            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="w-full text-slate-400 hover:text-blue-600 text-[10px] font-black uppercase tracking-widest pt-4 transition-colors">
              {isRegistering ? 'Já possuo uma conta' : 'Criar Nova Conta'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-8">© 2024 CRM PRO - TECNOLOGIA PARA CRESCIMENTO EXPOENCIAL</p>
      </div>
    </div>
  );
};

export default LoginPage;
