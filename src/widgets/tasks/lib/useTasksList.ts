import { useMemo, useState } from 'react';
import { useGetTasksQuery, ITask, ITaskStatus } from '@/entities/tasks';
import { useDeepLinkFilter } from '@shared/lib/hooks/useDeepLinkFilter';

export type TasksTab = 'ACTIVE' | 'REVIEW' | 'COMPLETED';

const tabToStatuses: Record<TasksTab, ITaskStatus[]> = {
  ACTIVE: ['ACTIVE','REJECTED'],
  REVIEW: ['REVIEW'],
  COMPLETED: ['COMPLETED', 'COMPLETED_AS_FULFILLED'],
};

const getTabByStatus = (status: ITaskStatus): TasksTab => {
  if (status === 'ACTIVE') return 'ACTIVE';
  if (status === 'REVIEW') return 'REVIEW';
  if (['COMPLETED', 'COMPLETED_AS_FULFILLED', 'REJECTED'].includes(status)) return 'COMPLETED';
  return 'ACTIVE';
};

export const useTasksList = () => {
  const [activeTab, setActiveTab] = useState<TasksTab>('ACTIVE');
  const { data, isLoading } = useGetTasksQuery();
  const tasks = data?.tasks ?? [];

  useDeepLinkFilter<ITask>(
    'taskId',
    (task) => {
      const tab = getTabByStatus(task.status);
      setActiveTab(tab);
      
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-task-modal-from-deeplink', { detail: { taskId: task.id } }));
      }, 100);
    },
    [tasks],
    (id, deps) => {
      const allTasks = deps.flat().filter(Boolean) as ITask[];
      return allTasks.find(t => t.id === id);
    }
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        tabToStatuses[activeTab].includes(task.status),
      ),
    [tasks, activeTab],
  );

  const handleTabChange = (tab: TasksTab) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    tasks,
    filteredTasks,
    isLoading,
    handleTabChange,
  };
};




