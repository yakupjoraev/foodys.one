import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { RestaurantFavorite } from "../RestaurantFavorite";
import {
  STAR_HALF,
  STAR_WHOLE,
  createRatingStarsModel,
} from "~/utils/rating-stars-model";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

export interface RestaurantCardProps {
  name: string;
  address: string;
  photo?: string;
  userRatingTotal: number;
  priceLevel?: number;
  rating: number;
  placeId?: string;
}

export function RestaurantCard(props: RestaurantCardProps) {
  const { t } = useTranslation("common");

  return (
    <div className="restaurant">
      <div className="restaurant__pictures">
        <Swiper
          className="restaurant__slider mySwiper"
          modules={[Navigation, Pagination]}
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
          <div className="restaurant__slider-arrow restaurant__slider-arrow-prev">
            <img src="/img/dashboard/arrow-prev.svg" alt="prev" />
          </div>
          <div className="restaurant__slider-arrow restaurant__slider-arrow-next">
            <img src="/img/dashboard/arrow-next.svg" alt="next" />
          </div>
          <div className="restaurant__slider-paginations" />
        </Swiper>
        <RestaurantFavorite />
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
              <Trans
                i18nKey="common:textGetThere"
                components={[
                  <a className="restaurant__address-get" href="#" />,
                  <div className="restaurant__address-distance" />,
                ]}
                values={{ distance: 835 }}
              />
            </div>
          </div>
        </div>
        <div className="restaurant__checked">
          <div className="restaurant__checked-label restaurant__checked-label--green">
            {t("textOpenNow")}
          </div>
          <div className="restaurant__reviews">
            <div className="restaurant__reviews-balls">
              {props.rating.toFixed(1)}
            </div>
            <div className="restaurant__reviews-stars">
              {renderStars(props.rating)}
            </div>
            <div className="restaurant__reviews-count">
              ({props.userRatingTotal})
            </div>
            {props.priceLevel !== undefined && (
              <div className="restaurant__reviews-currency">
                {" · " + renderPriceLevelLabel(props.priceLevel)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="restaurant__bottom">
        <div className="restaurant__btns">
          <button type="button" className="restaurant__btn call">
            <img src="/img/dashboard/call.svg" alt="call" />
            {t("buttonCall")}
          </button>
          <button type="button" className="restaurant__btn delivery">
            <img src="/img/dashboard/delivery.svg" alt="delivery" />
            {t("buttonDelivery")}
          </button>
          <button type="button" className="restaurant__btn pay-crypto">
            <img src="/img/dashboard/pay-crypto.svg" alt="pay-crypto" />
            {t("buttonPayInCrypto")}
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

function renderStars(rating: number) {
  const model = createRatingStarsModel(rating);
  return model.map((starType, i) => {
    switch (starType) {
      case STAR_WHOLE: {
        return (
          <img
            className="restaurant__reviews-star"
            src="/img/dashboard/star.svg"
            alt=""
            width="14"
            height="15"
            key={i}
          />
        );
      }
      case STAR_HALF: {
        return (
          <img
            className="restaurant__reviews-star"
            src="/img/dashboard/star-half.svg"
            alt=""
            width="14"
            height="15"
            key={i}
          />
        );
      }
      default: {
        return (
          <img
            className="restaurant__reviews-star"
            src="/img/dashboard/star-empty.svg"
            alt=""
            width="14"
            height="15"
            key={i}
          />
        );
      }
    }
  });
}

function renderPriceLevelLabel(priceLevel: number) {
  if (priceLevel === 0) {
    return "Free";
  }
  let label = "";
  for (let i = 0; i < priceLevel; i++) {
    label += "€";
  }
  return label;
}
