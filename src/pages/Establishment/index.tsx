import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetEstablishmentQuery } from '@/entities/establishments/model/api/details.api.ts';
import { Gallery } from '@/widgets/spotCard/Gallery';
import { useEstablishmentDetailsStore } from '@/entities/establishments/model/store/useDetailsStore.ts';
import { EPageType } from '@shared/constants';
import { IEstablishmentDetails } from '@/entities/establishments/model/types/details.domain.types.ts';
import Loader from '@shared/Loader';
import ErrorEstablishment from '@components/ErrorEstablishment';
import { Description } from '@/widgets/spotCard/Description';
import { WorkingHoursSection } from '@/widgets/spotCard/WorkingHours';
import { Details } from '@/widgets/establishmentCard/Details';
import { SubCategories } from '@/widgets/spotCard/Categories';
import './establishment.scss';
import { AddressSection } from '@/widgets/spotCard/Address';
import { ReviewSection } from '@/widgets/spotCard/Review';
import { EventsSection } from '@/widgets/establishmentCard/Events/ui/EventsSection.tsx';
import { EstablishmentTopBanner } from '@/widgets/establishmentCard/TopBanner/TopBanner.tsx';
import { PromocodeSection } from '@/widgets/spotCard/PromocodeSection/ui/PromocodeSection.tsx';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';
import { MenuSection } from '@/widgets/spotCard/Menu';
import { ObjectNavigation, useObjectSections, useScrollToSection, EObjectSection } from '@/features/object-navigation';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';
import { useEffect, useRef } from 'react';

const EstablishmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const result = useGetEstablishmentQuery(Number(id));
  const { data, isLoading, error, refetch } = result as {
    data: IEstablishmentDetails | undefined;
    isLoading: boolean;
    error: any;
    refetch: () => void;
  };
  useAutoBackNavigation();
  const { setData, clearData } = useEstablishmentDetailsStore();
  useLocation();
  useBackButtonStack(() => {
    if ((window as any).__navCount <= 0) {
      navigate('/establishments');
    } else {
      navigate(-1);
    }
  }, 100);

  const sections = useObjectSections(data, EPageType.ESTABLISHMENT);
  const { registerSection, scrollToSection, activeSection } = useScrollToSection();

  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const generalSectionRef = useRef<HTMLDivElement>(null);
  const menuSectionRef = useRef<HTMLDivElement>(null);
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
    if (menuSectionRef.current) {
      registerSection(EObjectSection.MENU, menuSectionRef.current);
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

  useEffect(() => {
    if (data) {
      setData(data, EPageType.ESTABLISHMENT);
    }
  }, [data, setData]);

  useEffect(() => {
    return () => {
      clearData();
    };
  }, [clearData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorEstablishment />;

  return (
    <div className="establishment-page">
      <EstablishmentTopBanner data={data} />

      {sections.length > 0 && (
        <ObjectNavigation
          sections={sections}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      )}

      <div ref={gallerySectionRef} className={'establishment-page__gallery'} data-section-id={EObjectSection.GALLERY}>
        {data.sectionsWithImages && Boolean(data.sectionsWithImages) && (
          <Gallery mainImage={data.mainImg} sections={data.sectionsWithImages} />
        )}
      </div>

      <div ref={generalSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.GENERAL}>
        <Description description={data.description} />
        <WorkingHoursSection data={data} />
        <Details data={data} />
        <SubCategories categories={data.categories} />
      </div>
      {data.menu && Boolean(data.menu) && (
        <div ref={menuSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.MENU}>
          <MenuSection menu={data.menu} />
        </div>
      )}
      {data.promoCodes?.length && Boolean(data.promoCodes?.length) && (
        <div className={'establishment-page__section'}>
          <PromocodeSection
            promoCodes={data.promoCodes}
            pageId={Number(id)}
            pageType={EPageType.ESTABLISHMENT}
            onDataRefresh={refetch}
          />
        </div>
      )}
      <div ref={addressSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.ADDRESS}>
        <AddressSection
          title={data?.mapLocation?.pointTitle || ''}
          latitude={data.mapLocation?.latitude || 0}
          longitude={data.mapLocation?.longitude || 0}
          address={data?.mapLocation?.pointTitle || ''}
        />
      </div>

      {data.review && Boolean(data.review) && (
        <div ref={reviewSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.REVIEW}>
          <ReviewSection review={data.review} />
        </div>
      )}

      {data.events?.length > 0 && (
        <div ref={eventsSectionRef} className={'establishment-page__section'} data-section-id={EObjectSection.EVENTS}>
          <EventsSection data={data} />
        </div>
      )}
    </div>
  );
};

export default EstablishmentPage;
