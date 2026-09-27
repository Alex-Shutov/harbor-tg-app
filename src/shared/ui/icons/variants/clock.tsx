import { IIconProps } from '@shared/ui/icons/icons.types.ts';

export const ClockIcon = ({ size = 24, ...props }: IIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 23 19"
    fill="none"
    {...props}
  >
    <path d="M21 12C21 16.968 16.968 21 12 21C7.032 21 3 16.968 3 12C3 7.032 7.032 3 12 3C16.968 3 21 7.032 21 12Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.7099 15.1798L12.6099 13.3298C12.0699 13.0098 11.6299 12.2398 11.6299 11.6098V7.50977" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);

