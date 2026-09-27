import { IApiPromoCode } from '@shared/types';
import { IPromoCode, ERestrictionType } from '@/entities/promocode/types';
import { isAfter, endOfDay } from 'date-fns';


export const mapPromoCodeFromApi = (api: IApiPromoCode): IPromoCode => {
  const isDateExpired = isAfter(new Date(), endOfDay(new Date(api.endDate)));
  const isCountExpired = api.restrictionType === ERestrictionType.UPON_RECEIPT
    ? api.amount <= api.receivedCount
    : api.amount <= api.appliedCount;
  
  return {
    ...api,
    isExpired: isDateExpired || isCountExpired,
    isPurchasable: api.type === 'PAID',
  };
};