#!/usr/bin/env node

const { style } = require('./build-styles');

/**
 * Анализатор результатов сборки Next.js
 * Парсит вывод сборки и представляет его в красивом виде
 */

class BuildAnalyzer {
  constructor() {
    this.stats = {
      routes: [],
      totalSize: 0,
      staticPages: 0,
      dynamicPages: 0,
      buildTime: 0,
      errors: [],
      warnings: []
    };
  }

  /**
   * Анализирует вывод сборки Next.js
   */
  analyzeBuildOutput(output) {
    const lines = output.split('\n');
    
    for (const line of lines) {
      this.parseRouteLine(line);
      this.parseSizeLine(line);
      this.parseStaticPagesLine(line);
      this.parseBuildTimeLine(line);
      this.parseErrorLine(line);
      this.parseWarningLine(line);
    }
    
    return this.stats;
  }

  /**
   * Парсит строки с маршрутами
   */
  parseRouteLine(line) {
    // Route (app)                             Size     First Load JS
    // ┌ ○ /                                   8.88 kB         209 kB
    const routeMatch = line.match(/^[├└]\s+([○ƒ])\s+([^\s]+)\s+(\d+(?:\.\d+)?\s*kB)\s+(\d+(?:\.\d+)?\s*kB)/);
    
    if (routeMatch) {
      const [, type, path, size, firstLoad] = routeMatch;
      this.stats.routes.push({
        type: type === '○' ? 'static' : 'dynamic',
        path,
        size,
        firstLoad
      });
      
      if (type === '○') {
        this.stats.staticPages++;
      } else {
        this.stats.dynamicPages++;
      }
    }
  }

  /**
   * Парсит строки с размерами
   */
  parseSizeLine(line) {
    // + First Load JS shared by all           196 kB
    const sizeMatch = line.match(/First Load JS shared by all\s+(\d+(?:\.\d+)?\s*kB)/);
    if (sizeMatch) {
      this.stats.totalSize = sizeMatch[1];
    }
  }

  /**
   * Парсит строки со статическими страницами
   */
  parseStaticPagesLine(line) {
    // ✓ Generating static pages (24/24)
    const staticMatch = line.match(/Generating static pages \((\d+)\/(\d+)\)/);
    if (staticMatch) {
      this.stats.staticPages = parseInt(staticMatch[1]);
    }
  }

  /**
   * Парсит строки со временем сборки
   */
  parseBuildTimeLine(line) {
    // ✓ Compiled successfully in 2.3s
    const timeMatch = line.match(/Compiled successfully in ([\d.]+)s/);
    if (timeMatch) {
      this.stats.buildTime = parseFloat(timeMatch[1]);
    }
  }

  /**
   * Парсит строки с ошибками
   */
  parseErrorLine(line) {
    if (line.includes('❌') || line.includes('Error') || line.includes('Failed')) {
      this.stats.errors.push(line.trim());
    }
  }

  /**
   * Парсит строки с предупреждениями
   */
  parseWarningLine(line) {
    if (line.includes('⚠️') || line.includes('Warning')) {
      this.stats.warnings.push(line.trim());
    }
  }

  /**
   * Выводит красивую статистику сборки
   */
  displayBuildStats() {
    console.log(style.divider());
    console.log(style.header('📊 Анализ результатов сборки'));
    console.log(style.divider());

    // Общая статистика
    console.log(style.section('Общие показатели:'));
    console.log(style.info(`Всего маршрутов: ${this.stats.routes.length}`));
    console.log(style.info(`Статических страниц: ${this.stats.staticPages}`));
    console.log(style.info(`Динамических страниц: ${this.stats.dynamicPages}`));
    
    if (this.stats.totalSize) {
      console.log(style.size('Общий размер JS', this.stats.totalSize));
    }
    
    if (this.stats.buildTime) {
      console.log(style.time('Время компиляции', this.stats.buildTime * 1000));
    }

    // Детальная информация по маршрутам
    if (this.stats.routes.length > 0) {
      console.log(style.section('Детализация маршрутов:'));
      
      this.stats.routes.forEach((route, index) => {
        const typeIcon = route.type === 'static' ? '○' : 'ƒ';
        const typeText = route.type === 'static' ? 'Статический' : 'Динамический';
        
        console.log(style.route(`${typeIcon} ${route.path}`));
        console.log(style.size('  Размер страницы', route.size));
        console.log(style.size('  Первоначальная загрузка', route.firstLoad));
        console.log(style.info(`  Тип: ${typeText}`));
        
        if (index < this.stats.routes.length - 1) {
          console.log(style.divider());
        }
      });
    }

    // Ошибки и предупреждения
    if (this.stats.errors.length > 0) {
      console.log(style.section('Ошибки сборки:'));
      this.stats.errors.forEach(error => {
        console.log(style.error(error));
      });
    }

    if (this.stats.warnings.length > 0) {
      console.log(style.section('Предупреждения:'));
      this.stats.warnings.forEach(warning => {
        console.log(style.warning(warning));
      });
    }

    // Рекомендации
    this.displayRecommendations();
    
    console.log(style.divider());
  }

  /**
   * Показывает рекомендации по оптимизации
   */
  displayRecommendations() {
    console.log(style.section('💡 Рекомендации по оптимизации:'));
    
    // Анализ размеров
    const largeRoutes = this.stats.routes.filter(r => {
      const size = parseFloat(r.firstLoad.replace(' kB', ''));
      return size > 200;
    });
    
    if (largeRoutes.length > 0) {
      console.log(style.warning('Обнаружены страницы с большим размером JS:'));
      largeRoutes.forEach(route => {
        console.log(style.warning(`  - ${route.path}: ${route.firstLoad}`));
      });
      console.log(style.info('Рекомендуется: код-сплиттинг, ленивая загрузка компонентов'));
    }

    // Анализ статических страниц
    if (this.stats.staticPages > 20) {
      console.log(style.info('Много статических страниц - отлично для SEO!'));
    }

    // Анализ динамических страниц
    if (this.stats.dynamicPages > 10) {
      console.log(style.info('Много динамических страниц - рассмотрите ISR для оптимизации'));
    }

    // Общие рекомендации
    console.log(style.info('Общие рекомендации:'));
    console.log(style.info('  - Используйте Next.js Image для оптимизации изображений'));
    console.log(style.info('  - Включите сжатие Gzip/Brotli на сервере'));
    console.log(style.info('  - Мониторьте Core Web Vitals'));
  }
}

// Экспорт для использования в других скриптах
module.exports = { BuildAnalyzer };

// Для запуска напрямую
if (require.main === module) {
  const analyzer = new BuildAnalyzer();
  
  // Читаем вывод сборки из stdin или аргументов
  let buildOutput = '';
  
  if (process.argv.length > 2) {
    // Читаем из файла
    const fs = require('fs');
    const filePath = process.argv[2];
    try {
      buildOutput = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(style.error(`Не удалось прочитать файл: ${filePath}`));
      process.exit(1);
    }
  } else {
    // Читаем из stdin
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      buildOutput += chunk;
    });
    
    process.stdin.on('end', () => {
      const stats = analyzer.analyzeBuildOutput(buildOutput);
      analyzer.displayBuildStats();
    });
    
    return;
  }
  
  // Анализируем и показываем результаты
  const stats = analyzer.analyzeBuildOutput(buildOutput);
  analyzer.displayBuildStats();
}
