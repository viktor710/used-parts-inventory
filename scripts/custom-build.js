#!/usr/bin/env node

const { execSync } = require('child_process');
const { style } = require('./build-styles');
const { BuildAnalyzer } = require('./build-analyzer');

/**
 * Кастомный скрипт сборки Next.js с единым стилем сообщений
 * Заменяет стандартный next build для лучшего UX
 */

async function customBuild() {
  const startTime = Date.now();
  const analyzer = new BuildAnalyzer();
  
  try {
    console.log(style.header('🚀 Запуск сборки проекта'));
    console.log(style.divider());
    
    // Этап 1: Проверка зависимостей
    console.log(style.step('Проверка зависимостей...'));
    try {
      execSync('npm list --depth=0', { stdio: 'pipe' });
      console.log(style.success('Зависимости проверены'));
    } catch (error) {
      console.log(style.warning('Проблемы с зависимостями, но продолжаем...'));
    }
    
    // Этап 2: Генерация Prisma Client
    console.log(style.generate('Генерация Prisma Client...'));
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log(style.success('Prisma Client сгенерирован'));
    
    // Этап 3: Сборка Next.js
    console.log(style.build('Сборка Next.js приложения...'));
    const buildOutput = execSync('next build', { 
      stdio: 'pipe',
      encoding: 'utf8'
    }).toString();
    
    // Этап 4: Анализ результатов
    const buildTime = Date.now() - startTime;
    console.log(style.divider());
    console.log(style.done(`Сборка завершена успешно!`));
    console.log(style.time('Общее время сборки', buildTime));
    
    // Анализируем результаты сборки
    const stats = analyzer.analyzeBuildOutput(buildOutput);
    analyzer.displayBuildStats();
    
    console.log(style.divider());
    console.log(style.success('🎉 Проект готов к развертыванию!'));
    
  } catch (error) {
    const buildTime = Date.now() - startTime;
    console.log(style.divider());
    console.error(style.error(`Ошибка сборки: ${error.message}`));
    console.log(style.time('Время до ошибки', buildTime));
    
    // Пытаемся проанализировать частичный вывод
    if (error.stdout) {
      console.log(style.section('Частичный вывод сборки:'));
      const stats = analyzer.analyzeBuildOutput(error.stdout);
      analyzer.displayBuildStats();
    }
    
    process.exit(1);
  }
}

// Запуск если скрипт вызван напрямую
if (require.main === module) {
  customBuild();
}

module.exports = { customBuild };
