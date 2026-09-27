import React from 'react';
import { useExpandDescription } from '@/features/spot-card/expandDescription';
import './description.scss';

interface IExpandableDescriptionProps {
  text: string;
  maxLines?: number;
}


export const ExpandableDescription: React.FC<IExpandableDescriptionProps> = ({
                                                                               text,
                                                                               maxLines = 4,
                                                                             }) => {
  const { isExpanded, setIsExpanded, isTruncated } = useExpandDescription({
    text,
    maxLines,
  });

  return (
    <div className="expandable-description">
      <p
        className={`expandable-description__text ${
          !isExpanded ? 'expandable-description__text--truncated' : ''
        }`}
        style={{
          WebkitLineClamp: !isExpanded ? maxLines : 'unset',
        }}
      >
        {text}
      </p>

      {isTruncated && (
        <button
          className="expandable-description__btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Скрыть' : 'Ещё'}
        </button>
      )}
    </div>
  );
};
