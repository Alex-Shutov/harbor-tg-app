import React from 'react';
import { BottomSheetWithImage } from '@shared/ui';
import { Counter } from '@shared/ui';
import { Button } from '@shared/ui';
import { UrbanWhiteOrangeIcon } from '@shared/ui';
import { IStoreItem, EStoreItemType } from '@/entities/shop/types';
import './shop-item-modal.scss';

interface IShopItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: IStoreItem | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isLoading?: boolean;
  isInCart?: boolean;
}

export const ShopItemModal: React.FC<IShopItemModalProps> = ({
  isOpen,
  onClose,
  item,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  isLoading = false,
  isInCart = false,
}) => {
  const isPromoCode = item?.type === EStoreItemType.PROMO_CODE;
  const isProduct = item?.type === EStoreItemType.PRODUCT;
  const isUrbanBox = item?.type === EStoreItemType.URBAN_BOX;

  const maxQuantity = isPromoCode
    ? 1 
    : (item?.onePerHand ? 1 : (item?.availableQuantity || 1));

  // Преобразуем additionalImages в массив URL для передачи в BottomSheetWithImage
  const additionalImagesUrls = item?.additionalImages?.map(img => img.url) || [];

  const handleContactUsernameClick = (username: string | undefined) => {
    if (!username) return;
    
    // Убираем @ если есть
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
    
    if (window.Telegram?.WebApp?.openTelegramLink) {
      try {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${cleanUsername}`);
      } catch (error) {
        console.warn('Failed to open Telegram link, falling back to window.open:', error);
        // Фолбек: открываем в новой вкладке
        window.open(`https://t.me/${cleanUsername}`, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Фолбек: открываем в новой вкладке
      window.open(`https://t.me/${cleanUsername}`, '_blank', 'noopener,noreferrer');
    }
  }

  if (!item) return null;

  return (
    <BottomSheetWithImage
      isOpen={isOpen}
      onClose={onClose}
      mainImage={item.mainImage.url}
      additionalImages={additionalImagesUrls}
      imageAlt={item.title}
      title={isPromoCode ? item.description : item.title}
      closeOnOverlayClick={true}
    >
      <div className="shop-item-modal">
        <div className="shop-item-modal__content">
            {(isPromoCode || isProduct) && item.description && (
              <div className="shop-item-modal__description">
                <p>{item.description}</p>
              </div>
            )}

            {isUrbanBox && item.description && (
              <div className="shop-item-modal__description">
                <div className="shop-item-modal__section-title">Что внутри</div>
                <p>{item.description}</p>
              </div>
            )}

            {((isPromoCode && item.objectTitle) || (isUrbanBox && item.establishmentTitle))  || (isProduct && item.establishmentTitle) && (
              <div className="shop-item-modal__establishment">
                <div className="shop-item-modal__section-title">Заведение:</div>
                <p>{isPromoCode ? item.objectTitle : item.establishmentTitle}</p>
              </div>
            )}

            {(isUrbanBox || isProduct) && item.availableQuantity !== undefined && item.availableQuantity > 0 && (
              <div className="shop-item-modal__available">
                <div className="shop-item-modal__section-title">Осталось:</div>
                <p>{item.availableQuantity}</p>
              </div>
            )}

            <div className="shop-item-modal__cost">
              <div className="shop-item-modal__section-title">Стоимость:</div>
              <div className="shop-item-modal__cost-value">
                {isUrbanBox ? (
                  <span>{item.priceCustomer || item.cost} ₽</span>
                ) : (
                  <>
                    <span>{item.cost}</span>
                    <UrbanWhiteOrangeIcon viewBox={'-4 -4 30 30'} size={16} />
                  </>
                )}
              </div>
            </div>

            {isUrbanBox && item.pickupHours && (
              <div className="shop-item-modal__pickup">
                <div className="shop-item-modal__section-title">Самовывоз:</div>
                <p>{item.pickupHours}</p>
              </div>
            )}

            {(isUrbanBox || isProduct) && item.pickupLocation && (
              <div className="shop-item-modal__address">
                <div className="shop-item-modal__section-title">Адрес:</div>
                <p>{item.pickupLocation}</p>
              </div>
            )}

            {isProduct && item.contactUsername && (
              <div className="shop-item-modal__address">
                <div className="shop-item-modal__section-title">Кто с вами свяжется:</div>
                <p className={'link'} onClick={()=>handleContactUsernameClick(item.contactUsername)}>{item.contactUsername}</p>
              </div>
            )}


            <div className="shop-item-modal__actions">
              {!isInCart || quantity == 0 ? (
                <Button
                  type="primary"
                  fullWidth
                  onClick={onAddToCart}
                  disabled={isLoading || (item.availableQuantity !== undefined && item.availableQuantity === 0)}
                >
                  Добавить в корзину
                </Button>
              ) : (
                <div className="shop-item-modal__cart-controls">
                  <Button
                    type="primary"
                    onClick={onBuyNow}
                    disabled={isLoading}
                    className="shop-item-modal__buy-button"
                  >
                    Купить сейчас
                  </Button>
                  <Counter
                    value={quantity}
                    min={0}
                    max={maxQuantity}
                    onChange={onQuantityChange}
                    disabled={isLoading}
                    className="shop-item-modal__counter"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </BottomSheetWithImage>
  );
};

