import { useId, useState } from "react";
import { DashboardFilter } from "../DashboardFilter";
import { DashboardFilterCheckbox } from "../DashboardFilterCheckbox";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { DashboardFilterRadio } from "../DashboradFilterRadio";
import { procedureTypes } from "@trpc/server";
import { DashboardFilterPageSize } from "../DashboardFilterPageSize";

export interface FilterState {
  serviceDineIn?: boolean;
  serviceTakeOut?: boolean;
  serviceDelivery?: boolean;
  servicePickUp?: boolean;
  cuisineItalian?: boolean;
  cuisineSpanish?: boolean;
  cuisineFrench?: boolean;
  cuisineGeorgian?: boolean;
  cuisineChinese?: boolean;
  cuisineJapanese?: boolean;
  rating1?: boolean;
  rating2?: boolean;
  rating3?: boolean;
  rating4?: boolean;
  rating5?: boolean;
  priceLevel1?: boolean;
  priceLevel2?: boolean;
  priceLevel3?: boolean;
  priceLevel4?: boolean;
  hours1?: boolean;
  hours2?: boolean;
  hours3?: boolean;
  hours4?: boolean;
  sortBy1?: boolean;
  sortBy2?: boolean;
  sortBy3?: boolean;
  establishment: "restaurant" | "coffeeAndTea" | "bar";
  pageSize: 10 | 20 | 30;
}

const DEFAULT_FILTER_STATE: FilterState = {
  establishment: "restaurant",
  pageSize: 10,
};

export interface DashboardFiltersProps {
  resultsTotal?: number;
  filter: FilterState;
  onChange: (filterState: FilterState) => void;
}

export function DashboardFilters(props: DashboardFiltersProps) {
  const { t } = useTranslation("common");
  const establishmentId = useId();
  const [mobileFiltersOpened, setMobileFiltersOpened] = useState(false);

  const registerFilterCheckbox = (
    key: Exclude<keyof FilterState, "establishment" | "pageSize">
  ) => {
    const handleChange = (checked: boolean) => {
      const nextFilterState = { ...props.filter };
      nextFilterState[key] = checked;
      props.onChange(nextFilterState);
    };
    return {
      checked: props.filter[key],
      onChange: handleChange,
    };
  };

  const registerFilterRadio = <T extends "establishment">(
    key: T,
    value: FilterState[T],
    form?: string
  ) => {
    const handleChange = (value: FilterState[T]) => {
      const nextFilterState = { ...props.filter };
      nextFilterState[key] = value;
      props.onChange(nextFilterState);
    };

    return {
      form,
      value,
      checked: props.filter[key] === value,
      onChange: handleChange,
    };
  };

  const handleClearAllBtnClick = () => {
    props.onChange(DEFAULT_FILTER_STATE);
  };

  const handlePageSizeChange = (value: 10 | 20 | 30) => {
    const nextFilterState = { ...props.filter };
    nextFilterState.pageSize = value;
    props.onChange(nextFilterState);
  };

  return (
    <div
      className={classNames("dashboard__filters", {
        active: mobileFiltersOpened,
      })}
    >
      <div className="dashboard__filters-header">
        <p className="dashboard__filters-header-label">Filters</p>
        <button
          type="button"
          className="dashboard__filters-header-close"
          data-mobile-filters-close=""
          onClick={() => void setMobileFiltersOpened(false)}
        >
          <svg
            width={19}
            height={20}
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1.09187"
              y1="1.67766"
              x2="18.0919"
              y2="18.6777"
              stroke="#313743"
              strokeWidth={2}
            />
            <line
              x1="17.7071"
              y1="1.70711"
              x2="0.707106"
              y2="18.7071"
              stroke="#313743"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>

      <DashboardFilter
        className="dashboard__filter--square"
        label={t("titleEstablishmentType")}
      >
        <DashboardFilterRadio
          label={t("valueEstablishmentTypeRestaurant")}
          name={establishmentId}
          {...registerFilterRadio("establishment", "restaurant")}
        />
        <DashboardFilterRadio
          label={t("valueEstablishmentTypeCoffeeTea")}
          name={establishmentId}
          {...registerFilterRadio("establishment", "coffeeAndTea")}
        />
        <DashboardFilterRadio
          label={t("valueEstablishmentTypeBar")}
          name={establishmentId}
          {...registerFilterRadio("establishment", "bar")}
        />
      </DashboardFilter>

      <DashboardFilter
        className="dashboard__filter--square"
        label={t("titleService")}
      >
        <DashboardFilterCheckbox
          label={t("valueServiceDineIn")}
          {...registerFilterCheckbox("serviceDineIn")}
        />
        <DashboardFilterCheckbox
          label={t("valueServiceTakeOut")}
          {...registerFilterCheckbox("serviceTakeOut")}
        />
        <DashboardFilterCheckbox
          label={t("valueServiceDelivery")}
          {...registerFilterCheckbox("serviceDelivery")}
        />
        <DashboardFilterCheckbox
          label={t("valueServicePickUp")}
          {...registerFilterCheckbox("servicePickUp")}
        />
      </DashboardFilter>

      {/* <DashboardFilter
        className="dashboard__filter--square"
        label={t("titleCuisine")}
      >
        <DashboardFilterCheckbox
          label={t("valueCuisineItalian")}
          {...registerFilterCheckbox("cuisineItalian")}
        />
        <DashboardFilterCheckbox
          label={t("valueCuisineSpanish")}
          {...registerFilterCheckbox("cuisineSpanish")}
        />
        <DashboardFilterCheckbox
          label={t("valueCuisineFrench")}
          {...registerFilterCheckbox("cuisineFrench")}
        />
        <DashboardFilterCheckbox
          label={t("valueCuisineGeorgian")}
          {...registerFilterCheckbox("cuisineGeorgian")}
        />
        <DashboardFilterCheckbox
          label={t("valueCuisineChinese")}
          {...registerFilterCheckbox("cuisineChinese")}
        />
        <DashboardFilterCheckbox
          label={t("valueCuisineJapanese")}
          {...registerFilterCheckbox("cuisineJapanese")}
        />
      </DashboardFilter> */}

      <DashboardFilter
        className="dashboard__filter--square"
        label={t("titleRating")}
      >
        <DashboardFilterCheckbox
          label={<img src="/img/icons/5-star.svg" alt="5 stars" />}
          {...registerFilterCheckbox("rating5")}
        />
        <DashboardFilterCheckbox
          label={<img src="/img/icons/4-star.svg" alt="4 stars" />}
          {...registerFilterCheckbox("rating4")}
        />
        <DashboardFilterCheckbox
          label={<img src="/img/icons/3-star.svg" alt="3 stars" />}
          {...registerFilterCheckbox("rating3")}
        />
        <DashboardFilterCheckbox
          label={<img src="/img/icons/2-star.svg" alt="2 stars" />}
          {...registerFilterCheckbox("rating2")}
        />
        <DashboardFilterCheckbox
          label={<img src="/img/icons/1-star.svg" alt="1 star" />}
          {...registerFilterCheckbox("rating1")}
        />
      </DashboardFilter>

      <DashboardFilter
        className="dashboard__filter--square"
        label={t("titlePrice")}
      >
        <DashboardFilterCheckbox
          label="€€€€"
          {...registerFilterCheckbox("priceLevel4")}
        />
        <DashboardFilterCheckbox
          label="€€€"
          {...registerFilterCheckbox("priceLevel3")}
        />
        <DashboardFilterCheckbox
          label="€€"
          {...registerFilterCheckbox("priceLevel2")}
        />
        <DashboardFilterCheckbox
          label="€"
          {...registerFilterCheckbox("priceLevel1")}
        />
      </DashboardFilter>

      <DashboardFilter
        className="dashboard__filter--square"
        label={t("titleHours")}
      >
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("hours1")}
        />
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("hours2")}
        />
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("hours3")}
        />
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("hours4")}
        />
      </DashboardFilter>

      <div className="dashboard__filter dashboard__filter--clear">
        <button
          type="button"
          className="dashboard__filter-btn"
          onClick={handleClearAllBtnClick}
        >
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
          {t("titleClearAll")}
        </button>
      </div>

      <div
        className="dashboard__filter dashboard__filter--filters"
        data-mobile-filters=""
        onClick={() => void setMobileFiltersOpened(true)}
      >
        <img src="/img/dashboard/filters.svg" alt="filters" />
        <p className="dashboard__filter-text">Filtres</p>
        <button type="button" className="dashboard__filter-btn">
          <svg
            width={19}
            height={19}
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width={19} height={19} rx={6} fill="#F0F0F0" />
            <path d="M14 7L9.5 12L5 7" stroke="#A8ADB8" strokeWidth={2} />
          </svg>
        </button>
      </div>

      <DashboardFilter
        className="dashboard__filter--sort"
        label={t("titleSortBy")}
        appendLeft={<img src="/img/dashboard/sort.svg" alt="sort view" />}
      >
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("sortBy1")}
        />
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("sortBy2")}
        />
        <DashboardFilterCheckbox
          label="Lorem ipsum dolor"
          {...registerFilterCheckbox("sortBy3")}
        />
      </DashboardFilter>

      <DashboardFilterPageSize
        value={props.filter.pageSize}
        onChange={handlePageSizeChange}
      />

      <button
        type="button"
        className="dashboard__filter-all"
        onClick={() => void setMobileFiltersOpened(false)}
      >
        View all results
        {!!props.resultsTotal && (
          <>
            {" "}
            <span>({props.resultsTotal.toString()})</span>
          </>
        )}
      </button>
    </div>
  );
}
