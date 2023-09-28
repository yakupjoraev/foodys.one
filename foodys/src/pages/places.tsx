import { Layout } from "~/components/Layout";
import { useSearchParams } from "next/navigation";
import { RestaurantCard } from "~/components/RestaurantCard";
import { api } from "~/utils/api";
import { Paginator } from "~/components/Paginator";

export default function Places() {
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
  });

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
                  <p className="dashboard__form-results-count">
                    {queryResponse.data.total} resultats{" "}
                  </p>
                  <p className="dashboard__form-results-name">pour “{query}”</p>
                </div>
              )}

              <div className="dashboard__filters">
                <div className="dashboard__filter dashboard__filter--square">
                  <p className="dashboard__filter-text">Establishment type</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--square">
                  <p className="dashboard__filter-text">Service</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--square">
                  <p className="dashboard__filter-text">Cuisine</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--square">
                  <p className="dashboard__filter-text">Rating</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--square">
                  <p className="dashboard__filter-text">Price</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--square">
                  <p className="dashboard__filter-text">Hours</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--clear">
                  <button type="button" className="dashboard__filter-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={8}
                      height={8}
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.8999 4.80916L7.09082 8.00008L7.79793 7.29297L4.60701 4.10205L7.7998 0.909256L7.0927 0.202148L3.8999 3.39494L0.707107 0.202148L0 0.909256L3.1928 4.10205L0.00187718 7.29297L0.708984 8.00008L3.8999 4.80916Z"
                        fill="#A8ADB8"
                      />
                    </svg>{" "}
                    Clear all
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--filters">
                  <img src="/img/dashboard/filters.svg" alt="filters" />
                  <p className="dashboard__filter-text">Filtres</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--sort">
                  <img src="/img/dashboard/sort.svg" alt="sort view" />
                  <p className="dashboard__filter-text">Sort by</p>
                  <button type="button" className="dashboard__filter-btn">
                    <img
                      src="/img/dashboard/filter-arrow.svg"
                      alt="filter arrow"
                    />
                  </button>
                </div>
                <div className="dashboard__filter dashboard__filter--position">
                  <p className="dashboard__filter-text">Position display</p>
                  <div className="dashboard__filter-positions">
                    <div className="dashboard__filter-position-selected">
                      10
                      <img
                        src="/img/dashboard/position-arrow.svg"
                        alt="position arrow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="dashboard__main">
              <div className="restaurants">
                {!queryResponse.data && "Loading..."}
                {!!queryResponse.data &&
                  queryResponse.data.results.length === 0 &&
                  "Not found"}
                {!!queryResponse.data &&
                  queryResponse.data.results.length > 0 &&
                  queryResponse.data.results.map((candidate) => {
                    if (!candidate.place_id) {
                      return null;
                    }

                    let photoUrl: string | undefined = undefined;
                    if (candidate.photos) {
                      const firstPhoto = candidate.photos[0];
                      photoUrl = firstPhoto
                        ? "https://foodys.freeblock.site/place-photos/cover_168x168/" +
                          firstPhoto.photo_reference
                        : undefined;
                    }

                    return (
                      <RestaurantCard
                        name={candidate.name || "???"}
                        address={candidate.formatted_address || "???"}
                        rating={candidate.rating || 0}
                        userRatingTotal={candidate.user_ratings_total || 0}
                        placeId={candidate.place_id}
                        photo={photoUrl}
                        key={candidate.place_id}
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
                    Learn more
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
