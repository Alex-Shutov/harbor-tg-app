import './Favorites.scss';
import { useAutoBackNavigation } from '@/hooks/useAutoBackNavigation';
import FavoritesTypeFilter from './components/FavoritesTypeFilter.tsx';
import CategoriesBar from '@/pages/Establishments/components/CategoriesBar/index.tsx';
import CategorySection from '@/pages/Establishments/components/CategorySection/index.tsx';
import { toAsyncState } from '@shared/lib/utils/asyncState.ts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectFavoriteTypeCategory,
  selectSelectedFavoriteCategory,
} from '@/entities/favorites/model/api/filters.selectors.ts';
import {
  resetSelectedFavoriteCategory,
  setSelectedFavoriteCategory,
} from '@/entities/favorites/model/store/filters.slice.ts';
import {
  useGetFavoriteCategoriesQuery,
  useGetFavoritesQuery,
} from '@/entities/favorites/model/api/list.api.ts';
import { FavoritesCategory } from './favorites.types.ts';

const ProfileFavorites: React.FC = () => {
  useAutoBackNavigation();
  const dispatch = useAppDispatch();

  const favoriteTypeCategory = useAppSelector(selectFavoriteTypeCategory);
  const selectedCategory = useAppSelector(selectSelectedFavoriteCategory);

  const categoriesResult = useGetFavoriteCategoriesQuery(favoriteTypeCategory);
  const favoritesResult = useGetFavoritesQuery({
    categoryId: selectedCategory.id,
    categoryType: selectedCategory.type,
  });

  const handleEmptyCategory = () => {
    dispatch(resetSelectedFavoriteCategory());
  };

  const handleSelectCategory = (id: FavoritesCategory | number | null) => {
    if (id === null) {
      dispatch(resetSelectedFavoriteCategory());
      return;
    }
    if (typeof id === 'number') {
      dispatch(setSelectedFavoriteCategory({ id, title: '', type: '', entityType: '' }));
      return;
    }
    dispatch(setSelectedFavoriteCategory(id));
  };

  return (
    <div className="profile-favorites">
      <div className="profile-favorites__header">
        <h1>Избранное</h1>
      </div>

      <FavoritesTypeFilter />
      <CategoriesBar
        favorites={toAsyncState(favoritesResult)}
        categories={toAsyncState(categoriesResult) as any}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory as any}
        isFavorites={true}
        selectedInnerCategory={null}
        onSelectInnerCategory={null}
      />
      <CategorySection
        onEmptyCategory={handleEmptyCategory}
        data={toAsyncState(favoritesResult)}
        categories={toAsyncState(categoriesResult) as any}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory as any}
        type={'favorites'}
      />
    </div>
  );
};
export default ProfileFavorites;
