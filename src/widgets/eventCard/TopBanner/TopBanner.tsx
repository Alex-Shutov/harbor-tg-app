import { EPageType } from '@shared/constants';
import { withTopBanner } from '@/widgets/spotCard/TopBanner';
import { OpeningStatus } from '@/widgets/establishmentCard/TopBanner/ui/OpenStatus/OpenStatus';
import { AgeRatingComponent } from '@/widgets/eventCard/TopBanner/ui/AgeRating/AgeRating.tsx';
import { IEventDetails } from '@/entities/events/model/types/details.domain.types.ts';

export const EventTopBanner = withTopBanner<IEventDetails>({
  type: EPageType.EVENT,
  renderInfoComponent: (data) =>
    data.ageRating ? <AgeRatingComponent ageRating={data.ageRating} /> : null,
  renderOpeningStatus: (data) =>
    data.openingHours ? <OpeningStatus openingHours={data.openingHours} /> : null,
});
