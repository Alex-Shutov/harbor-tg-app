import React from 'react';
import { Title } from '@shared/ui';
import './address-section.scss';

interface AddressSectionProps {
  title: string;
  latitude: number;
  longitude: number;
  address: string;
}

export const AddressSection: React.FC<AddressSectionProps> = ({
                                                                title,
                                                                address,
                                                              }) => {
  return (
    <section className="address-section">
      <Title className="address-section__title">Адрес</Title>
      <div className="address-section__text">
        {address || title}
      </div>
    </section>
  );
};
