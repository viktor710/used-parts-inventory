'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'USER',
  fallback 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (requiredRole !== 'USER') {
      const roleHierarchy: Record<UserRole, number> = {
        USER: 1,
        MANAGER: 2,
        ADMIN: 3,
      };

      if (roleHierarchy[session.user.role] < roleHierarchy[requiredRole]) {
        router.push('/');
        return;
      }
    }
  }, [session, status, requiredRole, router]);

  // Показываем загрузку
  if (status === 'loading') {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Проверяем аутентификацию
  if (!session) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Требуется авторизация
          </h2>
          <p className="text-gray-600 mb-4">
            Для доступа к этой странице необходимо войти в систему
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Войти в систему
          </button>
        </div>
      </div>
    );
  }

  // Проверяем роль
  if (requiredRole !== 'USER') {
    const roleHierarchy: Record<UserRole, number> = {
      USER: 1,
      MANAGER: 2,
      ADMIN: 3,
    };

    if (roleHierarchy[session.user.role] < roleHierarchy[requiredRole]) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Недостаточно прав
            </h2>
            <p className="text-gray-600 mb-4">
              Для доступа к этой странице требуется роль {requiredRole} или выше
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Ваша роль: {session.user.role}
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
