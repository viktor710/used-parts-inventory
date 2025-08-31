/**
 * Скрипт для исправления критических проблем в проекте
 * Запуск: node scripts/fix-critical-issues.js
 */

const fs = require('fs');
const path = require('path');

// Файлы с отладочными логами
const filesWithDebugLogs = [
  'app/parts/page.tsx',
  'app/cars/page.tsx',
  'hooks/useStats.ts',
  'components/layout/Sidebar.tsx',
  'utils/cn.ts',
  'components/ui/AutocompleteOptimized.tsx',
  'components/ui/ImageUpload.tsx',
  'components/ui/ImageGallery.tsx',
  'components/ui/PartImage.tsx',
  'app/page.tsx',
  'app/cars/new/page.tsx',
  'app/parts/new/page.tsx'
];

// Файлы API для добавления обработки ошибок
const apiFiles = [
  'app/api/parts/route.ts',
  'app/api/cars/route.ts',
  'app/api/upload/route.ts',
  'app/api/zapchasti/search/route.ts',
  'app/api/stats/route.ts'
];

/**
 * Исправляет отладочные логи в файле
 */
function fixDebugLogs(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Файл не найден: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Паттерны для поиска console.log
    const patterns = [
      /console\.log\s*\(\s*['"`]🔧\s*\[DEBUG\].*?['"`].*?\)/g,
      /console\.log\s*\(\s*['"`]🔧\s*\[DEBUG\].*?['"`]\s*,/g,
      /console\.log\s*\(\s*['"`]🔧\s*\[DEBUG\].*?['"`]\s*\)/g
    ];

    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Заменяем на условный console.log
          const replacement = match.replace(
            /console\.log\s*\(\s*(['"`]🔧\s*\[DEBUG\].*?['"`].*?)\)/,
            'if (process.env.NODE_ENV === \'development\') {\n  console.log($1);\n}'
          );
          content = content.replace(match, replacement);
          modified = true;
        });
      }
    });

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Исправлены отладочные логи в: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Отладочные логи не найдены в: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Ошибка при обработке файла ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Добавляет обработку ошибок в API файл
 */
function addErrorHandling(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Файл не найден: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // Проверяем, есть ли уже обработка ошибок
    if (content.includes('catch (error)')) {
      console.log(`ℹ️  Обработка ошибок уже есть в: ${filePath}`);
      return false;
    }

    // Добавляем глобальный обработчик ошибок для функций
    const functionPattern = /export async function (GET|POST|PUT|DELETE)\s*\([^)]*\)\s*\{/g;
    
    content = content.replace(functionPattern, (match, method) => {
      return `${match}\n  try {`;
    });

    // Добавляем catch блоки
    const tryPattern = /try\s*\{/g;
    let tryCount = 0;
    
    content = content.replace(tryPattern, (match) => {
      tryCount++;
      return match;
    });

    // Добавляем catch блоки после каждого try
    const lines = content.split('\n');
    const newLines = [];
    let braceCount = 0;
    let inTryBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      newLines.push(line);

      if (line.includes('try {')) {
        inTryBlock = true;
        braceCount = 0;
      }

      if (inTryBlock) {
        if (line.includes('{')) braceCount++;
        if (line.includes('}')) braceCount--;

        if (braceCount === 0 && inTryBlock) {
          // Добавляем catch блок
          newLines.push('  } catch (error) {');
          newLines.push('    console.error(`❌ [ERROR] API ${method}:`, error);');
          newLines.push('    return NextResponse.json(');
          newLines.push('      { ');
          newLines.push('        success: false, ');
          newLines.push('        error: \'Внутренняя ошибка сервера\' ');
          newLines.push('      },');
          newLines.push('      { status: 500 }');
          newLines.push('    );');
          newLines.push('  }');
          inTryBlock = false;
        }
      }
    }

    const newContent = newLines.join('\n');
    
    if (newContent !== content) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log(`✅ Добавлена обработка ошибок в: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Изменения не требуются в: ${filePath}`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Ошибка при обработке API файла ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Исправляет проблемы с валидацией
 */
function fixValidationIssues() {
  try {
    const validationPath = path.join(__dirname, '..', 'lib/validation.ts');
    
    if (!fs.existsSync(validationPath)) {
      console.log('⚠️  Файл валидации не найден');
      return false;
    }

    let content = fs.readFileSync(validationPath, 'utf8');
    let modified = false;

    // Исправляем небезопасное приведение типа
    if (content.includes('(schema as any).partial()')) {
      content = content.replace(
        /const result = \(schema as any\)\.partial\(\)\.parse\(data\);/,
        'const result = schema.partial().parse(data);'
      );
      modified = true;
    }

    // Добавляем проверки на null/undefined
    if (content.includes('(error as z.ZodError).issues')) {
      content = content.replace(
        /const errors = \(error as z\.ZodError\)\.issues\.map\(issue => issue\.message\);/g,
        'const errors = error instanceof z.ZodError ? error.issues.map(issue => issue.message) : [\'Неизвестная ошибка валидации\'];'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(validationPath, content, 'utf8');
      console.log('✅ Исправлены проблемы с валидацией');
      return true;
    } else {
      console.log('ℹ️  Проблемы с валидацией не найдены');
      return false;
    }

  } catch (error) {
    console.error('❌ Ошибка при исправлении валидации:', error.message);
    return false;
  }
}

/**
 * Создает middleware для rate limiting
 */
function createRateLimitMiddleware() {
  try {
    const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
    
    if (fs.existsSync(middlewarePath)) {
      console.log('ℹ️  Middleware уже существует');
      return false;
    }

    const middlewareContent = `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Простой rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 минут
const RATE_LIMIT_MAX = 100; // максимум 100 запросов

export function middleware(request: NextRequest) {
  // Применяем rate limiting только к API маршрутам
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown';
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
        return NextResponse.json(
          { success: false, error: 'Слишком много запросов' },
          { status: 429 }
        );
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
`;

    fs.writeFileSync(middlewarePath, middlewareContent, 'utf8');
    console.log('✅ Создан middleware для rate limiting');
    return true;

  } catch (error) {
    console.error('❌ Ошибка при создании middleware:', error.message);
    return false;
  }
}

/**
 * Основная функция
 */
async function fixCriticalIssues() {
  console.log('🔧 Исправление критических проблем...\n');

  let fixedFiles = 0;
  let totalIssues = 0;

  // 1. Исправляем отладочные логи
  console.log('📝 Исправление отладочных логов:');
  for (const file of filesWithDebugLogs) {
    if (fixDebugLogs(file)) {
      fixedFiles++;
    }
    totalIssues++;
  }

  // 2. Добавляем обработку ошибок в API
  console.log('\n🛡️ Добавление обработки ошибок в API:');
  for (const file of apiFiles) {
    if (addErrorHandling(file)) {
      fixedFiles++;
    }
    totalIssues++;
  }

  // 3. Исправляем проблемы с валидацией
  console.log('\n✅ Исправление проблем с валидацией:');
  if (fixValidationIssues()) {
    fixedFiles++;
  }
  totalIssues++;

  // 4. Создаем middleware для rate limiting
  console.log('\n🚦 Создание rate limiting middleware:');
  if (createRateLimitMiddleware()) {
    fixedFiles++;
  }
  totalIssues++;

  // Результаты
  console.log('\n📊 Результаты:');
  console.log(`✅ Исправлено проблем: ${fixedFiles}/${totalIssues}`);
  console.log(`📈 Процент исправления: ${Math.round((fixedFiles / totalIssues) * 100)}%`);

  if (fixedFiles > 0) {
    console.log('\n🎉 Критические проблемы исправлены!');
    console.log('\n📋 Следующие шаги:');
    console.log('1. Проверьте изменения в файлах');
    console.log('2. Запустите тесты: npm run build');
    console.log('3. Проверьте работу приложения');
  } else {
    console.log('\nℹ️  Критические проблемы не найдены или уже исправлены');
  }
}

// Запуск скрипта
if (require.main === module) {
  fixCriticalIssues().catch(console.error);
}

module.exports = { fixCriticalIssues };
