import React from 'react';
import { BottomSheet, Button, NumberPad, Input, UrbanWhiteOrangeIcon, TooltippedElement } from '@shared/ui';
import { IUserTag } from '@/entities/bonuses/types';
import './transfer-bonuses-modal.scss';

interface ITransferBonusesModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientTag: string;
  amount: string;
  selectedRecipient: IUserTag | null;
  suggestedTags: IUserTag[];
  isTagInputFocused: boolean;
  isSearchingTags: boolean;
  isTransferring: boolean;
  userBalance: number;
  showValidationErrors: boolean;
  onTagInputChange: (value: string) => void;
  onTagInputFocus: () => void;
  onTagInputBlur: () => void;
  onSelectRecipient: (tag: IUserTag) => void;
  onNumberPadClick: (value: string) => void;
  onBackspace: () => void;
  onTransfer: () => void;
  comission:number
}

interface ITransferBadgeWithDescription{
  description: string | React.ReactNode;
  label: string;
}

export const TransferBonusesModal: React.FC<ITransferBonusesModalProps> = ({
  isOpen,
  onClose,
  recipientTag,
  amount,
  selectedRecipient,
  suggestedTags,
  isTagInputFocused,
  isSearchingTags,
  isTransferring,
  userBalance,
  showValidationErrors,
  onTagInputChange,
  onTagInputFocus,
  onTagInputBlur,
  onSelectRecipient,
  onNumberPadClick,
  onBackspace,
  onTransfer,
                                                                             comission,
}) => {
  const amountNumber = Number(amount) || 0;
  const MIN_TRANSFER_AMOUNT = 10;

  const showRecipientError = showValidationErrors && !selectedRecipient && !recipientTag.trim();
  
  // Проверяем все возможные ошибки суммы
  const hasInsufficientBalance = amountNumber > userBalance;
  const hasAmountLessThanMin = amountNumber > 0 && amountNumber < MIN_TRANSFER_AMOUNT;
  const hasNoAmount = amountNumber === 0;
  
  const showAmountError = showValidationErrors && (hasInsufficientBalance || hasAmountLessThanMin || hasNoAmount);
  
  const getAmountTooltipText = () => {
    if (hasInsufficientBalance) {
      return 'Недостаточно бонусов для перевода';
    }
    if (hasAmountLessThanMin) {
      return `Минимальная сумма перевода - ${MIN_TRANSFER_AMOUNT} бонусов`;
    }
    if (hasNoAmount) {
      return 'Введите сумму для перевода';
    }
    return '';
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Перевести бонусы">
      <div className="transfer-bonuses-modal">
        { (
          <>
            <div className="transfer-bonuses-modal__balance">
              <TooltippedElement
                tooltip={getAmountTooltipText()}
                showTooltip={showAmountError}
                position="top"
              >
                <div className={`transfer-bonuses-modal__balance-display ${showAmountError ? 'transfer-bonuses-modal__balance-display--error' : ''}`}>
                  {amountNumber > 0 ? `${amountNumber}` : '0'}<UrbanWhiteOrangeIcon  viewBox={'-4 0 28 28'} size={28} />
                </div>
              </TooltippedElement>
              {showAmountError && (
                <div className="transfer-bonuses-modal__balance-error">
                  {getAmountTooltipText()}
                </div>
              )}
              <div className={'transfer-bonuses-modal__balance-badges'}>
                <TransferBadgeWithDescription description={<>{userBalance} <UrbanWhiteOrangeIcon  viewBox={'-4 -13 38 38'} size={24} /></>} label={'Мой баланс'}/>
                <TransferBadgeWithDescription description={<span>{comission}%</span>} label={'Комиссия'}/>
                <TransferBadgeWithDescription description={<>{MIN_TRANSFER_AMOUNT} <UrbanWhiteOrangeIcon  viewBox={'-4 -13 38 38'} size={24} /></>} label={'Мин. сумма'}/>
              </div>
             {/*<div className="transfer-bonuses-modal__balance-amount">{userBalance} <UrbanWhiteOrangeIcon  viewBox={'-4 -13 38 38'} size={24} /></div>*/}
              {/*<div className="transfer-bonuses-modal__balance-amount">{userBalance} <UrbanWhiteOrangeIcon  viewBox={'-4 -13 38 38'} size={24} /></div>*/}

            </div>

            <div className="transfer-bonuses-modal__input-section">
              <TooltippedElement
                tooltip="Не выбран получатель"
                showTooltip={showRecipientError}
                position="top"
              >
                <Input
                  name="recipientTag"
                  value={recipientTag}
                  onChange={(_name, value) => onTagInputChange(String(value))}
                  onFocus={onTagInputFocus}
                  onBlur={onTagInputBlur}
                  placeholder="Напишите тег получателя"
                  label={isTagInputFocused ? 'Кому' : undefined}
                  type="text"
                />
              </TooltippedElement>

              {isTagInputFocused && suggestedTags.length <= 0 && (
                <div className="transfer-bonuses-modal__hint">
                  Напишите тег человека, чтобы перевести ему бонусы
                </div>
              )}

              {isTagInputFocused && suggestedTags.length > 0 && (
                <div className="transfer-bonuses-modal__suggestions">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className="transfer-bonuses-modal__suggestion-item"
                      onClick={() => onSelectRecipient(tag)}
                    >
                      {tag.tag}
                    </button>
                  ))}
                </div>
              )}

              {isTagInputFocused && isSearchingTags && (
                <div className="transfer-bonuses-modal__loading">Поиск...</div>
              )}
            </div>

            {isTagInputFocused ? (
              <div className="transfer-bonuses-modal__keyboard-placeholder" />
            ) : (
              <NumberPad
                onNumberClick={onNumberPadClick}
                onBackspace={onBackspace}
              />
            )}
                <div className="transfer-bonuses-modal__actions">
                    <Button
                        type="primary"
                        fullWidth
                        onClick={onTransfer}
                        // disabled={!canTransfer || isTransferring}
                     >
                    {isTransferring ? 'Переводим...' : 'Перевести'}
                    </Button>
                </div>
          </>
        ) 
        // : (
        //   <>
        //     <div className="transfer-bonuses-modal__recipient">
        //       <div className="transfer-bonuses-modal__recipient-label">Перевести бонусы</div>
        //       <div className="transfer-bonuses-modal__recipient-tag">{selectedRecipient.tag}</div>
        //     </div>

        //     <div className="transfer-bonuses-modal__amount-section">
        //       <div className="transfer-bonuses-modal__amount-display">
        //         {amountNumber > 0 ? `${amountNumber} Û` : '0 Û'}
        //       </div>
        //       <div className="transfer-bonuses-modal__amount-balance">
        //         Доступно: {userBalance} Û
        //       </div>
        //     </div>

        //     <NumberPad
        //       onNumberClick={onNumberPadClick}
        //       onBackspace={onBackspace}
        //     />

        //     <div className="transfer-bonuses-modal__actions">
        //       <Button
        //         type="primary"
        //         fullWidth
        //         onClick={onTransfer}
        //         disabled={!canTransfer || isTransferring}
        //       >
        //         {isTransferring ? 'Переводим...' : 'Перевести'}
        //       </Button>
        //     </div>
        //   </>
        // )
        }
      </div>
    </BottomSheet>
  );
};

const TransferBadgeWithDescription:React.FC<ITransferBadgeWithDescription> = ({description,label}) =>{
  return (
    <div className={'transfer-bonuses-modal__balance-container'}>
      <div className={'transfer-bonuses-modal__balance-label'}>{label}</div>
      <div className="transfer-bonuses-modal__balance-amount">{description}</div>
  </div>)



}
