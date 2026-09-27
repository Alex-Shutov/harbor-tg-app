import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Общий хук для обработки deep link фильтров
 * Используется для установки фильтров на основе параметров URL
 * 
 * @param filterKey - ключ параметра в URL (например, 'taskId', 'giveawayId')
 * @param onFilterApply - callback, который вызывается когда нужно применить фильтр
 *   Принимает найденную сущность и значение фильтра
 * @param dependencies - зависимости для пересчета (например, данные для поиска)
 * @param findEntity - функция для поиска сущности по ID (опционально, по умолчанию ищет в dependencies)
 */
export const useDeepLinkFilter = <T extends { id: number }>(
  filterKey: string,
  onFilterApply: (entity: T, filterValue: string) => void,
  dependencies: any[] = [],
  findEntity?: (id: number, deps: any[]) => T | undefined
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasAppliedRef = useRef(false);
  const storageKey = `deeplink_${filterKey}_processed`;

  useEffect(() => {
    const entityId = searchParams.get(filterKey);
    
    const processedValue = sessionStorage.getItem(storageKey);
    if (processedValue === entityId) {
      if (entityId) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(filterKey);
        setSearchParams(newSearchParams, { replace: true });
      }
      return;
    }
    
    if (entityId && !hasAppliedRef.current) {
      const id = parseInt(entityId, 10);
      if (!isNaN(id)) {
        let entity: T | undefined;
        
        if (findEntity) {
          entity = findEntity(id, dependencies);
        } else {
          const allEntities = dependencies.flat().filter(Boolean) as T[];
          entity = allEntities.find(e => e.id === id);
        }
        
        if (entity) {
          hasAppliedRef.current = true;
          
          sessionStorage.setItem(storageKey, entityId);
          
          onFilterApply(entity, entityId);
          
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete(filterKey);
          setSearchParams(newSearchParams, { replace: true });
        }
      }
    }
  }, [filterKey, searchParams, setSearchParams, onFilterApply, findEntity, storageKey, ...dependencies]);

  return { hasApplied: hasAppliedRef.current };
};

