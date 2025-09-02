import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const ip = request.ip || 'unknown';

  // Логируем начало запроса
  if (process.env['NODE_ENV'] === 'development') {
    console.log(`🔧 [MIDDLEWARE] ${method} ${path} - IP: ${ip}`);
  }

  // Пропускаем аутентификационные роуты
  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

      // Проверяем аутентификацию для защищенных API роутов
    if (path.startsWith('/api/')) {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
      });

    if (!token) {
      console.log(`🚫 [MIDDLEWARE] Неавторизованный доступ к ${path}`);
      return NextResponse.json(
        { success: false, error: 'Требуется аутентификация' },
        { status: 401 }
      );
    }

    // Проверяем права на операции
    const userRole = token.role as string;
    
    // Операции удаления требуют роль ADMIN
    if (method === 'DELETE' && userRole !== 'ADMIN') {
      console.log(`🚫 [MIDDLEWARE] Недостаточно прав для удаления: ${path}, роль: ${userRole}`);
      return NextResponse.json(
        { success: false, error: 'Недостаточно прав для выполнения операции' },
        { status: 403 }
      );
    }

    // Операции создания и обновления требуют роль MANAGER или выше
    if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && 
        !['MANAGER', 'ADMIN'].includes(userRole)) {
      console.log(`🚫 [MIDDLEWARE] Недостаточно прав для изменения: ${path}, роль: ${userRole}`);
      return NextResponse.json(
        { success: false, error: 'Недостаточно прав для выполнения операции' },
        { status: 403 }
      );
    }
  }

  // Продолжаем обработку запроса
  const response = NextResponse.next();
  
  // Логируем завершение запроса
  const duration = Date.now() - startTime;
  if (process.env['NODE_ENV'] === 'development') {
    console.log(`🔧 [MIDDLEWARE] ${method} ${path} - ${response.status} - ${duration}ms`);
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
