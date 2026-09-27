import React, { useMemo } from 'react';
import { EWeekDay } from '@shared/constants/types.constants.ts';
import './index.scss';
import { ClockIcon } from '@shared/ui/icons';
import { IOpeningHours } from '@shared/types';

interface IOpeningStatusProps {
  openingHours: IOpeningHours[];
}

const WEEKDAY_MAP: Record<EWeekDay, number> = {
  [EWeekDay.MONDAY]: 1,
  [EWeekDay.TUESDAY]: 2,
  [EWeekDay.WEDNESDAY]: 3,
  [EWeekDay.THURSDAY]: 4,
  [EWeekDay.FRIDAY]: 5,
  [EWeekDay.SATURDAY]: 6,
  [EWeekDay.SUNDAY]: 0,
};

export const OpeningStatus: React.FC<IOpeningStatusProps> = ({ openingHours }) => {
  const status = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todayHours = openingHours.find(
      (h) => WEEKDAY_MAP[h.weekDay] === currentDay
    );

    if (!todayHours || !todayHours.open) {
      return { isOpen: false, message: 'Закрыто' };
    }

    const [fromHour, fromMin] = todayHours.from.split(':').map(Number);
    const [tillHour, tillMin] = todayHours.till.split(':').map(Number);

    const fromTime = fromHour * 60 + fromMin;
    let tillTime = tillHour * 60 + tillMin;

    if (tillTime === 0) {
      tillTime = 24 * 60;
    }

    if (currentTime >= fromTime && currentTime < tillTime) {
      const displayTill = todayHours.till === '00:00:00' ? '00:00' : todayHours.till.slice(0, 5);
      return {
        isOpen: true,
        message: `Открыто до ${displayTill}`
      };
    }

    return { isOpen: false, message: 'Закрыто' };
  }, [openingHours]);

  return (
    <div className={`opening-status ${status.isOpen ? 'opening-status--open' : 'opening-status--closed'}`}>
      <div className="opening-status__icon">
       <ClockIcon/>
      </div>
      <div className="opening-status__content">
        <span className="opening-status__label">{status.isOpen ? 'Открыто' : 'Закрыто'}</span>
        {status.isOpen && (
          <span className="opening-status__time">{status.message.replace('Открыто ', '')}</span>
        )}
      </div>
    </div>
  );
};