import { baseApi } from '@shared/api/redux.api';
import {
  IExecuteOtherTaskRequest,
  IExecuteTaskRequest,
  ISendMessageForOtherTaskRequest,
  ITask,
  ITaskListResponse,
  IOtherTaskMessage,
  IUploadTempFileResponse,
} from '../types';
import {
  USE_TASKS_MOCKS,
  mockGetTasks,
  mockExecuteTask,
  mockExecuteOtherTask,
  mockSendMessageForOtherTask,
  mockUploadTempFile,
  mockDeleteTempFile,
} from './tasks.mocks';

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<ITaskListResponse, void>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async () => {
              const data = await mockGetTasks();
              return { data };
            },
          }
        : {
            query: () => ({
              url: '/account/task/list',
              method: 'GET',
            }),
          }),
      providesTags: ['Tasks'],
    }),

    getTask: build.query<ITask, number>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async (taskId) => {
              const tasksData = await mockGetTasks();
              const task = tasksData.tasks.find((t) => t.id === taskId);
              if (!task) {
                throw new Error('Task not found');
              }
              return { data: task };
            },
          }
        : {
            query: (taskId) => ({
              url: `/account/task/get?id=${taskId}`,
              method: 'GET',
            }),
          }),
      providesTags: (_, __, taskId) => [{ type: 'Tasks', id: taskId }],
    }),

    executeTask: build.mutation<ITask, IExecuteTaskRequest>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async (arg) => {
              const data = await mockExecuteTask(arg.taskId);
              return { data };
            },
          }
        : {
            query: (body) => ({
              url: '/account/task/execute',
              method: 'POST',
              data: body,
            }),
          }),
      invalidatesTags: ['Tasks'],
    }),

    executeOtherTask: build.mutation<ITask, IExecuteOtherTaskRequest>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async (arg) => {
              const data = await mockExecuteOtherTask(arg.taskId, arg.text, arg.fileIds);
              return { data };
            },
          }
        : {
            query: (body) => ({
              url: '/account/task/execute/other',
              method: 'POST',
              data: body,
            }),
          }),
      invalidatesTags: ['Tasks'],
    }),

    sendMessageForOtherTask: build.mutation<IOtherTaskMessage[], ISendMessageForOtherTaskRequest>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async (arg) => {
              const data = await mockSendMessageForOtherTask(arg.taskId, arg.message, arg.fileIds);
              return { data };
            },
          }
        : {
            query: (body) => ({
              url: '/account/task/send-message/other',
              method: 'POST',
              data: body,
            }),
          }),
    }),

    uploadTempFile: build.mutation<IUploadTempFileResponse, FormData>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async () => {
              const data = await mockUploadTempFile();
              return { data };
            },
          }
        : {
            queryFn: async (formData) => {
              const baseURL = import.meta.env.VITE_APP_URL;
              const sessionId = localStorage.getItem('sessionId');
              
              const headers: HeadersInit = {};
              if (sessionId) {
                headers['Authorization'] = sessionId;
              }

              const response = await fetch(`${baseURL}/account/temp-file/upload`, {
                method: 'POST',
                headers,
                body: formData,
              });
              
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return {
                  error: {
                    status: response.status,
                    data: errorData,
                    message: response.statusText,
                  },
                };
              }
              
              const data = await response.json();
              return { data };
            },
          }),
    }),

    deleteTempFile: build.mutation<void, number>({
      ...(USE_TASKS_MOCKS
        ? {
            queryFn: async () => {
              await mockDeleteTempFile();
              return { data: undefined };
            },
          }
        : {
            query: (fileId) => ({
              url: `/account/temp-file/${fileId}`,
              method: 'DELETE',
            }),
          }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useExecuteTaskMutation,
  useExecuteOtherTaskMutation,
  useSendMessageForOtherTaskMutation,
  useUploadTempFileMutation,
  useDeleteTempFileMutation,
} = tasksApi;



