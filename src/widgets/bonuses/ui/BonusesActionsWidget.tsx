import React from 'react';
import { Tab } from '@shared/ui';
import './bonuses-actions-widget.scss';
import { useNavigate } from 'react-router-dom';

const TABS =   [{
    id: 'tasks',
    title: 'Задания',
    icon: '/tasks-main.png',
    size: 'small',
    route: '/profile/tasks',
  },
  {
    id: 'raffles',
    title: 'Розыгрыши',
    icon: '/giveaway-main.png',
    size: 'small',
    route: '/profile/raffles',
  },
  {
    id: 'shop',
    title: 'Магазин',
    icon: '/shop-main.png',
    size: 'small',
    route: '/profile/shop',
  }]

export const BonusesActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };



  return (
    <div className="bonuses-actions-widget">
        {TABS.map((tab) => (
          <Tab
            title={tab.title}
            iconSrc={tab.icon}
            size="small"
            onClick={() => handleNavigate(tab.route)}
          />
        ))}
      </div>
  );
};

