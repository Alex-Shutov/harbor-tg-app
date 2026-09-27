import React from 'react';
import { IIconProps } from '@shared/ui/icons/icons.types.ts';

export const CheckIcon:React.FC<IIconProps> = (props) => {
  return (
    <svg
      viewBox={'-4 -5.5 20 20'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 5L4.5 8.5L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
