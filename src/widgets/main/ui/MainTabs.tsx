import React from 'react';
import { Gift, ListChecks, Palmtree, Utensils } from 'lucide-react';
import { Tab } from '@shared/ui';
import { useNavigate, useLocation } from 'react-router-dom';
import './main-tabs.scss';

type TMainTab = {
  id: string;
  title: string;
  icon: React.ReactNode;
  size: 'large' | 'small';
  route: string;
};

const TABS_CONFIG: TMainTab[] = [
  {
    id: 'food',
    title: 'Места',
    icon: <Utensils />,
    size: 'large',
    route: '/establishments',
  },
  {
    id: 'leisure',
    title: 'Досуг',
    icon: <Palmtree />,
    size: 'large',
    route: '/leisure',
  },
  {
    id: 'tasks',
    title: 'Задания',
    icon: <ListChecks />,
    size: 'small',
    route: '/profile/tasks',
  },
  {
    id: 'raffles',
    title: 'Розыгрыши',
    icon: <Gift />,
    size: 'small',
    route: '/profile/raffles',
  },
];

export const MainTabs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  const activeTabId = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/establishments')) return 'food';
    if (path.startsWith('/leisure')) return 'leisure';
    if (path.startsWith('/profile/tasks')) return 'tasks';
    if (path.startsWith('/profile/raffles')) return 'raffles';
    return '';
  }, [location.pathname]);

  const largeTabs = TABS_CONFIG.filter((tab) => tab.size === 'large');
  const smallTabs = TABS_CONFIG.filter((tab) => tab.size === 'small');

  return (
    <div className="main-tabs">
      <div className="main-tabs__row main-tabs__row--large">
        {largeTabs.map((tab) => (
          <Tab
            key={tab.id}
            title={tab.title}
            icon={tab.icon}
            size="large"
            isActive={activeTabId === tab.id}
            onClick={() => handleNavigate(tab.route)}
          />
        ))}
      </div>
      <div className="main-tabs__row main-tabs__row--small">
        {smallTabs.map((tab) => (
          <Tab
            key={tab.id}
            title={tab.title}
            icon={tab.icon}
            size="small"
            isActive={activeTabId === tab.id}
            onClick={() => handleNavigate(tab.route)}
          />
        ))}
      </div>
    </div>
  );
};
