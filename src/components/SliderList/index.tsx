import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import  {SwiperClass} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './SliderList.scss';

export interface SliderListItem {
  id: string | number;
  content: React.ReactNode;
}

interface SliderListProps {
  items: SliderListItem[];
  itemsPerPage?: number;
  className?: string;
}

const SliderList: React.FC<SliderListProps> = ({
                                                 items,
                                                 itemsPerPage = 7,
                                                 className = ''
                                               }) => {
  const swiperRef = useRef<SwiperClass>();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (items.length <= itemsPerPage) {
    return (
      <ul className={className}>
        {items.map((item) => (
          <li key={item.id}>
            {item.content}
          </li>
        ))}
      </ul>
    );
  }

  const groupedItems = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    groupedItems.push(items.slice(i, i + itemsPerPage));
  }

  return (
    <div className="slider-container">
      <div className="slider-navigation">
        <button
          ref={prevRef}
          className="nav-arrow left"
          type="button"
        >
          <img
            src="/dropdown.svg"
            alt="Previous"
            className="arrow-icon left-arrow"
          />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}

          onSwiper={(swiper) => {
            swiperRef.current = swiper;

            setTimeout(() => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }
            });
          }}
          className="hours-swiper"
        >
          {groupedItems.map((group, slideIndex) => (
            <SwiperSlide key={slideIndex}>
              <ul className={className}>
                {group.map((item) => (
                  <li key={item.id}>
                    {item.content}
                  </li>
                ))}
              </ul>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={nextRef}
          className="nav-arrow right"
          type="button"
        >
          <img
            src="/dropdown.svg"
            alt="Next"
            className="arrow-icon right-arrow"
          />
        </button>
      </div>


    </div>
  );
};

export default SliderList;
