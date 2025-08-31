import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const ip = request.ip || 'unknown';

  // Логируем начало запроса (простое логирование)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔧 [MIDDLEWARE] ${method} ${path} - IP: ${ip}`);
  }

  // Продолжаем обработку запроса
  const response = NextResponse.next();
  
  // Логируем завершение запроса
  const duration = Date.now() - startTime;
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔧 [MIDDLEWARE] ${method} ${path} - ${response.status} - ${duration}ms`);
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
