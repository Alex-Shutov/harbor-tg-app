import React from 'react';
import { motion } from 'framer-motion';
import { Title } from '@shared/ui';
import './categories.scss';
import { useViewSubcategories } from '@/features/spot-card/viewSubCategories/lib';
import { useHorizontalScroll } from '@hooks/useHorizontalScroll.ts';
import { CategoriesList } from '@/features/spot-card/viewSubCategories/ui/SubCategoriesList.tsx';
import { IEstablishmentCategory } from '@shared/types';

interface CategoriesSectionProps {
  categories: IEstablishmentCategory[];
}

export const SubCategories: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const { flatCategories } = useViewSubcategories({ categories });

  const { containerRef, contentRef, x, constraints } = useHorizontalScroll();

  if (!flatCategories || flatCategories.length === 0) return null;

  return (
    <section className="categories-section">
      <Title className="categories-section__title">Особенности</Title>

      <div ref={containerRef} className="categories-section__scroll-container">
        <motion.div
          ref={contentRef}
          className="categories-section__content"
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          style={{ x }}
          whileTap={{ cursor: 'grabbing' }}
        >
          <CategoriesList
            categories={flatCategories}
            canSelect={false}
          />
        </motion.div>
      </div>
    </section>
  );
};
