import { useMemo } from 'react';
import { EObjectSection, ISectionConfig } from '../../types/sections.types';
import { EPageType } from '@shared/constants';

/**
 * Конфигурации разделов для разных типов объектов
 */
const getSectionConfigs = (pageType: EPageType): ISectionConfig[] => {
  const baseConfigs: ISectionConfig[] = [
    {
      id: EObjectSection.GALLERY,
      label: 'Галерея',
      isAvailable: (data: any) => !!(data?.sectionsWithImages || data?.mainImg), // Доступно если есть галерея или главное изображение
    },
    {
      id: EObjectSection.GENERAL,
      label: 'Общее',
      isAvailable: () => true, // Всегда доступно
    },
    // {
    //   id: EObjectSection.ADDRESS,
    //   label: 'Адрес',
    //   isAvailable: () => true, // Всегда доступно
    // },
    // {
    //   id: EObjectSection.REVIEW,
    //   label: 'Обзор',
    //   isAvailable: (data: any) => !!data?.review,
    // },
  ];

  if (pageType === EPageType.ESTABLISHMENT) {
    return [
      ...baseConfigs,
      {
        id: EObjectSection.MENU,
        label: 'Меню',
        isAvailable: (data: any) => !!data?.menu,
      },
      {
        id: EObjectSection.ADDRESS,
        label: 'Адрес',
        isAvailable: () => true, // Всегда доступно
      },
      {
        id: EObjectSection.REVIEW,
        label: 'Обзор',
        isAvailable: (data: any) => !!data?.review,
      },
      {
        id: EObjectSection.EVENTS,
        label: 'События',
        isAvailable: (data: any) => !!(data?.events && data.events.length > 0),
      },
    ];
  }

  if (pageType === EPageType.LEISURE) {
    return [
      ...baseConfigs,
      {
        id: EObjectSection.ADDRESS,
        label: 'Адрес',
        isAvailable: () => true,
      },
      {
        id: EObjectSection.REVIEW,
        label: 'Обзор',
        isAvailable: (data: any) => !!data?.review,
      },
      {
        id: EObjectSection.EVENTS,
        label: 'События',
        isAvailable: (data: any) => !!(data?.events && data.events.length > 0),
      },
    ];
  }

  if (pageType === EPageType.EVENT) {
    return [
      ...baseConfigs,
      {
        id: EObjectSection.ADDRESS,
        label: 'Адрес',
        isAvailable: () => true,
      },
      {
        id: EObjectSection.REVIEW,
        label: 'Обзор',
        isAvailable: (data: any) => !!data?.review,
      },

    ];
  }

  return baseConfigs;
};

export const useObjectSections = <T extends Record<string, any>>(
  data: T | undefined,
  pageType: EPageType
) => {
  const sections = useMemo(() => {
    if (!data) return [];

    const configs = getSectionConfigs(pageType);
    
    return configs
      .filter((config) => config.isAvailable(data))
      .map((config) => ({
        id: config.id,
        label: config.label,
        isAvailable: true,
      }));
  }, [data, pageType]);

  return sections;
};

