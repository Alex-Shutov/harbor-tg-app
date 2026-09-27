import React, { useState } from 'react';
import Button from '../../shared/Button';
import { format, parseISO } from 'date-fns';
import CustomInput from '../../shared/Input';
import './PromoCode.scss'
import { PromoCode } from '../../pages/Account/components/Promocodes/promocodes.types.ts';
import { ru } from 'date-fns/locale';
import { handleSubmitSnackBar } from '../../utils/snackbar.ts';
import { Modal } from '@shared/ui';
interface IProps {
  promoCode: PromoCode
  onClose: () => void;
  onPromoCodeReceived: () => void;
}

const PromoCodeModal: React.FC<IProps> = ({ promoCode, onClose, onPromoCodeReceived }) => {
  const [_, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(promoCode.code);
    setCopied(true);
    handleSubmitSnackBar('Harbor Code скопирован!')
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPromoDate = (dateString: string) => {
    return format(parseISO(dateString), 'd MMMM yyyy', { locale: ru });
  };

  return (
    <Modal align={'end'}  onClose={onClose} title={`${promoCode.title}`}>
      <p>
        {promoCode.description}
      </p>

      <CustomInput
        readOnly={true}
        name={'promocode'}
        value={promoCode.code}
        onChange={() => {}}
        type={!promoCode.receivedByUser ? 'password' : 'text'}
        placeholder="Harbor Code"
        onCopy={handleCopyClick}
        // onEditClick={handleCopyClick} // Кнопка для копирования
      />
      {promoCode.receivedByUser ? <div className="promo-code-dates">
        <div className="date-range">
          <div>
          <span className="date-label">Действует с </span>
          <span className="date-value">{formatPromoDate(promoCode.startDate)} </span>
          <span className="date-label">по </span>
          <span className="date-value">{formatPromoDate(promoCode.endDate)}</span>
          </div>
        </div>

      </div> : <></>}
      <div className={'promoModal-button'}>
      {!promoCode.receivedByUser  ? (
        <Button type="primary" onClick={onPromoCodeReceived}>
          Получить
        </Button>
      ) : (
        <Button type="secondary" disabled>
          Harbor Code получен
        </Button>
      )}

      </div>
    </Modal>
  );
};

export default PromoCodeModal;
