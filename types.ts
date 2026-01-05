
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
}

export interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  totalRevenue: number;
  avgConversionRate: number;
}

export type ViewType = 'dashboard' | 'customers' | 'analytics' | 'settings';
