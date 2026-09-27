import React from 'react';
import './mainInfo.scss';
import { motion } from 'framer-motion';
import { useSafeClick } from '@hooks/useSafeClick.ts';
import { useHorizontalScroll } from '@hooks/useHorizontalScroll.ts';
import { WorkingHours } from '@/features/spot-card/viewWorkingHours';
import { IEstablishmentDetails } from '@/entities/establishments/model/types';
import { IEventDetails } from '@/entities/events/model/types/details.domain.types.ts';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';
import { EAgeRatingToNumber } from '@shared/constants';
import { CostLevelComponent } from '@/features/spot-card/mainInfo/ui/costLevel.tsx';
import { ExpandableDescription } from '@/features/spot-card/expandDescription';


interface IProps {
  data:IEstablishmentDetails | IEventDetails | ILeisureDetails
}

interface CategoryItemProps {
  item: {
    type: string;
    title: string;
    id: number;
    parentId?: number;
  },
  onCategoryClick: (categoryId: number) => void,
  onSubcategoryClick: (categoryId: number, subcategoryId: number) => void,
  key?: number,
  isLast?: boolean
}

const CategoryItem: React.FC<CategoryItemProps> = ({ item, onCategoryClick, onSubcategoryClick, isLast }) => {
  const isMain = item.type === 'main';

  // Create a callback for the click handler
  const handleClick = () => {
    if (isMain) {
      onCategoryClick (item.id);
    } else {
      onSubcategoryClick (item.parentId!, item.id);
    }
  };

  // Now we can safely use the hook here
  const safeClickHandlers = useSafeClick (handleClick);

  return (
    <span
      className={`establishment-page__mainInfo_categories_category ${isLast ? 'establishment-page__mainInfo_categories_category_last' : ''} ${
        isMain
          ? 'establishment-page__mainInfo_categories_category__main'
          : 'establishment-page__mainInfo_categories_category_inner'
      }`}
      {...safeClickHandlers}
    >
      {item.title}
    </span>
  );
};

const MainInfoComponent: React.FC<IProps> = ({
                                              data
                                             }) => {

  const flattenCategories = data.categories
    ? data.categories.flatMap ((el) =>
      el?.innerCategories
        ? [
          { type: 'main', title: el.title, id: el.id },
          ...el.innerCategories.map ((inner) => ({
            type: 'inner',
            title: inner.title,
            id: inner.id,
            parentId: el.id,
          })),
        ]
        : [{ type: 'main', title: el.title, id: el.id }],
    )
    : [];

  const { containerRef, contentRef, x, constraints } = useHorizontalScroll ();

  return (
    <div className={'establishment-page__mainInfo'}>
      <div ref={containerRef} className="categories-scroll-container">
        {data.averageBill && <CostLevelComponent level={data.averageBill} />}
        {'ageRating' in data && data.ageRating && (
          <span className={'establishment-page__ageLevel'}>
           {EAgeRatingToNumber[data.ageRating]}+
         </span>
        )}
        <motion.div
          ref={contentRef}
          className="categories-scroll-content"
          drag="x"
          style={{ x }}
          dragConstraints={constraints}
          dragElastic={0.05}
          whileTap={{ cursor: 'grabbing' }}
        >
          {flattenCategories.map ((item, idx) => (
            <CategoryItem
              key={idx}
              item={item}
              onCategoryClick={()=>null}
              onSubcategoryClick={()=>null}
              isLast={idx===flattenCategories.length - 1}
            />
          ))}
        </motion.div>
      </div>

      <div className={'establishment-page__mainInfo_title'}>{data.title}</div>
      {<WorkingHours {...data}/>}
      <ExpandableDescription
        text={data.description}
        maxLines={2}
      />
    </div>
  );
};

export default MainInfoComponent;