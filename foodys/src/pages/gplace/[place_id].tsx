import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
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
import {
  fetchGPlaceByPlaceId,
  isGplaceFavorite,
} from "~/server/api/utils/g-place";
import { RWebShare } from "react-web-share";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

enum Tab {
  Overview,
  OpeningHours,
  Reviews,
  Location,
}

const HASH_GALLERY = "#gallery";
const HASH_OVERVIEW = "#overview";
const HASH_OPENING_HOURS = "#opening-hours";
const HASH_REVIEWS = "#reviews";
const HASH_LOCATION = "#location";

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

  let favorite = false;
  const session = await getServerAuthSession(ctx);
  if (session) {
    const userId = session.user.id;
    favorite = await isGplaceFavorite(placeId, userId);
  }

  return { props: { place, favorite } };
}) satisfies GetServerSideProps<{ place: Place }>;

export default function Place(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t } = useTranslation("common");
  const [tab, setTab] = useState<Tab>(Tab.Overview);
  const [cryptoModalOpen, setCryptoModelOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [favorite, setFavorite] = useState(props.favorite);
  const { status: authStatus } = useSession();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [hash, setHash] = useHash();

  const favoriteGPlace = api.favorite.favoriteGPlace.useMutation();

  useEffect(() => {
    if (hash === HASH_GALLERY) {
      setGalleryOpen(true);
    } else {
      const tab = getTabByHash(hash);
      if (tab !== null) {
        openTab(tab);
      }
    }
  }, [hash]);

  useEffect(() => {
    const tab = getTabByHash(hash);
    if (tab !== null && tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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

  const handleOpenGalleryBtnClick = () => {
    setGalleryOpen(true);
  };

  const hanldeGalleryClose = () => {
    setGalleryOpen(false);
  };

  const handleCloseCryptoModal = () => {
    setCryptoModelOpen(false);
  };

  const handleFavoriteBtnClick = () => {
    const placeId = props.place.place_id;
    if (!placeId) {
      return;
    }
    if (authStatus !== "authenticated") {
      toast.error("Authentification required!");
      return;
    }

    const currentFavorite = favorite;
    const nextFavorite = !favorite;

    setFavorite(!favorite);

    favoriteGPlace
      .mutateAsync({
        placeId,
        favorite: nextFavorite,
      })
      .catch((error) => {
        console.error(error);
        setFavorite(currentFavorite);
        toast.error("Failed to toggle favorite!");
      });
  };

  const openTab = (nextTab: Tab, scroll?: boolean) => {
    switch (nextTab) {
      case Tab.Overview: {
        setTab(nextTab);
        setHash(HASH_OVERVIEW);
        break;
      }
      case Tab.Reviews: {
        setTab(nextTab);
        setHash(HASH_REVIEWS);
        break;
      }
      case Tab.OpeningHours: {
        setTab(nextTab);
        setHash(HASH_OPENING_HOURS);
        break;
      }
      case Tab.Location: {
        setTab(nextTab);
        setHash(HASH_LOCATION);
        break;
      }
      default: {
        return;
      }
    }
    if (scroll && tabsRef.current !== null) {
      tabsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const lastPreviewIndex = previewPhotos ? previewPhotos.length - 1 : -1;

  const openingHours = props.place.opening_hours?.periods;

  const shareData: ShareData = useMemo(() => {
    let title = "Foodys";
    if (props.place.name) {
      title += " - " + props.place.name;
    }
    return {
      title,
      text: props.place.editorial_summary?.overview,
    };
  }, [props.place]);

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
                    {props.place.name ?? "..."}
                  </h1>
                  <div className="restaurant-page__instruments">
                    <div className="restaurant-page__instrument">
                      <img src="/img/restaurant-page/review.svg" alt="review" />
                      <span>{t("buttonReview")}</span>
                    </div>

                    <div
                      className={classNames("restaurant-page__instrument", {
                        liked: favorite,
                      })}
                      onClick={handleFavoriteBtnClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                      >
                        <rect
                          width="19"
                          height="19"
                          rx="9.5"
                          fill="#A8ADB8"
                          fill-opacity="0.1"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.28155 6.13286C5.74335 5.63389 6.3696 5.35359 7.02259 5.35359C7.67557 5.35359 8.30182 5.63389 8.76362 6.13286L9.48515 6.91204L10.2067 6.13286C10.4338 5.87865 10.7056 5.67589 11.006 5.5364C11.3065 5.39691 11.6296 5.32348 11.9566 5.32041C12.2836 5.31734 12.6078 5.38468 12.9105 5.51851C13.2131 5.65234 13.4881 5.84997 13.7193 6.09987C13.9505 6.34977 14.1333 6.64694 14.2572 6.97404C14.381 7.30114 14.4433 7.65162 14.4405 8.00502C14.4376 8.35842 14.3697 8.70767 14.2406 9.0324C14.1116 9.35712 13.924 9.65081 13.6888 9.89633L9.48515 14.4403L5.28155 9.89633C4.81989 9.39721 4.56055 8.72035 4.56055 8.0146C4.56055 7.30884 4.81989 6.63198 5.28155 6.13286Z"
                          fill="#A8ADB8"
                        />
                      </svg>
                      <span>{t("buttonSave")}</span>
                    </div>

                    <RWebShare data={shareData}>
                      <div
                        className="restaurant-page__instrument"
                        role="button"
                      >
                        <img src="/img/restaurant-page/share.svg" alt="share" />
                        <span>{t("buttonShare")}</span>
                      </div>
                    </RWebShare>
                  </div>
                  <div className="restaurant-page__address">
                    <div className="restaurant__address">
                      <a
                        className="restaurant__address-info"
                        href={HASH_LOCATION}
                        onClick={(ev) => {
                          ev.preventDefault();
                          openTab(Tab.Location, true);
                        }}
                      >
                        <img src="/img/dashboard/geo.svg" alt="geo" />
                        <p>{props.place?.formatted_address ?? "..."} </p>
                        <span>–</span>
                      </a>
                      <div className="restaurant__address-gets">
                        <Trans
                          i18nKey="common:textGetThere"
                          components={[
                            // eslint-disable-next-line react/jsx-key
                            <a className="restaurant__address-get" href="#" />,
                            // eslint-disable-next-line react/jsx-key
                            <div className="restaurant__address-distance" />,
                          ]}
                          values={{ distance: 835 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="restaurant-page__reviews">
                    <div
                      className="restaurant__reviews"
                      onClick={() => openTab(Tab.Reviews, true)}
                    >
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
                    <a
                      className="restaurant-page__others-open"
                      href={HASH_OPENING_HOURS}
                      onClick={(ev) => {
                        ev.preventDefault();
                        openTab(Tab.OpeningHours, true);
                      }}
                    >
                      {t("textOpenNow")}
                    </a>
                    {openingHours && openingHours.length > 0 && (
                      <button
                        className="restaurant-page__others-link"
                        type="button"
                        onClick={() => openTab(Tab.OpeningHours, true)}
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
                <div className="tabs" ref={tabsRef}>
                  <div className="tabs__header">
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Overview,
                      })}
                      onClick={() => openTab(Tab.Overview)}
                    >
                      {t("titleOverview")}
                    </div>
                    {openingHours && openingHours.length > 0 && (
                      <div
                        className={classNames("tabs__header-item", {
                          active: tab === Tab.OpeningHours,
                        })}
                        onClick={() => openTab(Tab.OpeningHours)}
                      >
                        {t("titleOpeningHours")}
                      </div>
                    )}
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Reviews,
                      })}
                      onClick={() => openTab(Tab.Reviews)}
                    >
                      {t("titleReviews")}
                    </div>
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Location,
                      })}
                      role="button"
                      onClick={() => openTab(Tab.Location)}
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

                    {/*---------------------- Opening hours ---------------------*/}
                    {openingHours?.length && (
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

function getTabByHash(hash: string): Tab | null {
  switch (hash) {
    case HASH_OVERVIEW: {
      return Tab.Overview;
    }
    case HASH_OPENING_HOURS: {
      return Tab.OpeningHours;
    }
    case HASH_REVIEWS: {
      return Tab.Reviews;
    }
    case HASH_LOCATION: {
      return Tab.Location;
    }
    default: {
      return null;
    }
  }
}

function getInitialHash() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.hash;
}

function useHash(): [string, (hash: string) => void] {
  const [hash, setHash] = useState<string>(getInitialHash);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleHashChange = (ev: HashChangeEvent) => {
      const newURL = new URL(ev.newURL);
      const nextHash = newURL.hash;
      setHash(nextHash);
    };

    setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const updateHash = (nextHash: string) => {
    if (typeof window === "undefined") {
      return;
    }
    if (!/^#[a-z0-9_\-]+$/.test(nextHash)) {
      return;
    }
    setHash(nextHash);
    history.replaceState(undefined, "", nextHash);
  };

  return [hash, updateHash];
}
