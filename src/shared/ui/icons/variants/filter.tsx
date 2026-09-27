import React from 'react';
import { IIconProps } from '@shared/ui/icons/icons.types.ts';


export const FilterIcon: React.FC<IIconProps> = ({ size = 24, ...props }: IIconProps) => {
  return (
    <svg  width={size}
          height={size}
          viewBox="0 2 23 19"
          fill="none"
          {...props}>
      <path d="M20.333 7.41699H15.333" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.00033 7.41699H3.66699" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.3337 10.3333C11.9445 10.3333 13.2503 9.0275 13.2503 7.41667C13.2503 5.80584 11.9445 4.5 10.3337 4.5C8.72283 4.5 7.41699 5.80584 7.41699 7.41667C7.41699 9.0275 8.72283 10.3333 10.3337 10.3333Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20.3333 16.5835H17" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.66699 16.583H3.66699" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.6667 19.4998C15.2775 19.4998 16.5833 18.194 16.5833 16.5832C16.5833 14.9723 15.2775 13.6665 13.6667 13.6665C12.0558 13.6665 10.75 14.9723 10.75 16.5832C10.75 18.194 12.0558 19.4998 13.6667 19.4998Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  );
};
