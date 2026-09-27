import React, { useMemo, useState, useEffect } from 'react';
import { Card, CaptchaModal } from '@/shared/ui';
import { useGetGiveawaysListQuery, IGiveaway } from '@/entities/giveaway';
import { useParticipateGiveaway, GiveawayParticipateModal } from '@/features/participate-giveaway';
import { GiveawayTabs, TabType } from '@/entities/giveaway';
import { useAppSelector } from '@/store/hooks';
import { selectUserBalanceData } from '@/entities/user-balance/model';
import Loader from '@/shared/Loader';
import EmptyEstablishments from '@/components/EmptyEstablishments';
import { useDeepLinkFilter } from '@shared/lib/hooks/useDeepLinkFilter';
import './raffles-list.scss';


const getTabByGiveaway = (giveaway: IGiveaway, data: { active: IGiveaway[]; participating: IGiveaway[]; completed: IGiveaway[]; prizes: IGiveaway[] }): TabType => {
  if (data.active.some(g => g.id === giveaway.id)) return 'active';
  if (data.participating.some(g => g.id === giveaway.id)) return 'participating';
  if (data.completed.some(g => g.id === giveaway.id)) return 'completed';
  if (data.prizes.some(g => g.id === giveaway.id)) return 'prizes';
  return 'active';
};

export const RafflesList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const { data, isLoading, isError } = useGetGiveawaysListQuery();
  const userBalance = useAppSelector(selectUserBalanceData);
  const {
    modalState,
    openModal,
    closeModal,
    handleParticipate,
    isLoading: isParticipating,
    error,
    toastState,
    hideToast,
    updateModalGiveaway,
    captchaModalOpen,
    handleCaptchaSuccess,
    handleCaptchaClose,
  } = useParticipateGiveaway();

  // Обновляем модальное окно при изменении данных списка розыгрышей
  useEffect(() => {
    if (modalState.isOpen && modalState.selectedGiveaway && data) {
      const allGiveaways = [
        ...(data.active || []),
        ...(data.participating || []),
        ...(data.completed || []),
        ...(data.prizes || []),
      ];
      const updatedGiveaway = allGiveaways.find(g => g.id === modalState.selectedGiveaway?.id);
      if (updatedGiveaway) {
        updateModalGiveaway(updatedGiveaway);
      }
    }
  }, [data, modalState.isOpen, modalState.selectedGiveaway?.id, updateModalGiveaway]);

  useDeepLinkFilter<IGiveaway>(
    'giveawayId',
    (giveaway) => {
      if (!data) return;
      const tab = getTabByGiveaway(giveaway, data);
      setActiveTab(tab);

      setTimeout(() => {
        openModal(giveaway);
      }, 100);
    },
    [data],
    (id, deps) => {
      const data = deps[0] as { active: IGiveaway[]; participating: IGiveaway[]; completed: IGiveaway[]; prizes: IGiveaway[] } | undefined;
      if (!data) return undefined;

      const allGiveaways = [
        ...(data.active || []),
        ...(data.participating || []),
        ...(data.completed || []),
        ...(data.prizes || []),
      ];
      return allGiveaways.find(g => g.id === id);
    }
  );

  const currentGiveaways = data?.[activeTab] || [];
  const currentLabels = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return {mainLabel:'Розыгрышей пока нет',secondLabel:'Но скоро они появятся!'};
      case 'completed':
        return {mainLabel:'Кажется, пока нет завершенных розыгрышей',secondLabel:''};
      case 'participating':
        return {mainLabel:'Кажется, вы не учавствуйте ни в каких розыгрышах',secondLabel:'Может пора это исправить?'};
      case 'prizes':
        return {mainLabel:'Пока что вы не победили в розыгрыше',secondLabel:'Но вскоре все может измениться!'};
      default:
        return {mainLabel:'Розыгрышей пока нет',secondLabel: 'Попробуйте позднее'};
    }
  },[activeTab])

  if (isLoading) return <Loader />;
  if (isError) return <div className="raffles-list__error">Ошибка загрузки розыгрышей</div>;


  return (
    <div className="raffles-list">
      <GiveawayTabs selectedTab={activeTab} onTabChange={setActiveTab} />

      <div className="raffles-list__content">
        {currentGiveaways.length === 0 ? (
          <EmptyEstablishments
            mainLabel={currentLabels.mainLabel}
            secondLabel={currentLabels.secondLabel}
          />
        ) : (
          <div className="raffles-list__cards">
            {currentGiveaways.map((giveaway) => (
              <Card
                title={giveaway.title}
                subtitle={''}
                description="Бесплатно"
                imgUrl={giveaway.image.url}
                imgAlt={giveaway.title}
                onClick={() => openModal(giveaway)}
                winnerMessage={giveaway.isWinner ? 'Вы победили, с Вами свяжутся представители Harbor по контакту: @harbor_support' : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {modalState.selectedGiveaway && <GiveawayParticipateModal
        giveaway={modalState.selectedGiveaway}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onParticipate={handleParticipate}
        isLoading={isParticipating}
        error={error}
        userBalance={userBalance}
        toastState={toastState}
        onHideToast={hideToast}
      />}

      <CaptchaModal
        isOpen={captchaModalOpen}
        onClose={handleCaptchaClose}
        onSuccess={handleCaptchaSuccess}
        title="Подтвердите участие"
        description="Пожалуйста, пройдите проверку безопасности для участия в розыгрыше"
      />
    </div>
  );
};

