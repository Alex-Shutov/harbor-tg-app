import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CloseButton } from '@shared/ui';
import './DatePickerSlider.scss';

export type DateClassType =
  | 'single-date'
  | 'range-start'
  | 'range-end'
  | 'range-middle'
  | '';

export interface IProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (startDate: Date | null, endDate: Date | null) => void;
  initialDate?: Date;
}

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const RIGHT_DAY_LENGTH = 90
const LEFT_DAY_LENGTH = 3

const DatePickerSlider: React.FC<IProps> = ({
                                              startDate: propStartDate = null,
                                              endDate: propEndDate = null,
                                              onChange,
                                              initialDate = new Date(),
                                            }) => {
  const [internalStartDate, setInternalStartDate] = useState<Date | null>(propStartDate);
  const [internalEndDate, setInternalEndDate] = useState<Date | null>(propEndDate);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);

  useEffect(() => {
    if (propStartDate !== internalStartDate) {
      setInternalStartDate(propStartDate ?? null);
    }
    if (propEndDate !== internalEndDate) {
      setInternalEndDate(propEndDate ?? null);
    }
  }, [propStartDate, propEndDate]);


  const getVisibleDates = (centerDate: Date) => {
    const dates: Date[] = [];
    const startDate = new Date(centerDate);
    startDate.setDate(centerDate.getDate() - LEFT_DAY_LENGTH);

    for (let i = 0; i < RIGHT_DAY_LENGTH; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  useEffect(() => {
    setVisibleDates(getVisibleDates(initialDate));
  }, []);

  // Функция для создания массива с месяцами и датами
  const getDatesWithMonths = useMemo(() => {
    const result: { type: 'date' | 'month'; data: Date | string; index: number }[] = [];
    let lastMonth = -1;

    visibleDates.forEach((date, _) => {
      const currentMonth = date.getMonth();

      // Добавляем элемент месяца при смене месяца
      if (currentMonth !== lastMonth) {
        result.push({
          type: 'month',
          data: `${monthNames[currentMonth]}`,
          index: result.length
        });
        lastMonth = currentMonth;
      }

      // Добавляем дату
      result.push({
        type: 'date',
        data: date,
        index: result.length
      });
    });

    return result;
  }, [visibleDates]);

  const handleSelectDate = (date: Date): void => {
    let newStartDate: Date | null = internalStartDate;
    let newEndDate: Date | null = internalEndDate;

    if (!internalStartDate) {
      newStartDate = date;
      newEndDate = null;
    } else if (internalStartDate && !internalEndDate) {
      if (date.getTime() < internalStartDate.getTime()) {
        newEndDate = internalStartDate;
        newStartDate = date;
      } else {
        newEndDate = date;
      }
    } else {
      newStartDate = date;
      newEndDate = null;
    }

    setInternalStartDate(newStartDate);
    setInternalEndDate(newEndDate);
    onChange?.(newStartDate, newEndDate);
  };

  const isInRange = (date: Date): boolean => {
    if (!internalStartDate || !internalEndDate) return false;
    return date >= internalStartDate && date <= internalEndDate;
  };

  const isSelected = (date: Date): boolean => {
    return !!(
      (internalStartDate && date.toDateString() === internalStartDate.toDateString()) ||
      (internalEndDate && date.toDateString() === internalEndDate.toDateString())
    );
  };

  const handleClearSelection = (): void => {
    setInternalStartDate(null);
    setInternalEndDate(null);
    onChange?.(null, null);
  };

  const scrollByDays = (days: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: days * 56,
        behavior: 'smooth',
      });
    }
  };

  const getDateClass = (date: Date): DateClassType => {
    const selected = isSelected(date);
    const inRange = isInRange(date);

    if (internalStartDate && !internalEndDate && selected) {
      return 'single-date';
    }

    if (internalStartDate && internalEndDate) {
      if (date.toDateString() === internalStartDate.toDateString()) {
        return 'range-start';
      }
      if (date.toDateString() === internalEndDate.toDateString()) {
        return 'range-end';
      }
      if (inRange) {
        return 'range-middle';
      }
    }

    return '';
  };
  const getMonthClass = (date: Date): DateClassType => {
    if (!internalStartDate || !internalEndDate) return '';

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    if (internalEndDate > internalStartDate && internalEndDate >= monthStart && monthStart >= internalStartDate) {
      return 'range-middle';
    }
    return '';
  };

  return (
    <div className="date-picker-slider">
      <button
        className="date-picker-slider__nav-btn"
        onClick={() => scrollByDays(-6)}
      >
        ‹
      </button>

      <div className="date-picker-slider__dates-scroll" ref={scrollRef}>
        {getDatesWithMonths.map((item, index) => {
          if (item.type === 'month') {
            const monthDate = new Date(visibleDates.find(d =>
              d.getMonth() === monthNames.indexOf(item.data as string)
            ) || new Date());

            const monthClass = getMonthClass(monthDate);

            return (
              <div
                key={`month-${index}`}
                className={`date-picker-slider__month-item divider ${monthClass}`}
              >
                <div className="date-picker-slider__month-text">
                  {item.data.toString()}
                </div>
                <div className="date-picker-slider__month-divider" />
              </div>
            );
          }

          const date = item.data as Date;
          const weekend = date.getDay() === 0 || date.getDay() === 6;
          const selected = isSelected(date);
          const inRange = isInRange(date);

          return (
            <div
              key={`date-${index}`}
              className={`date-picker-slider__item 
                ${selected ? 'selected' : ''} 
                ${inRange ? 'in-range' : ''}
                ${getDateClass(date)}
              `}
              onClick={() => handleSelectDate(date)}
            >
              <div className={`date-picker-slider__day ${weekend ? 'weekend' : ''}`}>
                {daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]}
              </div>
              <div className="date-picker-slider__day-number">
                {date.getDate()}
              </div>

              {selected && !internalEndDate && internalStartDate && (
                <div
                  className="date-picker-slider__clear-btn-wrapper"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSelection();
                  }}
                >
                  <CloseButton
                    onClick={() => {}}
                    className="date-picker-slider__clear-btn"
                    aria-label="Очистить выбор"
                    size="small"
                  />
                </div>
              )}

              {selected && internalEndDate && internalStartDate && date.getTime() === internalEndDate.getTime() && (
                <div
                  className="date-picker-slider__clear-btn-wrapper"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSelection();
                  }}
                >
                  <CloseButton
                    onClick={() => {}}
                    className="date-picker-slider__clear-btn"
                    aria-label="Очистить выбор"
                    size="small"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="date-picker-slider__nav-btn"
        onClick={() => scrollByDays(6)}
      >
        ›
      </button>
    </div>
  );
};

export default DatePickerSlider;