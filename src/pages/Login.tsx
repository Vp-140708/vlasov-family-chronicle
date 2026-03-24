import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Неверный логин или пароль. Попробуйте снова.');
      setLoading(false);
    } else {
      // Если всё ок, отправляем на главную
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Хроника Рода</h1>
          <p className="text-stone-500">Доступ только для членов семьи</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email (выданный хранителем)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all"
              placeholder="family@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium hover:bg-stone-900 transition-colors disabled:opacity-70"
          >
            {loading ? 'Вход...' : 'Войти в семейный портал'}
          </button>
        </form>
      </div>
    </div>
  );
}