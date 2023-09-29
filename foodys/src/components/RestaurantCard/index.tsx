import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

export interface RestaurantCardProps {
  name: string;
  address: string;
  photo?: string;
  userRatingTotal: number;
  rating: number;
  placeId?: string;
}

export function RestaurantCard(props: RestaurantCardProps) {
  return (
    <div className="restaurant">
      <div className="restaurant__pictures">
        <Swiper
          className="restaurant__slider mySwiper"
          modules={[Navigation]}
          spaceBetween={6}
          slidesPerView={1}
          navigation={{
            nextEl: ".restaurant__slider-arrow-next",
            prevEl: ".restaurant__slider-arrow-prev",
          }}
          pagination={{
            el: ".restaurant__slider-paginations",
            type: "bullets",
          }}
          wrapperClass="restaurant__slider-wrapper"
        >
          {props.photo && (
            <SwiperSlide className="restaurant__slide">
              <img
                src={props.photo}
                alt="slide"
                width="168"
                height="168"
                loading="lazy"
              />
            </SwiperSlide>
          )}
          <SwiperSlide className="restaurant__slide">
            <img
              style={{ height: "168px", objectFit: "cover" }}
              src="/img/dashboard/slide-1.jpg"
              alt="slide"
              width="168"
              height="168"
            />
          </SwiperSlide>
          <SwiperSlide className="restaurant__slide">
            <img src="/img/dashboard/slide-2.jpg" alt="slide" />
          </SwiperSlide>
          <SwiperSlide className="restaurant__slide">
            <img src="/img/dashboard/slide-3.jpg" alt="slide" />
          </SwiperSlide>
          <SwiperSlide className="restaurant__slide">
            <img src="/img/dashboard/slide-4.jpg" alt="slide" />
          </SwiperSlide>
          <SwiperSlide className="restaurant__slide">
            <img src="/img/dashboard/slide-5.jpg" alt="slide" />
          </SwiperSlide>
          <div className="restaurant__slider-arrow restaurant__slider-arrow-prev">
            <img src="/img/dashboard/arrow-prev.svg" alt="prev" />
          </div>
          <div className="restaurant__slider-arrow restaurant__slider-arrow-next">
            <img src="/img/dashboard/arrow-next.svg" alt="next" />
          </div>
          <div className="restaurant__slider-paginations" />
        </Swiper>
        <div className="restaurant__favorite">
          <div className="restaurant__favorite-heart">
            <svg
              width={13}
              height={13}
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.948692 1.65769C1.55632 1.02354 2.38034 0.667289 3.23953 0.667289C4.09872 0.667289 4.92273 1.02354 5.53036 1.65769L6.47975 2.64798L7.42913 1.65769C7.72803 1.33461 8.08557 1.07691 8.48089 0.899629C8.87621 0.722346 9.30139 0.629031 9.73163 0.625128C10.1619 0.621225 10.5885 0.706813 10.9867 0.876897C11.385 1.04698 11.7467 1.29816 12.051 1.61577C12.3552 1.93338 12.5958 2.31106 12.7587 2.72678C12.9216 3.1425 13.0036 3.58793 12.9999 4.03708C12.9961 4.48623 12.9068 4.93011 12.7369 5.34281C12.5671 5.75551 12.3203 6.12877 12.0108 6.44082L6.47975 12.2159L0.948692 6.44082C0.341245 5.80647 0 4.94622 0 4.04926C0 3.15229 0.341245 2.29204 0.948692 1.65769Z"
                fill="#A8ADB8"
              />
            </svg>
          </div>
          <p className="restaurant__favorite-text">Added to favorites</p>
        </div>
      </div>
      <div className="restaurant__top">
        <div className="restaurant__texts">
          <h3 className="restaurant__name">{props.name}</h3>
          <div className="restaurant__tags">
            <div className="restaurant__tag">#Tagname no.1</div>
            <div className="restaurant__tag">#Tagname no.2</div>
            <div className="restaurant__tag">#Tagname no.3</div>
          </div>
          <div className="restaurant__address">
            <div className="restaurant__address-info">
              <img src="/img/dashboard/geo.svg" alt="geo" />
              <p>{props.address}</p>
              <span>–</span>
            </div>
            <div className="restaurant__address-gets">
              <a className="restaurant__address-get" href="#">
                Get there
              </a>
              <div className="restaurant__address-distance">
                | 835m from you
              </div>
            </div>
          </div>
        </div>
        <div className="restaurant__checked">
          <div className="restaurant__checked-label restaurant__checked-label--green">
            Open now
          </div>
          <div className="restaurant__reviews">
            <div className="restaurant__reviews-balls">
              {props.rating.toFixed(1)}
            </div>
            <div className="restaurant__reviews-stars">
              <img
                className="restaurant__reviews-star"
                src="/img/dashboard/star.svg"
                alt="star"
              />
              <img
                className="restaurant__reviews-star"
                src="/img/dashboard/star.svg"
                alt="star"
              />
              <img
                className="restaurant__reviews-star"
                src="/img/dashboard/star.svg"
                alt="star"
              />
              <img
                className="restaurant__reviews-star"
                src="/img/dashboard/star.svg"
                alt="star"
              />
              <img
                className="restaurant__reviews-star"
                src="/img/dashboard/star.svg"
                alt="star"
              />
            </div>
            <div className="restaurant__reviews-count">
              ({props.userRatingTotal})
            </div>
            <div className="restaurant__reviews-currency"> · €€</div>
          </div>
        </div>
      </div>
      <div className="restaurant__bottom">
        <div className="restaurant__btns">
          <button type="button" className="restaurant__btn call">
            <img src="/img/dashboard/call.svg" alt="call" />
            Call
          </button>
          <button type="button" className="restaurant__btn delivery">
            <img src="/img/dashboard/delivery.svg" alt="delivery" />
            Delivery
          </button>
          <button type="button" className="restaurant__btn pay-crypto">
            <img src="/img/dashboard/pay-crypto.svg" alt="pay-crypto" />
            Pay in Crypto
          </button>
        </div>
        {props.placeId && (
          <a
            className="restaurant__more"
            href={"/place?place_id=" + encodeURIComponent(props.placeId)}
          >
            See more
          </a>
        )}
      </div>
    </div>
  );
}
