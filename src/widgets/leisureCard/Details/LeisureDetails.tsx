import React from 'react';
import { Title } from '@shared/ui';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';
interface IProps {
  data: ILeisureDetails;
}
export const LeisureDetails:React.FC<IProps> = ({data}) => {
  if (!data) return null;

  const {
    averageBill,
    hasDelivery,
    hasParking,
    hasCatering,
    hasBanquets,
    canBookSomeTables,
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

  return (
    <>
      <Title className={'details__title'}>Детали</Title>
      <div className="additional-info">
        <div className="details-section__content">
          {averageBill && (
            <p className="details-section__item">
              <span className="details-section__label">Средний чек:</span>
              <span>{averageBill} ₽</span>
            </p>
          )}

          <p className="details-section__item">
            <span className="details-section__label">Доставка:</span>
            <span>{hasDelivery ? 'Да' : 'Нет'}</span>
          </p>

          <p className="details-section__item">
            <span className="details-section__label">Парковка:</span>
            <span>{hasParking ? 'Да' : 'Нет'}</span>
          </p>

          <p className="details-section__item">
            <span className="details-section__label">Кейтеринг:</span>
            <span>{hasCatering ? 'Да' : 'Нет'}</span>
          </p>

          <p className="details-section__item">
            <span className="details-section__label">Банкеты:</span>
            <span>{hasBanquets ? 'Да' : 'Нет'}</span>
          </p>

          <p className="details-section__item">
            <span className="details-section__label">Забронировать столы:</span>
            <span>{canBookSomeTables ? 'Да' : 'Нет'}</span>
          </p>

          {phoneNumbers && phoneNumbers.length > 0 && (
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

          {webSiteLink && (
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
  )
}