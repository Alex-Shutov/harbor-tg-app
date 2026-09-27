import { SVGAttributes } from 'react';

export interface IIconProps extends SVGAttributes<SVGElement> {
  size?: number;
  color?: string;
  isLiked?: boolean;
  isActive?: boolean;
}
