import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";
import { Layout } from "~/components/Layout";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { OpeningHoursTab } from "~/components/OpeningHoursTab";
import { OverviewTab } from "~/components/OverviewTab";
import { Place } from "~/server/gm-client/types";
import { ReviewsTab } from "~/components/ReviewsTab";
import {
  STAR_HALF,
  STAR_WHOLE,
  createRatingStarsModel,
} from "~/utils/rating-stars-model";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { CryptoModal } from "~/components/CryptoModal";
import { LocationTab } from "~/components/LocationTab";
import { fetchGPlaceByPlaceId } from "~/server/api/utils/g-place";

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
  const place = await fetchGPlaceByPlaceId(placeId);
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
  const [cryptoModalOpen, setCryptoModelOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const previewPhotos = useMemo(() => {
    if (!props.place.photos) {
      return undefined;
    }
    if (props.place.photos.length === 0) {
      return [];
    }
    return props.place.photos.slice(0, 4);
  }, [props.place]);

  const galleryPhotos = useMemo(() => {
    if (props.place.photos === undefined) {
      return [];
    }
    return props.place.photos;
  }, [props.place]);

  const handleSeeOpeningHoursBtnClick = () => {
    setTab(Tab.OpeningHours);
  };

  const handleOpenGalleryBtnClick = () => {
    setGalleryOpen(true);
  };

  const hanldeGalleryClose = () => {
    setGalleryOpen(false);
  };

  const handleCloseCryptoModal = () => {
    setCryptoModelOpen(false);
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
                            <button
                              className="restaurant-page__pic-all"
                              type="button"
                              onClick={handleOpenGalleryBtnClick}
                            >
                              {t("buttonViewAll")}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {galleryPhotos.length > 0 && (
                  <Lightbox
                    open={galleryOpen}
                    close={hanldeGalleryClose}
                    plugins={[Thumbnails]}
                    slides={galleryPhotos.map((photo) => {
                      return {
                        src:
                          "https://foodys.freeblock.site/place-photos/orig/" +
                          photo.photo_reference,
                      };
                    })}
                  />
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
                      {props.place.rating !== undefined && (
                        <div className="restaurant__reviews-balls">
                          {props.place.rating}
                        </div>
                      )}
                      {props.place.rating !== undefined && (
                        <div className="restaurant__reviews-stars">
                          {renderStars(props.place.rating)}
                        </div>
                      )}
                      {props.place.user_ratings_total !== undefined && (
                        <div className="restaurant__reviews-count">
                          ({props.place.user_ratings_total})
                        </div>
                      )}
                      {props.place.price_level !== undefined && (
                        <div className="restaurant__reviews-currency">
                          {" · " +
                            renderPriceLevelLabel(props.place.price_level)}
                        </div>
                      )}
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
                        onClick={() => setCryptoModelOpen(true)}
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
                    <LocationTab
                      show={tab === Tab.Location}
                      place={props.place}
                    />
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
      <CryptoModal open={cryptoModalOpen} onClose={handleCloseCryptoModal} />
    </Layout>
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
