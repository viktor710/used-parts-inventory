import { getServerSession } from 'next-auth';
import { UserRole } from '@/types';

// Конфигурация NextAuth (дублируем здесь для избежания циклических импортов)
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};

/**
 * Получение сессии пользователя на сервере
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Получение текущего пользователя на сервере
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Проверка, аутентифицирован ли пользователь
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Проверка роли пользователя
 */
export async function hasRole(requiredRole: UserRole) {
  const user = await getCurrentUser();
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    MANAGER: 2,
    ADMIN: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Проверка, является ли пользователь администратором
 */
export async function isAdmin() {
  return await hasRole('ADMIN');
}

/**
 * Проверка, является ли пользователь менеджером или выше
 */
export async function isManagerOrHigher() {
  return await hasRole('MANAGER');
}

/**
 * Проверка, является ли пользователь обычным пользователем или выше
 */
export async function isUserOrHigher() {
  return await hasRole('USER');
}

/**
 * Получение минимальной роли для операции
 */
export function getRequiredRole(operation: string): UserRole {
  const roleRequirements: Record<string, UserRole> = {
    // Чтение данных
    'read:cars': 'USER',
    'read:parts': 'USER',
    'read:customers': 'USER',
    'read:suppliers': 'USER',
    'read:sales': 'USER',
    'read:stats': 'USER',
    
    // Создание и редактирование
    'create:cars': 'MANAGER',
    'update:cars': 'MANAGER',
    'delete:cars': 'ADMIN',
    
    'create:parts': 'MANAGER',
    'update:parts': 'MANAGER',
    'delete:parts': 'ADMIN',
    
    'create:customers': 'MANAGER',
    'update:customers': 'MANAGER',
    'delete:customers': 'ADMIN',
    
    'create:suppliers': 'MANAGER',
    'update:suppliers': 'MANAGER',
    'delete:suppliers': 'ADMIN',
    
    'create:sales': 'MANAGER',
    'update:sales': 'MANAGER',
    'delete:sales': 'ADMIN',
    
    // Административные операции
    'manage:users': 'ADMIN',
    'manage:system': 'ADMIN',
  };

  return roleRequirements[operation] || 'USER';
}

/**
 * Проверка прав на выполнение операции
 */
export async function canPerformOperation(operation: string): Promise<boolean> {
  const requiredRole = getRequiredRole(operation);
  return await hasRole(requiredRole);
}
