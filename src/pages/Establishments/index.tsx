import ImageSlider from '../../components/ImageSlider';
import { List } from '@telegram-apps/telegram-ui';
import React, { useEffect, useState } from 'react';
import CollectionSlider from './components/CollectionSlider';
import './main.scss';
import SearchBar from '../../components/SearchBar';
import CategoriesBar from './components/CategoriesBar';
import CategorySection from './components/CategorySection';
import {
  useCaptureEstablishmentSliderClickMutation,
  useGetEstablishmentCategoriesQuery,
  useGetEstablishmentCollectionsQuery,
  useGetEstablishmentSliderImagesQuery,
  useGetEstablishmentsListQuery,
} from '@/entities/establishments/model/api';
import { useFiltersEstablishments } from '@/entities/establishments/model/store/useFiltersEstablishmentStore.ts';
import { Banner } from '@shared/types';
import { toAsyncState } from '@shared/lib/utils/asyncState.ts';
import { cleanHistoryIfFromSubscription } from '../../utils/telegram.ts';
import { FiltersSection } from '@/widgets/establishmentsList/FiltersWidget_old/ui/FiltersSection/FiltersSection.tsx';
import { FiltersModal } from '@/widgets/establishmentsList/FiltersWidget_old/ui/FiltersModal/FiltersModal.tsx';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';

const EstablishmentsPage = () => {
  useAutoBackNavigation();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  const {
    selectedCategoryId,
    selectedSubcategoryIds,
    workTime,
    costLevel,
    isPromotionExist,
    searchValue,
    selectCategory,
    selectSubcategories,
    updateSearchValue,
    resetAllFilters,
  } = useFiltersEstablishments();

  const categoriesResult = useGetEstablishmentCategoriesQuery();
  const collectionsResult = useGetEstablishmentCollectionsQuery();
  const sliderImagesResult = useGetEstablishmentSliderImagesQuery();
  const [captureSliderClick] = useCaptureEstablishmentSliderClickMutation();

  const establishmentsResult = useGetEstablishmentsListQuery({
    categoryId: selectedCategoryId,
    innerCategoriesIds: selectedSubcategoryIds,
    searchValue,
    workTime,
    costLevel,
    isPromotionExist,
  });

  useEffect(() => {
    cleanHistoryIfFromSubscription();
    return () => {
      updateSearchValue('');
      resetAllFilters();
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchValue(event.target.value);
  };

  const handleCaptureClick = (banner: Banner) => {
    captureSliderClick(banner.id);
  };

  const handleApplyFilters = () => {
    console.log('Filters applied');
  };

  const selectedInnerCategory = selectedSubcategoryIds.length > 0 ? selectedSubcategoryIds : null;

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
        <CollectionSlider type="establishments" collections={collectionsResult.data} />
        <CategoriesBar
          isFavorites={false}
          categories={toAsyncState(categoriesResult)}
          selectedCategory={selectedCategoryId}
          onSelectCategory={(id) => selectCategory(id as number | null)}
          selectedInnerCategory={selectedInnerCategory}
          onSelectInnerCategory={selectSubcategories}
        />
        <FiltersSection onFiltersClick={() => setIsFiltersModalOpen(true)} />
        <CategorySection
          data={toAsyncState(establishmentsResult)}
          categories={toAsyncState(categoriesResult)}
          selectedCategory={selectedCategoryId}
          onSelectCategory={(id) => selectCategory(id as number | null)}
          type="establishments"
        />
      </List>
      <FiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
};

export default EstablishmentsPage;
