import React, { useState, useMemo, useCallback } from 'react';
import { BottomSheet, Button, Chip, Counter } from '@shared/ui';
import { UrbanWhiteOrangeIcon } from '@shared/ui';
import {
  selectUnavailableItems,
  selectCartItems,
  selectGroupedCartByEstablishment,
  setCart,
  setUnavailableItems,
  setCartStats,
} from '@/entities/shop/model/cart.slice';
import { useSelector } from 'react-redux';
import { EStoreItemType } from '@/entities/shop/types';
import { useRemoveFromCartMutation, useDecreaseCartItemMutation, useAddToCartMutation, useCreateOrderMutation } from '@/entities/shop/api/store.api';
import { useAppDispatch } from '@/store/hooks';
import './shop-order-modal.scss';
import { TrashIcon } from '@shared/ui/icons/variants/trash.tsx';
import ToastMessage from '@/components/ToastMessage';

interface IShopOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReserve?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  dividedInGroups?: boolean;
}

export const ShopOrderModal: React.FC<IShopOrderModalProps> = ({
  isOpen,
  onClose,
  onReserve,
  isLoading: externalIsLoading,
  isSuccess: externalIsSuccess,
  dividedInGroups = false,
}) => {
  const dispatch = useAppDispatch();
  const [selectedFilter, setSelectedFilter] = useState<string | number | null>(null);
  const [toastState, setToastState] = useState({
    isVisible: false,
    title: '',
    description: '',
    icon:'',
    type: 'success' as 'success' | 'error',
  });

  const cartItems = useSelector(selectCartItems);
  const groupedByEstablishment = useSelector(selectGroupedCartByEstablishment);
  const unavailableItems = useSelector(selectUnavailableItems);

  const [removeFromCart] = useRemoveFromCartMutation();
  const [decreaseCartItem] = useDecreaseCartItemMutation();
  const [addToCart] = useAddToCartMutation();
  const [createOrder, { isLoading: isCreatingOrder, isSuccess: isOrderSuccess }] = useCreateOrderMutation();

  const isLoading = externalIsLoading || isCreatingOrder;
  const isSuccess = externalIsSuccess || isOrderSuccess;

  const showSuccessToast = useCallback((message: string) => {
    setToastState({
      isVisible: true,
      type: 'success',
      icon: '/subscribe-confirmed.gif',
      title: 'Успешно!',
      description: message,
    });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    setToastState({
      isVisible: true,
      type: 'error',
      icon: '/empty.gif',
      title: 'Ошибка',
      description: message,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Группировка для режима dividedInGroups
  const groupedForFilters = useMemo(() => {
    if (!dividedInGroups) return null;

    const grouped: Record<string, { id: number; title: string; items: typeof cartItems; type: 'establishment' | 'promocode' | 'product' }> = {};

    // Группируем наборы по заведениям используя селектор из Redux
    if (groupedByEstablishment) {
      const establishmentEntries = Object.entries(groupedByEstablishment);
      if (establishmentEntries.length > 0) {
        establishmentEntries.forEach(([establishmentId, establishmentGroup]) => {
          if (establishmentGroup && establishmentGroup.items && establishmentGroup.items.length > 0) {
            const key = `establishment_${establishmentId}`;
            grouped[key] = {
              id: establishmentGroup.establishmentId,
              title: establishmentGroup.establishmentTitle,
              items: establishmentGroup.items,
              type: 'establishment',
            };
          }
        });
      }
    }

    // Все промокоды в один чип
    const promocodes = cartItems.filter((item) => item.item.type === EStoreItemType.PROMO_CODE);
    if (promocodes.length > 0) {
      grouped['promocodes'] = {
        id: 0,
        title: 'Harbor Codes',
        items: promocodes,
        type: 'promocode',
      };
    }

    // Все товары в один чип
    const products = cartItems.filter((item) => item.item.type === EStoreItemType.PRODUCT);
    if (products.length > 0) {
      grouped['products'] = {
        id: 0,
        title: 'Товары',
        items: products,
        type: 'product',
      };
    }

    return grouped;
  }, [cartItems, dividedInGroups, groupedByEstablishment]);

  // Фильтры для режима dividedInGroups
  const establishmentFilters = useMemo(() => {
    if (!dividedInGroups || !groupedForFilters) return [];

    // Сортируем: сначала промокоды, потом товары, потом заведения
    const filters = Object.entries(groupedForFilters).map(([key, group]) => ({
      key,
      id: group.id,
      title: group.title,
      type: group.type,
    }));

    // Сортируем: промокоды -> товары -> заведения
    return filters.sort((a, b) => {
      const order = { promocode: 0, product: 1, establishment: 2 };
      return (order[a.type] || 99) - (order[b.type] || 99);
    });
  }, [dividedInGroups, groupedForFilters]);

  // Фильтры для режима по типам
  const typeFilters = useMemo(() => {
    if (dividedInGroups) return [];

    // Убираем "Все", оставляем только конкретные типы
    const filters = [];

    const hasPromoCodes = cartItems.some((item) => item.item.type === EStoreItemType.PROMO_CODE);
    const hasProducts = cartItems.some((item) => item.item.type === EStoreItemType.PRODUCT);
    const hasUrbanBoxes = cartItems.some((item) => item.item.type === EStoreItemType.URBAN_BOX);

    // Порядок: промокоды -> товары -> наборы
    if (hasPromoCodes) {
      filters.push({ key: EStoreItemType.PROMO_CODE, label: 'Harbor Codes' });
    }
    if (hasProducts) {
      filters.push({ key: EStoreItemType.PRODUCT, label: 'Товары' });
    }
    if (hasUrbanBoxes) {
      filters.push({ key: EStoreItemType.URBAN_BOX, label: 'наборы' });
    }

    return filters;
  }, [dividedInGroups, cartItems]);

  // Устанавливаем первый фильтр по умолчанию
  React.useEffect(() => {
    if (dividedInGroups && establishmentFilters.length > 0 && selectedFilter === null) {
      setSelectedFilter(establishmentFilters[0].key);
    } else if (!dividedInGroups && typeFilters.length > 0 && selectedFilter === null) {
      setSelectedFilter(typeFilters[0].key);
    }
  }, [dividedInGroups, establishmentFilters, typeFilters, selectedFilter]);



  const selectedItems = useMemo(() => {
    if (selectedFilter === null) {
      // Если фильтр не выбран, возвращаем первый доступный
      if (dividedInGroups && establishmentFilters.length > 0) {
        const firstFilter = establishmentFilters[0];
        return groupedForFilters?.[firstFilter.key]?.items || [];
      } else if (!dividedInGroups && typeFilters.length > 0) {
        const firstFilter = typeFilters[0];
        return cartItems.filter((item) => item.item.type === firstFilter.key);
      }
      return [];
    }

    if (dividedInGroups) {
      // Фильтр по группе (заведение, промокоды или товары)
      const group = groupedForFilters?.[selectedFilter as string];
      return group?.items || [];
    } else {
      // Фильтр по типу
      return cartItems.filter((item) => item.item.type === selectedFilter);
    }
  }, [selectedFilter, cartItems, dividedInGroups, groupedForFilters, establishmentFilters, typeFilters]);

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      const response = await removeFromCart({ cartItemId }).unwrap();
      // Обновляем Redux состояние после удаления
      dispatch(setCart(response.items));
      dispatch(setUnavailableItems(response.unavailableItems));
      dispatch(setCartStats({
        totalItems: response.totalItems,
        unavailableItemsCount: response.unavailableItemsCount,
      }));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = async (cartItemId: number, newQuantity: number, currentQuantity: number) => {
    if (newQuantity === 0) {
      await handleRemoveItem(cartItemId);
      return;
    }

    try {
      let response;
      if (newQuantity < currentQuantity) {
        response = await decreaseCartItem({
          cartItemId,
          decreaseBy: currentQuantity - newQuantity,
        }).unwrap();
      } else if (newQuantity > currentQuantity) {
        // Находим item по cartItemId и добавляем разницу
        const cartItem = cartItems.find((item) => item.cartItemId === cartItemId);
        if (cartItem) {
          response = await addToCart({
            itemType:cartItem.item.type,
            itemId: cartItem.item.id,
            quantity: newQuantity - currentQuantity,
          }).unwrap();
        }
      }

      // Обновляем Redux состояние после изменения количества
      if (response) {
        dispatch(setCart(response.items));
        dispatch(setUnavailableItems(response.unavailableItems));
        dispatch(setCartStats({
          totalItems: response.totalItems,
          unavailableItemsCount: response.unavailableItemsCount,
        }));
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const totalQuantity = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItems]);

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      const itemPrice = (item.item.priceCustomer || item.item.cost) * item.quantity;
      return sum + itemPrice;
    }, 0);
  }, [selectedItems]);

  // Определяем тип валюты для выбранных товаров
  const currencyType = useMemo(() => {
    if (selectedItems.length === 0) return 'rubles'; // По умолчанию рубли

    const hasUrbanBoxes = selectedItems.some((item) => item.item.type === EStoreItemType.URBAN_BOX);
    return hasUrbanBoxes ? 'rubles' : 'bonuses';
  }, [selectedItems]);

  const buttonText = useMemo(() => {
    const hasUrbanBoxes = selectedItems.some((item) => item.item.type === EStoreItemType.URBAN_BOX);
    return hasUrbanBoxes ? 'Забронировать' : 'Получить';
  }, [selectedItems]);

  const handleReserve = useCallback(async () => {
    if (selectedItems.length === 0) {
      showErrorToast('Выберите товары для заказа');
      return;
    }

    // Проверяем, что все товары одного типа
    const itemTypes = new Set(selectedItems.map((item) => item.item.type));
    if (itemTypes.size > 1) {
      showErrorToast('Все элементы корзины должны быть одного типа');
      return;
    }

    try {
      const cartItemIds = selectedItems.map((item) => item.cartItemId);

      if (onReserve) {
        await onReserve();
      } else {
        await createOrder({ cartItemIds }).unwrap();
        showSuccessToast('Заказ успешно оформлен!');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);

      // Обрабатываем ошибку от API
      let errorMessage = 'Не удалось оформить заказ';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errorCode === 'VALIDATION_ERROR') {
        errorMessage = error.data.message || 'Ошибка валидации данных';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showErrorToast(errorMessage);
    }
  }, [selectedItems, onReserve, createOrder, showSuccessToast, showErrorToast]);

  // Закрываем модалку при успешном заказе
  React.useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Информация о заказе">
      <div className="shop-order-modal">
        {/* Фильтры */}
        {(dividedInGroups ? establishmentFilters.length > 0 : typeFilters.length > 0) && (
          <div className="shop-order-modal__filters">
            <div className="shop-order-modal__filters-content">
              {dividedInGroups ? (
                establishmentFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    isActive={selectedFilter === filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.title}
                  </Chip>
                ))
              ) : (
                typeFilters.map((filter) => (
                  <Chip
                    key={filter.key}
                    isActive={selectedFilter === filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.label}
                  </Chip>
                ))
              )}
            </div>
          </div>
        )}

        {/* Скроллируемая секция с деталями заказа */}
        <div className="shop-order-modal__scrollable">
          <div className="shop-order-modal__section">
            <div className="shop-order-modal__section-title">Детали заказа</div>
            <div className="shop-order-modal__items">
              {selectedItems.map((item) => {
                const isUrbanBox = item.item.type === EStoreItemType.URBAN_BOX;
                const isPromoCode = item.item.type === EStoreItemType.PROMO_CODE;
                const itemPrice = (item.item.priceCustomer || item.item.cost) * item.quantity;
                const maxQuantity = isPromoCode ? 1 : (item.item.onePerHand ? 1 : (item.item.availableQuantity || 1));

                return (
                  <div key={item.cartItemId} className="shop-order-modal__item">
                    <div className="shop-order-modal__item-header">
                      <span className="shop-order-modal__item-title">
                        {item.item.title}
                        {isUrbanBox && (
                          <span className="shop-order-modal__item-quantity">
                            {' '}
                            {item.quantity} шт.
                          </span>
                        )}
                      </span>
                      <span className="shop-order-modal__item-price">
                        {isUrbanBox ? (
                          `${itemPrice} ₽`
                        ) : (
                          <>
                            {itemPrice}{' '}
                            <UrbanWhiteOrangeIcon viewBox={'-5 -2 28 28'} size={16} />
                          </>
                        )}
                      </span>
                    </div>

                    {isPromoCode && (
                      <div className="shop-order-modal__item-promocode-label">Harbor Code</div>
                    )}

                    {isUrbanBox && item.item.pickupLocation && (
                      <div className="shop-order-modal__item-address">
                        {item.item.pickupLocation}
                      </div>
                    )}
                    {isUrbanBox && item.item.pickupHours && (
                      <div className="shop-order-modal__item-hours">{item.item.pickupHours}</div>
                    )}

                    {/* Контролы для управления количеством */}
                    <div className="shop-order-modal__item-controls">
                      <button
                        className="shop-order-modal__item-delete"
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        type="button"
                        aria-label="Удалить"
                      >
                      <TrashIcon size={24} />
                      </button>
                      {isUrbanBox && (
                        <Counter
                          value={item.quantity}
                          min={1}
                          max={maxQuantity}
                          onChange={(newQuantity) =>
                            handleQuantityChange(item.cartItemId, newQuantity, item.quantity)
                          }
                          disabled={isLoading}
                          className="shop-order-modal__item-counter"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Недоступные товары */}
          {unavailableItems.length > 0 && (
            <div className="shop-order-modal__section">
              <div className="shop-order-modal__section-title">Недоступные товары</div>
              <div className="shop-order-modal__unavailable-items">
                {unavailableItems.map((item) => (
                  <div key={item.cartItemId} className="shop-order-modal__unavailable-item">
                    <div className="shop-order-modal__item-title">{item.item.title}</div>
                    <div className="shop-order-modal__unavailable-reason">
                      Комментарий: {item.unavailabilityReason === 'OUT_OF_STOCK' ? 'Товар закончился' : 'Товар недоступен'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shop-order-modal__footer">
          <div className="shop-order-modal__total">
            <span className="shop-order-modal__total-label">
              Итого, <span className="shop-order-modal__item-quantity">{totalQuantity} шт.</span>
            </span>
            <span className="shop-order-modal__total-price">
              {currencyType === 'rubles' ? (
                `${totalPrice} ₽`
              ) : (
                <>
                  {totalPrice} <UrbanWhiteOrangeIcon viewBox={'-5 -2 28 28'} size={20} />
                </>
              )}
            </span>
          </div>

          {!isSuccess && (
            <Button
              type="primary"
              fullWidth
              onClick={handleReserve}
              disabled={isLoading || selectedItems.length === 0}
              className="shop-order-modal__reserve-button"
            >
              {isLoading ? 'Оформление заказа...' : buttonText}
            </Button>
          )}


        </div>
      </div>

      <ToastMessage
        isVisible={toastState.isVisible}
        title={toastState.title}
        description={toastState.description}
        type={toastState.type}
        showCloseButton={true}
        duration={toastState.type === 'success' ? 3000 : 0}
        onClose={hideToast}
        onVisibilityChange={(visible) => {
          if (!visible) {
            hideToast();
          }
        }}
      />
    </BottomSheet>
  );
};

