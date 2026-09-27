import React, { useState } from 'react';
import { BottomSheetWithImage, Button, Input } from '@shared/ui';
import { IReferralSystemInfo } from '@/entities/referral/types/referral.types';
import { StatusWidget } from '../StatusWidget';
import { handleSubmitSnackBar } from '@utils/snackbar.ts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './referal-modal.scss';
import { useShare } from '@/features/spot-card/shareEstablishment';

interface IReferalModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralData: IReferralSystemInfo ;
}

export const ReferalModal: React.FC<IReferalModalProps> = ({
  isOpen,
  onClose,
  referralData,
}) => {
  const [_, setCopied] = useState(false);
  const { handleShare,shareLink } = useShare({
    userHash: referralData.userHash,
  });




  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    handleSubmitSnackBar('Ссылка скопирована!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm dd.MM.yyyy', { locale: ru });
    } catch {
      return dateString;
    }
  };

  return (
    <BottomSheetWithImage
      isOpen={isOpen}
      onClose={onClose}
      mainImage="/ref_system_bg.png"
      imageAlt="Реферальная система"
      title="Реферальная ссылка"
    >
      <div className="referal-modal">
        <p className="referal-modal__description">
          Поделитесь ссылкой и пригласите гостей в Harbor.
        </p>

        <div className="referal-modal__link-section">
          <Input
            label={'Ссылка'}
            name="referralLink"
            value={`${shareLink.substring(0,33)}...`}
            onChange={() => {}}
            readOnly
            onCopy={handleCopyLink}
            placeholder="Реферальная ссылка"
          />
        </div>

        <div className="referal-modal__invitations">
          <div className="referal-modal__invitations-header">
            <h3 className="referal-modal__invitations-title">Приглашения</h3>
            <span className="referal-modal__invitations-count">
              Приглашено: {referralData.invitedCount}
            </span>
          </div>

          <div className="referal-modal__referrals-list">
            {!referralData?.referrals || referralData?.referrals?.length === 0 ? (
              <div className="referal-modal__empty">
                <p>Пока нет приглашенных пользователей</p>
              </div>
            ) : (
              referralData?.referrals.map((referral, index) => (
                <div key={index} className="referal-modal__referral-item">
                  <div className="referal-modal__referral-avatar">
                    {referral.imageUrl ? (
                      <img src={referral.imageUrl} alt={referral.username} />
                    ) : (
                      <div className="referal-modal__referral-avatar-placeholder">
                        {referral.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="referal-modal__referral-info">
                    <div className="referal-modal__referral-username">{referral.username}</div>
                    <div className="referal-modal__referral-date">{formatDate(referral.joinedAt)}</div>
                  </div>
                  <div className="referal-modal__referral-status">
                    <StatusWidget status={referral.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="referal-modal__share">
          <Button className={'referal-modal__share-button'} type="primary" fullWidth onClick={handleShare}>
            Поделиться
          </Button>
        </div>
      </div>
    </BottomSheetWithImage>
  );
};


