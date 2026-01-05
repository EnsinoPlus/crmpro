
import { GoogleGenAI, Type } from "@google/genai";
import { Customer } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

export const analyzeCustomerBase = async (customers: Customer[]) => {
  const customerSummary = customers.map(c => ({
    name: c.name,
    status: c.status,
    value: c.value,
    company: c.company,
    industry: c.industry,
    priority: c.priority,
    lastContact: c.lastContact
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analise estrategicamente esta base: ${JSON.stringify(customerSummary)}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        systemInstruction: `Você é um Consultor de Estratégia Sênior. 
        Sua tarefa é gerar um "Dossiê de Crescimento" extremamente limpo e profissional.
        
        IMPORTANTE: 
        1. Se usar tabelas, certifique-se de que a sintaxe Markdown esteja perfeita (use | e - corretamente).
        2. Não use caracteres de preenchimento ou "pontinhos" para alinhar texto manualmente.
        3. Use títulos claros (H1 e H2) para separar os assuntos.
        4. O relatório deve parecer um documento oficial impresso.
        5. Remova qualquer menção a códigos ou sintaxes técnicas no corpo do texto.

        ESTRUTURA:
        - # 📊 RELATÓRIO EXECUTIVO DE PERFORMANCE
        - ## Panorama Financeiro (Tabela com Colunas: Segmento | Volume R$ | Status)
        - ## Análise de Oportunidades (Lista numerada com foco em ROI)
        - ## Radar de Retenção (Tabela com Colunas: Cliente | Último Contato | Nível de Risco)
        - > **INSIGHT DO CONSULTOR:** Uma frase de impacto final sem traços ou pontos extras.
        
        Linguagem: Português Brasileiro formal e persuasivo.`,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro na análise da Gemini:", error);
    throw error;
  }
};

export const refineReportText = async (currentText: string, instruction: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Texto atual: "${currentText}". Instrução: ${instruction}`,
      config: {
        systemInstruction: `Você é um editor de textos executivos de alta performance. 
        Sua tarefa é reescrever ou ajustar o texto fornecido seguindo estritamente a instrução do usuário.
        Mantenha a formatação Markdown se ela existir. 
        Retorne apenas o texto refinado, sem comentários adicionais.
        Linguagem: Português Brasileiro formal.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro no refinamento:", error);
    return currentText;
  }
};

export const generateCustomerAdvice = async (customer: Customer) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Conselho estratégico para o cliente: ${JSON.stringify(customer)}`,
    config: {
      systemInstruction: "Você é um mentor de vendas. Dê 3 dicas práticas de negociação sem usar caracteres especiais desnecessários.",
    }
  });

  return response.text;
};
