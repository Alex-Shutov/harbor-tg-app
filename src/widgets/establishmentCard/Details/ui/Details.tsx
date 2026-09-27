import React from 'react';
import { IEstablishmentDetails } from '@/entities/establishments/model/types/details.domain.types';
import './details.scss';
import { Title } from '@shared/ui';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';
import { IEventDetails } from '@/entities/events/model/types/details.domain.types.ts';

interface DetailsProps {
  data: IEstablishmentDetails | ILeisureDetails  | IEventDetails | undefined;
}

export const Details: React.FC<DetailsProps> = ({ data }) => {
  if (!data) return null;

  const {
    averageBill,
    hasDelivery,
    hasParking,
    hasCatering,
    hasBanquets,
    phoneNumbers,
    webSiteLink,

  } = data;

  const handlePhoneClick = (phoneNumber: string) => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isIOS) {
      window.open(`tel:${phoneNumber}`, '_blank');
    } else if (isAndroid) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };
  console.log(data);
  return (
    <>
      <Title className={'details__title'}>Детали</Title>
    <div className="additional-info">
      <div className="details-section__content">
        {averageBill && data.averageBill !== undefined && (
          <p className="details-section__item">
            <span className="details-section__label">Средний чек:</span>
            <span>{averageBill} ₽</span>
          </p>
        )}

        {'hasDelivery' in data && data.hasDelivery !== undefined &&  <p className="details-section__item">
          <span className="details-section__label">Доставка:</span>
          <span>{hasDelivery ? 'Да' : 'Нет'}</span>
        </p>}

        {'hasParking' in data && data.hasParking !== undefined && <p className="details-section__item">
          <span className="details-section__label">Парковка:</span>
          <span>{hasParking ? 'Да' : 'Нет'}</span>
        </p>}

        {'hasCatering' in data && data.hasCatering !== undefined &&  <p className="details-section__item">
          <span className="details-section__label">Кейтеринг:</span>
          <span>{hasCatering ? 'Да' : 'Нет'}</span>
        </p>}

        {'hasBanquets' in data && data.hasBanquets !== undefined && <p className="details-section__item">
          <span className="details-section__label">Банкеты:</span>
          <span>{hasBanquets ? 'Да' : 'Нет'}</span>
        </p>}

        {'canBookSomeTables' in data && data.canBookSomeTables !== undefined && <p className="details-section__item">
          <span className="details-section__label">Забронировать столы:</span>
          <span>{data.canBookSomeTables ? 'Да' : 'Нет'}</span>
        </p>}

        {phoneNumbers && phoneNumbers.length > 0 && data.phoneNumbers !== undefined && (
          <p className="info_telephone">
            <span className="details-section__label">Телефон:</span>
            <div>
              {phoneNumbers.map((phone, index) => (
                <span
                  key={index}
                  onClick={() => handlePhoneClick(phone)}
                  className="info_telephone_tel"
                >
                  {phone}
                </span>
              ))}
            </div>
          </p>
        )}

        {webSiteLink && data.webSiteLink !== undefined && (
          <p className="details-section__item">
            <span className="details-section__label">Сайт:</span>
            <a
              href={webSiteLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {webSiteLink}
            </a>
          </p>
        )}
      </div>
    </div>
</>
  );
};
