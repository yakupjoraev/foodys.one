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
  name?: string;
  formattedAddress?: string;
  photos?: string[];
  userRatingTotal?: number;
  priceLevel?: number;
  rating?: number;
  placeId?: string;
  favorite?: boolean;
  authentificated?: boolean;
  onChangeFavorite?: (
    placeId: string,
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => void;
}

const DEFAULT_PHOTOS = ["/img/dashboard/empty168x168.svg"];

export function RestaurantCard(props: RestaurantCardProps) {
  const { t } = useTranslation("common");

  const photos =
    props.photos && props.photos.length ? props.photos : DEFAULT_PHOTOS;

  const handleFavoriteBtnClick = (
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => {
    if (props.onChangeFavorite && props.placeId) {
      props.onChangeFavorite(props.placeId, favorite, cb);
    }
  };

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
          {photos.map((photo, i) => (
            <SwiperSlide className="restaurant__slide" key={i}>
              <img
                src={photo}
                alt="slide"
                width="168"
                height="168"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
          {photos.length > 1 && (
            <>
              <div className="restaurant__slider-arrow restaurant__slider-arrow-prev">
                <img src="/img/dashboard/arrow-prev.svg" alt="prev" />
              </div>
              <div className="restaurant__slider-arrow restaurant__slider-arrow-next">
                <img src="/img/dashboard/arrow-next.svg" alt="next" />
              </div>
              <div className="restaurant__slider-paginations" />
            </>
          )}
        </Swiper>
        {props.authentificated && (
          <RestaurantFavorite
            checked={props.favorite}
            onChange={handleFavoriteBtnClick}
          />
        )}
      </div>

      <div className="restaurant__top">
        <div className="restaurant__texts">
          <h3 className="restaurant__name">{props.name || "..."}</h3>
          <div className="restaurant__tags">
            <div className="restaurant__tag">#Tagname no.1</div>
            <div className="restaurant__tag">#Tagname no.2</div>
            <div className="restaurant__tag">#Tagname no.3</div>
          </div>
          <div className="restaurant__address">
            <div className="restaurant__address-info">
              <img src="/img/dashboard/geo.svg" alt="geo" />
              <p>{props.formattedAddress || "..."}</p>
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
            {props.rating !== undefined && (
              <>
                <div className="restaurant__reviews-balls">
                  {props.rating.toFixed(1)}
                </div>
                <div className="restaurant__reviews-stars">
                  {renderStars(props.rating)}
                </div>
              </>
            )}
            {props.userRatingTotal !== undefined && (
              <div className="restaurant__reviews-count">
                ({props.userRatingTotal})
              </div>
            )}
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
            href={"/gplace/" + encodeURIComponent(props.placeId)}
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
