import { useState, useCallback } from 'react';
import { useToggleFavoriteMutation } from '@/features/spot-card/manageLike/model/api/like.api.ts';
import { EObjectType } from '@shared/constants';

interface UseLikeProps {
  id: number;
  objectType: string;
  initialLiked: boolean;
}

interface UseLikeReturn {
  isLiked: boolean;
  handleLikeClick: (e: React.MouseEvent) => void;
  isLoading: boolean;
  error: string | null;
}


export const useLike = ({
                          id,
                          objectType,
                          initialLiked,
                        }: UseLikeProps): UseLikeReturn => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [error, setError] = useState<string | null>(null);
  const [toggleLikeMutation, { isLoading }] = useToggleFavoriteMutation();

  const handleLikeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const previousLiked = isLiked;
      setIsLiked(!isLiked);
      setError(null);
      try {
        await toggleLikeMutation({
          id,
          object_type: objectType as EObjectType,
        }).unwrap();

        setIsLiked(!isLiked);
      } catch (err) {
        setIsLiked(previousLiked);
        setError(err instanceof Error ? err.message : 'Failed to toggle like');
        console.error('Failed to toggle like:', err);
      }
    },
    [id, objectType, isLiked, toggleLikeMutation]
  );

  return {
    isLiked,
    handleLikeClick,
    isLoading,
    error,
  };
};
