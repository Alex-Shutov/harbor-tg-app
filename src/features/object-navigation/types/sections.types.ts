/**
 * Типы разделов для навигации по странице объекта
 */
export enum EObjectSection {
  GALLERY = 'gallery', // Галерея
  GENERAL = 'general', // Общее
  MENU = 'menu', // Меню
  ADDRESS = 'address', // Адрес
  REVIEW = 'review', // Обзор
  EVENTS = 'events', // События
}

export interface IObjectSection {
  id: EObjectSection;
  label: string;
  isAvailable: boolean;
}

/**
 * Конфигурация разделов для разных типов объектов
 */
export interface ISectionConfig {
  id: EObjectSection;
  label: string;
  // Функция для проверки доступности раздела на основе данных объекта
  isAvailable: (data: any) => boolean;
}

