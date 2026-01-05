
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { analyzeCustomerBase } from '../services/gemini';

interface AIAnalyticsProps {
  customers: Customer[];
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ customers }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getInsights = async () => {
    setLoading(true);
    try {
      const result = await analyzeCustomerBase(customers);
      setInsight(result || "Não foi possível gerar insights no momento.");
    } catch (err) {
      console.error(err);
      setInsight("Erro ao processar análise inteligente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <span className="bg-blue-400/30 text-blue-100 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
            Powered by Gemini
          </span>
          <h2 className="text-4xl font-extrabold mt-6 mb-4">Análise Estratégica com IA</h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
            Clique no botão abaixo para que nossa inteligência artificial analise seu portfólio de clientes e sugira as melhores ações para este trimestre.
          </p>
          <button
            onClick={getInsights}
            disabled={loading}
            className={`mt-8 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${
              loading 
                ? 'bg-white/20 text-white cursor-not-allowed' 
                : 'bg-white text-blue-700 hover:scale-105 shadow-xl hover:shadow-white/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
                Processando análise...
              </>
            ) : (
              <>✨ Gerar Insights Estratégicos</>
            )}
          </button>
        </div>
      </div>

      {insight && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 prose prose-slate max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <span className="text-2xl">💡</span>
            <h3 className="text-xl font-bold text-slate-800 m-0">Resultado da Análise Inteligente</h3>
          </div>
          <div className="text-slate-700 whitespace-pre-line text-lg">
            {insight}
          </div>
        </div>
      )}
      
      {!insight && !loading && (
        <div className="text-center py-20 opacity-30">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-xl font-medium">Aguardando comando para análise...</p>
        </div>
      )}
    </div>
  );
};

export default AIAnalytics;
