import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FormEvent, useId } from "react";

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
        className="menu__item-search"
        id={queryId}
        name="query"
        type="search"
        placeholder={t("textSupportSearchExample")}
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
