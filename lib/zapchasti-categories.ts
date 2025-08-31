import { PartCategory } from '@/types';

/**
 * Функция для автоматического определения категории запчасти по названию
 */
export function getCategoryByZapchastName(zapchastName: string): PartCategory {
  const lowerName = zapchastName.toLowerCase();
  
  // Двигатель
  if (
    lowerName.includes('двигатель') ||
    lowerName.includes('мотор') ||
    lowerName.includes('блок цилиндров') ||
    lowerName.includes('головка блока') ||
    lowerName.includes('коленвал') ||
    lowerName.includes('распредвал') ||
    lowerName.includes('поршень') ||
    lowerName.includes('шатун') ||
    lowerName.includes('клапан') ||
    lowerName.includes('свеча') ||
    lowerName.includes('инжектор') ||
    lowerName.includes('карбюратор') ||
    lowerName.includes('турбина') ||
    lowerName.includes('интеркулер') ||
    lowerName.includes('радиатор') ||
    lowerName.includes('вентилятор') ||
    lowerName.includes('термостат') ||
    lowerName.includes('помпа') ||
    lowerName.includes('масляный насос') ||
    lowerName.includes('топливный насос') ||
    lowerName.includes('бак топливный') ||
    lowerName.includes('адсорбер') ||
    lowerName.includes('катализатор') ||
    lowerName.includes('глушитель') ||
    lowerName.includes('выпускной коллектор') ||
    lowerName.includes('впускной коллектор')
  ) {
    return 'engine';
  }
  
  // Трансмиссия
  if (
    lowerName.includes('кпп') ||
    lowerName.includes('коробка передач') ||
    lowerName.includes('сцепление') ||
    lowerName.includes('актуатор сцепления') ||
    lowerName.includes('кардан') ||
    lowerName.includes('редуктор') ||
    lowerName.includes('дифференциал') ||
    lowerName.includes('полуось') ||
    lowerName.includes('шарнир') ||
    lowerName.includes('привод') ||
    lowerName.includes('балка под кпп') ||
    lowerName.includes('балка под редуктор')
  ) {
    return 'transmission';
  }
  
  // Подвеска
  if (
    lowerName.includes('амортизатор') ||
    lowerName.includes('пружина') ||
    lowerName.includes('рычаг') ||
    lowerName.includes('стойка') ||
    lowerName.includes('сайлентблок') ||
    lowerName.includes('шаровой') ||
    lowerName.includes('подшипник') ||
    lowerName.includes('балка подвески') ||
    lowerName.includes('подрамник') ||
    lowerName.includes('стабилизатор') ||
    lowerName.includes('поперечина') ||
    lowerName.includes('кронштейн')
  ) {
    return 'suspension';
  }
  
  // Тормоза
  if (
    lowerName.includes('тормоз') ||
    lowerName.includes('колодка') ||
    lowerName.includes('диск') ||
    lowerName.includes('барабан') ||
    lowerName.includes('суппорт') ||
    lowerName.includes('цилиндр тормозной') ||
    lowerName.includes('бачок тормозной') ||
    lowerName.includes('блок abs') ||
    lowerName.includes('датчик abs') ||
    lowerName.includes('тормозная трубка') ||
    lowerName.includes('тормозной шланг')
  ) {
    return 'brakes';
  }
  
  // Электрика
  if (
    lowerName.includes('акб') ||
    lowerName.includes('батарея') ||
    lowerName.includes('генератор') ||
    lowerName.includes('стартер') ||
    lowerName.includes('блок управления') ||
    lowerName.includes('датчик') ||
    lowerName.includes('реле') ||
    lowerName.includes('предохранитель') ||
    lowerName.includes('провод') ||
    lowerName.includes('разъем') ||
    lowerName.includes('контроллер') ||
    lowerName.includes('модуль') ||
    lowerName.includes('антенна') ||
    lowerName.includes('динамик') ||
    lowerName.includes('магнитола') ||
    lowerName.includes('навигация') ||
    lowerName.includes('камера') ||
    lowerName.includes('радар') ||
    lowerName.includes('парктроник')
  ) {
    return 'electrical';
  }
  
  // Кузов
  if (
    lowerName.includes('кузов') ||
    lowerName.includes('крыло') ||
    lowerName.includes('капот') ||
    lowerName.includes('багажник') ||
    lowerName.includes('дверь') ||
    lowerName.includes('крышка багажника') ||
    lowerName.includes('стекло') ||
    lowerName.includes('лобовое') ||
    lowerName.includes('заднее стекло') ||
    lowerName.includes('боковое стекло') ||
    lowerName.includes('стеклоподъемник') ||
    lowerName.includes('замок') ||
    lowerName.includes('петля') ||
    lowerName.includes('уплотнитель') ||
    lowerName.includes('молдинг') ||
    lowerName.includes('накладка') ||
    lowerName.includes('арка') ||
    lowerName.includes('порог') ||
    lowerName.includes('стойка') ||
    lowerName.includes('лонжерон') ||
    lowerName.includes('балка под радиатор')
  ) {
    return 'body';
  }
  
  // Салон
  if (
    lowerName.includes('сиденье') ||
    lowerName.includes('спинка') ||
    lowerName.includes('подголовник') ||
    lowerName.includes('ремень') ||
    lowerName.includes('подушка') ||
    lowerName.includes('панель') ||
    lowerName.includes('приборная панель') ||
    lowerName.includes('руль') ||
    lowerName.includes('ручка') ||
    lowerName.includes('педаль') ||
    lowerName.includes('коврик') ||
    lowerName.includes('обшивка') ||
    lowerName.includes('потолок') ||
    lowerName.includes('бардачок') ||
    lowerName.includes('вещевой ящик') ||
    lowerName.includes('консоль') ||
    lowerName.includes('подлокотник') ||
    lowerName.includes('подстаканник') ||
    lowerName.includes('зеркало заднего вида') ||
    lowerName.includes('солнцезащитный козырек')
  ) {
    return 'interior';
  }
  
  // Внешние элементы
  if (
    lowerName.includes('фара') ||
    lowerName.includes('фонарь') ||
    lowerName.includes('поворотник') ||
    lowerName.includes('стоп-сигнал') ||
    lowerName.includes('габарит') ||
    lowerName.includes('зеркало') ||
    lowerName.includes('дворник') ||
    lowerName.includes('щетка') ||
    lowerName.includes('багажник на крышу') ||
    lowerName.includes('фаркоп') ||
    lowerName.includes('кенгурятник') ||
    lowerName.includes('защита') ||
    lowerName.includes('обвес') ||
    lowerName.includes('спойлер') ||
    lowerName.includes('антикрыло') ||
    lowerName.includes('накладка') ||
    lowerName.includes('эмблема') ||
    lowerName.includes('шильдик')
  ) {
    return 'exterior';
  }
  
  // По умолчанию - прочее
  return 'other';
}
