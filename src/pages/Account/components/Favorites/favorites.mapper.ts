import { GroupedApiResponse, mapEstablishmentCategories } from '@/pages/Establishments/main.mapper.ts';
import { GroupedApiEventResponse, mapEventsCategories } from '../../../Events/events.mapper.ts';

export type FavoritesResponse = {
  favoriteEstablishments: GroupedApiResponse;
  favoriteEvents: GroupedApiEventResponse;
  favoriteLeisure: GroupedApiResponse;
};

export const mapFavorites = (data: FavoritesResponse) => {

  const mappedEstablishments = mapEstablishmentCategories(data.favoriteEstablishments)
  const mappedEvents = mapEventsCategories(data.favoriteEvents)
  const mappedLeisure = mapEstablishmentCategories(data.favoriteLeisure??{},"LEISURE")
  return {mappedEstablishments, mappedEvents,mappedLeisure, isEmpty: !(!!Object.keys (mappedEvents).length || !!Object.keys (mappedEstablishments).length || !!Object.keys((mappedLeisure)).length)};
};