import React, { startTransition, useEffect } from 'react';
import { motion } from 'framer-motion';
import './SubCategories.scss';
import { Category } from '../../categroies.atoms.ts';
import SubcategoriesList from '../../../../../../components/SubcategoresList';
import { useHorizontalScroll } from '../../../../../../hooks/useHorizontalScroll.ts';

interface SubcategoriesBarProps {
  subcategories: Omit<Category, "innerCategoriesTitle">[];
  selectedInnerCategory: number[] | null;
  onSelectInnerCategory: (value: number[] | null) => void;
}

const SubcategoriesBar: React.FC<SubcategoriesBarProps> = ({
                                                             subcategories,
                                                             selectedInnerCategory,
                                                             onSelectInnerCategory,
                                                           }) => {
  const { containerRef, contentRef, x, constraints,recalculate } = useHorizontalScroll();

  const handleSelectSubcategory = (id: number) => {
    startTransition(() => {
      const prev = selectedInnerCategory;
      if (Array.isArray(prev)) {
        if (prev.includes(id)) {
          onSelectInnerCategory(prev.filter((subId: number) => subId !== id));
        } else {
          onSelectInnerCategory([...prev, id]);
        }
      } else {
        onSelectInnerCategory([id]);
      }
    });
  };

  useEffect(() => {
      recalculate(); // Пересчитываем ограничения после загрузки данных
  }, [subcategories]);


  return (
    <div  className="subcategories">
      <div className="subcategory-label">Предпочтения</div>
      <div ref={containerRef}>
      <motion.div
        className="subcategory-bar"
        ref={contentRef}
        drag="x"
        dragConstraints={constraints}
        style={{ x }}
        dragElastic={0.1}
        whileTap={{ cursor: 'grabbing' }}
      >
        <SubcategoriesList
          subcategories={subcategories}
          selectedSubcategory={selectedInnerCategory}
          handleSelectSubcategory={handleSelectSubcategory}
        />
      </motion.div>
      </div>
    </div>
  );
};

export default SubcategoriesBar;
