import React, { useState } from 'react';
import { Title, Chip } from '@shared/ui';
import { OrdersListWidget } from '@/widgets/orders';
import { useAutoBackNavigation } from '@/hooks/useAutoBackNavigation';
import './orders-page.scss';

export const OrdersPage: React.FC = () => {
  useAutoBackNavigation();
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');

  return (
    <div className="orders-page">
      <div className="orders-page__header">
        <Title className={'title'}>Заказы</Title>
        <div className="orders-page__tabs">
          <Chip
            isActive={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          >
            Активные
          </Chip>
          <Chip
            isActive={activeTab === 'archive'}
            onClick={() => setActiveTab('archive')}
          >
            Архив
          </Chip>
        </div>
      </div>



      <div className="orders-page__content">
        <OrdersListWidget filter={activeTab} />
      </div>
    </div>
  );
};


