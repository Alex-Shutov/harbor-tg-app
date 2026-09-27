/// <reference types="vite/client" />

declare global {
  interface Window {
    env: {
      BACKEND_URL: string;
    };
  }
}

export {};
