import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { type FormEvent, useId } from "react";

export function DashboardFormSearch() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryId = useId();

  const handleQueryFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const queryInput = ev.currentTarget.elements.namedItem("query");
    if (!queryInput) {
      return;
    }

    if (queryInput instanceof HTMLInputElement) {
      const value = queryInput.value;
      if (value) {
        void router.push(`/places?query=${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <form
      className="dashboard__form-search search-wrapper"
      data-search-wrapper=""
      onSubmit={handleQueryFormSubmit}
    >
      <input
        className="dashboard-search"
        id={queryId}
        name="query"
        type="search"
        placeholder={t("textSupportSearchExample")}
        data-search-input=""
      />
      <button
        className="dashboard-search__btn"
        type="submit"
        aria-label={t("buttonSearch")}
      >
        <svg
          className="dashboard-search__btn-icon"
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.8478 18.9492L16.4287 16.5005M18.8478 10.3789C18.8478 11.5043 18.6288 12.6188 18.2033 13.6586C17.7778 14.6984 17.1541 15.6432 16.3679 16.439C15.5817 17.2348 14.6483 17.8661 13.6211 18.2968C12.5938 18.7275 11.4928 18.9492 10.3809 18.9492C9.26905 18.9492 8.16806 18.7275 7.14081 18.2968C6.11356 17.8661 5.18018 17.2348 4.39395 16.439C3.60773 15.6432 2.98407 14.6984 2.55857 13.6586C2.13306 12.6188 1.91406 11.5043 1.91406 10.3789C1.91406 8.1059 2.80611 5.92601 4.39395 4.31877C5.9818 2.71153 8.13538 1.80859 10.3809 1.80859C12.6265 1.80859 14.7801 2.71153 16.3679 4.31877C17.9558 5.92601 18.8478 8.1059 18.8478 10.3789Z"
            stroke="#313743"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="search__list">
        <a className="search__item" href="#">
          <img
            className="search__item-pic"
            src="/img/dashboard/slide-1.jpg"
            alt=""
          />
          <div className="search__item-info">
            <h4 className="search__item-label">Hank Burger Paris Archives</h4>
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
            <h4 className="search__item-label">Hank Burger Paris Archives</h4>
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
            <h4 className="search__item-label">Hank Burger Paris Archives</h4>
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
            <h4 className="search__item-label">Hank Burger Paris Archives</h4>
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
            <h4 className="search__item-label">Hank Burger Paris Archives</h4>
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
    </form>
  );
}
