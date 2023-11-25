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
import { useGeolocation } from "@uidotdev/usehooks";
import { useClientFavorites } from "~/providers/favorites-provider";
import { DashboardFormSearch } from "~/components/DashboardFormSearch";
import { useRouter } from "next/router";

const DEFAULT_FILTER_STATE: FilterState = {
  hours: "anyTime",
  establishment: "restaurant",
  pageSize: 10,
  sortBy: "relevance",
};

const FILTER_DELAY = 1000;

export default function Places() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const session = useSession();
  const geolocation = useGeolocation();
  const [cryptoModelOpen, setCryptoModalOpen] = useState(false);
  const [filterState, setFilterState] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const debouncedFilterState = useDebounce(filterState, FILTER_DELAY);
  const searchParams = useSearchParams();
  const [clientFavorites, appendClientFavorite, removeClientFavorite] =
    useClientFavorites();
  const query = searchParams.get("query");
  const page = searchParams.get("page") ?? "1";

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

  const clientCoordinates: { lat: number; lng: number } | undefined =
    useMemo(() => {
      const lat = geolocation.latitude;
      const lng = geolocation.longitude;
      if (lat === null) {
        return undefined;
      }
      if (lng === null) {
        return undefined;
      }
      return { lat, lng };
    }, [geolocation]);

  const queryResponse = api.places.getPlaces.useQuery({
    query: query ?? "",
    page: pageInt,
    pageSize: debouncedFilterState.pageSize,
    rating,
    priceLevel,
    service,
    establishment: debouncedFilterState.establishment,
    hours: debouncedFilterState.hours,
    sortBy: debouncedFilterState.sortBy,
    clientCoordinates:
      debouncedFilterState.sortBy === "distance"
        ? clientCoordinates
        : undefined,
  });

  const handleChangeFilter = (nextFilterState: FilterState) => {
    setFilterState(nextFilterState);
  };

  const handleChangeFavorite = (
    placeId: string,
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => {
    if (favorite) {
      appendClientFavorite(placeId);
    } else {
      removeClientFavorite(placeId);
    }
    if (cb) {
      cb(favorite);
    }
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
            <div className="dashboard__form">
              <DashboardFormSearch />
              {queryResponse.data && query !== null && (
                <div className="dashboard__form-results">
                  <Trans
                    i18nKey="common:textNumberResults"
                    components={[
                      // eslint-disable-next-line react/jsx-key
                      <p className="dashboard__form-results-count" />,
                      // eslint-disable-next-line react/jsx-key
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
                clientCoordinates={clientCoordinates}
                onChange={handleChangeFilter}
              />
            </div>
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
                        favorite={clientFavorites.includes(
                          placeListingItem.place_id
                        )}
                        clientCoordinates={clientCoordinates}
                        placeCoordinates={placeListingItem.location}
                        authentificated={authentificated}
                        url={placeListingItem.url}
                        searchUrl={router.asPath}
                        openingPeriods={placeListingItem.opening_periods}
                        utcOffset={placeListingItem.utc_offset}
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
