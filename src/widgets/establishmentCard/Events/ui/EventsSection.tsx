import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from '@/shared/ui';
import { Title } from '@shared/ui';
import './events-section.scss';
import { IEmbeddedEvent } from '@shared/types';
import { IEstablishmentDetails } from '@/entities/establishments/model/types/details.domain.types.ts';
import { formatDateTime, formatPeriod } from '@utils/date.ts';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';
interface IProps {
  data: IEstablishmentDetails | ILeisureDetails;
}

export const EventsSection: React.FC<IProps> = ({data}) => {
  const navigate = useNavigate();


  const handleEventClick = (eventId: number) => {
    navigate(`/event/${eventId}`);
  };

  const handleLikeClick = useCallback((event: IEmbeddedEvent) => {
    console.log('Like clicked for event:', event.id);
  }, []);

  const formatEventDate = (event: IEmbeddedEvent): string | undefined => {

    if (event.type === 'DATE_TIME' && event.dateTime) {
      return formatDateTime(event.dateTime);
    }

    if ((event.type === 'PERIOD' || event.type === 'PERIOD_WITH_WORKING_HOURS') && (event.startDate && event.endDate)) {
      return formatPeriod(event.startDate, event.endDate);
    }


    return undefined;
  };

  return (
    <section className="events-section">
      <Title className="events-section__title">События</Title>

      <div className="events-section__grid">
        {data.events.map((event) => (
          <EventCard
            imageUrl={event.imgUrl}
            title={event.title}
            subtitle={event.categories.map(el=>el.title).join(', ')}
            date={formatEventDate(event)}
            inFavorites={event.inFavorites}
            onClick={() => handleEventClick(event.id)}
            onLikeClick={(e) => {
              e.stopPropagation();
              handleLikeClick(event);
            }}
          />
        ))}
      </div>
    </section>
  );
};
