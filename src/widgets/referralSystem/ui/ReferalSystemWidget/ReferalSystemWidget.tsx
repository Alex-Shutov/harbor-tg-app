import { ChevronRight } from 'lucide-react';
import React from 'react';
import './referal-system-widget.scss';

interface IReferalSystemWidgetProps {
  onClick: () => void;
}

export const ReferalSystemWidget: React.FC<IReferalSystemWidgetProps> = ({
  onClick,
}) => {
  return (
    <button
      type="button"
      className="referal-system-widget"
      onClick={onClick}
    >
      <div className="referal-system-widget__content">
        <h3 className="referal-system-widget__title">Реферальная ссылка</h3>
        <p className="referal-system-widget__description">
          Поделитесь ссылкой и пригласите гостей в Harbor
        </p>
      </div>
      <div className="referal-system-widget__arrow">
        <ChevronRight size={20} aria-hidden />
      </div>
    </button>
  );
};
