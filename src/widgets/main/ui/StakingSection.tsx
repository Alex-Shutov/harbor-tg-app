import { Button, Title } from '@shared/ui';
import './staking.scss'

export const StakingSection = () => {
  const handleStakingClick = () => {
    console.log('Staking clicked');
  }
  return (
    <div className="main__page__staking">
      <div className="main__page__staking-content">
        <Title className="main__page__staking-title">Staking</Title>
        <p className="main__page__staking-text">
          Храните ваши $HARBORPOINTS и тратьте на ценные призы
        </p>
        <Button type={'primary'} onClick={handleStakingClick} className="main__page__staking-button">
          Подробнее
        </Button>
      </div>
      <div className="main__page__staking-icon">
        <span className="staking-icon">Ú</span>
      </div>
    </div>
  );
};

