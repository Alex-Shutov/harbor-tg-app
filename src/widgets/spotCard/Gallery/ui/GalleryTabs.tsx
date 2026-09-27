import React from 'react';
import { IGallerySection } from '../types';

interface IGalleryTabsProps {
  sections: IGallerySection[];
  activeTabId: number;
  onTabChange: (sectionId: number) => void;
}


export const GalleryTabs: React.FC<IGalleryTabsProps> = ({
                                                           sections,
                                                           activeTabId,
                                                           onTabChange,
                                                         }) => {
  return (
    <div className="gallery__tabs">
      {sections.map((section) => (
        <button
          key={section.id}
          className={`gallery__tab ${
            section.id === activeTabId ? 'gallery__tab--active' : ''
          }`}
          onClick={() => onTabChange(section.id)}
        >
          {section.title}
        </button>
      ))}
    </div>
  );
};
