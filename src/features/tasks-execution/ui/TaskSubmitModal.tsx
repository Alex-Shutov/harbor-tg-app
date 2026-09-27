import React, { useRef, useState } from 'react';
import { BottomSheetWithImage, Button, TextArea } from '@shared/ui';
import { ITask } from '@/entities/tasks';
import { TempFileInfo } from '../lib/hooks/useTaskExecution';
import './task-submit-modal.scss';
import Loader from '@shared/Loader';

interface TaskSubmitModalProps {
  task: ITask | null;
  isOpen: boolean;
  text: string;
  files: TempFileInfo[];
  isExecuting: boolean;
  onClose: () => void;
  onTextChange: (value: string) => void;
  onFileSelected: (file: File | null) => Promise<void>;
  onRemoveFile: (fileId: number) => void;
  onSubmit: () => void;
}

export const TaskSubmitModal: React.FC<TaskSubmitModalProps> = ({
  task,
  isOpen,
  text,
  files,
  isExecuting,
  onClose,
  onTextChange,
  onFileSelected,
  onRemoveFile,
  onSubmit,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  if (!task) return null;

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async(
    event,
  ) => {
    setIsLoading(true);
    const file = event.target.files?.[0] ?? null;
    await onFileSelected(file).finally(()=>setIsLoading(false));
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitClick = () => {
    if (isExecuting) return;
    onSubmit();
  };

  return (
    <BottomSheetWithImage
      isOpen={isOpen}
      onClose={onClose}
      mainImage={task.image?.url ?? ''}
      imageAlt={task.title}
      title="Отправка задания"
    >
      <div className="task-submit">
        <p className="task-submit__hint">
          Прикрепите до 5 файлов и напишите комментарий по желанию.
        </p>

        <TextArea
          name="task-comment"
          value={text}
          onChange={onTextChange}
          placeholder="Напишите комментарий"
          label="Комментарий"
        />

        <div className="task-submit__files">
          <Button
            type="secondary"
            fullWidth
            disabled={files.length >= 5}
            onClick={handleUploadClick}
          >
            Загрузить файл
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileChange}
          />

          <div className="task-submit__files-list">
            {files.map((file) => (
              <div key={file.id} className="task-submit__file-row">
                <div className="task-submit__file-info">
                  <div className="task-submit__file-icon" />
                  <div>
                    <div className="task-submit__file-name">{file.name}</div>
                    <div className="task-submit__file-size">
                      {(file.size / (1024 * 1024)).toFixed(2)} МБ
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="task-submit__file-remove"
                  onClick={() => onRemoveFile(file.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {isLoading && <Loader/>}
        </div>

        <Button
          type="primary"
          fullWidth
          onClick={handleSubmitClick}
          disabled={isExecuting}
        >
          {isExecuting ? 'Отправляем...' : 'Отправить'}
        </Button>
      </div>
    </BottomSheetWithImage>
  );
};






