import React from 'react';
import { Chip } from '@shared/ui';
import { TasksTab } from '../lib/useTasksList';
import './tasks-status-filter.scss';

interface TasksStatusFilterProps {
  activeTab: TasksTab;
  onChange: (tab: TasksTab) => void;
}

const TABS: { key: TasksTab; label: string }[] = [
  { key: 'ACTIVE', label: 'Активные' },
  { key: 'REVIEW', label: 'На проверке' },
  { key: 'COMPLETED', label: 'Завершённые' },
];

export const TasksStatusFilter: React.FC<TasksStatusFilterProps> = ({
  activeTab,
  onChange,
}) => {
  return (
    <div className="tasks-status-filter">
      <div className="tasks-status-filter__content">
        {TABS.map((tab) => (
          <Chip
            key={tab.key}
            isActive={activeTab === tab.key}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </Chip>
        ))}
      </div>
    </div>
  );
};







