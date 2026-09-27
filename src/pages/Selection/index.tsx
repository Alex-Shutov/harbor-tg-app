import { useNavigate, useParams } from 'react-router-dom';
import ImageSlider from "../../components/ImageSlider";
import { useGetSelectionQuery } from './selection.api.ts';
import Loader from "../../shared/Loader";
import './selection.scss'
import ContentBlock from "./components/ContentBlock";
import { useAutoBackNavigation } from '@/hooks/useAutoBackNavigation';
import { Title } from '@shared/ui';



const Index = () => {
  const {id} = useParams();
    const {data:selection,isLoading:loading,error} = useGetSelectionQuery(`${id}`);
    const navigate = useNavigate()
    useAutoBackNavigation()
    if (loading) return <Loader />;
    if (error || !selection) return <div>Error loading selection</div>;
    return (
        <div>
            <ImageSlider onClose={()=>navigate(-1)} images={[selection.mainImg.url]}/>
            <div className={'selection_container'}>
              <Title>{selection.title}</Title>
                {/*<Details data={selection as any}/>*/}
                <div className={'description'}>{selection.description}</div>
                <div className={'contentObjects'}>
                    {selection.contentObjects.map(el=><ContentBlock contentBlock={el}/>)}
                </div>
            </div>

        </div>
    );
};

export default Index;