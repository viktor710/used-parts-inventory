import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Logger } from '@/lib/logger';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const ip = request.ip || 'unknown';

  // Логируем начало запроса
  Logger.info(`API Request started: ${method} ${path}`, {
    ip,
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer')
  });

  // Продолжаем обработку запроса (rate limiting отключен)
  const response = NextResponse.next();
  
  // Логируем завершение запроса
  const duration = Date.now() - startTime;
  Logger.api(method, path, response.status, duration, {
    ip,
    userAgent: request.headers.get('user-agent')
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
