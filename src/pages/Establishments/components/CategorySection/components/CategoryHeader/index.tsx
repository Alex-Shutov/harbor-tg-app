import React from 'react';

interface CategoryHeaderProps {
  title: string;
  onSelect?: () => void;
  onBack?: () => void;
  isDetailed?: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, onSelect, onBack, isDetailed }) => {
  return (
    <div className="category-header">
      {isDetailed ? (
        <>
          <div  onClick={onBack}>Назад</div>
          <div className={'category-header--title'}>{title}</div>
        </>
      ) : (
        <>
          <div className={'category-header--title'}>{title}</div>
          <div onClick={onSelect} className="view-all">Все</div>
        </>
      )}
    </div>
  );
};

export default CategoryHeader;
