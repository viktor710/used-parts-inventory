#!/usr/bin/env tsx

/**
 * Скрипт для инициализации базы данных
 * Создает папку data и инициализирует SQLite базу данных
 */

import fs from 'fs';
import path from 'path';
import { db } from '../lib/database';
import { CreatePartInput, CreateCarInput } from '../types';

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
const carStats = db.getCarStats();

if (stats.totalParts === 0 && carStats.totalCars === 0) {
  console.log('📝 Добавление тестовых данных...');
  
  // Сначала создаем автомобили
  const testCars: CreateCarInput[] = [
    {
      brand: 'BMW',
      model: 'E46 325i',
      year: 2003,
      bodyType: 'sedan',
      fuelType: 'gasoline',
      engineVolume: '2.5L',
      transmission: '5MT',
      mileage: 150000,
      vin: 'WBAVB13506PT12345',
      color: 'Черный',
      description: 'BMW E46 325i в хорошем состоянии, полная комплектация',
      images: [],
      notes: 'Автомобиль разобран на запчасти',
    },
    {
      brand: 'Toyota',
      model: 'Camry',
      year: 2010,
      bodyType: 'sedan',
      fuelType: 'gasoline',
      engineVolume: '2.4L',
      transmission: '5MT',
      mileage: 120000,
      vin: '4T1BF1FK0CU123456',
      color: 'Серебристый',
      description: 'Toyota Camry в отличном состоянии',
      images: [],
      notes: 'Автомобиль разобран на запчасти',
    },
    {
      brand: 'Honda',
      model: 'Civic',
      year: 2015,
      bodyType: 'hatchback',
      fuelType: 'gasoline',
      engineVolume: '1.8L',
      transmission: '6MT',
      mileage: 80000,
      vin: '1HGBH41JXMN123456',
      color: 'Белый',
      description: 'Honda Civic в хорошем состоянии',
      images: [],
      notes: 'Автомобиль разобран на запчасти',
    },
    {
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2012,
      bodyType: 'hatchback',
      fuelType: 'diesel',
      engineVolume: '2.0L',
      transmission: '6MT',
      mileage: 180000,
      vin: 'WVWZZZ1KZAW123456',
      color: 'Синий',
      description: 'VW Golf с дизельным двигателем',
      images: [],
      notes: 'Автомобиль разобран на запчасти',
    },
  ];

  // Создаем автомобили
  const createdCars: string[] = [];
  testCars.forEach((car, index) => {
    try {
      const newCar = db.createCar(car);
      createdCars.push(newCar.id);
      console.log(`✅ Добавлен автомобиль ${index + 1}: ${newCar.brand} ${newCar.model}`);
    } catch (error) {
      console.error(`❌ Ошибка при добавлении автомобиля ${index + 1}:`, error);
    }
  });

  // Проверяем, что все автомобили созданы
  if (createdCars.length < 4) {
    console.error('❌ Не все автомобили были созданы. Пропускаем создание запчастей.');
    process.exit(1);
  }

  // Теперь создаем запчасти, связанные с автомобилями
  const testParts: CreatePartInput[] = [
    {
      name: 'Двигатель BMW M54 2.5L',
      category: 'engine',
      carId: createdCars[0]!, // BMW
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
      carId: createdCars[1]!, // Toyota
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
      carId: createdCars[0]!, // BMW
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
      name: 'Амортизаторы передние KYB',
      category: 'suspension',
      carId: createdCars[2]!, // Honda
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
      carId: createdCars[3]!, // VW
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

  // Добавляем запчасти
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
