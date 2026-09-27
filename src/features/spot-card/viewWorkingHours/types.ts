import { EScheduleType } from '@shared/constants';

export interface IWorkingHoursComponentProps {
  type: EScheduleType;
  openingHours?: Array<{
    weekDay: string;
    from: string;
    till: string;
    open: boolean;
    currentDay: boolean;
  }>;
  dateTime?: string;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: Array<{
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
    currentDay: boolean;
  }>;
}