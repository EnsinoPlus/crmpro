
import React, { useState } from 'react';
import { Customer, ViewType } from '../types';
import { analyzeCustomerBase, refineReportText } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIAnalyticsProps {
  customers: Customer[];
  insight: string | null;
  setInsight: (text: string | null) => void;
  onToast: (msg: string, type?: string) => void;
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ customers, insight, setInsight, onToast }) => {
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copying, setCopying] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const getInsights = async () => {
    setLoading(true);
    try {
      const result = await analyzeCustomerBase(customers);
      setInsight(result || "Não foi possível gerar insights.");
      onToast("Dossiê estratégico gerado!");
    } catch (err) {
      console.error(err);
      onToast("Erro ao processar análise.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!insight) return;
    setRefining(true);
    try {
      const refined = await refineReportText(insight, instruction);
      setInsight(refined || insight);
      onToast("Refinamento IA aplicado!");
    } catch (err) {
      console.error(err);
      onToast("Erro no refinamento assistido.", "error");
    } finally {
      setRefining(false);
    }
  };

  const downloadFile = (format: 'md' | 'txt') => {
    if (!insight) return;
    const blob = new Blob([insight], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Relatorio_Estrategico_CRM_Pro_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
    onToast(`Arquivo .${format} baixado!`);
  };

  const handlePrint = () => {
    window.print();
    setShowDownloadMenu(false);
  };

  const handleCopy = () => {
    if (!insight) return;
    navigator.clipboard.writeText(insight);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
    onToast("Copiado para área de transferência");
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8 transition-colors duration-300 print:p-0">
      {/* Header Executivo */}
      <div className="bg-slate-900 dark:bg-black rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group print:hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-none">
               Inteligência <span className="text-blue-500">Comercial</span>
             </h2>
             <p className="text-slate-400 text-base max-w-xl font-medium leading-relaxed">
               Análise preditiva e estratégica da sua carteira de clientes gerada por IA.
             </p>
          </div>
          <button
            onClick={getInsights}
            disabled={loading}
            className="shrink-0 px-10 py-5 bg-blue-600 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Processando...' : insight ? '⚡ Recalcular' : '⚡ Gerar Dossiê'}
          </button>
        </div>
      </div>

      {insight && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* Barra de Ferramentas Integrada */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-2 print:hidden">
            <div className="flex items-center gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isEditing ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Visualizar
                </button>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Editar Texto
                </button>
              </div>

              {isEditing && (
                <div className="hidden md:flex items-center gap-1.5 bg-slate-900 dark:bg-slate-800 p-1 rounded-2xl shadow-lg animate-in slide-in-from-left-4">
                  <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest ml-3 mr-1">IA:</span>
                  <button onClick={() => handleRefine("Melhore a escrita e impacto.")} disabled={refining} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase text-white transition-all disabled:opacity-50">✨ Refinar</button>
                  <button onClick={() => handleRefine("Torne o texto formal e executivo.")} disabled={refining} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase text-white transition-all disabled:opacity-50">👔 Formal</button>
                  <button onClick={() => handleRefine("Resuma os pontos em tópicos.")} disabled={refining} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-[8px] font-black uppercase text-white transition-all disabled:opacity-50">🎯 Resumir</button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleCopy} className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all" title="Copiar">
                {copying ? '✅' : '📄'}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="flex items-center gap-3 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  📥 Baixar
                </button>
                
                {showDownloadMenu && (
                  <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-[60] animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => downloadFile('md')} className="w-full text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3">
                      <span className="text-blue-500 font-bold">M↓</span> Markdown (.md)
                    </button>
                    <button onClick={() => downloadFile('txt')} className="w-full text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3">
                      <span className="text-slate-400 font-bold">TXT</span> Texto Simples (.txt)
                    </button>
                    <div className="h-px bg-slate-50 dark:bg-slate-800 my-2 mx-4"></div>
                    <button onClick={handlePrint} className="w-full text-left px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3">
                      <span className="text-emerald-500 font-bold">PDF</span> Exportar PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Janela Única de Conteúdo */}
          <div className="bg-white dark:bg-slate-950 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden relative min-h-[600px] print:rounded-none print:shadow-none print:border-none print:min-h-0">
            <div className="h-2 bg-blue-600"></div>
            
            {/* Overlay de Refinamento */}
            {refining && (
              <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-[9px] font-black text-blue-600 uppercase tracking-widest">IA Refinando Texto...</p>
              </div>
            )}

            <div className="p-10 md:p-20 relative">
              {isEditing ? (
                <div className="animate-in fade-in duration-300">
                  <textarea 
                    value={insight} 
                    onChange={(e) => setInsight(e.target.value)}
                    className="w-full h-[700px] bg-slate-50/50 dark:bg-slate-900/50 p-10 rounded-[3rem] border-none outline-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-400 resize-none custom-scrollbar"
                    placeholder="Edite seu dossiê aqui..."
                    autoFocus
                  />
                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all"
                    >
                      ✓ Concluir Edição
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert prose-lg max-w-none 
                  prose-h1:text-4xl prose-h1:font-black prose-h1:text-slate-900 dark:prose-h1:text-white prose-h1:tracking-tighter prose-h1:mb-12
                  prose-h2:text-xl prose-h2:font-black prose-h2:text-blue-600 prose-h2:uppercase prose-h2:tracking-widest prose-h2:border-b prose-h2:border-slate-50 dark:prose-h2:border-slate-900 prose-h2:pb-4 prose-h2:mt-16
                  prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-base
                  prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
                  prose-table:w-full prose-table:my-10 prose-table:border-collapse
                  prose-thead:bg-slate-50 dark:prose-thead:bg-slate-900/50
                  prose-th:px-6 prose-th:py-4 prose-th:text-[10px] prose-th:font-black prose-th:uppercase prose-th:tracking-widest prose-th:text-slate-400
                  prose-td:px-6 prose-td:py-4 prose-td:text-sm prose-td:border-b prose-td:border-slate-50 dark:prose-td:border-slate-900
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/30 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:p-8 prose-blockquote:rounded-r-[2rem] prose-blockquote:not-italic prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300
                  prose-ul:list-disc prose-li:text-slate-600 dark:prose-li:text-slate-400
                  animate-in fade-in zoom-in-[0.98] duration-500
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {insight}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {!insight && !loading && (
        <div className="py-32 flex flex-col items-center text-center opacity-40">
           <div className="text-8xl mb-10 transform hover:rotate-12 transition-transform duration-700">🔭</div>
           <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">Aguardando Análise</h3>
           <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium mt-4 leading-loose">
             Clique em "Gerar Dossiê" para processar sua base de clientes com inteligência artificial avançada.
           </p>
        </div>
      )}

      {/* Estado de Carregamento Principal */}
      {loading && (
        <div className="py-32 flex flex-col items-center gap-8 animate-pulse">
          <div className="w-20 h-20 border-[6px] border-slate-100 dark:border-slate-900 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="text-center space-y-2">
            <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-[0.3em]">IA Processando Estratégias...</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cruzando indicadores financeiros e churn</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalytics;
