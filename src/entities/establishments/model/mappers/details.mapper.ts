import { IApiEstablishment } from '@/entities/establishments/model/types/details.api.types.ts';
import { IEstablishmentDetails } from '@/entities/establishments/model/types/details.domain.types.ts';
import { mapOpeningHours } from '@/entities/lib/utils.mapper.ts';
import { EScheduleType } from '@shared/constants';

export const mapEstablishmentFromApi = (data: IApiEstablishment): IEstablishmentDetails => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    rating: data.rating,
    costLevel: data.costLevel,
    inFavorites: data.inFavorites,
    type: EScheduleType.WORKING_HOURS,
    mainImg: data.mainImg,
    menu: data.menu,
    sectionsWithImages:  data.sectionsWithImages,

    categories: data.categories,

    openingHours: mapOpeningHours(data.openingHours),

    promoCodes: data.promoCodes,

    mapLocation: data.mapLocation,

    review: data.review,

    events: data.events,

    averageBill: data.averageBill,
    hasBreakfasts: data.hasBreakfasts,
    hasBusinessLunches: data.hasBusinessLunches,
    hasDelivery: data.hasDelivery,
    hasParking: data.hasParking,
    hasCatering: data.hasCatering,
    hasBanquets: data.hasBanquets,

    phoneNumbers: data.phoneNumbers,
    webSiteLink: data.webSiteLink,

    reservationTypeEnum: data.reservationTypeEnum,
    needMessageAfterSuccessBid: data.needMessageAfterSuccessBid,
    needBidBeforeField: data.needBidBeforeField,
    messageAfterSuccessBid: data.messageAfterSuccessBid,
    canBookSomeTables: data.canBookSomeTables,
    partnersLinkForReserve: data.partnersLinkForReserve,
  };
};
