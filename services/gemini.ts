
import { Customer } from "../types";

export const analyzeCustomerBase = async (customers: Customer[]) => {
  // Simulação de análise enquanto a API do Google AI não está configurada
  const totalValue = customers.reduce((sum, c) => sum + c.value, 0);
  const activeCustomers = customers.filter(c => c.status === 'Ativo').length;
  const leads = customers.filter(c => c.status === 'Lead').length;
  
  return `
## 📊 Análise da Base de Clientes

### Visão Geral
- **Valor Total**: R$ ${totalValue.toLocaleString('pt-BR')}
- **Clientes Ativos**: ${activeCustomers}
- **Leads**: ${leads}

### Insights Estratégicos
- **Oportunidade**: ${leads > 0 ? 'Focar na conversão de leads para aumentar receita' : 'Buscar novos leads qualificados'}
- **Retenção**: ${activeCustomers > 0 ? 'Manter relacionamento com clientes ativos' : 'Reativar clientes inativos'}
- **Potencial**: Concentrar esforços nos clientes de maior valor

### Recomendações
1. Implementar follow-up sistemático para leads
2. Criar programa de fidelidade para clientes ativos
3. Analisar padrões de compra para cross-selling
  `;
};

export const generateCustomerAdvice = async (customer: Customer) => {
  // Simulação de recomendações personalizadas
  const advice = customer.status === 'Ativo' 
    ? `Manter contato frequente com ${customer.name}. Considerar upgrade de serviços baseado no valor atual de R$ ${customer.value.toLocaleString('pt-BR')}.`
    : customer.status === 'Lead'
    ? `Priorizar ${customer.name} - lead com potencial de R$ ${customer.value.toLocaleString('pt-BR')}. Agendar reunião de demonstração.`
    : `Tentar reativar ${customer.name}. Último contato em ${customer.lastContact}. Oferecer condições especiais.`;

  return advice;
};
