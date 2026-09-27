import React, { MouseEventHandler } from 'react';
import './button.scss';
interface IProps{
  type:"primary"|"secondary"|"gradient"|"outline"
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?:boolean
  children?:React.ReactNode
  className?:string
}
const Button:React.FC<IProps> = ({ type, onClick, children, disabled = false, className='' }) => {
  return (
    <button className={`button ${type} ${disabled ? 'disabled' : ''} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
