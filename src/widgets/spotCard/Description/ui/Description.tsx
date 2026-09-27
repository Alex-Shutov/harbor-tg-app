import React from 'react';
import { ExpandableDescription } from '@/features/spot-card/expandDescription';
import { Title } from '@shared/ui';
import './description.scss'
interface IProps {
  description:string
}

export const Description: React.FC<IProps> = ({description}) => {


  return (
    <section className="description-section">
      <Title className="description-section__title">О месте</Title>
      <ExpandableDescription
        text={description}
        maxLines={4}
      />
    </section>
  );
};
