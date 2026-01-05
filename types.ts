
export interface Activity {
  id: string;
  date: string;
  text: string;
  type: 'note' | 'status' | 'call' | 'email';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Ativo' | 'Lead' | 'Inativo';
  value: number;
  lastContact: string;
  phone: string;
  notes: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  activityLog?: Activity[];
  // Novos Campos
  cpfCnpj?: string;
  website?: string;
  industry?: string;
  leadSource?: string;
  address?: {
    cep?: string;
    street?: string;
    number?: string;
    city?: string;
    state?: string;
  };
}

export interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  totalRevenue: number;
  avgConversionRate: number;
}

export type ViewType = 'dashboard' | 'customers' | 'analytics' | 'settings' | 'profile';
