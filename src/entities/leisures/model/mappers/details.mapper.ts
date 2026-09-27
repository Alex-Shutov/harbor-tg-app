import {
  mapBaseDetails, mapEmbeddedEvent,
  mapOpeningHours,
  mapPeriodDaysInfo,
} from '@/entities/lib/utils.mapper';
import { IApiLeisureDetails } from '@/entities/leisures/model/types/details.api.types.ts';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';

export const mapLeisureFromApi = (
  data:IApiLeisureDetails
): ILeisureDetails => {
  const baseDetails = mapBaseDetails(data);

  return {
    ...baseDetails,
    serialNumber: data.serialNumber,

    type: data.type,
    dateTime: data.dateTime,
    startDate: data.startDate,
    endDate: data.endDate,
    mapPoint:undefined,
    periodDaysInfo: mapPeriodDaysInfo(data.periodDaysInfo),
    openingHours: mapOpeningHours(data.openingHours),
    promoCodes: data.promoCodes,
    canBookSomeTables:undefined,
    events:data.events ? mapEmbeddedEvent(data.events) : [],
    reservationTypeEnum:data.reservationTypeEnum,
    externalBookUrl:data.externalBookUrl
  };
};

