import { prisma } from '@/lib/prisma';
import { Part, Car } from '@/types';

/**
 * Серверная функция для получения всех запчастей с информацией об автомобилях
 */
export async function getAllParts(): Promise<(Part & { car: Car | null })[]> {
  try {
    console.log('🔧 [DEBUG] getAllParts: Загрузка запчастей с сервера');

    const parts = await prisma.part.findMany({
      include: {
        car: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('🔧 [DEBUG] getAllParts: Загружено запчастей:', parts.length);
    return parts;

  } catch (error) {
    console.error('🔧 [DEBUG] getAllParts: Ошибка загрузки запчастей:', error);
    return [];
  }
}

/**
 * Серверная функция для получения запчасти по ID
 */
export async function getPartById(id: string): Promise<(Part & { car: Car | null }) | null> {
  try {
    console.log('🔧 [DEBUG] getPartById: Загрузка запчасти с ID:', id);

    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        car: true
      }
    });

    if (!part) {
      console.log('🔧 [DEBUG] getPartById: Запчасть не найдена');
      return null;
    }

    console.log('🔧 [DEBUG] getPartById: Запчасть найдена:', part.zapchastName);
    return part;

  } catch (error) {
    console.error('🔧 [DEBUG] getPartById: Ошибка загрузки запчасти:', error);
    return null;
  }
}
