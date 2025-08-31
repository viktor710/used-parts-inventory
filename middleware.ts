import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Logger } from '@/lib/logger';

// Простой rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 минут
const RATE_LIMIT_MAX = 100; // максимум 100 запросов

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

  // Применяем rate limiting только к API маршрутам
  if (path.startsWith('/api/')) {
    const now = Date.now();
    
    const rateLimit = rateLimitMap.get(ip);
    
    if (!rateLimit || now > rateLimit.resetTime) {
      // Создаем новый rate limit
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW
      });
    } else {
      // Увеличиваем счетчик
      rateLimit.count++;
      
      if (rateLimit.count > RATE_LIMIT_MAX) {
        const duration = Date.now() - startTime;
        Logger.warn(`Rate limit exceeded for IP: ${ip}`, {
          ip,
          count: rateLimit.count,
          limit: RATE_LIMIT_MAX,
          duration
        });

        return NextResponse.json(
          { success: false, error: 'Слишком много запросов' },
          { status: 429 }
        );
      }
    }
  }

  // Продолжаем обработку запроса
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
