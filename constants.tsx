
import React from 'react';
import { Heart, Briefcase, User, BookOpen, CreditCard } from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: { name: Category; color: string; icon: React.ReactNode }[] = [
  { name: 'Saúde', color: 'bg-rose-100 text-rose-600', icon: <Heart size={18} /> },
  { name: 'Trabalho', color: 'bg-blue-100 text-blue-600', icon: <Briefcase size={18} /> },
  { name: 'Pessoal', color: 'bg-purple-100 text-purple-600', icon: <User size={18} /> },
  { name: 'Estudos', color: 'bg-amber-100 text-amber-600', icon: <BookOpen size={18} /> },
  { name: 'Finanças', color: 'bg-emerald-100 text-emerald-600', icon: <CreditCard size={18} /> },
];

export const STORAGE_KEY = 'focodiario_goals';
export const USER_STORAGE_KEY = 'focodiario_user';
