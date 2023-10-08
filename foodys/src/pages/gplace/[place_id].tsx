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
                      </div>
                    </div>
                  </div>
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
