import React, { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import './CategorySection.scss';
import CategoryHeader from './components/CategoryHeader';
import EstablishmentList from './components/EstablishmentList';
import Loader from '../../../../shared/Loader';
import { FoodEstablishmentInfoDto } from './categorySection.types.ts';

import { FavoritesCategory } from '../../../Account/components/Favorites/favorites.types.ts';
import EmptyEstablishments from '../../../../components/EmptyEstablishments';
import { AsyncState } from '@shared/types/common.types';

type CategoryType = {
  id: number;
  title: string;
  type?: 'ESTABLISHMENT' | 'EVENT' | 'LEISURE';
};



  type DataType =
    | Record<number, FoodEstablishmentInfoDto[]>
    | {isEmpty?:boolean, mappedEstablishments: Record<number, FoodEstablishmentInfoDto[]>,  mappedEvents: Record<number, FoodEstablishmentInfoDto[]>, mappedLeisure:Record<number, FoodEstablishmentInfoDto[]> }
    | FoodEstablishmentInfoDto[]
    | null;


  interface CategorySectionProps {
    data: AsyncState<DataType>;
    categories: AsyncState<CategoryType[]>;
    selectedCategory: CategoryType | FavoritesCategory | number | null;
    onSelectCategory: (id: CategoryType | FavoritesCategory | number | null) => void;
    type: 'establishments' | 'events' | 'favorites' | 'leisure';
    onEmptyCategory?: () => void;
  }

  const CategorySection: React.FC<CategorySectionProps> = ({
                                                             data: initialData,
                                                             categories,
                                                             selectedCategory,
                                                             onSelectCategory,
                                                             type,
    onEmptyCategory,
                                                           }) => {
    const [data, setLocalData] = useState<AsyncState<DataType>>(initialData);

  useEffect(() => {
    setLocalData(initialData);
  }, [initialData]);

    const handleEmptyCategory = () => {
      if (type === 'favorites') {
        onEmptyCategory && onEmptyCategory();
      }
    };
    const updateLocalData = useCallback((updatedItem: FoodEstablishmentInfoDto) => {
      {
      setLocalData(prev => {
        if (prev.state !== 'hasData' || !prev.data) return prev;

      // Для массива (детальный просмотр)
      if (Array.isArray(prev.data)) {
        return {
          ...prev,
          data: prev.data.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          )
        };
      }

      // Для Favorites с разделением по типам
      if (type === 'favorites' && 'mappedEstablishments' in prev.data && 'mappedEvents' in prev.data && 'mappedLeisure' in prev.data) {
        const updatedData = { ...prev.data };

        // Обновляем в mappedEstablishments
        if (updatedData.mappedEstablishments) {
          Object.keys(updatedData.mappedEstablishments).forEach(categoryId => {
            // @ts-ignore
            updatedData.mappedEstablishments[categoryId] = updatedData.mappedEstablishments[categoryId].map(item =>
              item.id === updatedItem.id ? updatedItem : item
            );
          });
        }

        // Обновляем в mappedEvents
        if (updatedData.mappedEvents) {
          Object.keys(updatedData.mappedEvents).forEach(categoryId => {
            // @ts-ignore
            updatedData.mappedEvents[categoryId] = updatedData.mappedEvents[categoryId].map(item =>
              item.id === updatedItem.id ? updatedItem : item
            );
          });
        }
        if (updatedData.mappedLeisure) {
          Object.keys(updatedData.mappedLeisure).forEach(categoryId => {
            // @ts-ignore
            updatedData.mappedLeisure[categoryId] = updatedData.mappedLeisure[categoryId].map(item =>
              item.id === updatedItem.id ? updatedItem : item
            );
          });
        }

        return { ...prev, data: updatedData };
      }

      // Для других типов (establishments, events)
      const updatedData = { ...prev.data };
      Object.keys(updatedData).forEach(categoryId => {
        // @ts-ignore
        updatedData[categoryId] = updatedData[categoryId]?.map((item:any) =>
          item.id === updatedItem.id ? updatedItem : item
        );
      });

      return { ...prev, data: updatedData };
    })
      };
    }, [type]);

  const onLikeClick = useCallback((item: FoodEstablishmentInfoDto) => {
    const updatedItem = { ...item };
    updateLocalData(updatedItem);
  }, [updateLocalData]);


  const groupedByCategory = useMemo(() => {
    if (data.state !== 'hasData' || !data.data) return {};

      // Для массива (детальный просмотр)


    if (Array.isArray(data.data)) return data.data;

    // Для Favorites с разделением по типам
    if (type === 'favorites' && 'mappedEstablishments' in data.data && 'mappedEvents' in data.data && "mappedLeisure" in data.data) {
      const result: Record<string, FoodEstablishmentInfoDto[]> = {};

      // Если выбрано "Все" или не выбран тип
      if (!selectedCategory || (selectedCategory as FavoritesCategory).id === 0 || !(selectedCategory as FavoritesCategory).type) {
        // Добавляем заведения с префиксом
        Object.entries(data.data.mappedEstablishments || {}).forEach(([categoryId, items]) => {
          result[`ESTABLISHMENT_${categoryId}`] = items.map(item => ({
            ...item,
            entityType: 'FOOD_ESTABLISHMENT'
          }));
        });

        // Добавляем мероприятия с префиксом
        Object.entries(data.data.mappedEvents || {}).forEach(([categoryId, items]) => {
          result[`EVENT_${categoryId}`] = items.map(item => ({
            ...item,
            entityType: 'EVENT'
          }));
        });

        Object.entries(data.data.mappedLeisure || {}).forEach(([categoryId, items]) => {
          result[`LEISURE_${categoryId}`] = items.map(item => ({
            ...item,
            entityType: 'LEISURE'
          }));
        });

        return result;
      }

      const typeToCheck =
        (selectedCategory as FavoritesCategory).type === 'EVENT' ? 'mappedEvents' :
          (selectedCategory as FavoritesCategory).type === 'LEISURE' ? 'mappedLeisure' :
            'mappedEstablishments';

      const typedData = data.data[typeToCheck] || {};
      return Object.fromEntries(
        Object.entries(typedData).map(([categoryId, items]) => [
          categoryId,
          items.map(item => ({
            ...item,
            entityType: (selectedCategory as FavoritesCategory).type
          }))
        ])
      );
    }

    // Для других типов (establishments, events)
    return data.data as Record<number, FoodEstablishmentInfoDto[]>;
  }, [data, type, selectedCategory]);

    const handleCategorySelect = (id: CategoryType | number) => {
      startTransition(() => {
        onSelectCategory(id);
      });
    };
     
    if (type === 'favorites' && data.state === 'hasData' && data.data &&
      'isEmpty' in data.data &&
      data.data.isEmpty){
      return <div className={'empty-cont'}>
        <EmptyEstablishments
          mainLabel={'В избранном пока пусто'}
          secondLabel={'Добавляйте понравившиеся места и они появятся здесь'}
        />
      </div>
    }

    if (type!=='favorites' && categories.state === 'loading' || data.state === 'loading') return <Loader style={{paddingBottom:'100vh'}} />;


    const renderCategorySection = () => {
      const isDetailedView = (type === 'favorites' &&
          selectedCategory &&
          (selectedCategory as FavoritesCategory).id !== 0 &&
          (selectedCategory as FavoritesCategory).id) ||
        (type !== 'favorites' && selectedCategory);

      if (isDetailedView && Array.isArray(groupedByCategory)) {
        return (
          <div className="detailed-view">
            <EstablishmentList
              type={type}
              isDetailed
              direction={'y'}
              establishments={groupedByCategory}
              onEmptyCategory={handleEmptyCategory}
            />
          </div>
        );
      }




    const getCategory = (categoryKey: string) => {
      if (type === 'favorites' && (categoryKey.startsWith('ESTABLISHMENT_') || categoryKey.startsWith('EVENT_') || categoryKey.startsWith("LEISURE_"))) {
        const [prefix, originalId] = categoryKey.split('_');
        const category = categories.state === 'hasData' &&
          categories.data.find(cat => cat.id === Number(originalId) && cat?.type === prefix);

        return category ? {
          ...category,
          modifiedId: categoryKey,
          isEstablishment: prefix === 'ESTABLISHMENT',
          isEvent: prefix === 'EVENT',
          isLeisure: prefix === 'LEISURE',
        } : null;
      }

      const category = categories.state === 'hasData' &&
        categories.data.find(cat => cat.id === Number(categoryKey));
      return category ? { ...category, modifiedId: categoryKey } : null;
    };
      if(!Object.values(groupedByCategory).some(items=>!!items && items.length)){
        return <div className={'empty-cont'}>
          <EmptyEstablishments
            mainLabel={'По данным фильтрам ничего не найдено'}
            secondLabel={'Попробуйте изменить фильтры'}
          />
        </div>
      }
      if (categories.state === 'hasData' && Object.values(groupedByCategory).length === 0) {
        return <div className={'empty-cont'}>
          <EmptyEstablishments
            mainLabel={'По данным фильтрам ничего не найдено'}
            secondLabel={'Попробуйте изменить фильтры'}
          />
        </div>
      }

    return categories.state === 'hasData' && Object.entries(groupedByCategory).map(([categoryKey, items]) => {
      const category = getCategory(categoryKey) as any;
      if (!category || (category && items && items.length === 0)) return null;

      const getTypeByCategory = () => {
        if (category?.isEvent) return "EVENT"
        else if (category?.isEstablishment) return "ESTABLISHMENT"
        else return "LEISURE"
      }




        return (
          <div key={category.modifiedId} className="category-section">
            <CategoryHeader
              title={category.title}
              onSelect={() => handleCategorySelect(
                type === 'favorites' && (category.isEstablishment || category?.isEvent || category?.isLeisure)
                  ? { ...category, type: getTypeByCategory()}
                  : category.id
              )}
            />
            <EstablishmentList
              onLikeClick={onLikeClick}
              type={type}
              direction={'x'}
              establishments={items}
              onEmptyCategory={handleEmptyCategory}
            />
          </div>
        );
      });
    };

  return <div className="category-sections">{renderCategorySection()}</div>;
};

export default CategorySection;
