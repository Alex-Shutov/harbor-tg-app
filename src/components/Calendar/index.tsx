import React, { forwardRef, useState, useEffect, useRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { parse, isValid } from 'date-fns';
import CustomInput from '../../shared/Input';
import './Calendar.scss'
import { formatDateWithOnlyDigits } from '../../utils/date.ts';

registerLocale('ru', ru);

interface CalendarProps {
  label?: string;
  excludedDates? :Date[]
  includedDates?: Date[] | null;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

interface CustomInputProps {
  onClick?: () => void;
  value?: string;
  onChange?: (name: string, value: string | number | Date) => void
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}



const Calendar: React.FC<CalendarProps> = ({label, excludedDates, includedDates, value: propValue = null, onChange }) => {
  const [value, setCalendarValue] = useState<Date | null>(propValue);
  const datePickerRef = useRef<DatePicker|null>(null);
  const [inputValue, setInputValue] = useState<string>( '');

  useEffect(() => {
    setCalendarValue(propValue);
  }, [propValue]);

  useEffect(() => {

    if (value) {
      setInputValue(formatDateWithOnlyDigits(value));
    }
  }, [value]);

  // useEffect(() => {
  //   return ()=> setCalendarValue(new Date())
  // }, []);

  const handleInputChange = (_:string,newValue: string | number | Date) => {

    if (typeof newValue === 'string') {
      setInputValue(newValue);
    }
  };

  const handleBlur = () => {

    const parsedDate = parse(inputValue, 'dd.MM.yyyy', new Date());
    if (isValid(parsedDate)) {
      setCalendarValue(parsedDate);
      onChange?.(parsedDate);
    } else {
      setInputValue(value ? formatDateWithOnlyDigits(value) : '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      if (datePickerRef.current) {
        datePickerRef?.current?.setOpen(false);
      }
    }
  };

  const CustomDateInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({  onClick }) => (
      <div onClick={onClick}>
        <CustomInput
          readOnly={true}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          label={label}
          placeholder="Выберите дату"
         name={'date'}/>
      </div>
    )
  );
  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setCalendarValue(date);
    onChange?.(date);
  };

  return (
    <div>
      <DatePicker
        ref={datePickerRef}
        selected={value}
        includeDates={includedDates??[]}
        excludeDates={excludedDates ?? []}
        dateFormat="dd.MM.yyyy"
        onChange={handleDateChange}
        customInput={<CustomDateInput />}
        filterDate={(date) => {
          if (includedDates && includedDates.length > 0) {
            return includedDates.some(includedDate =>
              includedDate.getDate() === date.getDate() &&
              includedDate.getMonth() === date.getMonth() &&
              includedDate.getFullYear() === date.getFullYear()
            );
          }
          // Иначе показываем все даты (кроме исключенных)
          return true;
        }}
        locale="ru"
      />
    </div>
  );
};

export default Calendar;
