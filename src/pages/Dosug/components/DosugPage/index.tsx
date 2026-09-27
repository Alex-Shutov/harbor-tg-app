import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../../shared/Loader';
import ErrorEstablishment from '../../../../components/ErrorEstablishment';
import { Gallery } from '@/widgets/spotCard/Gallery';
import { Description } from '@/widgets/spotCard/Description';
import { WorkingHoursSection } from '@/widgets/spotCard/WorkingHours';
import { Details } from '@/widgets/establishmentCard/Details';
import { SubCategories } from '@/widgets/spotCard/Categories';
import { AddressSection } from '@/widgets/spotCard/Address';
import { ReviewSection } from '@/widgets/spotCard/Review';
import { EventsSection } from '@/widgets/establishmentCard/Events/ui/EventsSection.tsx';
import { useGetLeisureQuery } from '@/entities/leisures/model/api/details.api.ts';
import { ILeisureDetails } from '@/entities/leisures/model/types/details.domain.types.ts';
import { LeisureTopBanner } from '@/widgets/leisureCard/TopBanner/TopBanner.tsx';
import { ObjectNavigation, useObjectSections, useScrollToSection, EObjectSection } from '@/features/object-navigation';
import { EPageType, EReservationType } from '@shared/constants';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';
import { Button } from '@shared/ui';
import { openLink } from '@telegram-apps/sdk';
import { PromocodeSection } from '@/widgets/spotCard/PromocodeSection/ui/PromocodeSection.tsx';

const EstablishmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const result = useGetLeisureQuery(Number(id));
  const { data, isLoading, error, refetch } = result as {
    data: ILeisureDetails | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  }

  const sections = useObjectSections(data, EPageType.ESTABLISHMENT);
  const { registerSection, scrollToSection, activeSection } = useScrollToSection();


  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const generalSectionRef = useRef<HTMLDivElement>(null);
  const addressSectionRef = useRef<HTMLDivElement>(null);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const eventsSectionRef = useRef<HTMLDivElement>(null);

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
    if (eventsSectionRef.current) {
      registerSection(EObjectSection.EVENTS, eventsSectionRef.current);
    }
  }, [registerSection, data]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [])

  useAutoBackNavigation()
  useBackButtonStack(() => {
    if ((window as any).__navCount <= 0) {
      navigate('/leisure');
    } else {
      navigate(-1);
    }
  },100);

  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorEstablishment />

  return (
    <div className="establishment-page">
      {/* <EstablishmentHeader data={data} /> */}

      <LeisureTopBanner data={data}/>
      
      {sections.length > 0 && (
        <ObjectNavigation
          sections={sections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      )}

      <div ref={gallerySectionRef} className={'establishment-page__gallery'} data-section-id={EObjectSection.GALLERY}>
        {data.sectionsWithImages && (
          <Gallery mainImage={data.mainImg} sections={data.sectionsWithImages} />
        )}
      </div>

      <div ref={generalSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.GENERAL}>
        <Description description={data.description} />
        <WorkingHoursSection data={data}/>
        <Details data={data}/>
        <SubCategories categories={data.categories}/>
      </div>
      {data.promoCodes?.length && Boolean(data.promoCodes?.length) && <div className={'establishment-page__section'}>

        <PromocodeSection onDataRefresh={refetch} promoCodes={data.promoCodes} pageId={Number(id)} pageType={EPageType.LEISURE}/>
      </div>}
      <div ref={addressSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.ADDRESS}>
        <AddressSection
          title={data?.mapLocation?.pointTitle || ''}
          latitude={data.mapLocation.latitude}
          longitude={data.mapLocation.longitude}
          address={''}
        />
      </div>

      {data.review && <div ref={reviewSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.REVIEW}>
        <ReviewSection review={data.review} />
      </div>}

      {data.events.length > 0 && <div ref={eventsSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.EVENTS}>
        <EventsSection data={data}/>
      </div>}
      <div className={'buttonContainer'}>
        {data.reservationTypeEnum === EReservationType.BY_PHONE && data.phoneNumbers?.length > 0 && (
          <Button
            type="primary"
            onClick={() => {
              const phone = data?.phoneNumbers[0];
              window.open(`tel:${phone}`, '_blank');
            }}
          >
            Забронировать по телефону
          </Button>
        )}
        {data.reservationTypeEnum === EReservationType.BY_PARTNERS_LINK_RESERVE && data.externalBookUrl && (
          <Button
            type="primary"
            onClick={() => {

              if ('externalBookUrl' in data) {
                openLink(data.externalBookUrl, { tryInstantView: true });
              }
            }}
          >
            Забронировать по телефону
          </Button>
        )}
      </div>
    </div>
  );
};

export default EstablishmentPage;