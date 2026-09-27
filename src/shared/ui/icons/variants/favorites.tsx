import React from 'react';
import { IIconProps } from '@shared/ui/icons/icons.types.ts';


export const FavoritesIcon: React.FC<IIconProps> = ({ size = 14, ...props }: IIconProps) => {
  return (
    <svg  width={size}
          height={size}
          viewBox="0 0 14 12"
          fill="none"
          {...props}>
      <path d="M9.62667 0C8.42 0 7.34 0.586667 6.66667 1.48667C5.99333 0.586667 4.91333 0 3.70667 0C1.66 0 0 1.66667 0 3.72667C0 4.52 0.126667 5.25333 0.346667 5.93333C1.4 9.26667 4.64667 11.26 6.25333 11.8067C6.48 11.8867 6.85333 11.8867 7.08 11.8067C8.68667 11.26 11.9333 9.26667 12.9867 5.93333C13.2067 5.25333 13.3333 4.52 13.3333 3.72667C13.3333 1.66667 11.6733 0 9.62667 0Z" fill="#85858B"/>
     </svg>

  );
};
