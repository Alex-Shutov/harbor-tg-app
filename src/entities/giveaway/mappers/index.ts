import { IApiGiveaway, IGiveaway } from '../types';

export const mapGiveawayFromApi = (apiGiveaway: IApiGiveaway): IGiveaway => {
  return {
    id: apiGiveaway.id,
    status: apiGiveaway.status,
    title: apiGiveaway.title,
    description: apiGiveaway.description,
    participationType: apiGiveaway.participationType,
    participationCost: apiGiveaway.participationCost,
    channels: apiGiveaway.channels,
    participantsLimit: apiGiveaway.participantsLimit,
    participantsCount: apiGiveaway.participantsCount,
    winnersCount: apiGiveaway.winnersCount,
    image: apiGiveaway.image,
    startDateTime: apiGiveaway.startDateTime,
    endDateTime: apiGiveaway.endDateTime,
    isParticipant: apiGiveaway.isParticipant,
    isWinner: apiGiveaway.isWinner,
    isExpired:new Date(apiGiveaway.endDateTime) < new Date() || apiGiveaway.participantsLimit <= apiGiveaway.participantsCount,
    winners: apiGiveaway.winners,
  };
};
























