const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🚀 Инициализация базы данных...');

// Создаем папку data если её нет
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Создана папка data');
}

// Создаем базу данных
const dbPath = path.join(dataDir, 'inventory.db');
const db = new sqlite3.Database(dbPath);

console.log('✅ База данных создана');

// Функция для выполнения SQL запросов
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

// Функция для получения данных
function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Инициализация базы данных
async function initDatabase() {
  try {
    // Создаем таблицы
    await runQuery(`
      CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('engine', 'transmission', 'suspension', 'brakes', 'electrical', 'body', 'interior', 'exterior', 'other')),
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'broken')),
        status TEXT NOT NULL CHECK (status IN ('available', 'reserved', 'sold', 'scrapped')),
        price REAL NOT NULL,
        description TEXT,
        location TEXT NOT NULL,
        supplier TEXT NOT NULL,
        purchase_date TEXT NOT NULL,
        purchase_price REAL NOT NULL,
        images TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        contact TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        part_id TEXT NOT NULL,
        customer_id TEXT NOT NULL,
        price REAL NOT NULL,
        sale_date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (part_id) REFERENCES parts (id),
        FOREIGN KEY (customer_id) REFERENCES customers (id)
      )
    `);

    // Создаем индексы
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parts_category ON parts (category)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parts_status ON parts (status)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parts_brand ON parts (brand)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parts_model ON parts (model)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parts_price ON parts (price)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_parts_location ON parts (location)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_sales_part_id ON sales (part_id)');
    await runQuery('CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales (customer_id)');

    console.log('✅ Таблицы созданы');

    // Добавляем тестовые данные
    const testParts = [
      {
        id: '1',
        name: 'Двигатель BMW M54 2.5L',
        category: 'engine',
        brand: 'BMW',
        model: 'E46',
        year: 2003,
        condition: 'good',
        status: 'available',
        price: 85000,
        description: 'Двигатель BMW M54 2.5L в хорошем состоянии, пробег 150,000 км',
        location: 'Склад А, полка 1',
        supplier: 'Авторазборка BMW',
        purchase_date: '2024-01-15T00:00:00.000Z',
        purchase_price: 65000,
        images: '[]',
        notes: 'Проверен, готов к установке. Комплект полный.',
        created_at: '2024-01-15T00:00:00.000Z',
        updated_at: '2024-01-15T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Коробка передач 5MT Toyota',
        category: 'transmission',
        brand: 'Toyota',
        model: 'Camry',
        year: 2010,
        condition: 'excellent',
        status: 'available',
        price: 45000,
        description: 'Механическая коробка передач в отличном состоянии',
        location: 'Склад Б, полка 3',
        supplier: 'Toyota Parts',
        purchase_date: '2024-01-10T00:00:00.000Z',
        purchase_price: 35000,
        images: '[]',
        notes: 'Проверена на стенде, работает идеально.',
        created_at: '2024-01-10T00:00:00.000Z',
        updated_at: '2024-01-10T00:00:00.000Z',
      },
      {
        id: '3',
        name: 'Тормозные колодки Brembo',
        category: 'brakes',
        brand: 'Brembo',
        model: 'Универсальные',
        year: 2020,
        condition: 'excellent',
        status: 'available',
        price: 8000,
        description: 'Передние тормозные колодки Brembo, новые',
        location: 'Склад А, полка 5',
        supplier: 'Brembo Official',
        purchase_date: '2024-01-05T00:00:00.000Z',
        purchase_price: 6000,
        images: '[]',
        notes: 'Оригинальные колодки, в упаковке.',
        created_at: '2024-01-05T00:00:00.000Z',
        updated_at: '2024-01-05T00:00:00.000Z',
      },
    ];

    for (let i = 0; i < testParts.length; i++) {
      const part = testParts[i];
      try {
        await runQuery(`
          INSERT INTO parts (
            id, name, category, brand, model, year, condition, status, price,
            description, location, supplier, purchase_date, purchase_price,
            images, notes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          part.id,
          part.name,
          part.category,
          part.brand,
          part.model,
          part.year,
          part.condition,
          part.status,
          part.price,
          part.description,
          part.location,
          part.supplier,
          part.purchase_date,
          part.purchase_price,
          part.images,
          part.notes,
          part.created_at,
          part.updated_at
        ]);
        console.log(`✅ Добавлена запчасть ${i + 1}: ${part.name}`);
      } catch (error) {
        console.error(`❌ Ошибка при добавлении запчасти ${i + 1}:`, error.message);
      }
    }

    // Проверяем количество записей
    const count = await getQuery('SELECT COUNT(*) as count FROM parts');
    console.log(`📊 Всего запчастей в базе: ${count.count}`);

    console.log('🎉 Инициализация завершена успешно!');
    console.log('📁 База данных находится в: data/inventory.db');

  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error);
  } finally {
    db.close();
  }
}

// Запускаем инициализацию
initDatabase();
