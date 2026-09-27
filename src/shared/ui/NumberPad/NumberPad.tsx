import React from 'react';
import { BackspaceIcon } from '@shared/ui/icons';
import './number-pad.scss';

interface INumberPadProps {
  onNumberClick: (value: string) => void;
  onBackspace: () => void;
  onComma?: () => void;
}

export const NumberPad: React.FC<INumberPadProps> = ({
  onNumberClick,
  onBackspace,
  onComma,
}) => {
  const handleNumberClick = (value: string) => {
    onNumberClick(value);
  };

  const handleBackspace = () => {
    onBackspace();
  };

  const handleComma = () => {
    if (onComma) {
      onComma();
    }
  };

  return (
    <div className="number-pad">
      <div className="number-pad__row">
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('1')}
        >
          1
        </button>
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('2')}
        >
          2
        </button>
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('3')}
        >
          3
        </button>
      </div>
      <div className="number-pad__row">
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('4')}
        >
          4
        </button>
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('5')}
        >
          5
        </button>
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('6')}
        >
          6
        </button>
      </div>
      <div className="number-pad__row">
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('7')}
        >
          7
        </button>
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('8')}
        >
          8
        </button>
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('9')}
        >
          9
        </button>
      </div>
      <div className="number-pad__row number-pad__row--last">
        {onComma ? (
          <button
            type="button"
            className="number-pad__button"
            onClick={handleComma}
          >
            ,
          </button>
        ) : (
          <div className="number-pad__spacer" />
        )}
        <button
          type="button"
          className="number-pad__button"
          onClick={() => handleNumberClick('0')}
        >
          0
        </button>
        <button
          type="button"
          className="number-pad__button number-pad__button--backspace"
          onClick={handleBackspace}
        >
          <BackspaceIcon size={24} />
        </button>
      </div>
    </div>
  );
};

