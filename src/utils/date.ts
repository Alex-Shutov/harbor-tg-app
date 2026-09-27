import { format, getMonth, isBefore, isSameDay, isSameMonth, isTomorrow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TimeOfDay } from '@/shared/types/common.types';
import { EWeekDay as WeekDay } from '@shared/constants';

function getCurrentWeekDay(): WeekDay {
  const currentDayIndex = new Date().getDay();

  switch (currentDayIndex) {
    case 1:
      return WeekDay.MONDAY;
    case 2:
      return WeekDay.TUESDAY;
    case 3:
      return WeekDay.WEDNESDAY;
    case 4:
      return WeekDay.THURSDAY;
    case 5:
      return WeekDay.FRIDAY;
    case 6:
      return WeekDay.SATURDAY;
    case 0:
      return WeekDay.SUNDAY;
    default:
      throw new Error('Unknown day');
  }
}

export function isToday(day: WeekDay): boolean {
  const today = getCurrentWeekDay();
  return today === day;
}

export const formatDate = (date:Date|null) => {
  if (!date) return ''

  return format(date, 'eeee, d MMMM', { locale: ru });
};

export const formatDateTime = (dateTime:string) => {
  debugger
  if (!dateTime) return ''
  let date: Date;
  try {
    date = parseISO(dateTime);
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      date = new Date(dateTime);
    }
  } catch (e) {
    date = new Date(dateTime);
  }

  return format (date, "d MMMM 'в' HH:mm", { locale: ru })
}

const months = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

const monthsGenitive = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];



export const formatPeriod = (startDate:string, endDate:string) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const now = new Date();

  // Проверка, началось ли мероприятие
  if (isBefore(now, start)) {
    // Мероприятие еще не началось
    return `С ${format(start, 'd')} ${monthsGenitive[getMonth(start)]}`;
  } else if (isBefore(now, end)) {
    // Мероприятие уже идет
    if (isSameMonth(start, end)) {
      // Начало и конец в одном месяце
      return 'Уже идет';
    } else {
      // Разные месяцы
      return `${months[getMonth(start)]} - ${months[getMonth(end)]}`;
    }
  } else {
    // Мероприятие завершилось
    return `Завершилось ${format(end, 'd')} ${monthsGenitive[getMonth(end)]}`;
  }
};

function padToTwoDigits(number:number) {
  return number < 10 ? `0${number}` : number;
}
export function formatDateWithPrefix(date:number|string|null|Date,startTime:TimeOfDay,endTime?:TimeOfDay) {
  if (!date) return ''
  let prefix = '';

  if (isSameDay(date,new Date())) {
    prefix = 'сегодня, ';
  } else if (isTomorrow(date)) {
    prefix = 'завтра, ';
  }
  
  // Если endTime не передан или undefined, показываем только startTime
  if (!endTime || endTime.hour==null || endTime.minute==null) {
    if (startTime.hour!==null && startTime.minute!==null) {
      const formattedDate = format(date, 'EEEE, d MMMM', { locale: ru });
      const start = `${padToTwoDigits(startTime.hour as number)}:${padToTwoDigits(startTime.minute as number)}`;
      const base = `${prefix}${formattedDate}, с ${start}`
      return base.charAt(0).toUpperCase() + base.slice(1);
    }
    return '';
  }

  if (startTime.hour==null || startTime.minute == null || endTime.hour==null || endTime.minute==null)
    return ''
  const formattedDate = format(date, 'EEEE, d MMMM', { locale: ru });
  const start = `${padToTwoDigits( startTime.hour)}:${padToTwoDigits(startTime.minute)}`;
  const end = `${padToTwoDigits( endTime.hour)}:${padToTwoDigits( endTime.minute)}`;
  const base = `${prefix}${formattedDate}, ${start} - ${end}`
  return base.charAt(0).toUpperCase() + base.slice(1);
}


export function formatOnlyDateWithPrefix(date: Date | string | number|null): string {
  if (!date) return ''

  const parsedDate = new Date(date);
  let prefix = '';

  if (isSameDay(parsedDate, new Date())) {
    prefix = 'Сегодня, ';
  } else if (isTomorrow(parsedDate)) {
    prefix = 'Завтра, ';
  }

  const formattedDate = format(parsedDate, 'EEEE, d MMMM', { locale: ru });
  const result = `${prefix}${formattedDate}`;

  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatTimeRange(startTime: TimeOfDay, endTime: TimeOfDay): string {
  if (
    startTime.hour == null || startTime.minute == null ||
    endTime.hour == null || endTime.minute == null
  ) {
    return '';
  }

  const padToTwoDigits = (num: number) => num.toString().padStart(2, '0');

  const start = `${padToTwoDigits(startTime.hour)}:${padToTwoDigits(startTime.minute)}`;
  const end = `${padToTwoDigits(endTime.hour)}:${padToTwoDigits(endTime.minute)}`;

  return `${start}-${end}`;
}

export const formatDateWithOnlyDigits = (date:number | string | Date,) => {
  let formatDate = format(date, 'dd.MM.yyyy', { locale: ru });
  formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
  return formatDate;
};