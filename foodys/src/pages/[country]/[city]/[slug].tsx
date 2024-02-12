import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Layout } from "~/components/Layout";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { OpeningHoursTab } from "~/components/OpeningHoursTab";
import { OverviewTab } from "~/components/OverviewTab";
import { GApiPlace } from "~/server/gm-client/types";
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
  createPlaceResourceByGoogleId,
  isGPlaceFavorite,
} from "~/server/api/utils/g-place";
import { RWebShare } from "react-web-share";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { db } from "~/server/db";
import { ServicePhone } from "~/components/ServicePhone";
import { useHash } from "~/hooks/use-hash";
import { env } from "~/env.mjs";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { GetThere } from "~/components/GetThere";
import {
  useGoogleOpeningHours,
  GoogleOpeningHours,
} from "~/hooks/use-google-opening-hours";
import { Translate } from "next-translate";
import Link from "next/link";
import { useClientFavorites } from "~/providers/favorites-provider";
import { useClientBlockedReviews } from "~/providers/blocked-reviews-provider";
import { OwnerAnswerResource } from "~/server/api/utils/g-place-review-answer";
import { useRouter } from "next/router";
import { DashboardFormSearch } from "~/components/DashboardFormSearch";
import { useSharedGeolocation } from "~/providers/shared-geolocation-provider";
import { useClientLikes } from "~/providers/likes-provider";
import { CookiesModalContainer } from "~/containers/CookiesModalContainer";
import { useServicePhone } from "~/hooks/use-service-phone";
import Head from "next/head";
import { HreflangMeta } from "~/components/HreflangMeta";

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
  const country = ctx.params?.country;
  const city = ctx.params?.city;
  const slug = ctx.params?.slug;
  if (
    typeof country !== "string" ||
    typeof city !== "string" ||
    typeof slug !== "string"
  ) {
    return {
      notFound: true,
    };
  }

  const placeUrl = await db.placeUrl.findFirst({
    where: {
      url: "/" + country + "/" + city + "/" + slug,
    },
  });
  if (placeUrl === null) {
    return {
      notFound: true,
    };
  }
  const placeId = placeUrl.g_place_id;
  if (placeId === null) {
    return {
      notFound: true,
    };
  }

  const place = await createPlaceResourceByGoogleId(placeId);
  if (place === null) {
    return {
      notFound: true,
    };
  }

  let favorite = false;
  const session = await getServerAuthSession(ctx);
  if (session) {
    const userId = session.user.id;
    favorite = await isGPlaceFavorite(placeId, userId);
  }

  const absolutePlaceUrl = new URL(placeUrl.url, env.NEXT_PUBLIC_SITE_URL);

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session,
      db,
    },
    transformer: superjson,
  });
  await ssg.reviews.getGPlaceReviews.prefetch({ gPlaceId: place.id });

  let hasTrackedPhone = false;
  if (place.international_phone_number && place.address_components) {
    const countryComponent = place.address_components.find((ac) =>
      ac.types.includes("country")
    );
    if (
      countryComponent !== undefined &&
      countryComponent.short_name === "FR"
    ) {
      hasTrackedPhone = true;
    }
  }

  return {
    props: {
      place,
      favorite,
      hasTrackedPhone,
      placeUrl: absolutePlaceUrl.toString(),
      trpcState: ssg.dehydrate(),
    },
  };
}) satisfies GetServerSideProps;

export default function Place(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(Tab.Overview);
  const [cryptoModalOpen, setCryptoModelOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [servicePhone, servicePhoneLoading, fetchServicePhone] =
    useServicePhone(props.place.place_id);
  const { status: authStatus, data: sessionData } = useSession();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [hash, setHash] = useHash();
  const geolocation = useSharedGeolocation();
  const [favorites, appendFavorite, removeFavorite] = useClientFavorites();
  const [blockedReviews, blockReview] = useClientBlockedReviews();
  const googleOpeningHours = useGoogleOpeningHours(
    props.place.opening_hours?.periods,
    props.place.utc_offset
  );
  const [likes, like, unlike] = useClientLikes();
  const reviewsQuery = api.reviews.getGPlaceReviews.useQuery({
    gPlaceId: props.place.id,
  });

  const utils = api.useContext();
  const createGPlaceReviewAnswer =
    api.reviews.createGPlaceReviewAnswer.useMutation({
      async onMutate(opts) {
        await utils.reviews.getGPlaceReviews.cancel();

        const prevData = utils.reviews.getGPlaceReviews.getData();

        utils.reviews.getGPlaceReviews.setData(
          { gPlaceId: props.place.id },
          (old) => {
            if (old === undefined) {
              return old;
            }
            const reviewIndex = old.findIndex(
              (review) => review.id === opts.gPlaceReviewId
            );
            if (reviewIndex === -1) {
              return old;
            }
            const target = old[reviewIndex];
            if (target === undefined) {
              return old;
            }
            const updatedReview = { ...target };
            const newAnswer: OwnerAnswerResource = {
              id: Math.random().toString(),
              ownerName: sessionData?.user.name ?? "",
              text: opts.text,
              time: Math.floor(Date.now() / 1000),
            };

            if (updatedReview.ownerAnswers) {
              updatedReview.ownerAnswers = [
                ...updatedReview.ownerAnswers,
                newAnswer,
              ];
            } else {
              updatedReview.ownerAnswers = [newAnswer];
            }

            return [
              ...old.slice(0, reviewIndex),
              updatedReview,
              ...old.slice(reviewIndex + 1),
            ];
          }
        );

        return { prevData };
      },
      onError(error, opts, ctx) {
        console.error(error);

        toast(t("toastAnswerFailed"));

        if (ctx) {
          utils.reviews.getGPlaceReviews.setData(
            { gPlaceId: props.place.id },
            ctx.prevData
          );
        }
      },
      onSettled() {
        void utils.reviews.getGPlaceReviews.invalidate();
      },
    });

  useEffect(() => {
    if (hash === HASH_GALLERY) {
      setGalleryOpen(true);
      return;
    }
    const tab = getTabByHash(hash);
    if (tab !== null) {
      openTab(tab);
      return;
    }
    if (hash.startsWith("#rv")) {
      setTab(Tab.Reviews);
      if (tabsRef.current) {
        tabsRef.current.scrollIntoView({ behavior: "smooth" });
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

  const favorite = useMemo(
    () =>
      props.place.place_id ? favorites.includes(props.place.place_id) : false,
    [props.place.place_id, favorites]
  );

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
    if (favorite) {
      removeFavorite(placeId);
    } else {
      appendFavorite(placeId);
    }
  };

  const handleCallBtnClick = () => {
    if (servicePhoneLoading) {
      return;
    }
    if (servicePhone) {
      return;
    }
    fetchServicePhone();
  };

  const handleUpdateLike = (reviewId: string, liked: boolean) => {
    if (liked) {
      like(reviewId);
    } else {
      unlike(reviewId);
    }
  };

  const handleBlockReview = (reviewId: string) => {
    blockReview(reviewId);
  };

  const handleAnswerReview = (
    reviewId: string,
    text: string,
    cb: (success: boolean) => void
  ) => {
    if (authStatus !== "authenticated") {
      toast.error(t("toastAuthRequired"));
      cb(false);
      return;
    }
    void createGPlaceReviewAnswer
      .mutateAsync({ gPlaceReviewId: reviewId, text })
      .then(
        () => {
          cb(true);
        },
        () => {
          cb(false);
        }
      );
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

  const placeCoordinates: { lat: number; lng: number } | null =
    props.place.geometry?.location ?? null;
  const clientCoordinates: { lat: number; lng: number } | null = useMemo(() => {
    const lat = geolocation.latitude;
    const lng = geolocation.longitude;
    if (lat === null) {
      return null;
    }
    if (lng === null) {
      return null;
    }
    return { lat, lng };
  }, [geolocation]);

  const reviews = useMemo(() => {
    if (!props.place.reviews) {
      return undefined;
    }
    if (!reviewsQuery.data) {
      return undefined;
    }
    const blockedReviewsSet = new Set(blockedReviews);
    const visible = reviewsQuery.data.filter((review) => {
      return !blockedReviewsSet.has(review.id);
    });

    const withLikes = visible.map((review) => {
      const nextReview = { ...review };
      const liked = likes.includes(review.id);
      if (liked) {
        nextReview.liked = true;
        nextReview.likes = 1;
      } else {
        nextReview.liked = false;
        nextReview.likes = 0;
      }
      return nextReview;
    });

    return withLikes;
  }, [likes, blockedReviews, reviewsQuery.data]);

  const prevResultsUrl: string | null = useMemo(() => {
    const { search } = router.query;
    return typeof search === "string" ? search : null;
  }, [router.query]);

  const city = useMemo(() => {
    if (props.place.address_components) {
      const cityAddressComponent = props.place.address_components.find((ac) => {
        return ac.types.includes("locality");
      });
      if (cityAddressComponent) {
        return cityAddressComponent.long_name;
      }
    }
    return "";
  }, [props.place]);

  const restaurantName = props.place.name ?? "";

  return (
    <Layout
      title={t("pageTitlePlace", { restaurant_name: restaurantName, city })}
      description={t("pageDescriptionPlace", {
        restaurant_name: restaurantName,
        city,
      })}
    >
      <Head>
        <meta name="robots" content="index, follow" />
      </Head>
      <HreflangMeta />
      <main className="main">
        <div className="dashboard restaurant-page">
          <div className="container">
            <div className="dashboard__form">
              <DashboardFormSearch />
            </div>
            <div className="dashboard__main">
              <div className="restaurant-page__inner">
                {prevResultsUrl !== null && (
                  <Link
                    className="restaurant-page__nav-back"
                    href={prevResultsUrl}
                  >
                    {"❮ " + t("textBackToSearch")}
                  </Link>
                )}
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
                            alt={
                              props.place.name
                                ? props.place.name +
                                  " image-" +
                                  photo.photo_reference.slice(-4)
                                : ""
                            }
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
                    {`${restaurantName}, ${city}`}
                  </h1>
                  <div className="restaurant-page__instruments">
                    <Link
                      className="restaurant-page__instrument"
                      href={props.placeUrl + "/review"}
                    >
                      <img
                        src="/img/restaurant-page/review-gray.svg"
                        alt="review"
                      />
                      <span>{t("buttonReview")}</span>
                    </Link>

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
                          fillOpacity="0.1"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
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
                        {clientCoordinates && placeCoordinates && (
                          <span>–</span>
                        )}
                      </a>
                      {clientCoordinates && placeCoordinates && (
                        <GetThere
                          from={clientCoordinates}
                          to={placeCoordinates}
                          googlePlaceId={props.place.place_id}
                        />
                      )}
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
                      {props.hasTrackedPhone && (
                        <button
                          type="button"
                          className="restaurant__btn call"
                          onClick={handleCallBtnClick}
                        >
                          <img src="/img/dashboard/call.svg" alt="call" />
                          {t("buttonCall")}
                        </button>
                      )}
                      <button
                        type="button"
                        className="restaurant__btn restaurant__btn--disabled delivery"
                        disabled
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
                    {googleOpeningHours && (
                      <a
                        className={classNames("restaurant-page__others-open", {
                          "restaurant-page__others-open--closed":
                            !googleOpeningHours.isOpen,
                        })}
                        href={HASH_OPENING_HOURS}
                        onClick={(ev) => {
                          ev.preventDefault();
                          openTab(Tab.OpeningHours, true);
                        }}
                      >
                        {renderOpeningLabel(googleOpeningHours, t)}
                      </a>
                    )}

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
                  {servicePhone && (
                    <div className="service-phone-group restaurant-page__service-phone">
                      <ServicePhone phone={servicePhone} />
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
                </div>
                <div className="input__border" />
                {/* Tabs */}
                <div className="tabs" ref={tabsRef}>
                  <div className="tabs__header">
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Overview,
                        "tabs__header-item--wide": lang === "fr",
                      })}
                      onClick={() => openTab(Tab.Overview)}
                    >
                      {t("titleOverview")}
                    </div>
                    {openingHours && openingHours.length > 0 && (
                      <div
                        className={classNames("tabs__header-item", {
                          active: tab === Tab.OpeningHours,
                          "tabs__header-item--wide": lang === "fr",
                        })}
                        onClick={() => openTab(Tab.OpeningHours)}
                      >
                        {t("titleOpeningHours")}
                      </div>
                    )}
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Reviews,
                        "tabs__header-item--wide": lang === "fr",
                      })}
                      onClick={() => openTab(Tab.Reviews)}
                    >
                      {t("titleReviews")}
                    </div>
                    <div
                      className={classNames("tabs__header-item", {
                        active: tab === Tab.Location,
                        "tabs__header-item--wide": lang === "fr",
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
                      reviews={reviews}
                      placeUrl={props.placeUrl}
                      show={tab === Tab.Reviews}
                      authentificated={authStatus === "authenticated"}
                      onUpdateLike={handleUpdateLike}
                      onBlockReview={handleBlockReview}
                      onAnswerReview={handleAnswerReview}
                    />

                    {/*---------------------- Location ---------------------*/}
                    <LocationTab
                      show={tab === Tab.Location}
                      place={props.place}
                      from={clientCoordinates ?? undefined}
                      to={placeCoordinates ?? undefined}
                      hasTrackedPhone={props.hasTrackedPhone}
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
      <CookiesModalContainer />
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
