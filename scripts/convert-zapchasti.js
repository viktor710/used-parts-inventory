const fs = require('fs');
const path = require('path');

function convertJsonToTypeScript() {
  try {
    // Читаем JSON файл
    const jsonPath = path.join(__dirname, '../data/zapchasti.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(jsonContent);

    // Создаем TypeScript код
    const tsCode = `// Автоматически сгенерированный файл из zapchasti.json
// Дата создания: ${new Date().toISOString()}

// Типы данных
export interface Zapchast {
  id: number;
  name: string;
}

export interface ZapchastiData {
  zapchasti: Zapchast[];
}

// Данные запчастей
export const zapchastiData: ZapchastiData = ${JSON.stringify(data, null, 2)};

// Массив запчастей для удобства
export const zapchasti: Zapchast[] = zapchastiData.zapchasti;

// Функции для работы с данными
export function findZapchastById(id: number): Zapchast | undefined {
  return zapchasti.find(item => item.id === id);
}

export function findZapchastByName(name: string): Zapchast | undefined {
  return zapchasti.find(item => 
    item.name.toLowerCase() === name.toLowerCase()
  );
}

export function searchZapchasti(query: string): Zapchast[] {
  const lowerQuery = query.toLowerCase();
  return zapchasti.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
}

export function getAllZapchasti(): Zapchast[] {
  return [...zapchasti];
}

export function getZapchastiCount(): number {
  return zapchasti.length;
}

// Функция для автодополнения
export function getAutocompleteSuggestions(query: string, limit: number = 10): Zapchast[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  const suggestions = zapchasti.filter(item => 
    item.name.toLowerCase().includes(lowerQuery)
  );
  
  return suggestions.slice(0, limit);
}

// Функция для проверки существования запчасти
export function isZapchastExists(name: string): boolean {
  return findZapchastByName(name) !== undefined;
}

// Экспорт по умолчанию
export default zapchastiData;
`;

    // Записываем TypeScript файл
    const tsPath = path.join(__dirname, '../lib/zapchasti-data.ts');
    fs.writeFileSync(tsPath, tsCode, 'utf-8');

    console.log('✅ Файл успешно конвертирован!');
    console.log(`📁 Создан файл: ${tsPath}`);
    console.log(`📊 Количество запчастей: ${data.zapchasti.length}`);
    console.log('\n📋 Доступные функции:');
    console.log('- findZapchastById(id: number)');
    console.log('- findZapchastByName(name: string)');
    console.log('- searchZapchasti(query: string)');
    console.log('- getAllZapchasti()');
    console.log('- getZapchastiCount()');
    console.log('- getAutocompleteSuggestions(query: string)');
    console.log('- isZapchastExists(name: string)');

  } catch (error) {
    console.error('❌ Ошибка при конвертации:', error);
  }
}

// Запускаем конвертацию
convertJsonToTypeScript();
