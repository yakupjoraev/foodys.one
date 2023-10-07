import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

const VIEW_TEXT_TIMEOUT = 1000;

export interface RestaurantFavoriteProps {
  checked?: boolean;
  showTootip?: boolean;
  onChange: (checked: boolean, cb?: (favorite: boolean) => void) => void;
}

export function RestaurantFavorite(props: RestaurantFavoriteProps) {
  const timerRef = useRef<number>(0);
  const [viewText, setViewText] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleFavBtnClick = () => {
    if (!window) {
      return;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const nextChecked = !props.checked;
    if (nextChecked) {
      props.onChange(true, (favorite) => {
        if (favorite) {
          setViewText(true);
          timerRef.current = window.setTimeout(() => {
            setViewText(false);
          }, VIEW_TEXT_TIMEOUT);
        }
      });
    } else {
      props.onChange(false);
      setViewText(false);
    }
  };

  return (
    <div
      className={classNames(
        "restaurant__favorite",
        props.checked && "checked",
        viewText && "view-text"
      )}
      onClick={handleFavBtnClick}
    >
      <div className="restaurant__favorite-heart">
        <svg
          width={13}
          height={13}
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.948692 1.65769C1.55632 1.02354 2.38034 0.667289 3.23953 0.667289C4.09872 0.667289 4.92273 1.02354 5.53036 1.65769L6.47975 2.64798L7.42913 1.65769C7.72803 1.33461 8.08557 1.07691 8.48089 0.899629C8.87621 0.722346 9.30139 0.629031 9.73163 0.625128C10.1619 0.621225 10.5885 0.706813 10.9867 0.876897C11.385 1.04698 11.7467 1.29816 12.051 1.61577C12.3552 1.93338 12.5958 2.31106 12.7587 2.72678C12.9216 3.1425 13.0036 3.58793 12.9999 4.03708C12.9961 4.48623 12.9068 4.93011 12.7369 5.34281C12.5671 5.75551 12.3203 6.12877 12.0108 6.44082L6.47975 12.2159L0.948692 6.44082C0.341245 5.80647 0 4.94622 0 4.04926C0 3.15229 0.341245 2.29204 0.948692 1.65769Z"
            fill="#A8ADB8"
          />
        </svg>
      </div>
      <p className="restaurant__favorite-text">Added to favorites</p>
    </div>
  );
}
