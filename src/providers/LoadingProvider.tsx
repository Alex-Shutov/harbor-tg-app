import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import Loader from '../shared/Loader';

interface LoadingContextType {
  renderLoader: () => JSX.Element;
  renderError: (error: string | Error) => JSX.Element;
}

interface LoadingProviderProps {
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean | Error | string | null;
}

const LoadingContext = createContext<LoadingContextType>({
  renderLoader: () => <Loader />,
  renderError: () => <div>Error occurred</div>,
});

export const LoadingProvider:React.FC<LoadingProviderProps> = ({ children, isLoading, isError }) => {
  const value = useMemo(() => ({
    renderLoader: () => <Loader />,
    renderError: (error:string|Error) => <div>Error: {error instanceof Error ? error?.message : error}</div>,
}), []);

  if(isLoading){
    return value.renderLoader()
  }
  if(isError){
    return value.renderError('Ошибка 123')
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
      </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);
