#!/usr/bin/env node

/**
 * Единый стиль для всех сообщений в терминале при сборке
 * Используется во всех скриптах сборки для консистентности
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

const style = {
  // Основные типы сообщений
  info: (text) => `${colors.cyan}ℹ️  ${text}${colors.reset}`,
  success: (text) => `${colors.green}✅ ${text}${colors.reset}`,
  warning: (text) => `${colors.yellow}⚠️  ${text}${colors.reset}`,
  error: (text) => `${colors.red}❌ ${text}${colors.reset}`,
  
  // Этапы процесса
  step: (text) => `${colors.blue}🔧 ${text}${colors.reset}`,
  process: (text) => `${colors.magenta}⚙️  ${text}${colors.reset}`,
  build: (text) => `${colors.cyan}🏗️  ${text}${colors.reset}`,
  generate: (text) => `${colors.blue}🔨 ${text}${colors.reset}`,
  
  // Операции
  clean: (text) => `${colors.white}🗑️  ${text}${colors.reset}`,
  check: (text) => `${colors.cyan}🔍 ${text}${colors.reset}`,
  install: (text) => `${colors.magenta}📦 ${text}${colors.reset}`,
  test: (text) => `${colors.yellow}🧪 ${text}${colors.reset}`,
  
  // Статусы
  loading: (text) => `${colors.gray}⏳ ${text}${colors.reset}`,
  done: (text) => `${colors.green}🎉 ${text}${colors.reset}`,
  skip: (text) => `${colors.yellow}⏭️  ${text}${colors.reset}`,
  
  // Специальные
  header: (text) => `${colors.bright}${colors.cyan}🚀 ${text}${colors.reset}`,
  section: (text) => `${colors.bright}${colors.blue}📋 ${text}${colors.reset}`,
  divider: () => `${colors.gray}${'─'.repeat(60)}${colors.reset}`,
  
  // Счетчики и прогресс
  progress: (current, total, text) => 
    `${colors.cyan}[${current}/${total}] ${text}${colors.reset}`,
  
  // Время выполнения
  time: (text, duration) => 
    `${colors.gray}⏱️  ${text}: ${duration}ms${colors.reset}`,
  
  // Размеры файлов
  size: (text, size) => 
    `${colors.cyan}📊 ${text}: ${size}${colors.reset}`,
  
  // Пути и файлы
  file: (text) => `${colors.white}📁 ${text}${colors.reset}`,
  route: (text) => `${colors.cyan}🛣️  ${text}${colors.reset}`
};

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { style, colors };
}

// Для использования в браузере или как модуль
if (typeof window !== 'undefined') {
  window.buildStyles = { style, colors };
}

module.exports = { style, colors };
