import { EPageType } from '@shared/constants';
import { withTopBanner } from '@/widgets/spotCard/TopBanner';
import { OpeningStatus } from '@/widgets/establishmentCard/TopBanner/ui/OpenStatus/OpenStatus';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';

export const LeisureTopBanner = withTopBanner<ILeisureDetails>({
  type: EPageType.LEISURE,
  renderInfoComponent: () =>
     null,
  renderOpeningStatus: (data) =>
    data.openingHours ? <OpeningStatus openingHours={data.openingHours} /> : null,
});
