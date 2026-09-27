import { IIconProps } from '@shared/ui/icons/icons.types.ts';

export const SendIcon = ({ size = 16, ...props }: IIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="1 0 15 14"
    fill="none"
    {...props}
  >
    <path d="M4.93313 4.21344L10.5931 2.32677C13.1331 1.4801 14.5131 2.86677 13.6731 5.40677L11.7865 11.0668C10.5198 14.8734 8.43979 14.8734 7.17312 11.0668L6.61312 9.38677L4.93313 8.82677C1.12646 7.5601 1.12646 5.48677 4.93313 4.21344Z" stroke="#85858B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.74023 9.09988L9.1269 6.70654" stroke="#85858B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

