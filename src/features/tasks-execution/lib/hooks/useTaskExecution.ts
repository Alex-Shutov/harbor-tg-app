import { useCallback, useEffect, useState } from 'react';
import { IOtherTask, ITask } from '@/entities/tasks';
import {
  useExecuteOtherTaskMutation,
  useExecuteTaskMutation,
  useUploadTempFileMutation,
  useDeleteTempFileMutation,
} from '@/entities/tasks';
import { getCaptchaToken, saveCaptchaToken, hasValidCaptchaToken } from '@/utils/captchaCache';
import { useCaptchaRequirement } from '@/entities/captcha/hooks';
import { handleCaptchaErrorAndClear } from '@/shared/utils/captchaErrorHandler';

export type TaskExecutionFlowState = {
  selectedTask: ITask | null;
  isDetailsOpen: boolean;
  isSubmitOpen: boolean;
};

export type TempFileInfo = {
  id: number;
  name: string;
  size: number;
};

const isOtherTask = (task: ITask | null): task is IOtherTask =>
  !!task && task.type === 'OTHER';

export const useTaskExecution = () => {
  const { captchaRequiredForTask } = useCaptchaRequirement();
  const [flowState, setFlowState] = useState<TaskExecutionFlowState>({
    selectedTask: null,
    isDetailsOpen: false,
    isSubmitOpen: false,
  });
  const [text, setText] = useState('');
  const [tempFiles, setTempFiles] = useState<TempFileInfo[]>([]);

  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<((token: string) => Promise<void>) | null>(null);

  const [executeTask, { isLoading: executeLoading }] = useExecuteTaskMutation();
  const [executeOtherTask, { isLoading: executeOtherLoading }] =
    useExecuteOtherTaskMutation();
  const [uploadTempFile] = useUploadTempFileMutation();
  const [deleteTempFile] = useDeleteTempFileMutation();

  const openTaskDetails = useCallback((task: ITask) => {
    setFlowState({
      selectedTask: task,
      isDetailsOpen: true,
      isSubmitOpen: false,
    });
    setText('');
    setTempFiles([]);
  }, []);

  const closeAllModals = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      isDetailsOpen: false,
      isSubmitOpen: false,
      selectedTask: null,
    }));
  }, []);

  useEffect(() => {
    if (!flowState.isDetailsOpen && !flowState.isSubmitOpen && tempFiles.length) {
      const filesToDelete = [...tempFiles];
      setTempFiles([]);
      void Promise.allSettled(
        filesToDelete.map((file) => deleteTempFile(file.id)),
      );
    }
  }, [flowState.isDetailsOpen, flowState.isSubmitOpen, tempFiles, deleteTempFile]);

  const openSubmitModal = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      isSubmitOpen: true,
    }));
  }, []);

  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
    },
    [],
  );

  const handleFileSelected = useCallback(
    async (file: File | null) => {
      if (!file) return;
      if (tempFiles.length >= 5) return;

      const formData = new FormData();
      formData.append('file', file);
      console.log(formData.get('file'),'forms');

      const response = await uploadTempFile(formData).unwrap();
      setTempFiles((prev) => [
        ...prev,
        {
          id: response.fileId,
          name: file.name,
          size: file.size,
        },
      ]);
    },
    [uploadTempFile, tempFiles.length],
  );

  const handleRemoveFile = useCallback(
    async (fileId: number) => {
      setTempFiles((prev) => prev.filter((file) => file.id !== fileId));
      await deleteTempFile(fileId);
    },
    [deleteTempFile],
  );

  const executeTaskAction = useCallback(async (captchaToken?: string) => {
    const task = flowState.selectedTask;
    if (!task) return;

    if (isOtherTask(task)) {
      setCaptchaModalOpen(false);
      setPendingAction(null);
      openSubmitModal();
      return;
    }

    try {
      const requestData: any = {
        taskId: task.id,
      };

      // Добавляем captchaToken только если он передан
      if (captchaToken) {
        requestData.captchaToken = captchaToken;
      }

      await executeTask(requestData).unwrap();
      closeAllModals();
      setCaptchaModalOpen(false);
      setPendingAction(null);
    } catch (error: any) {
      // Проверяем, является ли ошибка ошибкой капчи
      if (handleCaptchaErrorAndClear(error)) {
        // Очистили токен, показываем капчу снова
        setPendingAction(() => (token: string) => executeTaskAction(token));
        setCaptchaModalOpen(true);
        return;
      }

      setCaptchaModalOpen(false);
      setPendingAction(null);
      throw error;
    }
  }, [flowState.selectedTask, executeTask, closeAllModals, openSubmitModal]);

  const handleExecuteFromDetails = useCallback(async (): Promise<void> => {
    const task = flowState.selectedTask;
    if (!task) return;

    if (isOtherTask(task)) {
      openSubmitModal();
      return;
    }

    // Если captcha не требуется, выполняем сразу
    if (!captchaRequiredForTask) {
      await executeTaskAction();
      return;
    }

    // Проверяем, есть ли кэшированный токен
    const cachedToken = getCaptchaToken();
    if (cachedToken && hasValidCaptchaToken()) {
      // Используем кэшированный токен без показа модального окна
      await executeTaskAction(cachedToken);
      return;
    }

    // Если токена нет, показываем captcha
    setPendingAction(() => (token: string) => executeTaskAction(token));
    setCaptchaModalOpen(true);
  }, [flowState.selectedTask, captchaRequiredForTask, openSubmitModal, executeTaskAction]);

  const executeSubmitTask = useCallback(async (captchaToken?: string) => {
    const task = flowState.selectedTask;
    if (!task || !isOtherTask(task)) return;

    const requestData: any = {
      taskId: task.id,
      text,
      fileIds: tempFiles.map((file) => file.id),
    };

    // Добавляем captchaToken только если он передан
    if (captchaToken) {
      requestData.captchaToken = captchaToken;
    }

    try {
      const updatedTask = await executeOtherTask(requestData).unwrap();
      setFlowState((prev) => ({
        ...prev,
        selectedTask: updatedTask,
        isSubmitOpen: false,
      }));

      setText('');
      setTempFiles([]);
      setCaptchaModalOpen(false);
      setPendingAction(null);
    } catch (error: any) {
      // Проверяем, является ли ошибка ошибкой капчи
      if (handleCaptchaErrorAndClear(error)) {
        // Очистили токен, показываем капчу снова
        setPendingAction(() => (token: string) => executeSubmitTask(token));
        setCaptchaModalOpen(true);
        return;
      }

      setCaptchaModalOpen(false);
      setPendingAction(null);
      throw error;
    }
  }, [flowState.selectedTask, executeOtherTask, text, tempFiles]);

  const handleSubmitTask = useCallback(() => {
    const task = flowState.selectedTask;
    if (!task || !isOtherTask(task)) return;

    // Если captcha не требуется, выполняем сразу
    if (!captchaRequiredForTask) {
      executeSubmitTask();
      return;
    }

    // Проверяем, есть ли кэшированный токен
    const cachedToken = getCaptchaToken();
    if (cachedToken && hasValidCaptchaToken()) {
      // Используем кэшированный токен без показа модального окна
      executeSubmitTask(cachedToken);
      return;
    }

    // Если токена нет, показываем captcha
    setPendingAction(() => (token: string) => executeSubmitTask(token));
    setCaptchaModalOpen(true);
  }, [flowState.selectedTask, captchaRequiredForTask, executeSubmitTask]);

  const handleOpenChat = useCallback(() => {
    const task = flowState.selectedTask;
    if (!task) return;
    return task.id;
  }, [flowState.selectedTask]);

  const isOther = isOtherTask(flowState.selectedTask);

  const showExecuteButton =
    !!flowState.selectedTask &&
    flowState.selectedTask.status === 'ACTIVE' &&
    flowState.selectedTask.canParticipate;

  const showResendOtherButton = !!flowState.selectedTask &&
    flowState.selectedTask.type === 'OTHER' &&
    flowState.selectedTask.status === 'REJECTED'

  const showChatButton =
    !!flowState.selectedTask &&
    flowState.selectedTask.type === 'OTHER' &&
    ((isOtherTask(flowState.selectedTask) && flowState.selectedTask.messages.length > 0) ||
      flowState.selectedTask.status === 'REVIEW' ||
      flowState.selectedTask.status === 'REJECTED');

  const showResendButton =  !!flowState.selectedTask &&
    flowState.selectedTask.type !== 'OTHER' &&
    flowState.selectedTask.status === 'REJECTED';

  const handleCaptchaSuccess = useCallback((token: string) => {
    // Сохраняем токен в кэш
    saveCaptchaToken(token);
    
    if (pendingAction) {
      // Передаем токен в функцию выполнения
      pendingAction(token);
    }
  }, [pendingAction]);

  const handleCaptchaClose = useCallback(() => {
    setCaptchaModalOpen(false);
    setPendingAction(null);
  }, []);

  return {
    flowState,
    text,
    tempFiles,
    isOther,
    isExecuting: executeLoading || executeOtherLoading,
    showExecuteButton,
    showChatButton,
    showResendOtherButton,
    showResendButton,
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
  };
};
