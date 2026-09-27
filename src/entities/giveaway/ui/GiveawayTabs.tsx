import React from 'react';
import { Chip } from '@shared/ui';
import './giveaway-tabs.scss';

export type TabType = 'active' | 'participating' | 'completed' | 'prizes';

interface IGiveawayTabsProps {
  selectedTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS: { key: TabType; label: string }[] = [
  { key: 'active', label: 'Активные' },
  { key: 'participating', label: 'Участвую' },
  { key: 'completed', label: 'Завершённые' },
  { key: 'prizes', label: 'Призы' },
];

export const GiveawayTabs: React.FC<IGiveawayTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <div className="giveaway-tabs">
      <div className="giveaway-tabs__content">
        {TABS.map((tab) => (
          <Chip
            key={tab.key}
            isActive={selectedTab === tab.key}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </Chip>
        ))}
      </div>
    </div>
  );
};
























