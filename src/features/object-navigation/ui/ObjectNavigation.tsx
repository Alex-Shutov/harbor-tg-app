import React from 'react';
import { EObjectSection, IObjectSection } from '../types/sections.types';
import './object-navigation.scss';

interface IObjectNavigationProps {
  sections: IObjectSection[];
  activeSection: EObjectSection | null;
  onSectionClick: (sectionId: EObjectSection) => void;
}

export const ObjectNavigation: React.FC<IObjectNavigationProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  if (sections.length === 0) return null;

  return (
    <div className="object-navigation-wrapper">
      <div className="object-navigation">
        <div className="object-navigation__container">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`object-navigation__tab ${
                activeSection === section.id ? 'object-navigation__tab--active' : ''
              }`}
              onClick={() => onSectionClick(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

