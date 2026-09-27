import React, { useEffect } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import SearchBar from '../../components/SearchBar/index.tsx';
import ImageSlider from '../../components/ImageSlider/index.tsx';
import { Banner } from '@shared/types';
import { toAsyncState } from '@shared/lib/utils/asyncState.ts';
import { cleanHistoryIfFromSubscription } from '../../utils/telegram.ts';
import CollectionSlider from '../Establishments/components/CollectionSlider/index.tsx';
import CategoriesBar from '../Establishments/components/CategoriesBar/index.tsx';
import CategorySection from '../Establishments/components/CategorySection/index.tsx';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectLeisureSearchValue,
  selectSelectedLeisureCategoryId,
  selectSelectedLeisureSubcategoryIds,
} from '@/entities/leisures/model/api/filters.selectors.ts';
import {
  resetFilters,
  setSearchValue,
  setSelectedCategory,
  setSubcategories,
} from '@/entities/leisures/model/store/filters.slice.ts';
import {
  useCaptureLeisureSliderClickMutation,
  useGetLeisureCategoriesQuery,
  useGetLeisureCollectionsQuery,
  useGetLeisureSliderImagesQuery,
  useGetLeisuresListQuery,
} from '@/entities/leisures/model/api/list.api.ts';

const DosugPage = () => {
  useAutoBackNavigation();
  const dispatch = useAppDispatch();

  const searchValue = useAppSelector(selectLeisureSearchValue);
  const selectedCategoryId = useAppSelector(selectSelectedLeisureCategoryId);
  const selectedSubcategoryIds = useAppSelector(selectSelectedLeisureSubcategoryIds);

  const categoriesResult = useGetLeisureCategoriesQuery();
  const collectionsResult = useGetLeisureCollectionsQuery();
  const sliderImagesResult = useGetLeisureSliderImagesQuery();
  const [captureSliderClick] = useCaptureLeisureSliderClickMutation();

  const leisuresResult = useGetLeisuresListQuery({
    categoryId: selectedCategoryId,
    innerCategoriesIds: selectedSubcategoryIds?.[0] ?? null,
    searchValue,
  });

  useEffect(() => {
    cleanHistoryIfFromSubscription();
    return () => {
      dispatch(resetFilters());
    };
  }, [dispatch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchValue(event.target.value));
  };

  const handleCaptureClick = (banner: Banner) => {
    captureSliderClick(banner.id);
  };

  return (
    <>
      <ImageSlider
        onCapture={handleCaptureClick}
        images={sliderImagesResult.data}
        isLoading={sliderImagesResult.isLoading}
      />

      <List className={'main__page'}>
        <div className={'main__page__search-section'}>
          <SearchBar value={searchValue} onChange={handleSearchChange} />
        </div>
        <CollectionSlider type={'leisure'} collections={collectionsResult.data} />
        <CategoriesBar
          isFavorites={false}
          categories={toAsyncState(categoriesResult)}
          selectedCategory={selectedCategoryId}
          onSelectCategory={(id) => dispatch(setSelectedCategory(id as number | null))}
          selectedInnerCategory={selectedSubcategoryIds.length ? selectedSubcategoryIds : null}
          onSelectInnerCategory={(value) => dispatch(setSubcategories(value))}
        />

        <CategorySection
          data={toAsyncState(leisuresResult)}
          categories={toAsyncState(categoriesResult)}
          selectedCategory={selectedCategoryId}
          onSelectCategory={(id) => dispatch(setSelectedCategory(id as number | null))}
          type="leisure"
        />
      </List>
    </>
  );
};

export default DosugPage;
