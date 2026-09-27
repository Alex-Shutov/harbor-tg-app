import React from 'react';
import { StatusBadge, Button } from '@shared/ui';
import { IOrder, IUrbanBoxOrder } from '@/entities/orders';
import { useCancelOrder } from '@/features/cancel-order';
import './order-card.scss';

interface IOrderCardProps {
  order: IOrder;
  onDetailsClick?: () => void;
}

const getStatusConfig = (status: IOrder['status']) => {
  switch (status) {
    case 'WAITING':
      return { value: 'Ждет подтверждения', type: 'warning' as const };
    case 'CONFIRMED':
      return { value: 'Подтвержден', type: 'success' as const };
    case 'CANCELED':
      return { value: 'Отменен заведением', type: 'error' as const };
    case 'COMPLETED':
      return { value: 'Выполнен', type: 'complete' as const };
    default:
      return { value: status, type: 'warning' as const };
  }
};

export const OrderCard: React.FC<IOrderCardProps> = ({ order, onDetailsClick }) => {
  const { cancelOrder, isLoading } = useCancelOrder();
  const statusConfig = getStatusConfig(order.status);
  const showComment = order.status === 'CANCELED' || order.status === 'CONFIRMED';
  const commentBgColor = order.status === 'CANCELED' ? '#FEFFE6' : '#F7F8FC';
  const canCancel = order.status === 'WAITING' || order.status === 'CONFIRMED';

  // Получаем информацию о заказе в зависимости от типа
  const isUrbanBox = order.type === 'URBAN_BOX';
  const isPromoCode = order.type === 'PROMO_CODE';
  const isProduct = order.type === 'PRODUCT';
  
  const urbanBoxOrder = isUrbanBox ? (order as IUrbanBoxOrder) : null;
  const firstItem = order.items[0];
  const establishmentTitle = isUrbanBox 
    ? urbanBoxOrder?.establishmentTitle 
    : firstItem?.item.objectTitle || firstItem?.item.establishmentTitle;
  
  // const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const comment = isUrbanBox ? urbanBoxOrder?.comment : undefined;

  const handleCancel = async () => {
    if (window.confirm('Вы уверены, что хотите отменить заказ?')) {
      try {
        await cancelOrder(order.id, 'Отменено пользователем');
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  return (
    <div className="order-card">
      <div className="order-card__header">
        <div className="order-card__restaurant">
          <h3 className="order-card__restaurant-name">
            {establishmentTitle || 'Заказ'}
          </h3>
          {isUrbanBox && <span className="order-card__cuisine">набор</span>}
          {isPromoCode && <span className="order-card__cuisine">Промокод</span>}
          {isProduct && <span className="order-card__cuisine">Товар</span>}

          <Button className={'order-card__details-button'} type="outline" onClick={onDetailsClick}>
            Подробнее
          </Button>
        </div>
        <StatusBadge value={statusConfig.value} type={statusConfig.type} />
      </div>

      <div className="order-card__content">
        <div className="order-card__details">
          {isUrbanBox && urbanBoxOrder?.pickupLocation && (
            <div className="order-card__pickup">
              <span className="order-card__pickup-label">Пункт самовывоза</span>
              <span className="order-card__pickup-address">
                {urbanBoxOrder.pickupLocation}
              </span>
              {urbanBoxOrder.saleTimeStart && urbanBoxOrder.saleTimeEnd && (
                <span className="order-card__pickup-hours">
                  {new Date(urbanBoxOrder.saleTimeStart).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - {new Date(urbanBoxOrder.saleTimeEnd).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          )}

          <div className="order-card__order-info">
            <span className="order-card__pickup-label">Детали заказа</span>
            <span className="order-card__order-number">Заказ <span className="order-card__pickup-hours">№{order.id}</span></span>
            {isUrbanBox && urbanBoxOrder?.verificationCode && (
              <span className="order-card__order-code">Код <span className="order-card__pickup-hours">{urbanBoxOrder.verificationCode}</span></span>
            )}
          </div>

          <div className="order-card__items">
            {order.items.map((cartItem) => (
              <div key={cartItem.cartItemId} className="order-card__item">
                <span className="order-card__item-name">
                  {isUrbanBox ? 'Urbanbox: ' : isPromoCode ? 'Промокод: ' : 'Товар: '}
                  {cartItem.item.title}
                  {cartItem.quantity > 1 && (
                    <span className={'order-card__order-number'}> {cartItem.quantity} шт.</span>
                  )}
                </span>
                <span className="order-card__item-price">
                  {isUrbanBox ? `${cartItem.item.cost * cartItem.quantity} ₽` : `${cartItem.item.cost * cartItem.quantity}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {showComment && comment && (
          <div
            className="order-card__comment"
            style={{ backgroundColor: commentBgColor }}
          >
            <p>{comment}</p>
          </div>
        )}

        <div className="order-card__actions">
          {canCancel && (
            <Button
              type="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="order-card__cancel-button"
            >
              Отменить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

