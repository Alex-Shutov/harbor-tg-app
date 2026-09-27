import { AverageBill } from './ui/AverageBill/AverageBill';
import { OpeningStatus } from './ui/OpenStatus/OpenStatus';
import { EPageType } from '@shared/constants';
import { IEstablishmentDetails } from '@/entities/establishments/model/types/details.domain.types';
import { withTopBanner } from '@/widgets/spotCard/TopBanner';

export const EstablishmentTopBanner = withTopBanner<IEstablishmentDetails>({
  type: EPageType.ESTABLISHMENT,
  renderInfoComponent: (data) =>
    data.averageBill ? <AverageBill amount={data.averageBill} /> : null,
  renderOpeningStatus: (data) =>
    data.openingHours ? <OpeningStatus openingHours={data.openingHours} /> : null,
});
