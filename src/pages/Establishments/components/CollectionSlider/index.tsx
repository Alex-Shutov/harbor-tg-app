import React from 'react';
import './CollectionSlider.scss';
import GenericSlider from '../../../../components/GenericSlider';
import { CollectionItem } from '@shared/types';

interface IProps {
  collections?: CollectionItem[];
  type: 'establishments' | 'events' | 'leisure';
}

const CollectionSlider: React.FC<IProps> = ({ collections, type }) => {
  return <GenericSlider label="Подборки" items={collections} type={type} itemConstraints={{ left: 0 }} />;
};

export default CollectionSlider;
