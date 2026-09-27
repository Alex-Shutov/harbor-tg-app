import React, { useEffect, useMemo, useRef } from 'react';
import { FavoritesCategory } from '../favorites.types.ts';
import { CategoryItem } from '@/pages/Establishments/components/CategoriesBar/index.tsx';
import { Category } from '@/pages/Establishments/components/CategoriesBar/categroies.atoms.ts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectFavoriteTypeCategory, selectSelectedFavoriteCategory } from '@/entities/favorites/model/api/filters.selectors.ts';
import {
  resetFavoriteTypeCategory,
  setFavoriteTypeCategory,
} from '@/entities/favorites/model/store/filters.slice.ts';
import { useGetFavoritesQuery } from '@/entities/favorites/model/api/list.api.ts';

const FavoritesTypeFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const type = useAppSelector(selectFavoriteTypeCategory);
  const selectedCategory = useAppSelector(selectSelectedFavoriteCategory);
  const favoritesResult = useGetFavoritesQuery({
    categoryId: selectedCategory.id,
    categoryType: selectedCategory.type,
  });
  const prevLengthRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetFavoriteTypeCategory());
    };
  }, [dispatch]);

  const availableTypes = useMemo(() => {
    const types: { type: string; id: number; title: string }[] = [];
    const favoritesData = favoritesResult.data;

    if (favoritesData && 'mappedEstablishments' in favoritesData) {
      if (Object.keys(favoritesData.mappedEstablishments).length > 0) {
        types.push({ type: 'ESTABLISHMENT', id: 0, title: 'Заведения' });
      } else if (type === 'ESTABLISHMENT') {
        dispatch(resetFavoriteTypeCategory());
      }
    }

    if (favoritesData && 'mappedEvents' in favoritesData) {
      if (Object.keys(favoritesData.mappedEvents).length > 0) {
        types.push({ type: 'EVENT', id: 1, title: 'Мероприятия' });
      } else if (type === 'EVENT') {
        dispatch(resetFavoriteTypeCategory());
      }
    }

    if (favoritesData && 'mappedLeisure' in favoritesData) {
      if (Object.keys(favoritesData.mappedLeisure).length > 0) {
        types.push({ type: 'LEISURE', id: 1, title: 'Досуг' });
      } else if (type === 'LEISURE') {
        dispatch(resetFavoriteTypeCategory());
      }
    }

    return types;
  }, [favoritesResult.data]);

  useEffect(() => {
    if (availableTypes.length !== prevLengthRef.current) {
      if (availableTypes.length === 1) {
        dispatch(resetFavoriteTypeCategory());
      }
      prevLengthRef.current = availableTypes.length;
    }
  }, [availableTypes, dispatch]);

  const handleTypeSelect = (selectedType: 'ESTABLISHMENT' | 'EVENT' | 'LEISURE') => {
    dispatch(setFavoriteTypeCategory(selectedType));
  };

  return (
    <div className="favorites-type-filter">
      <div className="navigate-bar-content">
        {availableTypes.map((t) => (
          <CategoryItem
            key={t.id}
            item={t as Category}
            isActive={
              type === (t as unknown as FavoritesCategory).type ||
              availableTypes.length === 1
            }
            onClick={() => handleTypeSelect(t.type as any)}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesTypeFilter;
