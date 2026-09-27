import { Gift, Heart, ListChecks, Ticket } from 'lucide-react';
import { ReactNode } from 'react';

export type ProfileActionConfig = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  to: string;
  disabled?: boolean;
};

export const profileActionsConfig: ProfileActionConfig[] = [
  {
    id: 'favorites',
    label: 'Избранное',
    description: 'Ваше любимое',
    icon: <Heart size={13} strokeWidth={2} />,
    to: '/profile/favorites',
  },
  {
    id: 'promocodes',
    label: 'Harbor Codes',
    description: 'Применяйте скидки',
    icon: <Ticket size={13} strokeWidth={2} />,
    to: '/profile/promocodes',
  },
  {
    id: 'tasks',
    label: 'Задания',
    description: 'Плюшки в заведениях',
    icon: <ListChecks size={13} strokeWidth={2} />,
    to: '/profile/tasks',
  },
  {
    id: 'raffles',
    label: 'Розыгрыши',
    description: 'Выигрывайте подарки',
    icon: <Gift size={13} strokeWidth={2} />,
    to: '/profile/raffles',
  },
];
