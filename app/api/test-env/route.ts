import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🔧 [DEBUG] API GET /api/test-env: Запрос получен');
  console.log('🔧 [DEBUG] API GET /api/test-env: DATABASE_URL установлена:', !!process.env['DATABASE_URL']);
  console.log('🔧 [DEBUG] API GET /api/test-env: NODE_ENV:', process.env['NODE_ENV']);
  
  if (process.env['DATABASE_URL']) {
    console.log('🔧 [DEBUG] API GET /api/test-env: DATABASE_URL начинается с:', process.env['DATABASE_URL'].substring(0, 30) + '...');
  }
  
  return NextResponse.json({
    success: true,
    data: {
      DATABASE_URL: !!process.env['DATABASE_URL'],
      NODE_ENV: process.env['NODE_ENV'],
      DATABASE_URL_PREFIX: process.env['DATABASE_URL'] ? process.env['DATABASE_URL'].substring(0, 30) + '...' : null
    }
  });
}
