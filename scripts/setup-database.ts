#!/usr/bin/env tsx

/**
 * Скрипт для инициализации базы данных
 * Создает папку data и инициализирует SQLite базу данных
 */

import fs from 'fs';
import path from 'path';
import { db } from '../lib/database';
import { CreatePartInput } from '../types';

console.log('🚀 Инициализация базы данных...');

// Создаем папку data если её нет
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Создана папка data');
}

// Инициализируем базу данных (таблицы создаются автоматически)
try {
  // Получаем статистику для проверки подключения
  const stats = db.getInventoryStats();
  console.log('✅ База данных успешно инициализирована');
  console.log(`📊 Текущая статистика: ${stats.totalParts} запчастей`);
} catch (error) {
  console.error('❌ Ошибка при инициализации базы данных:', error);
  process.exit(1);
}

// Добавляем тестовые данные если база пустая
const stats = db.getInventoryStats();
if (stats.totalParts === 0) {
  console.log('📝 Добавление тестовых данных...');
  
  const testParts: CreatePartInput[] = [
    {
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
      purchaseDate: new Date('2024-01-15'),
      purchasePrice: 65000,
      images: [],
      notes: 'Проверен, готов к установке. Комплект полный.',
    },
    {
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
      purchaseDate: new Date('2024-01-10'),
      purchasePrice: 35000,
      images: [],
      notes: 'Проверена на стенде, работает идеально.',
    },
    {
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
      purchaseDate: new Date('2024-01-05'),
      purchasePrice: 6000,
      images: [],
      notes: 'Оригинальные колодки, в упаковке.',
    },
    {
      name: 'Амортизаторы передние',
      category: 'suspension',
      brand: 'KYB',
      model: 'Honda Civic',
      year: 2015,
      condition: 'good',
      status: 'available',
      price: 12000,
      description: 'Передние амортизаторы KYB для Honda Civic',
      location: 'Склад В, полка 2',
      supplier: 'KYB Parts',
      purchaseDate: new Date('2024-01-08'),
      purchasePrice: 9000,
      images: [],
      notes: 'Б/у, но в хорошем состоянии.',
    },
    {
      name: 'Генератор Bosch',
      category: 'electrical',
      brand: 'Bosch',
      model: 'VW Golf',
      year: 2012,
      condition: 'fair',
      status: 'available',
      price: 15000,
      description: 'Генератор Bosch для VW Golf',
      location: 'Склад А, полка 7',
      supplier: 'Bosch Service',
      purchaseDate: new Date('2024-01-12'),
      purchasePrice: 12000,
      images: [],
      notes: 'Требует проверки перед установкой.',
    },
  ];

  // Добавляем тестовые данные
  testParts.forEach((part, index) => {
    try {
      const newPart = db.createPart(part);
      console.log(`✅ Добавлена запчасть ${index + 1}: ${newPart.name}`);
    } catch (error) {
      console.error(`❌ Ошибка при добавлении запчасти ${index + 1}:`, error);
    }
  });

  console.log('✅ Тестовые данные добавлены');
}

console.log('🎉 Инициализация завершена успешно!');
console.log('📁 База данных находится в: data/inventory.db');
console.log('🚀 Запустите приложение командой: npm run dev');
