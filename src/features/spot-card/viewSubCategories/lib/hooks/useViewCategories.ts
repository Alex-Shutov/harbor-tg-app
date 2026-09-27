import { useMemo } from 'react';
import { IEstablishmentCategory } from '@shared/types';

interface UseViewCategoriesProps {
  categories: IEstablishmentCategory[];
}

export const useViewSubcategories = ({ categories }: UseViewCategoriesProps) => {

  const flatCategories = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.innerCategories && cat.innerCategories.length > 0
        ? [cat, ...cat.innerCategories]
        : [cat]
    );
  }, [categories]);

  return {
    flatCategories,
  };
};
