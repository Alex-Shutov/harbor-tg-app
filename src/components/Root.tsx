import { FC, useEffect, useRef } from 'react';
import App from '../App';
import { ErrorBoundary } from './ErrorBoundary';
import { SnackbarProvider } from 'notistack';
import {
  HashRouter, useLocation,
} from 'react-router-dom';
import { store } from '@/store/store';
import { Provider } from 'react-redux';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
);

const NavigationCounter = () => {
  const location = useLocation();
  const countRef = useRef(-2);
  useEffect(() => {
    if (!location.pathname.includes('subscription')) {
      // Avoid using the post-increment operator on refs to prevent
      // any potential issues after compilation/minification.
      countRef.current = countRef.current + 1;
      (window as any).__navCount = countRef.current;
    }
  }, [location.pathname]);

  return null;
};

const Inner: FC = () => {

  return (
      <SnackbarProvider>
        <HashRouter>
          <NavigationCounter/>
          <App />
        </HashRouter>
      </SnackbarProvider>
  );
};

export const Root: FC = () => {


  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <Provider store={store}>

        {<Inner />}
      </Provider>
    </ErrorBoundary>
  );
};
