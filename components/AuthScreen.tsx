
import React, { useState } from 'react';
import { User as UserIcon, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthScreenProps {
  onLogin: (user: any) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Supabase Auth requer um e-mail. Criamos um fake baseado no username.
    const email = `${username.trim().toLowerCase().replace(/\s+/g, '')}@focodiario.com`;

    try {
      // Tenta login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Se falhar e for erro de credenciais inválidas ou usuário não encontrado, tenta cadastrar
        if (signInError.message.includes("Invalid login credentials") || signInError.status === 400) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { display_name: username }
            }
          });

          if (signUpError) throw signUpError;
          if (signUpData.user) onLogin(signUpData.user);
        } else {
          throw signInError;
        }
      } else {
        if (signInData.user) onLogin(signInData.user);
      }
    } catch (err: any) {
      setError(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 fade-in">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">FocoDiário</h1>
          <p className="text-slate-500 mt-2 text-center">Organize suas metas com Supabase Cloud.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Entrar ou Criar Conta</h2>
          
          {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Usuário</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nome de usuário"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl mt-8 shadow-lg shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Acessar App'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
