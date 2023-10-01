import classNames from "classnames";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export type DashboardFilterProps = PropsWithChildren<{
  className?: string;
  label: string;
  appendLeft?: JSX.Element;
}>;

export function DashboardFilter(props: DashboardFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleDocumentClick = (ev: MouseEvent) => {
      if (
        containerRef.current &&
        ev.target !== null &&
        ev.target instanceof Element &&
        !containerRef.current.contains(ev.target)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [active]);

  const handleContainerClick = (
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

  return (
    <div
      className={classNames(
        "dashboard__filter",
        props.className,
        active && "active"
      )}
      data-filter-container=""
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {props.appendLeft}
      <p className="dashboard__filter-text">{props.label}</p>
      <button
        type="button"
        className="dashboard__filter-btn"
        data-filter-btn=""
      >
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
      <div className="filter-list" data-filter-list="" ref={listRef}>
        {props.children}
      </div>
    </div>
  );
}
