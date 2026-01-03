
import React, { useState, useEffect } from 'react';
import { Plus, X, ListTodo, Settings, Calendar, Trophy, Trash2, User as UserIcon, ChevronRight, Award, Star, Flame, LogOut, Loader2 } from 'lucide-react';
import { Goal, Category, Tab } from './types';
import { CATEGORIES } from './constants';
import { supabase } from './services/supabase';
import GoalItem from './components/GoalItem';
import StatsCard from './components/StatsCard';
import AuthScreen from './components/AuthScreen';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('metas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Pessoal');
  const [loading, setLoading] = useState(true);

  // Gerenciar sessão do Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carregar metas do Supabase quando houver sessão
  useEffect(() => {
    if (session?.user) {
      fetchGoals();
    }
  }, [session]);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGoals(data.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category as Category,
        completed: g.completed,
        createdAt: new Date(g.created_at).getTime()
      })));
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !session?.user) return;

    const { data, error } = await supabase
      .from('goals')
      .insert([
        { 
          title: newGoalTitle, 
          category: selectedCategory, 
          completed: false,
          user_id: session.user.id
        }
      ])
      .select();

    if (!error && data) {
      const newGoal: Goal = {
        id: data[0].id,
        title: data[0].title,
        category: data[0].category as Category,
        completed: data[0].completed,
        createdAt: new Date(data[0].created_at).getTime(),
      };
      setGoals([newGoal, ...goals]);
      setNewGoalTitle('');
      setShowAddModal(false);
    }
  };

  const toggleGoal = async (id: string) => {
    const goalToToggle = goals.find(g => g.id === id);
    if (!goalToToggle) return;

    const { error } = await supabase
      .from('goals')
      .update({ completed: !goalToToggle.completed })
      .eq('id', id);

    if (!error) {
      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, completed: !g.completed } : g
      ));
    }
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleLogout = async () => {
    if (confirm("Deseja realmente sair?")) {
      await supabase.auth.signOut();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onLogin={(user) => setSession({ user })} />;
  }

  const completedCount = goals.filter(g => g.completed).length;
  const historyGoals = goals.filter(g => g.completed);
  const username = session.user.user_metadata.display_name || session.user.email.split('@')[0];

  const renderMetas = () => (
    <div className="fade-in">
      <StatsCard completed={completedCount} total={goals.length} />
      <div className="flex items-center justify-between mb-4 mt-6">
        <h2 className="text-lg font-bold text-slate-800">Minhas Metas</h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
          {goals.length} total
        </span>
      </div>
      <div className="pb-20">
        {goals.length > 0 ? (
          goals.map(goal => (
            <GoalItem key={goal.id} goal={goal} onToggle={toggleGoal} onDelete={deleteGoal} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ListTodo size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 text-sm">Nada por aqui. Adicione uma meta!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistorico = () => (
    <div className="fade-in pb-20">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Concluídas</h2>
      {historyGoals.length > 0 ? (
        historyGoals.map(goal => (
          <div key={goal.id} className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-3 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-800 opacity-60 line-through">{goal.title}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{goal.category}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-20">
          <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400">Nenhum histórico disponível.</p>
        </div>
      )}
    </div>
  );

  const renderConquistas = () => (
    <div className="fade-in pb-20">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Conquistas</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${completedCount >= 1 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100 grayscale'}`}>
          <Award size={40} className="text-amber-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">Iniciante</h3>
        </div>
        <div className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${completedCount >= 5 ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 grayscale'}`}>
          <Star size={40} className="text-indigo-500 mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">Constante</h3>
        </div>
      </div>
    </div>
  );

  const renderAjustes = () => (
    <div className="fade-in pb-20">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Ajustes</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-800">{username}</p>
              <p className="text-xs text-slate-400">{session.user.email}</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between text-left group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-active:bg-rose-500 group-active:text-white transition-colors">
              <LogOut size={20} />
            </div>
            <div>
              <p className="font-medium text-slate-800">Sair</p>
              <p className="text-xs text-slate-400">Desconectar conta</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-300" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col relative">
      <header className="p-6 pt-12 flex justify-between items-center bg-slate-50 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 truncate max-w-[200px]">Olá, {username}!</h1>
          <p className="text-sm text-slate-500 font-medium">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <Trophy size={20} />
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto pb-24">
        {activeTab === 'metas' && renderMetas()}
        {activeTab === 'historico' && renderHistorico()}
        {activeTab === 'conquistas' && renderConquistas()}
        {activeTab === 'ajustes' && renderAjustes()}
      </main>

      {activeTab === 'metas' && (
        <button onClick={() => setShowAddModal(true)} className="fixed bottom-24 left-1/2 -translate-x-1/2 w-14 h-14 bg-indigo-600 rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center text-white z-50 active:scale-90 transition-transform">
          <Plus size={28} />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-slate-100 px-4 py-3 flex justify-between items-center safe-area-bottom z-50">
        <button onClick={() => setActiveTab('metas')} className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === 'metas' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <ListTodo size={22} />
          <span className="text-[10px] font-bold uppercase">Metas</span>
        </button>
        <button onClick={() => setActiveTab('historico')} className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === 'historico' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Calendar size={22} />
          <span className="text-[10px] font-bold uppercase">Histórico</span>
        </button>
        <button onClick={() => setActiveTab('conquistas')} className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === 'conquistas' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Trophy size={22} />
          <span className="text-[10px] font-bold uppercase">Conquistas</span>
        </button>
        <button onClick={() => setActiveTab('ajustes')} className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === 'ajustes' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Settings size={22} />
          <span className="text-[10px] font-bold uppercase">Ajustes</span>
        </button>
      </nav>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Nova Meta</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={addGoal}>
              <div className="mb-6">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Objetivo</label>
                <input autoFocus type="text" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} placeholder="Ex: Treino de manhã" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-slate-900 focus:border-indigo-500 transition-all outline-none" />
              </div>
              <div className="mb-8">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Categoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.name} type="button" onClick={() => setSelectedCategory(cat.name)} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${selectedCategory === cat.name ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
                      <div className="mb-1">{cat.icon}</div>
                      <span className="text-[10px] font-bold">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl text-white font-bold shadow-lg active:scale-95 transition-transform">Criar Meta</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
