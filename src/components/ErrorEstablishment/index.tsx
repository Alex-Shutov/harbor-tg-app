import EmptyEstablishments from '../EmptyEstablishments';
import { useNavigate } from 'react-router-dom';
import './errorPage.scss'
const Index = () => {
  const navigate = useNavigate();
  return (
    <div className={'error-page'}><EmptyEstablishments imagePath={'./empty.gif'} onClick={()=>navigate('..')} buttonText={'Вернуться назад'} mainLabel={'Кажется что-то сломалось!'} secondLabel={'Не волнуйтесь, мы уже чиним!'}/></div>
  );
};

export default Index;