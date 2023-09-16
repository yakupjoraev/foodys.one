import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { RestaurantCard } from "~/components/restaurant-card";

import { api } from "~/utils/api";

export default function Places() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const queryResponse = api.places.getPlaces.useQuery({ query: query || "" });

  return (
    <>
      <Head>
        <title>Foodys - Places</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page">
        <header className="header">
          <a className="logo" href="/">
            foodys.one
          </a>
          <div className="header__extra">
            <button className="login-btn btn hidden">Sign In</button>
            <button className="logout-btn btn hidden">Sign Out</button>
            <button className="register-btn btn hidden">Register</button>
          </div>
        </header>
        <div className="page__content listing-page">
          <div className="listing-page__primary listing">
            <div className="filter">
              <select className="filter__option">
                <option value="none">Establishment type</option>
              </select>
              <select className="filter__option">
                <option value="none">Service</option>
              </select>
              <select className="filter__option">
                <option value="none">Cuisine</option>
              </select>
              <select className="filter__option">
                <option value="none">Rating</option>
              </select>
              <select className="filter__option">
                <option value="none">Price</option>
              </select>
              <select className="filter__option">
                <option value="none">Hours</option>
              </select>
              <button className="filter__clear">× Clear</button>
            </div>
            <div className="restaurant-cards">
              {!queryResponse.data && "Loading..."}
              {!!queryResponse.data &&
                queryResponse.data.results.length === 0 &&
                "Not found"}
              {!!queryResponse.data &&
                queryResponse.data.results.length > 0 &&
                queryResponse.data.results.map((candidate) => {
                  let photo = "https://placekitten.com/200/200";
                  const candidatePhotos = candidate.photos;
                  if (candidatePhotos && candidatePhotos.length) {
                    const firstPhoto = candidatePhotos[0];
                    const photoReference = firstPhoto?.photo_reference;
                    if (photoReference) {
                      photo =
                        "/api/place-photo?photo_reference=" +
                        encodeURIComponent(photoReference);
                    }
                  }
                  return (
                    <RestaurantCard
                      id={candidate.place_id || ""}
                      name={candidate.name || ""}
                      photo={photo}
                      rating={candidate.rating || 0}
                      reviewsCount={candidate.user_ratings_total || 0}
                      address={candidate.formatted_address || ""}
                    />
                  );
                })}
            </div>
          </div>
          <div className="listing-page__secondary">
            <div className="position-display">
              <label
                className="position-display__label"
                htmlFor="position-display"
              >
                Position display
              </label>
              <select
                className="position-display__select"
                id="position-display"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
