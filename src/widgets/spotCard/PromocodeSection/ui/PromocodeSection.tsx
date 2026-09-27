import React, { useState, useEffect } from 'react';
import { PromocodeCard } from './PromocodeCard';
import { EPageType } from '@shared/constants/types.constants';
import './promocode-section.scss';
import { Title, Button, BottomSheet } from '@shared/ui';
import {  useReceivePromoCode } from '@/features/recievePromoCode';
import { IPromoCode } from '@/entities/promocode/types';
import { ReceivePromoCodeFlow } from '@/features/recievePromoCode/ui';
import { motion } from 'framer-motion';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';

interface IPromocodeSectionProps {
  promoCodes: IPromoCode[];
  pageId: number;
  pageType: EPageType;
  onDataRefresh?: () => void;
}

const INITIAL_DISPLAY_COUNT = 5;
const CHECK_ALL_DISPLAY_COUNT = 1;
const LOAD_MORE_OFFSET=5

export const PromocodeSection: React.FC<IPromocodeSectionProps> = ({
                                                                     promoCodes,
                                                                     pageId,
                                                                     pageType,
                                                                     onDataRefresh,
                                                                   }) => {
  const [selectedPromoCode, setSelectedPromoCode] = useState<IPromoCode | null>(null);
  const [displayedCount, setDisplayedCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

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
    pageId: pageId,
    context: 'object',
    pageType: pageType,
    onDataRefresh: onDataRefresh,
  });

  const { containerRef, contentRef, x, constraints, recalculate } = useHorizontalScroll();

  useEffect(() => {
    if (!selectedPromoCode) {
      closePromoCodeModal();
      // if (isBottomSheetOpen){
      //   setIsBottomSheetOpen(true);
      // }
    }
  }, [selectedPromoCode, closePromoCodeModal]);

  useEffect(() => {
    recalculate();
  }, [displayedCount, recalculate]);

  const handleCardActionClick = (promoCode: IPromoCode) => {
    setSelectedPromoCode(promoCode);
    openPromoCodeModal(promoCode);
  };



  const handleLoadMore = () => {
    setDisplayedCount(prev => Math.min(prev + INITIAL_DISPLAY_COUNT, promoCodes.length));
  };

  const handleViewAll = () => {
    setIsBottomSheetOpen(true);
  };

  if (error) {
    console.error('Ошибка при получении промокода:', error);
  }

  const hasMore = promoCodes.length > displayedCount;
  const displayedPromoCodes = promoCodes.slice(0, displayedCount);
  const showSlider = promoCodes.length > 1 && promoCodes.length <= LOAD_MORE_OFFSET;
  const showLoadMore = promoCodes.length > LOAD_MORE_OFFSET && hasMore;

  if (promoCodes.length === 1) {
    return (
      <section className="promocode-section">
        <div className="promocode-section__header">
          <Title className='promocode-section__title'>Harbor Codes</Title>
        </div>

        <div className="promocode-section__single">
          <PromocodeCard
            promoCode={promoCodes[0]}
            onActionClick={() => handleCardActionClick(promoCodes[0])}
            isLoading={isLoading && selectedPromoCode?.id === promoCodes[0].id}
          />
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
      </section>
    );
  }

  return (
    <section className="promocode-section">
      <div className="promocode-section__header">
        <Title className='promocode-section__title'>Harbor Codes</Title>
      </div>
      <div className={'promocode-section__content'}>
      {showSlider ? (
        <div className="promocode-section__slider" ref={containerRef}>
          <motion.div
            className="promocode-section__slider-content"
            ref={contentRef}
            drag="x"
            dragConstraints={{ ...constraints}}
            dragElastic={0.1}
            style={{ x }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {promoCodes.map((promoCode) => (
              <PromocodeCard
                buttonDisabled={promoCodes.length > INITIAL_DISPLAY_COUNT}
                key={promoCode.id}
                promoCode={promoCode}
                onActionClick={() => handleCardActionClick(promoCode)}
                isLoading={isLoading && selectedPromoCode?.id === promoCode.id}
              />
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="promocode-section__slider" ref={containerRef}>
          <motion.div
            className="promocode-section__slider-content"
            ref={contentRef}
            drag="x"
            dragConstraints={{ ...constraints }}
            dragElastic={0.1}
            style={{ x }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {displayedPromoCodes.map((promoCode) => (
              <PromocodeCard
                key={promoCode.id}
                promoCode={promoCode}
                onActionClick={() => handleCardActionClick(promoCode)}
                isLoading={isLoading && selectedPromoCode?.id === promoCode.id}
              />
            ))}
            {showLoadMore && (
              <div className="promocode-section__load-more">
                <Button
                  type="secondary"
                  onClick={handleLoadMore}
                  className="promocode-section__load-more-button"
                >
                  Ещё
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
      {promoCodes.length > CHECK_ALL_DISPLAY_COUNT && (
        <Button
          type={'secondary'}
          onClick={handleViewAll}
          className="promocode-section__view-all"
        >
          Смотреть все
        </Button>
      )}
      </div>


      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="Harbor Codes"
      >
        <div className="promocode-section__list">
          {promoCodes.map((promoCode) => (
            <PromocodeCard
              key={promoCode.id}
              promoCode={promoCode}
              onActionClick={() => {
                setIsBottomSheetOpen(false);
                handleCardActionClick(promoCode);
              }}
              isLoading={isLoading && selectedPromoCode?.id === promoCode.id}
            />
          ))}
        </div>
      </BottomSheet>

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
    </section>
  );
};
