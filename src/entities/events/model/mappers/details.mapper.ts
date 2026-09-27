import { IApiEventDetails } from '../types/details.api.types.ts';
import { IEventDetails } from '../types/details.domain.types.ts';
import {
  mapBaseDetails,
  mapOpeningHours,
  mapPeriodDaysInfo,
} from '@/entities/lib/utils.mapper.ts';
import { IApiEmbeddedLeisure, IEmbeddedLeisure } from '@shared/types';

export const mapEventFromApi = (data: IApiEventDetails): IEventDetails => {
  const baseDetails = mapBaseDetails(data);

  return {
    ...baseDetails,
    serialNumber: data.serialNumber,

    type: data.type,
    dateTime: data.dateTime,
    startDate: data.startDate,
    endDate: data.endDate,
    periodDaysInfo: mapPeriodDaysInfo(data.periodDaysInfo),
    openingHours: mapOpeningHours(data.openingHours),
    establishments:data.establishments,
    leisure:mapLeisure(data.leisure),
    promoCodes: data.promoCodes,
    ageRating: data.ageRating,
    mapPoint:data.mapPoint
  };
};

const mapLeisure = (data:IApiEmbeddedLeisure[]):IEmbeddedLeisure[]=>{
    return data.map((el:IApiEmbeddedLeisure)=>{
      const {isPromotionExist,...rest} = el
      return{
        ...rest,
        promotionExist:isPromotionExist
      }
    })
  }
