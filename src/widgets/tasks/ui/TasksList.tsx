import React from 'react';
import './tasks-list.scss';
import EmptyEstablishments from '@components/EmptyEstablishments';
import { Card } from '@shared/ui';
import { ITask } from '@/entities/tasks';

interface TasksListProps {
  tasks: ITask[];
  isLoading: boolean;
  onTaskClick: (task: ITask) => void;
}

const isTaskCompleted = (task: ITask): boolean =>
  task.status === 'COMPLETED' ||
  task.status === 'COMPLETED_AS_FULFILLED'

export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  isLoading,
  onTaskClick,
}) => {
  if (isLoading) {
    return <div className="tasks-list__loader">Загрузка заданий...</div>;
  }

  if (!isLoading && tasks.length === 0) {
    return (
      <div className="tasks-list__empty">
        <EmptyEstablishments
          mainLabel="Задания не найдены"
          secondLabel="Новые задания появятся здесь, как только будут доступны"
        />
      </div>
    );
  }

  return (
    <div className="tasks-list">
      {tasks.map((task) => {
        const isExpired = isTaskCompleted(task);

        return (
          <Card
            key={task.id}
            title={task.title}
            subtitle={task.description}
            description="Плюшка в заведении"
            imgUrl={task.image?.url || 'https://picsum.photos/seed/harbor-task/800/600'}
            imgAlt={task.title}
            isExpired={isExpired}
            status={task.status === 'REJECTED' ? {value:'Отклонено', type:'error'} : undefined}
            onClick={() => onTaskClick(task)}
          />
        );
      })}
    </div>
  );
};



