'use server';

import { revalidatePath } from 'next/cache';
import { ActionResult, SearchResult } from '@/types';

/**
 * Server Action для добавления запчасти
 */
export async function addPartAction(formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);

    // Здесь будет логика добавления запчасти в базу данных
    console.log('Добавление запчасти:', { name, category, price });

    // Перевалидируем страницу для обновления данных
    revalidatePath('/');
    
    return { success: true, message: 'Запчасть успешно добавлена' };
  } catch (error) {
    console.error('Ошибка добавления запчасти:', error);
    return { success: false, message: 'Ошибка при добавлении запчасти' };
  }
}

/**
 * Server Action для поиска запчастей
 */
export async function searchPartsAction(formData: FormData): Promise<SearchResult> {
  try {
    const query = formData.get('query') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as string;

    // Здесь будет логика поиска запчастей
    console.log('Поиск запчастей:', { query, category, status });

    return { success: true, results: [] };
  } catch (error) {
    console.error('Ошибка поиска запчастей:', error);
    return { success: false, message: 'Ошибка при поиске запчастей' };
  }
}

/**
 * Server Action для добавления клиента
 */
export async function addClientAction(formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;

    // Здесь будет логика добавления клиента
    console.log('Добавление клиента:', { name, phone, email });

    revalidatePath('/');
    
    return { success: true, message: 'Клиент успешно добавлен' };
  } catch (error) {
    console.error('Ошибка добавления клиента:', error);
    return { success: false, message: 'Ошибка при добавлении клиента' };
  }
}

/**
 * Server Action для оформления продажи
 */
export async function createSaleAction(formData: FormData): Promise<ActionResult> {
  try {
    const partId = formData.get('partId') as string;
    const clientId = formData.get('clientId') as string;
    const price = parseFloat(formData.get('price') as string);

    // Здесь будет логика оформления продажи
    console.log('Оформление продажи:', { partId, clientId, price });

    revalidatePath('/');
    
    return { success: true, message: 'Продажа успешно оформлена' };
  } catch (error) {
    console.error('Ошибка оформления продажи:', error);
    return { success: false, message: 'Ошибка при оформлении продажи' };
  }
}
