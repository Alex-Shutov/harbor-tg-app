import React, { useEffect, useState } from 'react';
import { BottomSheet, Button, Checkbox } from '@shared/ui';
import { MainCategories } from '@/features/spot-list/filters/viewMainCategories';
import { WorkTime } from '@/features/spot-list/filters/viewWorkTime';
import { SubCategories } from '@/features/spot-list/filters/viewSubCategoriesWithCheckbox';
import './filters-modal.scss';
import { IWorkTimeOption } from '@/entities/lib';
import { ECostLevel } from '@shared/constants';
import { useFiltersEstablishments } from '@/entities/establishments/model/store/useFiltersEstablishmentStore.ts';
import { CostLevel } from '@/features/spot-list/filters/viewCostLevel';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

const costLevelOptions: Array<{ value:  ECostLevel; label: string }> = [
  { value: ECostLevel.ONE, label: '₽' },
  { value: ECostLevel.TWO, label: '₽₽' },
  { value: ECostLevel.THREE, label: '₽₽₽' },
  { value: ECostLevel.FOUR, label: '₽₽₽₽' },
  { value: ECostLevel.FIVE, label: '₽₽₽₽₽' },
];

export const FiltersModal: React.FC<FiltersModalProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            onApply,
                                                          }) => {
  const {
    categories,
    selectedCategoryId,
    selectedSubcategoryIds,
    workTime,
    costLevel,
    isPromotionExist,
    selectCategory,
    toggleSubcategorySelection,
    updateWorkTime,
    updateCostLevel,
    togglePromotion,
  } = useFiltersEstablishments();

  const [tempSelectedCategoryId, setTempSelectedCategoryId] = useState<number | null>(selectedCategoryId);
  const [tempSelectedSubcategoryIds, setTempSelectedSubcategoryIds] = useState<number[]>(selectedSubcategoryIds || []);
  const [tempWorkTime, setTempWorkTime] = useState<IWorkTimeOption>(workTime);
  const [tempCostLevel, setTempCostLevel] = useState<ECostLevel | null>(costLevel);
  const [tempPromotion, setTempPromotion] = useState<boolean | null>(isPromotionExist);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedCategoryId(selectedCategoryId);
      setTempSelectedSubcategoryIds(selectedSubcategoryIds || []);
      setTempWorkTime(workTime);
      setTempCostLevel(costLevel);
      setTempPromotion(isPromotionExist);
    }
  }, [isOpen, selectedCategoryId, selectedSubcategoryIds, workTime, costLevel, isPromotionExist]);

  const handleCategoryClick = (categoryId: number | null) => {
    setTempSelectedCategoryId(categoryId);
    // При смене категории сбрасываем подкатегории
    if (categoryId !== tempSelectedCategoryId) {
      setTempSelectedSubcategoryIds([]);
    }
  };

  const handleSubcategoryToggle = (subcategoryId: number) => {
    setTempSelectedSubcategoryIds((prev) => {
      // Убеждаемся, что prev всегда массив
      const prevArray = Array.isArray(prev) ? prev : [];
      if (prevArray.includes(subcategoryId)) {
        return prevArray.filter((id) => id !== subcategoryId);
      } else {
        return [...prevArray, subcategoryId];
      }
    });
  };

  const handleWorkTimeChange = (value: IWorkTimeOption) => {
    setTempWorkTime(value);
  };

  const handleCostLevelToggle = (value: ECostLevel) => {
    setTempCostLevel(tempCostLevel === value ? null : value);
  };

  const handlePromotionToggle = () => {
    setTempPromotion(tempPromotion === true ? null : true);
  };



  const handleCancel = () => {
    // Восстанавливаем исходные значения
    setTempSelectedCategoryId(selectedCategoryId);
    setTempSelectedSubcategoryIds(selectedSubcategoryIds || []);
    setTempWorkTime(workTime);
    setTempCostLevel(costLevel);
    setTempPromotion(isPromotionExist);
    onClose();
  };

  const handleApply = () => {
    // Применяем изменения к глобальному состоянию
    // Сначала применяем категорию (это может сбросить подкатегории, если категория изменилась)
    const categoryChanged = tempSelectedCategoryId !== selectedCategoryId;
    selectCategory(tempSelectedCategoryId);

    // Затем применяем подкатегории
    // Если категория изменилась, подкатегории уже сброшены, просто добавляем новые
    if (categoryChanged) {
      // Категория изменилась, подкатегории уже сброшены в selectCategory
      // Просто добавляем выбранные подкатегории
      tempSelectedSubcategoryIds.forEach((id) => {
        toggleSubcategorySelection(id);
      });
    } else {
      // Категория не изменилась, нужно синхронизировать подкатегории
      const previousSubcategories = [...(selectedSubcategoryIds || [])];
      
      // Сначала убираем те, которые были выбраны, но теперь не выбраны
      previousSubcategories.forEach((id) => {
        if (!tempSelectedSubcategoryIds.includes(id)) {
          toggleSubcategorySelection(id);
        }
      });
      
      // Затем добавляем те, которые были выбраны в модалке, но не были выбраны ранее
      tempSelectedSubcategoryIds.forEach((id) => {
        if (!previousSubcategories.includes(id)) {
          toggleSubcategorySelection(id);
        }
      });
    }

    updateWorkTime(tempWorkTime);
    updateCostLevel(tempCostLevel);

    // Обновляем boolean фильтры
    if (tempPromotion !== isPromotionExist) {
      togglePromotion();
    }

    onApply();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleCancel} title="Фильтры">
      <div className="filters-modal">
        <div className="filters-modal__content">
          {/* Категории */}
          <div className="filters-modal__section">
            <h3 className="filters-modal__section-title">Категория</h3>
            <MainCategories
              categories={categories}
              selectedCategoryId={tempSelectedCategoryId}
              onCategoryClick={handleCategoryClick}
              mode="filter"
            />
          </div>

          {/* Время работы */}
          <div className="filters-modal__section">
            <WorkTime value={tempWorkTime} onChange={handleWorkTimeChange} />
          </div>

          {categories.length > 0 && (
            <div className="filters-modal__section">
              <SubCategories
                categories={categories}
                selectedCategoryId={tempSelectedCategoryId}
                selectedSubcategoryIds={tempSelectedSubcategoryIds}
                onSubcategoryToggle={handleSubcategoryToggle}
              />
            </div>
          )}

          {tempCostLevel && <div className="filters-modal__section">
            <CostLevel options={costLevelOptions} value={tempCostLevel} onChange={handleCostLevelToggle}/>
          </div>}

          {/* Дополнительно */}
          <div className="filters-modal__section">
            <h3 className="filters-modal__section-title">Дополнительно</h3>
            <div className="filters-modal__checkboxes">
              <Checkbox
                checked={tempPromotion === true}
                onChange={handlePromotionToggle}
                label={'Есть акции'}
              />
            </div>
          </div>
        </div>

        <div className="filters-modal__actions">
          <Button type="secondary" onClick={handleCancel} fullWidth>
            Отмена
          </Button>
          <Button type="primary" onClick={handleApply} fullWidth>
            Применить
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
