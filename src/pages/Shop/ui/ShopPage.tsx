import React from 'react';
import { Title } from '@/shared/ui';

import { ShopPromocodes } from '@/widgets/shop/ui/ShopPromocodes.tsx';
import './shop-page.scss'
import { UrbanBonusBalanceWidget } from '@/widgets/spotList/UrbanBalance/ui/UrbanBalance.tsx';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';

export const ShopPage: React.FC = () => {
 useAutoBackNavigation()


  return (
    <div className="shop-promocodes-page">
      <div className="shop-promocodes-page__header">
        <Title>Магазин</Title>
        <UrbanBonusBalanceWidget/>
      </div>

      <div className="shop-promocodes-page__content">
        <ShopPromocodes />
      </div>
    </div>
  );
};
