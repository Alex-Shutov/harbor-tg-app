import React from 'react';
import { Badge, TransferIcon, UrbanWhiteOrangeIcon } from '@shared/ui';
import { selectUserBalanceData } from '@/entities/user-balance/model/user-balance.selectors';
import { useSelector } from 'react-redux';
import { useTransferBonuses } from '@/features/transfer-bonuses';
import { TransferBonusesModal, TransferConfirmationModal } from '@/features/transfer-bonuses/ui';
import ToastMessage from '@components/ToastMessage';
import './bonuses-badge.scss';

export const BonusesBadge: React.FC = () => {
  const balance = useSelector(selectUserBalanceData);
  const {
    modalState,
    confirmationModalState,
    openModal,
    closeModal,
    recipientTag,
    amount,
    description,
    selectedRecipient,
    suggestedTags,
    isTagInputFocused,
    isSearchingTags,
    isTransferring,
    handleTagInputChange,
    handleTagInputFocus,
    handleTagInputBlur,
    handleSelectRecipient,
    handleNumberPadClick,
    handleBackspace,
    handleDescriptionChange,
    handleTransfer,
    handleConfirmTransfer,
    showValidationErrors,
    toastState,
    hideToast,
    comission
  } = useTransferBonuses(balance);

  return (
    <>
      <div className="bonuses-badge-container">
        <Badge icon={<UrbanWhiteOrangeIcon viewBox={'-4 0 28 28'} size={32} />} value={balance} />
        <div
          className="bonuses-badge__transfer-button"
          onClick={openModal}
          aria-label="Перевести бонусы"
        >
          <div className={'bonuses-badge__transfer-button-icon'}>
           <TransferIcon size={24}/>
          </div>
          <div className={'bonuses-badge__transfer-text'}>Перевод</div>
        </div>
      </div>

      <TransferBonusesModal
        comission={comission as number}
        isOpen={modalState.isOpen}
        onClose={closeModal}
        recipientTag={recipientTag}
        amount={amount}
        selectedRecipient={selectedRecipient}
        suggestedTags={suggestedTags}
        isTagInputFocused={isTagInputFocused}
        isSearchingTags={isSearchingTags}
        isTransferring={isTransferring}
        userBalance={balance}
        showValidationErrors={showValidationErrors}
        onTagInputChange={handleTagInputChange}
        onTagInputFocus={handleTagInputFocus}
        onTagInputBlur={handleTagInputBlur}
        onSelectRecipient={handleSelectRecipient}
        onNumberPadClick={handleNumberPadClick}
        onBackspace={handleBackspace}
        onTransfer={handleTransfer}
      />

      <TransferConfirmationModal
        isOpen={confirmationModalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmTransfer}
        recipientTag={selectedRecipient?.tag || recipientTag || ''}
        amount={Number(amount.replace(',', '.')) || 0}
        commission={comission || 0}
        description={description}
        onDescriptionChange={handleDescriptionChange}
        isTransferring={isTransferring}
      />

      <ToastMessage
        position={'top'}
        className="transfer-bonuses-toast"
        isVisible={toastState.isVisible}
        title={toastState.title}
        description={toastState.description}
        icon={toastState.icon}
        type={toastState.type}
        showCloseButton={toastState.showCloseButton}
        duration={toastState.duration}
        onClose={hideToast}
        onVisibilityChange={(visible) => !visible && hideToast()}
      />
    </>
  );
};

