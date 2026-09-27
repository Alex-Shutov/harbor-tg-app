import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import './textarea.scss';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  error?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  placeholder,
  name,
  required,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="textarea-wrapper">
      {label && (
        <label className="textarea-label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className={`textarea-container ${error ? 'textarea-error' : ''}`}>
        <TextareaAutosize
          id={name}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="textarea-input"
          minRows={1}
          maxRows={5}
        />
      </div>
    </div>
  );
};

