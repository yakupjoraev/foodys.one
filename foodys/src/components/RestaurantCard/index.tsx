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
import Link from "next/link";
import { ServicePhone } from "../ServicePhone";
import { useMemo, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import classNames from "classnames";
import { useRouter } from "next/router";
import { GetThere } from "../GetThere";
import { PlaceOpeningHoursPeriod } from "~/server/gm-client/types";
import {
  GoogleOpeningHours,
  useGoogleOpeningHours,
} from "~/hooks/use-google-opening-hours";
import { Translate } from "next-translate";

const BREAKPOINT1440 = 1440;
const BREAKPOINT768 = 768;

enum ViewMode {
  Mobile,
  Desktop,
  Tablet,
}

export interface RestaurantCardProps {
  name?: string;
  formattedAddress?: string;
  photos?: { src: string; srcSet?: string }[];
  userRatingTotal?: number;
  priceLevel?: number;
  rating?: number;
  placeId?: string;
  favorite?: boolean;
  tags?: string[];
  authentificated?: boolean;
  url?: string;
  placeCoordinates?: { lat: number; lng: number };
  clientCoordinates?: { lat: number; lng: number };
  openingPeriods?: PlaceOpeningHoursPeriod[];
  utcOffset?: number;
  onChangeFavorite?: (
    placeId: string,
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => void;
  onPayInCryptoBtnClick: () => void;
}

const DEFAULT_PHOTOS: { src: string; srcSet?: string }[] = [
  { src: "/img/dashboard/empty168x168.svg" },
];

export function RestaurantCard(props: RestaurantCardProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();
  const [servicePhoneVisible, setServicePhoneVisible] = useState(false);
  const googleOpeningHours = useGoogleOpeningHours(
    props.openingPeriods,
    props.utcOffset
  );

  const photos: { src: string; srcSet?: string }[] =
    props.photos ?? DEFAULT_PHOTOS;

  const handleFavoriteBtnClick = (
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => {
    if (props.onChangeFavorite && props.placeId) {
      props.onChangeFavorite(props.placeId, favorite, cb);
    }
  };

  const handleCallBtnClick = () => {
    setServicePhoneVisible(true);
  };

  const viewMode = getViewMode(windowWidth);

  const placeLink = props.url;

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
              <Link href={placeLink ? placeLink + "#gallery" : "#"}>
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  alt="slide"
                  width="168"
                  height="168"
                  loading="lazy"
                />
              </Link>
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
        <RestaurantFavorite
          checked={props.favorite}
          onChange={handleFavoriteBtnClick}
        />
      </div>

      <div className="restaurant__top">
        <div className="restaurant__texts">
          <h3 className="restaurant__name">
            {placeLink ? (
              <Link className="restaurant__name-link" href={placeLink}>
                {props.name ?? "..."}
              </Link>
            ) : (
              props.name ?? "..."
            )}
          </h3>
          <div className="restaurant__tags">
            {props.tags?.map((tag, i) => (
              <div
                className="restaurant__tag"
                key={i.toString()}
              >{`#${tag}`}</div>
            ))}
          </div>
          <div className="restaurant__address">
            <Link
              className="restaurant__address-info"
              href={placeLink ? placeLink + "#location" : "#"}
            >
              <img src="/img/dashboard/geo.svg" alt="geo" />
              <p>{props.formattedAddress ?? "..."}</p>
              {props.clientCoordinates && props.placeCoordinates && (
                <span>–</span>
              )}
            </Link>
            {props.clientCoordinates && props.placeCoordinates && (
              <GetThere
                from={props.clientCoordinates}
                to={props.placeCoordinates}
                googlePlaceId={props.placeId}
              />
            )}
          </div>
        </div>
        <div className="restaurant__checked">
          {googleOpeningHours && (
            <div
              className={`restaurant__checked-label ${
                googleOpeningHours.isOpen
                  ? "restaurant__checked-label--green"
                  : "restaurant__checked-label--grey"
              }`}
            >
              {renderOpeningLabel(googleOpeningHours, t)}
            </div>
          )}

          <Link
            className="restaurant__reviews"
            href={placeLink ? placeLink + "#reviews" : "#"}
          >
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
          </Link>
        </div>
      </div>
      <div className="restaurant__bottom">
        <div className="restaurant__btns">
          <button
            className="restaurant__btn call"
            type="button"
            onClick={handleCallBtnClick}
          >
            <img src="/img/dashboard/call.svg" alt="call" />
            {t("buttonCall")}
          </button>
          <button
            type="button"
            className="restaurant__btn restaurant__btn--disabled delivery"
            disabled
          >
            <img src="/img/dashboard/delivery.svg" alt="" />
            {t("buttonDelivery")}
          </button>
          <button
            type="button"
            className="restaurant__btn pay-crypto"
            onClick={props.onPayInCryptoBtnClick}
          >
            <img src="/img/dashboard/pay-crypto.svg" alt="pay-crypto" />
            {t("buttonPayInCrypto")}
          </button>
          {servicePhoneVisible && viewMode === ViewMode.Desktop && (
            <ServicePhone />
          )}
        </div>

        {servicePhoneVisible && viewMode === ViewMode.Mobile && (
          <div className="service-phone-group">
            <ServicePhone />
            <p className="service-phone-help">
              <Trans
                i18nKey="common:textNumberExplanation"
                components={[
                  // eslint-disable-next-line react/jsx-key
                  <a
                    className="service-phone-help__link"
                    href={t("urlNumber")}
                  />,
                ]}
              />
            </p>
          </div>
        )}

        {placeLink && (
          <Link className="restaurant__more" href={placeLink}>
            {t("buttonSeeMore")}
          </Link>
        )}
      </div>
      {servicePhoneVisible && viewMode === ViewMode.Tablet && (
        <div className="service-phone-group restaurant__service-phone-group">
          <ServicePhone />
          <p className="service-phone-help service-phone-group__item">
            <Trans
              i18nKey="common:textNumberExplanation"
              components={[
                // eslint-disable-next-line react/jsx-key
                <a
                  className="service-phone-help__link"
                  href={t("urlNumber")}
                />,
              ]}
            />
          </p>
        </div>
      )}
      {servicePhoneVisible && viewMode === ViewMode.Desktop && (
        <p className="service-phone-help restaurant__service-phone-help">
          <Trans
            i18nKey="common:textNumberExplanation"
            components={[
              // eslint-disable-next-line react/jsx-key
              <a className="service-phone-help__link" href={t("urlNumber")} />,
            ]}
          />
        </p>
      )}
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

function getViewMode(windowWidth: number): ViewMode {
  if (windowWidth < BREAKPOINT768) {
    return ViewMode.Mobile;
  }
  if (windowWidth < BREAKPOINT1440) {
    return ViewMode.Tablet;
  }
  return ViewMode.Desktop;
}

function renderOpeningLabel(
  googleOpeningHours: GoogleOpeningHours,
  t: Translate
) {
  if (googleOpeningHours.isOpen) {
    return t("textOpenNow");
  } else {
    if (!googleOpeningHours.opensAt) {
      return t("textClosedNow");
    }
    return t("textOpensAt", { time: googleOpeningHours.opensAt });
  }
}
