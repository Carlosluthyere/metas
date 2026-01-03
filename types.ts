
export type Category = 'Saúde' | 'Trabalho' | 'Pessoal' | 'Estudos' | 'Finanças';
export type Tab = 'metas' | 'historico' | 'conquistas' | 'ajustes';

export interface Goal {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

export interface User {
  username: string;
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
}
