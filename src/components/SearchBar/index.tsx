import React, { ChangeEvent, KeyboardEvent, FocusEvent, useRef } from 'react';
import './Search.scss';
import { CloseButton } from '@shared/ui';

interface SearchBarProps {
  withImg?: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
                                              withImg=true,
                                               value,
                                               onChange,
                                               onKeyPress,
                                               placeholder = 'Поиск',
                                               onFocus,
                                               onBlur,
                                             }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // alert(`${event.currentTarget.height},${event.currentTarget.clientHeight},${event.currentTarget.offsetHeight},${event.currentTarget.scrollHeight}`);

    if (event.key === 'Enter' || event.keyCode === 13) {
      (event.target as HTMLInputElement).blur();
    }
    if (onKeyPress) {
      onKeyPress(event);
    }
  };

  const handleClear = () => {
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' },
    } as ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
    inputRef.current?.focus();
  };

  return (
    <div className="search-bar--container">
      <div className="search-bar">
        {withImg && <img className="search-bar--img" src="/search.svg" alt="Search"/>}
        <input
          ref={inputRef}
          type="text"
          value={value}
          // onFocusCapture={(e)=>e && handleFocus(e)}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {value?.length > 0 && (
          <CloseButton
            size="small"
            aria-label="Очистить поиск"
            onClick={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;