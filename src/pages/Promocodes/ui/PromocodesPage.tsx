import React from 'react';
import { Title } from '@shared/ui';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { EPageType } from '@shared/constants/types.constants';
import './promocodes-page.scss';
import { useGetPromoCodeCategoriesQuery, useGetPromoCodesQuery } from '@/entities/promocode/api';
import { PromoCodeFiltersWidget, usePromocodesState } from '@/widgets/promocodes';
import { useReceivePromoCode } from '@/features/recievePromoCode';
import { EPromoCodeStatus } from '@/entities/promocode/types';
import { PromocodeCard } from '@/entities/promocode/ui/PromocodeCard.tsx';
import { ReceivePromoCodeFlow } from '@/features/recievePromoCode/ui';
import { MainCategories } from '@/features/spot-list/filters/viewMainCategories';
import { PromoCodeTypeFilter } from '@/widgets/promocodes/ui';
import EmptyEstablishments from '@components/EmptyEstablishments';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';

const PromocodesPage: React.FC = () => {
  useAutoBackNavigation()
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(0);
  const [selectedType, setSelectedType] = React.useState<EPageType>(
    EPageType.ESTABLISHMENT
  );
  const { data: categories, isLoading: categoriesLoading } = useGetPromoCodeCategoriesQuery();
  const { data: promoCodesResponse, isLoading: promoCodesLoading } = useGetPromoCodesQuery(
    {
      categoryId: selectedCategoryId ?? undefined,
      type: selectedType,
    },
  );

  const { selectedStatus, filteredPromoCodes, handleStatusChange, allPromoCodes } =
    usePromocodesState({
      promoCodesResponse,
    });

  // Управление flow получения промокода
  const {
    flowState,
    toastState,
    openPromoCodeModal,
    closePromoCodeModal,
    handleApply,
    handleConfirmApply,
    handleVerifyAndUse,
    handleCancel,
    hideToast,
    isLoading,
    error,
  } = useReceivePromoCode({
    pageId: 0,
    context: 'profile',
  });

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };


  if (!promoCodesLoading && !promoCodesResponse) {
    return (
      <div className="promocodes-page">
        <div className="promocodes-page__header">
          <Title>Harbor Codes</Title>
        </div>
        <div className="promocodes-page__empty">
          <h2>У вас пока нет Harbor Codes</h2>
          <p>Harbor Codes появятся здесь, когда вы их получите</p>
        </div>
      </div>
    );
  }

  // Пустое состояние - нет промокодов
  if (!promoCodesLoading && allPromoCodes.length === 0) {
    return (
      <div className="promocodes-page">
        <div className="promocodes-page__header">
          <Title>Harbor Codes</Title>
        </div>
        <PromoCodeTypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
        {categories && <div className="promocodes-page__categories">
          <MainCategories mode={'page'} categories={categories} selectedCategoryId={selectedCategoryId} onCategoryClick={handleCategoryChange}/>
        </div>}
        <EmptyEstablishments mainLabel={'Промокоды не найдены'} secondLabel={''}/>
      </div>
    );
  }



  const handleCardClick = (promoCode: any) => {
    openPromoCodeModal(promoCode);
  };

  const getPromoCodeStatus = (promo: any): EPromoCodeStatus => {
    if (selectedStatus) {
      return selectedStatus;
    }

    if (new Date(promo.endDate) > new Date()) {
      return EPromoCodeStatus.ACTIVE;
    } else if (promo.appliedCount > 0) {
      return EPromoCodeStatus.USED;
    } else {
      return EPromoCodeStatus.COMPLETED;
    }
  };

  return (
    <div className="promocodes-page">
      {/* Заголовок */}
      <div className="promocodes-page__header">
        <Title>Harbor Codes</Title>
      </div>

      <PromoCodeTypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />

      {categoriesLoading ? (
        <div className="promocodes-page__categories-skeleton">
          <Skeleton height="40px" width="100%" />
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="promocodes-page__categories">
          <MainCategories mode={'page'} categories={categories} selectedCategoryId={selectedCategoryId} onCategoryClick={handleCategoryChange}/>
        </div>
      ) : null}

      {allPromoCodes.length > 0 && (
        <PromoCodeFiltersWidget
          promoCodesResponse={promoCodesResponse}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Список промокодов */}
      <div className="promocodes-page__list">
        {promoCodesLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                height="200px"
                width="100%"
                className="promocodes-page__card-skeleton"
              />
            ))}
          </>
        ) : filteredPromoCodes.length > 0 ? (
          filteredPromoCodes.map((promoCode) => (
            <div
              key={promoCode.id}
              className="promocodes-page__card-wrapper"
              onClick={() => handleCardClick(promoCode)}
            >
              <PromocodeCard
                promo={promoCode}
                status={getPromoCodeStatus(promoCode)}
                onClick={() => handleCardClick(promoCode)}
              />
            </div>
          ))
        ) : (
          <div className="promocodes-page__no-results">
            <p>По выбранному фильтру промокодов не найдено</p>
          </div>
        )}
      </div>

      <ReceivePromoCodeFlow
        flowState={flowState}
        isLoading={isLoading}
        error={error}
        onClose={closePromoCodeModal}
        onApply={handleApply}
        onConfirmApply={handleConfirmApply}
        onVerifyAndUse={handleVerifyAndUse}
        onCancel={handleCancel}
        toastState={toastState}
        onHideToast={hideToast}
      />
    </div>
  );
};

export default PromocodesPage;
