import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import useTranslation from "next-translate/useTranslation";

export function AboutPartners() {
  const { t } = useTranslation("common");

  return (
    <div className="about__partners">
      <h2 className="about__partners-title about__title">
        {t("titleOurPartners")}
      </h2>

      <div className="about__partners-slider-container">
        <Swiper
          className="about__partners-slider mySwiper"
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".about__partners-arrow--next",
            prevEl: ".about__partners-arrow--prev",
          }}
          breakpoints={{
            // when window width is >= 320px
            320: {
              spaceBetween: 12,
              slidesPerView: 'auto',
              centeredSlides: true,
              loop: true,
            },
            // when window width is >= 480px
            767: {
              spaceBetween: 16,
              slidesPerView: 3,
            },
            // when window width is >= 640px
            992: {
              spaceBetween: 24,
              slidesPerView: 4,
            },
          }}
          wrapperClass="about__partners-wrapper"
        >
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-1.png"
              alt=""
              width={230}
              height={38}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-2.svg"
              alt=""
              width={101}
              height={32}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-3.png"
              alt=""
              width={239}
              height={28}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-4.png"
              alt=""
              width={237}
              height={82}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-1.png"
              alt=""
              width={230}
              height={38}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-2.svg"
              alt=""
              width={101}
              height={32}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-3.png"
              alt=""
              width={239}
              height={28}
            />
          </SwiperSlide>
          <SwiperSlide className="about__partners-slide">
            <img
              className="about__partners-pic"
              src="/img/about/about__partners-4.png"
              alt=""
              width={237}
              height={82}
            />
          </SwiperSlide>
        </Swiper>

        <div
            className="about__partners-arrow about__partners-arrow--prev"
            slot="container-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={21}
              viewBox="0 0 14 21"
              fill="none"
            >
              <path d="M12 2L4 10.5L12 19" stroke="#A8ADB8" strokeWidth={5} />
            </svg>
          </div>

          <div
            className="about__partners-arrow about__partners-arrow--next"
            slot="container-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={14}
              height={21}
              viewBox="0 0 14 21"
              fill="none"
            >
              <path d="M2 2L10 10.5L2 19" stroke="#A8ADB8" strokeWidth={5} />
            </svg>
          </div>
      </div>

    </div>
  );
}
