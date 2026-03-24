import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from './Navbar';
import { Session } from '@supabase/supabase-js';

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Слушаем изменения (если человек вышел или вошел)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  },[]);

  // Пока проверяем авторизацию, показываем загрузку
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-500">
        Проверка доступа...
      </div>
    );
  }

  // Если нет сессии (не вошел), перекидываем на логин
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Если сессия есть, показываем Navbar и саму страницу (через Outlet)
  return (
    <div className="relative min-h-screen bg-stone-50">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}