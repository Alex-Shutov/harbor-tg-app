import React from 'react';
import { useWorkingHours } from '@/features/spot-card/viewWorkingHours';
import { IWorkingHoursComponentProps } from '../types.ts';
import './hours.scss';

const DAYS_OF_WEEK: Record<string, string> = {
  MONDAY: 'Пн',
  TUESDAY: 'Вт',
  WEDNESDAY: 'Ср',
  THURSDAY: 'Чт',
  FRIDAY: 'Пт',
  SATURDAY: 'Сб',
  SUNDAY: 'Вс',
};

const formatTime = (timeString: string): string => {
  if (!timeString) return '--:--';
  let hours,minutes;
  const hoursString = timeString.split('T')[1];
  [hours, minutes] = !hoursString ? timeString.split(':') : hoursString.split(':');
  return `${hours}:${minutes}`;
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const WorkingHours: React.FC<IWorkingHoursComponentProps> = ({
                                                                      type,
                                                                      openingHours,
                                                                      dateTime,
                                                                      startDate,
                                                                      endDate,
                                                                    }) => {
  const { showHours, setShowHours, currentDay, hoursArray } = useWorkingHours({
    type,
    openingHours,
  });

  if (type === 'DATE_TIME' && dateTime) {
    return (
      <div className="hours-header hours-header--not-clickable">
        Ждем вас {formatDate(dateTime)} в {formatTime(dateTime)}
      </div>
    );
  }

  if (type === 'PERIOD' && startDate && endDate) {
    return (
      <div className="hours-header hours-header--not-clickable">
        Ждем вас с {formatDate(startDate)} по {formatDate(endDate)}
      </div>
    );
  }

  if (type === 'WORKING_HOURS' && openingHours) {
    return (
      <div className="hours-component">
        <div
          className="hours-header"
          onClick={() => setShowHours(!showHours)}
        >
          <span>
            {currentDay
              ? !currentDay.open
                ? 'Выходной'
                : `Открыто с ${formatTime(currentDay.from)} до ${formatTime(
                  currentDay.till
                )}`
              : 'График работы'}
          </span>
          <svg
            className={`hours-header__arrow ${showHours ? 'up' : 'down'}`}
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {showHours && (
          <ul className="hours-list">
            {hoursArray.map((hours, index) =>
              hours ? (
                <li
                  key={index}
                  className={`hours-item ${
                    hours.currentDay ? 'hours-item--current-day' : ''
                  }`}
                >
                  <span className="hours-item__day">
                    {DAYS_OF_WEEK[hours.weekDay as keyof typeof DAYS_OF_WEEK]}
                  </span>
                  <span className="hours-item__time">
                    {!hours.open
                      ? 'Выходной'
                      : `${formatTime(hours.from)} – ${formatTime(hours.till)}`}
                  </span>
                </li>
              ) : null
            )}
          </ul>
        )}
      </div>
    );
  }

  return null;
};
