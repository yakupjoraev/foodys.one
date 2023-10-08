import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";
import { Layout } from "~/components/Layout";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { OpeningHoursTab } from "~/components/OpeningHoursTab";
import { OverviewTab } from "~/components/OverviewTab";
import { Place } from "~/server/gm-client/types";
import { getPlaceByPlaceId } from "~/server/api/routers/place";
import { ReviewsTab } from "~/components/ReviewsTab";

enum Tab {
  Overview,
  OpeningHours,
  Reviews,
  Location,
}

export const getServerSideProps = (async (ctx) => {
  const placeId = ctx.params?.place_id;
  if (typeof placeId !== "string") {
    return {
      notFound: true,
    };
  }
  const place = await getPlaceByPlaceId(placeId);
  if (place === null) {
    return {
      notFound: true,
    };
  }
  return { props: { place } };
}) satisfies GetServerSideProps<{ place: Place }>;

export default function Place(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t } = useTranslation("common");
  const [tab, setTab] = useState<Tab>(Tab.Overview);

  const previewPhotos = useMemo(() => {
    if (!props.place.photos) {
      return undefined;
    }
    if (props.place.photos.length === 0) {
      return [];
    }
    return props.place.photos.slice(0, 4);
  }, [props.place]);

  const handleSeeOpeningHoursBtnClick = () => {
    setTab(Tab.OpeningHours);
  };

  const lastPreviewIndex = previewPhotos ? previewPhotos.length - 1 : -1;

  const openingHours = props.place.opening_hours?.periods;

  return (
    <Layout title="Foodys - About page">
      <main className="main">
        <div className="dashboard restaurant-page">
          <div className="container">
            <form action="#" className="dashboard__form">
              <div
                className="dashboard__form-search search-wrapper"
                data-search-wrapper=""
              >
                <input
                  className="menu__item-search"
                  type="search"
                  placeholder="City, cuisine or restaurant name"
                  data-search-input=""
                />
                <img
                  className="menu__item-search-icon"
                  src="/img/icons/glass.svg"
                  alt=""
                />
                <div className="search__list">
                  <a className="search__item" href="#">
                    <img
                      className="search__item-pic"
                      src="/img/dashboard/slide-1.jpg"
                      alt=""
                    />
                    <div className="search__item-info">
                      <h4 className="search__item-label">
                        Hank Burger Paris Archives
                      </h4>
                      <div className="search__item-address">
                        <img src="/img/dashboard/geo.svg" alt="" />
                        <p>Paris, lle-de-France, France</p>
                      </div>
                    </div>
                  </a>
                  <a className="search__item" href="#">
                    <img
                      className="search__item-pic"
                      src="/img/dashboard/slide-1.jpg"
                      alt=""
                    />
                    <div className="search__item-info">
                      <h4 className="search__item-label">
                        Hank Burger Paris Archives
                      </h4>
                      <div className="search__item-address">
                        <img src="/img/dashboard/geo.svg" alt="" />
                        <p>Paris, lle-de-France, France</p>
                      </div>
                    </div>
                  </a>
                  <a className="search__item" href="#">
                    <img
                      className="search__item-pic"
                      src="/img/dashboard/slide-1.jpg"
                      alt=""
                    />
                    <div className="search__item-info">
                      <h4 className="search__item-label">
                        Hank Burger Paris Archives
                      </h4>
                      <div className="search__item-address">
                        <img src="/img/dashboard/geo.svg" alt="" />
                        <p>Paris, lle-de-France, France</p>
                      </div>
                    </div>
                  </a>
                  <a className="search__item" href="#">
                    <img
                      className="search__item-pic"
                      src="/img/dashboard/slide-1.jpg"
                      alt=""
                    />
                    <div className="search__item-info">
                      <h4 className="search__item-label">
                        Hank Burger Paris Archives
                      </h4>
                      <div className="search__item-address">
                        <img src="/img/dashboard/geo.svg" alt="" />
                        <p>Paris, lle-de-France, France</p>
                      </div>
                    </div>
                  </a>
                  <a className="search__item" href="#">
                    <img
                      className="search__item-pic"
                      src="/img/dashboard/slide-1.jpg"
                      alt=""
                    />
                    <div className="search__item-info">
                      <h4 className="search__item-label">
                        Hank Burger Paris Archives
                      </h4>
                      <div className="search__item-address">
                        <img src="/img/dashboard/geo.svg" alt="" />
                        <p>Paris, lle-de-France, France</p>
                      </div>
                    </div>
                  </a>
                  <a className="search__more" href="#">
                    View all results <span>(234)</span>
                  </a>
                </div>
              </div>
            </form>
            <div className="dashboard__main">
              <div className="restaurant-page__inner">
                {previewPhotos && (
                  <div className="restaurant-page__pictures">
                    {previewPhotos.map((photo, i) => {
                      if (!photo.photo_reference) {
                        return null;
                      }
                      return (
                        <div
                          className="restaurant-page__pic"
                          key={photo.photo_reference}
                        >
                          <img
                            src={
                              "https://foodys.freeblock.site/place-photos/cover_168x168/" +
                              photo.photo_reference
                            }
                            alt=""
                            width={168}
                            height={168}
                          />
                          {i === lastPreviewIndex && (
                            <a className="restaurant-page__pic-all" href="#">
                              {t("buttonViewAll")}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="input__border" />
                <div className="restaurant-page__info">
                  <h1 className="restaurant-page__name">
                    {props.place.name || "..."}
                  </h1>
                  <div className="restaurant-page__instruments">
                    <div className="restaurant-page__instrument">
                      <img src="/img/restaurant-page/review.svg" alt="review" />
                      <span>{t("buttonReview")}</span>
                    </div>
                    <div className="restaurant-page__instrument">
                      <img src="/img/restaurant-page/like.svg" alt="like" />
                      <span>{t("buttonSave")}</span>
                    </div>
                    <div className="restaurant-page__instrument">
                      <img src="/img/restaurant-page/share.svg" alt="share" />
                      <span>{t("buttonShare")}</span>
                    </div>
                  </div>
                  <div className="restaurant-page__address">
                    <div className="restaurant__address">
                      <div className="restaurant__address-info">
                        <img src="/img/dashboard/geo.svg" alt="geo" />
                        <p>{props.place?.formatted_address || "..."} </p>
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
                  <div className="restaurant-page__reviews">
                    <div className="restaurant__reviews">
                      <div className="restaurant__reviews-balls">
                        {props.place?.rating || 0}
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
                        ({props.place.user_ratings_total || 0})
                      </div>
                      <div className="restaurant__reviews-currency"> · €€</div>
                    </div>
                  </div>
                  <div className="restaurant-page__btns">
                    <div className="restaurant__btns">
                      <button type="button" className="restaurant__btn call">
                        <img src="/img/dashboard/call.svg" alt="call" />
                        {t("buttonCall")}
                      </button>
                      <button
                        type="button"
                        className="restaurant__btn delivery"
                      >
                        <img src="/img/dashboard/delivery.svg" alt="delivery" />
                        {t("buttonDelivery")}
                      </button>
                      <button
                        type="button"
                        className="restaurant__btn pay-crypto"
                      >
                        <img
                          src="/img/dashboard/pay-crypto.svg"
                          alt="pay-crypto"
                        />
                        {t("buttonPayInCrypto")}
                      </button>
                    </div>
                  </div>
                  <div className="restaurant-page__others">
                    <a className="restaurant-page__others-open" href="#">
                      {t("textOpenNow")}
                    </a>
                    {openingHours && openingHours.length > 0 && (
                      <button
                        className="restaurant-page__others-link"
                        type="button"
                        onClick={handleSeeOpeningHoursBtnClick}
                      >
                        {t("textSeeOpeningHours")}
                      </button>
                    )}

                    <a className="restaurant-page__others-link" href="#">
                      {t("textThisIsMyBusiness")}
                      <span className="restaurant-page__others-link-label">
                        {t("scrollOverScrollOverComingSoon")}
                      </span>
                    </a>
                  </div>
                </div>
                <div className="input__border" />
                {/* Tabs */}
                <div className="tabs">
                  <div className="tabs__header">
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Overview,
                      })}
                      onClick={() => setTab(Tab.Overview)}
                    >
                      {t("titleOverview")}
                    </div>
                    {openingHours && openingHours.length > 0 && (
                      <div
                        className={classNames("tabs__header-item", {
                          active: tab === Tab.OpeningHours,
                        })}
                        onClick={() => setTab(Tab.OpeningHours)}
                      >
                        {t("titleOpeningHours")}
                      </div>
                    )}
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Reviews,
                      })}
                      onClick={() => setTab(Tab.Reviews)}
                    >
                      {t("titleReviews")}
                    </div>
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Location,
                      })}
                      onClick={() => setTab(Tab.Location)}
                    >
                      {t("titleLocation")}
                    </div>
                  </div>
                  <div className="input__border" />
                  <div className="tabs__content">
                    {/*---------------------- Overview ---------------------*/}
                    <OverviewTab
                      show={tab === Tab.Overview}
                      place={props.place}
                    />
                    {/* <div
                      className="tabs__content-item"
                      style={{
                        display: tab === Tab.Overview ? "flex" : "none",
                      }}
                    >
                      <div className="overview-content">
                        <p className="overview-content__text">
                          {queryResponse.data?.formatted_address || "..."}
                          {queryResponse.data?.website && (
                            <a
                              href={queryResponse.data.website}
                              target="_blank"
                            >
                              {queryResponse.data.website}
                            </a>
                          )}
                        </p>
                        <p className="overview-content__text">
                          Cuisine: Chinese, Burger
                        </p>
                        <p className="overview-content__text">
                          Services: take out, Delivery, dine-in
                        </p>
                      </div>
                    </div> */}

                    {/*---------------------- Opening hours ---------------------*/}
                    {openingHours && openingHours.length && (
                      <OpeningHoursTab
                        periods={openingHours}
                        show={tab === Tab.OpeningHours}
                      />
                    )}

                    {/*---------------------- Reviews ---------------------*/}
                    <ReviewsTab
                      place={props.place}
                      show={tab === Tab.Reviews}
                    />

                    {/*---------------------- Location ---------------------*/}
                    <div
                      className="tabs__content-item"
                      style={{
                        display: tab === Tab.Location ? "flex" : "none",
                      }}
                    >
                      <div className="location">
                        <div className="location__top">
                          <p className="location__address">
                            {props.place.formatted_address || "..."} – 835m from
                            you
                          </p>
                          <div className="location__map">
                            <img
                              src="/img/location-map.jpg"
                              alt="location map"
                            />
                          </div>
                          <div className="location__footer">
                            <button
                              type="button"
                              className="restaurant__btn call"
                            >
                              <img src="/img/dashboard/call.svg" alt="call" />
                              {t("buttonCall")}
                            </button>
                            <button
                              type="button"
                              className="restaurant__btn restaurant__btn--outline"
                            >
                              Back to previous results
                            </button>
                          </div>
                        </div>
                        <div className="input__border" />
                        <div className="location__bottom">
                          <p className="location__bottom-label">
                            Check other places near you
                          </p>
                          <div className="restaurants">
                            <div className="restaurant">
                              <div className="restaurant__pictures">
                                <div className="restaurant__slider swiper mySwiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                                  <div
                                    className="restaurant__slider-wrapper swiper-wrapper"
                                    id="swiper-wrapper-aae496e8edbdf190"
                                    aria-live="off"
                                    style={{
                                      transitionDuration: "0ms",
                                      transform:
                                        "translate3d(-348px, 0px, 0px)",
                                      transitionDelay: "0ms",
                                    }}
                                  >
                                    <div
                                      className="restaurant__slide swiper-slide"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="1 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-1.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-prev"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="2 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-2.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-active"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="3 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-3.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-next"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="4 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-4.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="5 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-5.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className="restaurant__slider-arrow restaurant__slider-arrow-prev"
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Previous slide"
                                    aria-controls="swiper-wrapper-aae496e8edbdf190"
                                    aria-disabled="false"
                                  >
                                    <img
                                      src="/img/dashboard/arrow-prev.svg"
                                      alt="prev"
                                    />
                                  </div>
                                  <div
                                    className="restaurant__slider-arrow restaurant__slider-arrow-next"
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Next slide"
                                    aria-controls="swiper-wrapper-aae496e8edbdf190"
                                    aria-disabled="false"
                                  >
                                    <img
                                      src="/img/dashboard/arrow-next.svg"
                                      alt="next"
                                    />
                                  </div>
                                  <div className="restaurant__slider-paginations swiper-pagination-bullets swiper-pagination-horizontal">
                                    <span className="swiper-pagination-bullet" />
                                    <span className="swiper-pagination-bullet" />
                                    <span
                                      className="swiper-pagination-bullet swiper-pagination-bullet-active"
                                      aria-current="true"
                                    />
                                    <span className="swiper-pagination-bullet" />
                                    <span className="swiper-pagination-bullet" />
                                  </div>
                                  <span
                                    className="swiper-notification"
                                    aria-live="assertive"
                                    aria-atomic="true"
                                  />
                                </div>
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
                                  <p className="restaurant__favorite-text">
                                    Added to favorites
                                  </p>
                                </div>
                              </div>
                              <div className="restaurant__top">
                                <div className="restaurant__texts">
                                  <h3 className="restaurant__name">
                                    Restaurant Name 1
                                  </h3>
                                  <div className="restaurant__tags">
                                    <div className="restaurant__tag">
                                      #Tagname no.1
                                    </div>
                                    <div className="restaurant__tag">
                                      #Tagname no.2
                                    </div>
                                    <div className="restaurant__tag">
                                      #Tagname no.3
                                    </div>
                                  </div>
                                  <div className="restaurant__address">
                                    <div className="restaurant__address-info">
                                      <img
                                        src="/img/dashboard/geo.svg"
                                        alt="geo"
                                      />
                                      <p>
                                        {props.place.formatted_address || "..."}{" "}
                                      </p>
                                      <span>–</span>
                                    </div>
                                    <div className="restaurant__address-gets">
                                      <Trans
                                        i18nKey="common:textGetThere"
                                        components={[
                                          <a
                                            className="restaurant__address-get"
                                            href="#"
                                          />,
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
                                      4.5
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
                                      (347)
                                    </div>
                                    <div className="restaurant__reviews-currency">
                                      {" "}
                                      · €€
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="restaurant__bottom">
                                <div className="restaurant__btns">
                                  <button
                                    type="button"
                                    className="restaurant__btn call"
                                  >
                                    <img
                                      src="/img/dashboard/call.svg"
                                      alt="call"
                                    />
                                    {t("buttonCall")}
                                  </button>
                                  <button
                                    type="button"
                                    className="restaurant__btn delivery"
                                  >
                                    <img
                                      src="/img/dashboard/delivery.svg"
                                      alt="delivery"
                                    />
                                    {t("buttonDelivery")}
                                  </button>
                                  <button
                                    type="button"
                                    className="restaurant__btn pay-crypto"
                                  >
                                    <img
                                      src="/img/dashboard/pay-crypto.svg"
                                      alt="pay-crypto"
                                    />
                                    {t("buttonPayInCrypto")}
                                  </button>
                                </div>
                                <a className="restaurant__more" href="#">
                                  See more
                                </a>
                              </div>
                            </div>
                            <div className="restaurant">
                              <div className="restaurant__pictures">
                                <div className="restaurant__slider swiper mySwiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                                  <div
                                    className="restaurant__slider-wrapper swiper-wrapper"
                                    id="swiper-wrapper-93b3d362bc73b7a6"
                                    aria-live="off"
                                    style={{
                                      transitionDuration: "0ms",
                                      transform:
                                        "translate3d(-348px, 0px, 0px)",
                                      transitionDelay: "0ms",
                                    }}
                                  >
                                    <div
                                      className="restaurant__slide swiper-slide"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="1 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-1.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-prev"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="2 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-2.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-active"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="3 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-3.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-next"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="4 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-4.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="5 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-5.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className="restaurant__slider-arrow restaurant__slider-arrow-prev"
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Previous slide"
                                    aria-controls="swiper-wrapper-93b3d362bc73b7a6"
                                    aria-disabled="false"
                                  >
                                    <img
                                      src="/img/dashboard/arrow-prev.svg"
                                      alt="prev"
                                    />
                                  </div>
                                  <div
                                    className="restaurant__slider-arrow restaurant__slider-arrow-next"
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Next slide"
                                    aria-controls="swiper-wrapper-93b3d362bc73b7a6"
                                    aria-disabled="false"
                                  >
                                    <img
                                      src="/img/dashboard/arrow-next.svg"
                                      alt="next"
                                    />
                                  </div>
                                  <div className="restaurant__slider-paginations swiper-pagination-bullets swiper-pagination-horizontal">
                                    <span className="swiper-pagination-bullet" />
                                    <span className="swiper-pagination-bullet" />
                                    <span
                                      className="swiper-pagination-bullet swiper-pagination-bullet-active"
                                      aria-current="true"
                                    />
                                    <span className="swiper-pagination-bullet" />
                                    <span className="swiper-pagination-bullet" />
                                  </div>
                                  <span
                                    className="swiper-notification"
                                    aria-live="assertive"
                                    aria-atomic="true"
                                  />
                                </div>
                                <div className="restaurant__favorite checked">
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
                                  <p className="restaurant__favorite-text">
                                    Added to favorites
                                  </p>
                                </div>
                              </div>
                              <div className="restaurant__top">
                                <div className="restaurant__texts">
                                  <h3 className="restaurant__name">
                                    Restaurant Name 2
                                  </h3>
                                  <div className="restaurant__tags">
                                    <div className="restaurant__tag">
                                      #Tagname no.1
                                    </div>
                                    <div className="restaurant__tag">
                                      #Tagname no.2
                                    </div>
                                    <div className="restaurant__tag">
                                      #Tagname no.3
                                    </div>
                                  </div>
                                  <div className="restaurant__address">
                                    <div className="restaurant__address-info">
                                      <img
                                        src="/img/dashboard/geo.svg"
                                        alt="geo"
                                      />
                                      <p>
                                        {props.place.formatted_address || "..."}{" "}
                                      </p>
                                      <span>–</span>
                                    </div>
                                    <div className="restaurant__address-gets">
                                      <Trans
                                        i18nKey="common:textGetThere"
                                        components={[
                                          <a
                                            className="restaurant__address-get"
                                            href="#"
                                          />,
                                          <div className="restaurant__address-distance" />,
                                        ]}
                                        values={{ distance: 835 }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="restaurant__checked">
                                  <div className="restaurant__checked-label restaurant__checked-label--grey">
                                    Opens at 19:00
                                  </div>
                                  <div className="restaurant__reviews">
                                    <div className="restaurant__reviews-balls">
                                      4.5
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
                                      (347)
                                    </div>
                                    <div className="restaurant__reviews-currency">
                                      {" "}
                                      · €€
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="restaurant__bottom">
                                <div className="restaurant__btns">
                                  <button
                                    type="button"
                                    className="restaurant__btn call"
                                  >
                                    <img
                                      src="/img/dashboard/call.svg"
                                      alt="call"
                                    />
                                    {t("buttonCall")}
                                  </button>
                                  <button
                                    type="button"
                                    className="restaurant__btn delivery disabled"
                                  >
                                    <img
                                      src="/img/dashboard/delivery.svg"
                                      alt="delivery"
                                    />
                                    {t("buttonDelivery")}
                                  </button>
                                  <button
                                    type="button"
                                    className="restaurant__btn pay-crypto disabled"
                                  >
                                    <img
                                      src="/img/dashboard/pay-crypto.svg"
                                      alt="pay-crypto"
                                    />
                                    {t("buttonPayInCrypto")}
                                  </button>
                                </div>
                                <a className="restaurant__more" href="#">
                                  See more
                                </a>
                              </div>
                            </div>
                            <div className="restaurant">
                              <div className="restaurant__pictures">
                                <div className="restaurant__slider swiper mySwiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                                  <div
                                    className="restaurant__slider-wrapper swiper-wrapper"
                                    id="swiper-wrapper-fdf44377d14778fb"
                                    aria-live="off"
                                    style={{
                                      transitionDuration: "0ms",
                                      transform:
                                        "translate3d(-348px, 0px, 0px)",
                                      transitionDelay: "0ms",
                                    }}
                                  >
                                    <div
                                      className="restaurant__slide swiper-slide"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="1 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-1.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-prev"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="2 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-2.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-active"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="3 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-3.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide swiper-slide-next"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="4 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-4.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                    <div
                                      className="restaurant__slide swiper-slide"
                                      style={{ width: 168, marginRight: 6 }}
                                      role="group"
                                      aria-label="5 / 5"
                                    >
                                      <img
                                        src="/img/dashboard/slide-5.jpg"
                                        alt="slide"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className="restaurant__slider-arrow restaurant__slider-arrow-prev"
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Previous slide"
                                    aria-controls="swiper-wrapper-fdf44377d14778fb"
                                    aria-disabled="false"
                                  >
                                    <img
                                      src="/img/dashboard/arrow-prev.svg"
                                      alt="prev"
                                    />
                                  </div>
                                  <div
                                    className="restaurant__slider-arrow restaurant__slider-arrow-next"
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Next slide"
                                    aria-controls="swiper-wrapper-fdf44377d14778fb"
                                    aria-disabled="false"
                                  >
                                    <img
                                      src="/img/dashboard/arrow-next.svg"
                                      alt="next"
                                    />
                                  </div>
                                  <div className="restaurant__slider-paginations swiper-pagination-bullets swiper-pagination-horizontal">
                                    <span className="swiper-pagination-bullet" />
                                    <span className="swiper-pagination-bullet" />
                                    <span
                                      className="swiper-pagination-bullet swiper-pagination-bullet-active"
                                      aria-current="true"
                                    />
                                    <span className="swiper-pagination-bullet" />
                                    <span className="swiper-pagination-bullet" />
                                  </div>
                                  <span
                                    className="swiper-notification"
                                    aria-live="assertive"
                                    aria-atomic="true"
                                  />
                                </div>
                                <div className="restaurant__favorite checked view-text">
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
                                  <p className="restaurant__favorite-text">
                                    Added to favorites
                                  </p>
                                </div>
                              </div>
                              <div className="restaurant__top">
                                <div className="restaurant__texts">
                                  <h3 className="restaurant__name">
                                    Restaurant Name 2
                                  </h3>
                                  <div className="restaurant__tags">
                                    <div className="restaurant__tag">
                                      #Tagname no.1
                                    </div>
                                    <div className="restaurant__tag">
                                      #Tagname no.2
                                    </div>
                                    <div className="restaurant__tag">
                                      #Tagname no.3
                                    </div>
                                  </div>
                                  <div className="restaurant__address">
                                    <div className="restaurant__address-info">
                                      <img
                                        src="/img/dashboard/geo.svg"
                                        alt="geo"
                                      />
                                      <p>
                                        {props.place.formatted_address || "..."}{" "}
                                      </p>
                                      <span>–</span>
                                    </div>
                                    <div className="restaurant__address-gets">
                                      <Trans
                                        i18nKey="common:textGetThere"
                                        components={[
                                          <a
                                            className="restaurant__address-get"
                                            href="#"
                                          />,
                                          <div className="restaurant__address-distance" />,
                                        ]}
                                        values={{ distance: 835 }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="restaurant__checked">
                                  <div className="restaurant__checked-label restaurant__checked-label--grey">
                                    Opens at 19:00
                                  </div>
                                  <div className="restaurant__reviews">
                                    <div className="restaurant__reviews-balls">
                                      4.5
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
                                      (347)
                                    </div>
                                    <div className="restaurant__reviews-currency">
                                      {" "}
                                      · €€
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="restaurant__bottom">
                                <div className="restaurant__btns">
                                  <button
                                    type="button"
                                    className="restaurant__btn call"
                                  >
                                    <img
                                      src="/img/dashboard/call.svg"
                                      alt="call"
                                    />
                                    {t("buttonCall")}
                                  </button>
                                  <button
                                    type="button"
                                    className="restaurant__btn delivery disabled"
                                  >
                                    <img
                                      src="/img/dashboard/delivery.svg"
                                      alt="delivery"
                                    />
                                    {t("buttonDelivery")}
                                  </button>
                                  <button
                                    type="button"
                                    className="restaurant__btn pay-crypto disabled"
                                  >
                                    <img
                                      src="/img/dashboard/pay-crypto.svg"
                                      alt="pay-crypto"
                                    />
                                    {t("buttonPayInCrypto")}
                                  </button>
                                </div>
                                <a className="restaurant__more" href="#">
                                  See more
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="input__border" />
                <div className="restaurant-page__footer">
                  <button type="button" className="restaurant__btn call">
                    <img src="/img/dashboard/call.svg" alt="call" />
                    {t("buttonCall")}
                  </button>
                </div>
              </div>
              <aside className="dashboard__aside">
                <a className="dashboard__aside-link" href="#">
                  <img
                    src="/img/dashboard/aside-pic.png"
                    alt="aside pic reclame"
                  />
                </a>
                <div className="dashboard__aside-footer">
                  <p className="dashboard__aside-text">As an advertisement</p>
                  <a className="dashboard__aside-more" target="_blank" href="#">
                    {t("buttonLearnMore")}
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
