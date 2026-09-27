import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = (timeout=0) => {
  const loc = useLocation();
  useEffect(() => {
    const x = setTimeout(()=>{window.scrollTo(0, 0)},timeout)
    return () => {
      clearTimeout(x)
    }
  }, [loc]);
};

export default useScrollToTop;