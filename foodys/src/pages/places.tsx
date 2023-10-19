import { Layout } from "~/components/Layout";
import { useSearchParams } from "next/navigation";
import { RestaurantCard } from "~/components/RestaurantCard";
import { api } from "~/utils/api";
import { Paginator } from "~/components/Paginator";
import { DashboardFilters, FilterState } from "~/components/DashboardFilters";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useSession } from "next-auth/react";
import { CryptoModal } from "~/components/CryptoModal";

const DEFAULT_FILTER_STATE: FilterState = {
  establishment: "restaurant",
  pageSize: 10,
};

const FILTER_DELAY = 1000;

const DEFAULT_OPTIMISTIC_FAVORITE: string[] = [];

export default function Places() {
  const { t } = useTranslation("common");
  const session = useSession();
  const [cryptoModelOpen, setCryptoModalOpen] = useState(false);
  const [filterState, setFilterState] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const debouncedFilterState = useDebounce(filterState, FILTER_DELAY);
  const searchParams = useSearchParams();
  const [optimisticFavorite, setOptimisticFavorite] = useState(
    DEFAULT_OPTIMISTIC_FAVORITE
  );
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";

  let pageInt = parseInt(page, 10);
  if (isNaN(pageInt)) {
    pageInt = 1;
  }

  const rating: (1 | 2 | 3 | 4 | 5)[] = useMemo(() => {
    const rating: (1 | 2 | 3 | 4 | 5)[] = [];
    if (debouncedFilterState.rating1) {
      rating.push(1);
    }
    if (debouncedFilterState.rating2) {
      rating.push(2);
    }
    if (debouncedFilterState.rating3) {
      rating.push(3);
    }
    if (debouncedFilterState.rating4) {
      rating.push(4);
    }
    if (debouncedFilterState.rating5) {
      rating.push(5);
    }
    return rating;
  }, [debouncedFilterState]);

  const priceLevel: (1 | 2 | 3 | 4)[] = useMemo(() => {
    const priceLevel: (1 | 2 | 3 | 4)[] = [];
    if (debouncedFilterState.priceLevel1) {
      priceLevel.push(1);
    }
    if (debouncedFilterState.priceLevel2) {
      priceLevel.push(2);
    }
    if (debouncedFilterState.priceLevel3) {
      priceLevel.push(3);
    }
    if (debouncedFilterState.priceLevel4) {
      priceLevel.push(4);
    }

    return priceLevel;
  }, [debouncedFilterState]);

  const service: ("delivery" | "dine_in" | "takeout" | "curbside_pickup")[] =
    useMemo(() => {
      const service: (
        | "delivery"
        | "dine_in"
        | "takeout"
        | "curbside_pickup"
      )[] = [];
      if (debouncedFilterState.serviceDelivery) {
        service.push("delivery");
      }
      if (debouncedFilterState.serviceDineIn) {
        service.push("dine_in");
      }
      if (debouncedFilterState.serviceTakeOut) {
        service.push("takeout");
      }
      if (debouncedFilterState.servicePickUp) {
        service.push("curbside_pickup");
      }

      return service;
    }, [debouncedFilterState]);

  const queryResponse = api.places.getPlaces.useQuery({
    query: query || "",
    page: pageInt,
    pageSize: debouncedFilterState.pageSize,
    rating,
    priceLevel,
    service,
    establishment: debouncedFilterState.establishment,
  });

  const favoriteGPlace = api.favorite.favoriteGPlace.useMutation();

  useEffect(() => {
    if (!queryResponse.data) {
      setOptimisticFavorite(DEFAULT_OPTIMISTIC_FAVORITE);
      return;
    }
    const nextOptimisticFavorite: string[] = [];
    for (const place of queryResponse.data.results) {
      if (place.place_id && place.favorite) {
        nextOptimisticFavorite.push(place.place_id);
      }
    }
    if (nextOptimisticFavorite.length) {
      setOptimisticFavorite(nextOptimisticFavorite);
    } else {
      setOptimisticFavorite(DEFAULT_OPTIMISTIC_FAVORITE);
    }
  }, [queryResponse.data]);

  const handleChangeFilter = (nextFilterState: FilterState) => {
    setFilterState(nextFilterState);
  };

  const handleChangeFavorite = (
    placeId: string,
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => {
    if (favorite) {
      if (!optimisticFavorite.includes(placeId)) {
        setOptimisticFavorite([...optimisticFavorite, placeId]);
      }
    } else {
      const indexToRemove = optimisticFavorite.indexOf(placeId);
      if (indexToRemove !== -1) {
        setOptimisticFavorite([
          ...optimisticFavorite.slice(0, indexToRemove),
          ...optimisticFavorite.slice(indexToRemove + 1),
        ]);
      }
    }
    if (cb) {
      cb(favorite);
    }
    favoriteGPlace.mutate({
      placeId,
      favorite,
    });
  };

  const handlePayInCryptoBtnClick = () => {
    setCryptoModalOpen(true);
  };

  const handleCryptoModalClose = () => {
    setCryptoModalOpen(false);
  };

  const createNextPageUrl = (page: number) => {
    const nextUrlSerachParams = new URLSearchParams(searchParams);
    nextUrlSerachParams.set("page", page.toString());
    return "/places?" + nextUrlSerachParams.toString();
  };

  const authentificated = session.status === "authenticated";

  return (
    <Layout title="Foodys - Search result">
      <main className="main">
        <div className="dashboard">
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
              {queryResponse.data && query !== null && (
                <div className="dashboard__form-results">
                  <Trans
                    i18nKey="common:textNumberResults"
                    components={[
                      <p className="dashboard__form-results-count" />,
                      <p className="dashboard__form-results-name" />,
                    ]}
                    values={{
                      count: queryResponse.data.total,
                      query: query,
                    }}
                  />
                </div>
              )}
              <DashboardFilters
                resultsTotal={queryResponse.data?.total}
                filter={filterState}
                onChange={handleChangeFilter}
              />
            </form>
            <div className="dashboard__main">
              <div className="restaurants">
                {!queryResponse.data && "Loading..."}
                {!!queryResponse.data &&
                  queryResponse.data.results.length === 0 &&
                  "Not found"}
                {!!queryResponse.data &&
                  queryResponse.data.results.length > 0 &&
                  queryResponse.data.results.map((placeListingItem) => {
                    if (!placeListingItem.place_id) {
                      return null;
                    }

                    const tags: string[] = [];
                    if (placeListingItem.dine_in) {
                      tags.push(t("valueServiceDineIn"));
                    }
                    if (placeListingItem.takeout) {
                      tags.push(t("valueServiceTakeOut"));
                    }
                    if (placeListingItem.delivery) {
                      tags.push(t("valueServiceDelivery"));
                    }
                    if (placeListingItem.curbside_pickup) {
                      tags.push(t("valueServicePickUp"));
                    }

                    return (
                      <RestaurantCard
                        name={placeListingItem.name}
                        formattedAddress={placeListingItem.formatted_address}
                        priceLevel={placeListingItem.price_level}
                        rating={placeListingItem.rating}
                        userRatingTotal={placeListingItem.user_rating_total}
                        placeId={placeListingItem.place_id}
                        photos={placeListingItem.photos}
                        tags={tags}
                        favorite={optimisticFavorite.includes(
                          placeListingItem.place_id
                        )}
                        authentificated={authentificated}
                        onChangeFavorite={handleChangeFavorite}
                        onPayInCryptoBtnClick={handlePayInCryptoBtnClick}
                        key={placeListingItem.place_id}
                      />
                    );
                  })}
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
            {queryResponse.data && (
              <Paginator
                page={queryResponse.data.page}
                total={queryResponse.data.pages}
                createUrl={createNextPageUrl}
              />
            )}
          </div>
        </div>
      </main>
      <CryptoModal open={cryptoModelOpen} onClose={handleCryptoModalClose} />
    </Layout>
  );
}
