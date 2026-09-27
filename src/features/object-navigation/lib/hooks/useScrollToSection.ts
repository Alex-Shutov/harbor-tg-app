import { useCallback, useEffect, useRef, useState } from 'react';
import { EObjectSection } from '../../types/sections.types';

/**
 * Хук для прокрутки к разделу при клике на таб
 */
export const useScrollToSection = () => {
  const sectionRefs = useRef<Map<EObjectSection, HTMLElement>>(new Map());
  const [activeSection, setActiveSection] = useState<EObjectSection | null>(null);

  // Регистрируем элемент раздела
  const registerSection = useCallback((sectionId: EObjectSection, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(sectionId, element);
    } else {
      sectionRefs.current.delete(sectionId);
    }
  }, []);

  // Прокручиваем к разделу
  const scrollToSection = useCallback((sectionId: EObjectSection) => {
    const element = sectionRefs.current.get(sectionId);
    if (element) {
      const offset = 80; // Отступ сверху для фиксированной навигации
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setActiveSection(sectionId);
    }
  }, []);

  // Отслеживаем активный раздел при прокрутке
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Отступ для определения активного раздела (учитываем высоту навигации)

      // Находим раздел, который находится в области видимости
      // Проверяем разделы снизу вверх, чтобы выбрать последний видимый
      const sectionsArray = Array.from(sectionRefs.current.entries());
      let currentSection: EObjectSection | null = null;
      
      // Сортируем по позиции сверху вниз
      const sortedSections = sectionsArray.sort((a, b) => {
        const aTop = a[1].getBoundingClientRect().top + window.pageYOffset;
        const bTop = b[1].getBoundingClientRect().top + window.pageYOffset;
        return aTop - bTop;
      });

      // Находим последний раздел, который уже прошел верх экрана
      for (let i = sortedSections.length - 1; i >= 0; i--) {
        const [sectionId, element] = sortedSections[i];
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        
        if (scrollPosition >= elementTop - 120) {
          currentSection = sectionId;
          break;
        }
      }

      // Если ни один раздел не найден, выбираем первый
      if (!currentSection && sortedSections.length > 0) {
        currentSection = sortedSections[0][0];
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    // Вызываем сразу для установки начального активного раздела
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    registerSection,
    scrollToSection,
    activeSection,
  };
};

