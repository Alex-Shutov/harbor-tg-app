import { useState, useEffect, useMemo } from 'react';
import { IWorkingHoursComponentProps } from '@/features/spot-card/viewWorkingHours/types.ts';

export const useWorkingHours = ({
                                  type,
                                  openingHours,
                                  }: IWorkingHoursComponentProps) => {
  const [showHours, setShowHours] = useState(false);

  const hoursArray = useMemo(() => {
    return Array.isArray(openingHours) ? openingHours : [openingHours];
  }, [openingHours]);

  const currentDay = useMemo(() => {
    return hoursArray?.find((day) => day?.currentDay);
  }, [hoursArray]);

  useEffect(() => {
    if (!currentDay && type === 'WORKING_HOURS') {
      setShowHours(true);
    }
  }, [currentDay, type]);

  return {
    showHours,
    setShowHours,
    currentDay,
    hoursArray,
  };
};
