import React from 'react';
import { TaskDetailsModal } from './TaskDetailsModal';
import { TaskSubmitModal } from './TaskSubmitModal';
import { TaskExecutionFlowState, TempFileInfo } from '../lib/hooks/useTaskExecution';
import { ITask } from '@/entities/tasks';
import { CaptchaModal } from '@/shared/ui';

interface TaskExecutionFlowProps {
  flowState: TaskExecutionFlowState;
  text: string;
  tempFiles: TempFileInfo[];
  isOther: boolean;
  isExecuting: boolean;
  showExecuteButton: boolean;
  showResendOtherButton: boolean;
  showResendButton: boolean;
  showChatButton: boolean;
  handleTextChange: (value: string) => void;
  handleFileSelected: (file: File | null) => Promise<void>;
  handleRemoveFile: (fileId: number) => void;
  handleExecuteFromDetails: () => Promise<void>;
  handleSubmitTask: () => void;
  handleOpenChat: () => void | ((navigate: (path: string) => void) => void);
  closeAllModals: () => void;
  openSubmitModal: () => void;
  captchaModalOpen: boolean;
  handleCaptchaSuccess: (token: string) => void;
  handleCaptchaClose: () => void;
}

export const TaskExecutionFlow: React.FC<TaskExecutionFlowProps> = ({
  flowState,
  text,
  tempFiles,
  isOther,
  isExecuting,
  showExecuteButton,
  showChatButton, showResendOtherButton,showResendButton,
  handleTextChange,
  handleFileSelected,
  handleRemoveFile,
  handleExecuteFromDetails,
  handleSubmitTask,
  handleOpenChat,
  closeAllModals,
  openSubmitModal,
  captchaModalOpen,
  handleCaptchaSuccess,
  handleCaptchaClose,
}) => {
  const task: ITask | null = flowState.selectedTask;

  return (
    <>
      {task && <TaskDetailsModal
        task={task}
        isOpen={flowState.isDetailsOpen}
        isExecuting={isExecuting}
        showResendOtherButton={showResendOtherButton}
        showResendButton={showResendButton}
        showExecuteButton={showExecuteButton}
        showChatButton={showChatButton}
        onClose={closeAllModals}
        onExecuteFromDetails={handleExecuteFromDetails}
        onOpenSubmit={openSubmitModal}
        onOpenChat={handleOpenChat}
      />}

      {isOther && (
        <TaskSubmitModal
          task={task}
          isOpen={flowState.isSubmitOpen}
          text={text}
          files={tempFiles}
          isExecuting={isExecuting}
          onClose={closeAllModals}
          onTextChange={handleTextChange}
          onFileSelected={handleFileSelected}
          onRemoveFile={handleRemoveFile}
          onSubmit={handleSubmitTask}
        />
      )}

      <CaptchaModal
        isOpen={captchaModalOpen}
        onClose={handleCaptchaClose}
        onSuccess={handleCaptchaSuccess}
        title="Подтвердите выполнение задания"
        description="Пожалуйста, пройдите проверку безопасности для выполнения задания"
      />
    </>
  );
};






