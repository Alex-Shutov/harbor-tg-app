import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '@shared/ui';
import './tasks-page.scss';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';
import { TasksList, TasksStatusFilter, useTasksList } from '@/widgets/tasks';
import { useTaskExecution, TaskExecutionFlow } from '@/features/tasks-execution';
import { ReferalSystemWidget, ReferalModal } from '@/widgets/referralSystem';
import { useGetReferralSystemInfoQuery } from '@/entities/referral';

const TasksPage: React.FC = () => {
  useAutoBackNavigation();
  const navigate = useNavigate();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const { activeTab, filteredTasks, isLoading, handleTabChange, tasks } = useTasksList();
  const { data: referralData } = useGetReferralSystemInfoQuery();
  const {
    flowState,
    text,
    tempFiles,
    isOther,
    isExecuting,
    showExecuteButton,
    showResendOtherButton,
    showResendButton,
    showChatButton,
    openTaskDetails,
    closeAllModals,
    openSubmitModal,
    handleTextChange,
    handleFileSelected,
    handleRemoveFile,
    handleExecuteFromDetails,
    handleSubmitTask,
    handleOpenChat,
    captchaModalOpen,
    handleCaptchaSuccess,
    handleCaptchaClose,
  } = useTaskExecution();

  useEffect(() => {
    const handleOpenTaskModal = (event: CustomEvent<{ taskId: number }>) => {
      const { taskId } = event.detail;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        openTaskDetails(task);
      }
    };

    window.addEventListener('open-task-modal-from-deeplink', handleOpenTaskModal as EventListener);
    return () => {
      window.removeEventListener('open-task-modal-from-deeplink', handleOpenTaskModal as EventListener);
    };
  }, [tasks, openTaskDetails]);

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <Title>Задания</Title>
      </div>

      <ReferalSystemWidget
        onClick={() => setIsReferralModalOpen(true)}
      />

      {referralData && <ReferalModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        referralData={referralData }
      />}

      <TasksStatusFilter activeTab={activeTab} onChange={handleTabChange} />

      <TasksList
        tasks={filteredTasks}
        isLoading={isLoading}
        onTaskClick={openTaskDetails}
      />

      <TaskExecutionFlow
        flowState={flowState}
        text={text}
        tempFiles={tempFiles}
        isOther={isOther}
        showResendOtherButton={showResendOtherButton}
        showResendButton={showResendButton}
        isExecuting={isExecuting}
        showExecuteButton={showExecuteButton}
        showChatButton={showChatButton}
        handleTextChange={handleTextChange}
        handleFileSelected={handleFileSelected}
        handleRemoveFile={handleRemoveFile}
        handleExecuteFromDetails={handleExecuteFromDetails}
        handleSubmitTask={handleSubmitTask}
        handleOpenChat={() => {
          const taskId = handleOpenChat();
          if (taskId) {
            navigate(`/profile/tasks/chat/${taskId}`);
          }
        }}
        closeAllModals={closeAllModals}
        openSubmitModal={openSubmitModal}
        captchaModalOpen={captchaModalOpen}
        handleCaptchaSuccess={handleCaptchaSuccess}
        handleCaptchaClose={handleCaptchaClose}
      />
    </div>
  );
};

export default TasksPage;


