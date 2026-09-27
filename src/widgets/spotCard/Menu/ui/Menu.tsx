import React from 'react';
import './menu.scss';
import { Button, Title } from '@/shared/ui';
import { IMenu } from '@shared/types';
import { openLink } from '@telegram-apps/sdk';

interface ReviewSectionProps {
  menu?: IMenu;
}

export const MenuSection: React.FC<ReviewSectionProps> = ({ menu }) => {


  if (!menu) return null;

  const handleNavigate = () =>{
    if (menu.url) {
      try {
        openLink(menu.url, { tryInstantView: true });
      } catch (error) {
        console.error('Ошибка при открытии обзора:', error);
      }
    }
  }

  return (
    <section className="menu-section">
      <Title className="menu-section__title">Меню</Title>

      <div className="menu-section__content">


        <Button
          type={'secondary'}
          onClick={handleNavigate}
        >
          Посмотреть меню
        </Button>
      </div>
    </section>
  );
};
