import { prisma } from '@/lib/prisma';
import { Car } from '@/types';

/**
 * Серверная функция для получения всех автомобилей
 */
export async function getAllCars(): Promise<Car[]> {
  try {
    console.log('🔧 [DEBUG] getAllCars: Загрузка автомобилей с сервера');

    const cars = await prisma.car.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('🔧 [DEBUG] getAllCars: Загружено автомобилей:', cars.length);
    return cars;

  } catch (error) {
    console.error('🔧 [DEBUG] getAllCars: Ошибка загрузки автомобилей:', error);
    return [];
  }
}

/**
 * Серверная функция для получения автомобиля по ID
 */
export async function getCarById(id: string): Promise<Car | null> {
  try {
    console.log('🔧 [DEBUG] getCarById: Загрузка автомобиля с ID:', id);

    const car = await prisma.car.findUnique({
      where: { id }
    });

    if (!car) {
      console.log('🔧 [DEBUG] getCarById: Автомобиль не найден');
      return null;
    }

    console.log('🔧 [DEBUG] getCarById: Автомобиль найден:', car.brand, car.model);
    return car;

  } catch (error) {
    console.error('🔧 [DEBUG] getCarById: Ошибка загрузки автомобиля:', error);
    return null;
  }
}
