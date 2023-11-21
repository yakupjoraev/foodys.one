import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import style from "./style.module.css";

export type ExpandableSearchProps = Pick<
  React.HTMLAttributes<HTMLInputElement>,
  "placeholder" | "onFocus" | "onBlur" | "onChange"
> & {
  name?: string;
  form: string;
  value?: string;
  disabled?: boolean;
};

export function ExpandableSearch(props: ExpandableSearchProps) {
  const searchboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const handleDocumentClick = (ev: MouseEvent) => {
      if (
        searchboxRef.current &&
        ev.target instanceof Element &&
        !searchboxRef.current.contains(ev.target) &&
        inputRef.current &&
        inputRef.current.value.length === 0
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [expanded]);

  return (
    <div className={style.container}>
      <div
        className={classNames(
          style.searchbox,
          expanded && style["searchbox--open"]
        )}
        ref={searchboxRef}
      >
        <input
          className={style.searchbox__input}
          type="search"
          placeholder={props.placeholder}
          name={props.name}
          form={props.form}
          disabled={props.disabled}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onChange={props.onChange}
          ref={inputRef}
        />
        <button
          type="submit"
          className={style.searchbox__submit}
          onClick={(ev) => {
            if (!expanded) {
              setExpanded(true);
              ev.preventDefault();
            }
          }}
          aria-label="search"
          form={props.form}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M18.8478 18.9492L16.4287 16.5005M18.8478 10.3789C18.8478 11.5043 18.6288 12.6188 18.2033 13.6586C17.7778 14.6984 17.1541 15.6432 16.3679 16.439C15.5817 17.2348 14.6483 17.8661 13.6211 18.2968C12.5938 18.7275 11.4928 18.9492 10.3809 18.9492C9.26905 18.9492 8.16806 18.7275 7.14081 18.2968C6.11356 17.8661 5.18018 17.2348 4.39395 16.439C3.60773 15.6432 2.98407 14.6984 2.55857 13.6586C2.13306 12.6188 1.91406 11.5043 1.91406 10.3789C1.91406 8.1059 2.80611 5.92601 4.39395 4.31877C5.9818 2.71153 8.13538 1.80859 10.3809 1.80859C12.6265 1.80859 14.7801 2.71153 16.3679 4.31877C17.9558 5.92601 18.8478 8.1059 18.8478 10.3789Z"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
