export enum EPageType {
  ESTABLISHMENT = 'establishment',
  EVENT = 'event',
  LEISURE = 'leisure',
  TASK = 'task',
  GIVEAWAY = 'giveaway',
  PROMOCODE = 'promocode',
}


export enum EObjectType {
  FOOD_ESTABLISHMENT = 'ESTABLISHMENT',
  EVENT = 'EVENT',
  LEISURE = 'LEISURE',
}


export enum EScheduleType {
  WORKING_HOURS = 'WORKING_HOURS',
  DATE_TIME = 'DATE_TIME',
  PERIOD = 'PERIOD',
  PERIOD_WITH_WORKING_HOURS = 'PERIOD_WITH_WORKING_HOURS',
}


export enum EWeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}



export enum EReservationType {
  NONE = 'NONE',
  WITH_TABLE_SELECTION = 'WITH_TABLE_SELECTION',
  BY_PARTNERS_LINK_RESERVE = 'BY_PARTNERS_LINK_RESERVE',
  BY_PHONE = 'BY_PHONE',
}

export enum ECostLevel {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

export enum EAgeRating {
  ZERO = 'ZERO',
  SIX = 'SIX',
  TWELVE = 'TWELVE',
  SIXTEEN = 'SIXTEEN',
  EIGHTEEN = 'EIGHTEEN',
}

export enum EAgeRatingToNumber {
  ZERO = '0',
  SIX = '6',
  TWELVE = '12',
  SIXTEEN = '16',
  EIGHTEEN = '18',
}

// export const PAGE_TYPE_TO_OBJECT_TYPE: Record<EPageType, EObjectType> = {
//   [EPageType.ESTABLISHMENT]: EObjectType.FOOD_ESTABLISHMENT,
//   [EPageType.EVENT]: EObjectType.EVENT,
//   [EPageType.LEISURE]: EObjectType.LEISURE,
// };
