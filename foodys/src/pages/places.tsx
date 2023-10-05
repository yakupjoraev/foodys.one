import { Layout } from "~/components/Layout";
import { useSearchParams } from "next/navigation";
import { RestaurantCard } from "~/components/RestaurantCard";
import { api } from "~/utils/api";
import { Paginator } from "~/components/Paginator";
import { DashboardFilters, FilterState } from "~/components/DashboardFilters";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";

const DEFAULT_FILTER_STATE: FilterState = {
  establishment: "restaurant",
};

const FILTER_DELAY = 1000;

export default function Places() {
  const { t } = useTranslation("common");
  const [filterState, setFilterState] =
    useState<FilterState>(DEFAULT_FILTER_STATE);
  const debouncedFilterState = useDebounce(filterState, FILTER_DELAY);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";

  let pageInt = parseInt(page, 10);
  if (isNaN(pageInt)) {
    pageInt = 1;
  }

  const queryResponse = api.places.getPlaces.useQuery({
    query: query || "",
    page: pageInt,
    establishment: debouncedFilterState.establishment,
  });

  const handleChangeFilter = (nextFilterState: FilterState) => {
    setFilterState(nextFilterState);
  };

  const createNextPageUrl = (page: number) => {
    const nextUrlSerachParams = new URLSearchParams(searchParams);
    nextUrlSerachParams.set("page", page.toString());
    return "/places?" + nextUrlSerachParams.toString();
  };

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

                    return (
                      <RestaurantCard
                        name={placeListingItem.name}
                        formattedAddress={placeListingItem.formatted_address}
                        priceLevel={placeListingItem.price_level}
                        rating={placeListingItem.rating}
                        userRatingTotal={placeListingItem.user_rating_total}
                        placeId={placeListingItem.place_id}
                        photos={placeListingItem.photos}
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
    </Layout>
  );
}
