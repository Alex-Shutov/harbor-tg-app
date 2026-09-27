import React from 'react';
import { ContentObject } from '../../selection.types';
import { CostLevelEnum } from '@pages/Establishment/components/details/details.types';
import './categories-info.scss';
import { AgeRatingRu } from '@pages/Events/events.types.ts';

interface ICategoriesInfoProps {
  contentBlock: ContentObject;
}

const costLevelToSymbols: Record<CostLevelEnum, string> = {
  ONE: '₽',
  TWO: '₽₽',
  THREE: '₽₽₽',
  FOUR: '₽₽₽₽',
  FIVE: '₽₽₽₽₽',
};

export const CategoriesInfo: React.FC<ICategoriesInfoProps> = ({ contentBlock }) => {
  const parts: string[] = [];

  // Добавляем категории
  if (contentBlock.categories && contentBlock.categories.length > 0) {
    contentBlock.categories.forEach((category) => {
      if (category.title) {
        parts.push(category.title);
      }
      // Добавляем внутренние категории
      if (category.innerCategories && category.innerCategories.length > 0) {
        category.innerCategories.forEach((innerCategory) => {
          if (innerCategory.title) {
            parts.push(innerCategory.title);
          }
        });
      }
    });
  }

  // Добавляем уровень цен или возрастной рейтинг
  if (contentBlock.type === 'FOOD_ESTABLISHMENT' || contentBlock.type === 'LEISURE') {
    const costLevel = contentBlock.costLevel;
    if (costLevel && costLevelToSymbols[costLevel]) {
      parts.push(costLevelToSymbols[costLevel]);
    }
  } else if (contentBlock.type === 'EVENT') {
    const ageRating = contentBlock.ageRating;
    if (ageRating && AgeRatingRu[ageRating]) {
      parts.push(`${AgeRatingRu[ageRating]}+`);
    }
  }

  if (parts.length === 0) {
    return null;
  }

  return (
    <div className="categories-info">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="categories-info__separator"> • </span>}
          <span className="categories-info__item">{part}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

