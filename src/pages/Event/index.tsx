import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Gallery } from '@/widgets/spotCard/Gallery';
import { EPageType } from '@shared/constants';
import Loader from '@shared/Loader';
import ErrorEstablishment from '@components/ErrorEstablishment';
import { Description } from '@/widgets/spotCard/Description';
import { WorkingHoursSection } from '@/widgets/spotCard/WorkingHours';
import { Details } from '@/widgets/establishmentCard/Details';
import { SubCategories } from '@/widgets/spotCard/Categories';
import './event.scss';
import { AddressSection } from '@/widgets/spotCard/Address';
import { ReviewSection } from '@/widgets/spotCard/Review';
import { useGetEventQuery } from '@/entities/events/model/api/details.api.ts';
import { useEventDetailsStore } from '@/entities/events/model/store/useDetailsStore.ts';
import { EventTopBanner } from '@/widgets/eventCard/TopBanner/TopBanner.tsx';
import { IEventDetails } from '@/entities/events/model/types/details.domain.types.ts';
import { ObjectNavigation, useObjectSections, useScrollToSection, EObjectSection } from '@/features/object-navigation';
import { Button } from '@shared/ui';
import { PromocodeSection } from '@/widgets/spotCard/PromocodeSection/ui/PromocodeSection.tsx';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';

const EventPage = () => {
  const { id } = useParams();
  // const [, setEstablishmentId] = useAtom(establishmentIdAtom);
  // const setFilterPanelVisible = useSetAtom(filterPanelVisibleAtom);
  // const location = useLocation();
  // const navigate = useNavigate();
  const result = useGetEventQuery(Number(id));
  const { data, isLoading, error, refetch } = result as {
    data: IEventDetails | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  };
  const { setData } = useEventDetailsStore();
  const navigate = useNavigate()
  const sections = useObjectSections(data, EPageType.EVENT);
  const { registerSection, scrollToSection, activeSection } = useScrollToSection();
  
  // Рефы для разделов
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const generalSectionRef = useRef<HTMLDivElement>(null);
  const addressSectionRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLDivElement>(null);

  // Регистрируем разделы
  useEffect(() => {
    if (gallerySectionRef.current) {
      registerSection(EObjectSection.GALLERY, gallerySectionRef.current);
    }
    if (generalSectionRef.current) {
      registerSection(EObjectSection.GENERAL, generalSectionRef.current);
    }
    if (addressSectionRef.current) {
      registerSection(EObjectSection.ADDRESS, addressSectionRef.current);
    }
    if (reviewSectionRef.current) {
      registerSection(EObjectSection.REVIEW, reviewSectionRef.current);
    }
  }, [registerSection, data]);

  useEffect(() => {
    if (data) {
      setData(data, EPageType.EVENT);
    }
  }, [data, setData]);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useAutoBackNavigation()
  useBackButtonStack(() => {
    if ((window as any).__navCount <= 0) {
      navigate('/events');
    } else {
      navigate(-1);
    }
  },100);
  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorEstablishment />;

  return (
    <div className="establishment-page">
      <EventTopBanner data={data} />
      
      {sections.length > 0 && (
        <ObjectNavigation
          sections={sections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      )}

      <div ref={gallerySectionRef} className={'establishment-page__gallery'} data-section-id={EObjectSection.GALLERY}>
        {data.sectionsWithImages &&  Boolean(data.sectionsWithImages) && (
          <Gallery mainImage={data.mainImg} sections={data.sectionsWithImages} />
        )}
      </div>
      <div ref={generalSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.GENERAL}>
        <Description description={data.description} />
        <WorkingHoursSection data={data}  />
        <Details data={data} />
        <SubCategories categories={data.categories} />
      </div>
      {data.promoCodes?.length && Boolean(data.promoCodes.length) && <div className={'establishment-page__section'}>
        <PromocodeSection promoCodes={data.promoCodes} pageId={Number(id)} pageType={EPageType.EVENT} onDataRefresh={refetch}/>
      </div>}
      <div ref={addressSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.ADDRESS}>
        <AddressSection
          title={data?.mapPoint?.addressTitle || ''}
          latitude={data.mapPoint.latitude}
          longitude={data.mapPoint.longitude}
          address={''}
        />
      </div>

      {data.review && (
        <div ref={reviewSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.REVIEW}>
          <ReviewSection review={data.review} />
        </div>
      )}

      <div className={'buttonContainer'}>
        {data.phoneNumbers?.length > 0 && (
          <Button
            type="primary"
            onClick={() => {
              const phone = data?.phoneNumbers[0];
              window.open(`tel:${phone}`, '_blank');
            }}
          >
            Зарегистрироваться по телефону
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventPage;
