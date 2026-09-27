import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface IProps {
  value: any;
  onChange: (value: Date) => void;
  label?: string;
  placeholder?: string;
}

const CustomDatePicker: React.FC<IProps> = ({ value, onChange, placeholder }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      onChange(date);
    }
  };

  return (
    <div className="date-picker-container">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        placeholderText={placeholder}
        dateFormat="dd MMMM yyyy"
        className="custom-input"
        calendarClassName="custom-calendar"
      />
    </div>
  );
};

export default CustomDatePicker;
