import classNames from "classnames";
import { useEffect, useId, useRef, useState } from "react";
import { DashboardFilterRadio } from "../DashboradFilterRadio";
import style from "./style.module.css";

type PageSizeStr = "10" | "20" | "30";

export type PageSize = 10 | 20 | 30;

export interface DashboardPageSizeProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}

export function DashboardFilterPageSize(props: DashboardPageSizeProps) {
  const selectedOptionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const pageSizeId = useId();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleDocumentClick = (ev: MouseEvent) => {
      if (
        listRef.current &&
        ev.target instanceof Element &&
        !listRef.current.contains(ev.target) &&
        selectedOptionRef.current &&
        !selectedOptionRef.current.contains(ev.target)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [active]);

  const handleSelectedOptionClick = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      listRef.current &&
      ev.target instanceof Element &&
      !listRef.current.contains(ev.target)
    ) {
      setActive(!active);
    }
  };

  const handlePageSizeChange = (pageSize: PageSizeStr) => {
    props.onChange(pageSizeStrToInt(pageSize));
    setActive(false);
  };

  return (
    <div
      className={classNames(
        "dashboard__filter dashboard__filter--position",
        active && "active"
      )}
    >
      <p className="dashboard__filter-text">Position display</p>
      <div className="dashboard__filter-positions">
        <div
          className="dashboard__filter-position-selected"
          ref={selectedOptionRef}
          onClick={handleSelectedOptionClick}
        >
          {props.value.toString()}
          <img src="/img/dashboard/position-arrow.svg" alt="position arrow" />
        </div>
      </div>
      <div
        className={classNames("filter-list", style["page-size-list"])}
        data-filter-list=""
        ref={listRef}
      >
        <DashboardFilterRadio
          label="10"
          name={pageSizeId}
          value="10"
          checked={props.value === 10}
          onChange={handlePageSizeChange}
        />
        <DashboardFilterRadio
          label="20"
          name={pageSizeId}
          value="20"
          checked={props.value === 20}
          onChange={handlePageSizeChange}
        />
        <DashboardFilterRadio
          label="30"
          name={pageSizeId}
          value="30"
          checked={props.value === 30}
          onChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}

function pageSizeStrToInt(pageSize: PageSizeStr): PageSize {
  switch (pageSize) {
    case "10": {
      return 10;
    }
    case "20": {
      return 20;
    }
    case "30": {
      return 30;
    }
  }
}
