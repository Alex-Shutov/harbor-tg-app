import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { List } from '@telegram-apps/telegram-ui';
import { useGetShowcaseQuery, useGetBannersQuery, useSearchQuery } from '@/entities/main';
import ImageSlider from '../../components/ImageSlider';
import SearchBar from '../../components/SearchBar';
import { ShowcaseGrid } from '@/widgets/showcase';
import { Title } from '@shared/ui';
import Loader from '../../shared/Loader';
import useBackButton from '../../hooks/useBackButton';
import { cleanHistoryIfFromSubscription } from '../../utils/telegram';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation';
import { IBanner } from '@/entities/main';
import './main.scss';
import { MainTabs } from '@/widgets/main';
import EmptyEstablishments from '@components/EmptyEstablishments';
import { AnimatePresence, motion } from 'framer-motion';

const MainPage = () => {
  useAutoBackNavigation();
  const { hide } = useBackButton();
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { data: showcaseData, isLoading: isLoadingShowcase } = useGetShowcaseQuery();
  const { data: bannersData, isLoading: isLoadingBanners } = useGetBannersQuery();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const shouldSearch = useMemo(() => debouncedSearchValue && debouncedSearchValue.trim().length > 0, [debouncedSearchValue]);
  const { data: searchData, isLoading: isLoadingSearch } = useSearchQuery(debouncedSearchValue || '', {
    skip: !shouldSearch,
  });

  useEffect(() => {
    hide();
    cleanHistoryIfFromSubscription();
    return () => {
      setSearchValue('');
    };
  }, [hide, setSearchValue]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleBannerClick = (banner: IBanner | any) => {
    if (banner && banner.linkToFollow) {
      window.open(banner.linkToFollow, '_blank', 'noopener,noreferrer');
    }
  };


  const isLoading = isLoadingShowcase || isLoadingBanners || (shouldSearch && isLoadingSearch);

  const isSearchNotEmpty = searchValue.trim().length > 0;
  const shouldHideTabs = isSearchFocused && isSearchNotEmpty;

  const handleSearchFocus = useCallback(() => setIsSearchFocused(true), []);
  const handleSearchBlur = useCallback(() => setIsSearchFocused(false), []);

  if (isLoading && !shouldSearch) {
    return <Loader />;
  }

  const bannerImages = bannersData || [];
  const showcaseItems = shouldSearch ? (searchData || []) : (showcaseData || []);

  return (
    <>
      { (
        <ImageSlider
          onCapture={handleBannerClick}
          images={bannerImages.map(b => ({
            id: b.id,
            imgUrl: b.imgUrl,
            linkToFollow: b.linkToFollow,
            serialNumber: b.serialNumber,
          }))}
          isLoading={isLoadingBanners}
        />
      )}
      <List className="main__page">
        <div className="main__page__search-section">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
        </div>

        <AnimatePresence initial={false}>
          {!shouldHideTabs && (
            <motion.div
              key="main-tabs"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <MainTabs />
            </motion.div>
          )}
        </AnimatePresence>

        {showcaseItems.length > 0 && (
          <>
            <Title className="main__page__title">
              {shouldSearch ? 'Результаты поиска' : 'Подборка для вас'}
            </Title>
            <ShowcaseGrid items={showcaseItems} />
          </>
        )}
        
        {shouldSearch && showcaseItems.length === 0 && !isLoadingSearch && (
          <EmptyEstablishments mainLabel={"Увы, ничего не найдено"} secondLabel={''}/>
        )}
      </List>
    </>
  );
};

export default MainPage;

