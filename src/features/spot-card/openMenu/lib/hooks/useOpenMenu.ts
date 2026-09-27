import { useCallback } from 'react';

interface UseOpenMenuProps {
  menuUrl: string;
}

export const useOpenMenu = ({ menuUrl }: UseOpenMenuProps) => {
  const handleOpenMenu = useCallback(() => {
    if (menuUrl) {
      window.open(menuUrl, '_blank');
    }
  }, [menuUrl]);

  return { handleOpenMenu };
};
