import React, {useState } from 'react';
import './Input.scss';
import DatePicker from './components/DatePicker.tsx';

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>,"onChange"> {
    value?: string | number  | readonly string[];
    onChange: (name: string, value: string | number | Date) => void;
    type?: 'text' | 'password' | 'number' | 'date' | 'tel';
    onEditClick?: () => void;
    onCopy?: () => void;
    label?: string;
    placeholder?: string;
    name: string;
    min?: number;
    required?: boolean;
    customError?: string | null;
    customSuccess?:string | null;
}

const CustomInput: React.FC<IProps> = ({
                                           value,
                                           onChange,
                                           name,
                                           type = 'text',
                                           onEditClick,
                                           onCopy,
                                           placeholder,
                                           min = 1,
                                           label,
                                           required,
                                           customError,
                                           customSuccess,
                                           ...rest
                                       }) => {
    const [internalValue, setInternalValue] = useState<string | number | undefined | readonly string[]>(value );
    const [isFocused, setIsFocused] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleIncrement = () => {
        if (typeof internalValue === 'number') {
            const newValue = Math.max(Number(internalValue) + 1, min);
            setInternalValue(newValue);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onChange && onChange(name, newValue);
        }
    };

    const handleDecrement = () => {
        if (typeof internalValue === 'number' && internalValue > min) {
            const newValue = Math.max(Number(internalValue) - 1, min);
            setInternalValue(newValue);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onChange && onChange(name, newValue);
        }
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Удаляем все символы, кроме цифр
        // Если пользователь только начал ввод и значение не начинается с 7
        let formattedValue;
        if(rawValue.length === 1 && rawValue.startsWith('8')){
            formattedValue = ``
        }

        else if (rawValue.length === 1 && !rawValue.startsWith('7')) {
            formattedValue = `${rawValue}`;
        } else {
            formattedValue = `${rawValue.slice(1)}`; // Сохраняем все цифры, кроме первой
        }

        formattedValue = formatPhoneNumber(formattedValue.replace(/\D/g, ''));
        setInternalValue(formattedValue);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onChange && onChange(name, formattedValue);
    };

    const formatPhoneNumber = (value: string) => {
        // Добавляем "+7" к началу, если его нет
        // if (!value.startsWith('7')) {
        //     value = '7' + value;
        // }

        // Обрезаем до 10 цифр после 7
        const phoneDigits = value.slice(0, 10);

        // Форматируем как +7 999 123 45 67
        let formatted = `+7 ${phoneDigits}`;

        if (formatted.length > 1) {
            formatted = formatted.replace(/(\+7) (\d{3})?(\d{3})?(\d{2})?(\d{2})?/, function (_, p1, p2, p3, p4, p5) {
                let result = p1;
                if (p2) result += ' ' + p2;
                if (p3) result += ' ' + p3;
                if (p4) result += ' ' + p4;
                if (p5) result += ' ' + p5;
                return result;
            });
        }

        return formatted.trim();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
        setInternalValue(newValue);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onChange && onChange(name, newValue);
    };

    const handleFocus = () => {
        if (type === 'date') setIsFocused(true);
        setHasError(false); // Убираем красную обводку при фокусе
    };

    const handleBlur = () => {
        if (type === 'date') setIsFocused(false);

        if (customError) {
            setHasError(true);
            return;
        }

        if (required && !internalValue) {
            setHasError(true); // Устанавливаем ошибку, если поле пустое
        } else if (type === 'tel' && !validatePhone(internalValue as string)) {
            setHasError(true); // Устанавливаем ошибку, если телефон не прошел валидацию
        } else {
            setHasError(false);
        }
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
        return phoneRegex.test(phone);
    };


    const dynamicPlaceholder = required && placeholder ? `${placeholder} *` : placeholder;

    return (
        <>
            {label && <label className="input-label" htmlFor="input">{label}</label>}
            <div id="input" className={`input-container ${hasError ? 'input-error' : ''}`}>
                <div className="input-wrapper">
                    {type === 'number' && (
                        <div className="number-input-wrapper">
                            <input
                                type="number"
                                value={internalValue || ''}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="custom-input"
                                required={required}
                                {...rest}
                            />
                            <div className="actions">
                                <button
                                    onClick={handleDecrement}
                                    disabled={Number(internalValue) <= min}
                                    className={`action-btn ${Number(internalValue) <= min ? 'disabled' : ''}`}
                                >
                                    -
                                </button>
                                <button onClick={handleIncrement} className="action-btn">
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {type === 'date' && (
                        <>
                            <input
                                type="text"
                                value={internalValue || ''}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className="custom-input"
                                placeholder={dynamicPlaceholder}
                                readOnly
                                required={required}
                                {...rest}
                            />
                            {isFocused && (
                                <div className="datepicker">
                                    <div className="calendar">
                                        <DatePicker value={value} onChange={(val) => onChange && onChange(name, val)} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {type === 'tel' && (
                        <input
                            type="tel"
                            value={internalValue || ''}
                            onChange={handlePhoneInput}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="custom-input"
                            placeholder={dynamicPlaceholder || '+7 912 123 45 67'}
                            required={required}
                            {...rest}
                        />
                    )}

                    {type !== 'number' && type !== 'date' && type !== 'tel' && (
                        <input
                            type={type}
                            value={internalValue || ''}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="custom-input"
                            placeholder={dynamicPlaceholder}
                            required={required}
                            {...rest}
                        />
                    )}
                </div>

                <div className="actions">
                    {onCopy && (
                        <button onClick={onCopy} type="button" className="action-btn">
                            <img src={'/copy.svg'} alt="Copy" />
                        </button>
                    )}
                    {onEditClick && (
                        <button type="button" className="action-btn" onClick={onEditClick}>
                        </button>
                    )}
                </div>
            </div>
            {customError && <div className="input-custom-error">{customError}</div>}
            {customSuccess && <div className="input-custom-success">{customSuccess}</div>}
        </>
    );
};

export default CustomInput;
