import React, { useState } from 'react';
import classNames from 'classnames';
import './accordion.scss';

export interface AccordionItemProps {
  title: string | any;
  content: string | any;
}

export interface AccordionProps {
  items: AccordionItemProps[] ;
}

const AccordionItem: React.FC<AccordionItemProps & { isOpen: boolean; onToggle: () => void }> = ({
  title,
  content,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="accordion-item">
      <button
        type="button"
        className={classNames('accordion-item__header', {
          'accordion-item__header--open': isOpen,
        })}
        onClick={onToggle}
      >
        <span className="accordion-item__title">{title}</span>
        <svg
          className={classNames('accordion-item__chevron', {
            'accordion-item__chevron--open': isOpen,
          })}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="accordion-item__content">
          <p className="accordion-item__text">{content}</p>
        </div>
      )}
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <AccordionItem
          {...item}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

