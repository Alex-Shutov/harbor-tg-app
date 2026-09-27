import React, { useMemo } from 'react';
import { useGetOrdersQuery } from '@/entities/orders';
import { OrderCard } from '../OrderCard';
import { IOrder } from '@/entities/orders';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './orders-list-widget.scss';

interface IOrdersListWidgetProps {
  filter: 'active' | 'archive';
}

const isActiveOrder = (order: IOrder): boolean => {
  return order.status === 'WAITING' || order.status === 'CONFIRMED';
};

const isArchiveOrder = (order: IOrder): boolean => {
  return order.status === 'COMPLETED' || order.status === 'CANCELED';
};

export const OrdersListWidget: React.FC<IOrdersListWidgetProps> = ({ filter }) => {
  const { data: orders, isLoading } = useGetOrdersQuery();

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return filter === 'active'
      ? orders.filter(isActiveOrder)
      : orders.filter(isArchiveOrder);
  }, [orders, filter]);

  if (isLoading) {
    return (
      <div className="orders-list-widget">
        <div className="orders-list-widget__skeleton">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="200px" width="100%" style={{ marginBottom: '16px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!filteredOrders || filteredOrders.length === 0) {
    return (
      <div className="orders-list-widget">
        <div className="orders-list-widget__empty">
          <p>
            {filter === 'active'
              ? 'Активных заказов пока нет'
              : 'Архивных заказов пока нет'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-list-widget">
      <div className="orders-list-widget__list">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};


