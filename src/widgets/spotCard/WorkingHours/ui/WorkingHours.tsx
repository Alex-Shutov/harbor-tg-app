import React from 'react';
import { WorkingHours } from '@/features/spot-card/viewWorkingHours';
import './hours.scss';
import { IEstablishmentDetails } from '@/entities/establishments/model/types';
import { IEventDetails } from '@/entities/events/model/types/details.domain.types.ts';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';

interface IProps {

  data:IEstablishmentDetails | IEventDetails | ILeisureDetails
}

export const WorkingHoursSection: React.FC<IProps> = ({data}) => {
  return (
    <section className="working-hours-section">
      <WorkingHours
        {...data}
      />
    </section>
  );
};
