import React from 'react';
import Button from '../../shared/Button';
import { useNavigate } from 'react-router-dom';

interface IProps {
  containerLabel:string,
  textLabel:string,
  buttonLabel:string
}

const EmptyContainer:React.FC<IProps> = ({containerLabel,textLabel,buttonLabel}) => {
  const navigate = useNavigate();
  return (
    <div className="empty-state">
      <div className={'empty-state--container'}>
        <img className={'empty-state--container-image'} src={'/empty_reservation.gif'}/>
        <div className={'empty-state--container-empty'}>{containerLabel}</div>
        <div className={'empty-state--container-empty-label'}>
          {textLabel}
        </div>
        <div className={'empty-state--container-button'}>
          <Button onClick={()=>navigate('/')} type={'primary'} >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyContainer;