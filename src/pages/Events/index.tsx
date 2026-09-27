import React, { useEffect } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import SearchBar from '../../components/SearchBar';
import ImageSlider from '../../components/ImageSlider';
import DatePickerSlider from '../../components/DatePickerSlider';
import { Banner } from '@shared/types';
import { toAsyncState } from '@shared/lib/utils/asyncState.ts';
import CategoriesBar from '../Establishments/components/CategoriesBar/index.tsx';
import CategorySection from '../Establishments/components/CategorySection/index.tsx';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectEventEndDate,
  selectEventSearchValue,
  selectEventStartDate,
  selectSelectedEventCategoryId,
  selectSelectedEventSubcategoryIds,
} from '@/entities/events/model/api/filters.selectors.ts';
import {
  resetFilters,
  setDateRange,
  setSearchValue,
  setSelectedCategory,
  setSubcategories,
} from '@/entities/events/model/store/filters.slice.ts';
import {
  useCaptureEventSliderClickMutation,
  useGetEventCategoriesQuery,
  useGetEventSliderImagesQuery,
  useGetEventsListQuery,
} from '@/entities/events/model/api/list.api.ts';

const EventsPage = () => {
  const dispatch = useAppDispatch();

  const searchValue = useAppSelector(selectEventSearchValue);
  const selectedCategoryId = useAppSelector(selectSelectedEventCategoryId);
  const selectedSubcategoryIds = useAppSelector(selectSelectedEventSubcategoryIds);
  const startDate = useAppSelector(selectEventStartDate);
  const endDate = useAppSelector(selectEventEndDate);

  const categoriesResult = useGetEventCategoriesQuery();
  const sliderImagesResult = useGetEventSliderImagesQuery();
  const [captureSliderClick] = useCaptureEventSliderClickMutation();

  const eventsResult = useGetEventsListQuery({
    categoryId: selectedCategoryId,
    innerCategoriesIds: selectedSubcategoryIds?.[0] ?? null,
    searchValue,
    startDate,
    endDate,
  });

  useEffect(() => {
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

  const handleDateChange = (start: Date | null, end: Date | null) => {
    dispatch(setDateRange({
      startDate: start ? start.toISOString() : null,
      endDate: end ? end.toISOString() : null,
    }));
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
        <DatePickerSlider
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
        />
        <CategoriesBar
          showDateFilter
          isFavorites={false}
          categories={toAsyncState(categoriesResult)}
          selectedCategory={selectedCategoryId}
          onSelectCategory={(id) => dispatch(setSelectedCategory(id as number | null))}
          selectedInnerCategory={selectedSubcategoryIds.length ? selectedSubcategoryIds : null}
          onSelectInnerCategory={(value) => dispatch(setSubcategories(value))}
          startDate={startDate}
          endDate={endDate}
          onClearDateFilter={() => handleDateChange(null, null)}
        />

        <CategorySection
          data={toAsyncState(eventsResult)}
          categories={toAsyncState(categoriesResult)}
          selectedCategory={selectedCategoryId}
          onSelectCategory={(id) => dispatch(setSelectedCategory(id as number | null))}
          type="events"
        />
      </List>
    </>
  );
};

export default EventsPage;
