import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";
import { env } from "~/env.mjs";
import { type Place } from "~/server/gm-client/types";

export interface LocationTabProps {
  place: Place;
  show: boolean;
}

export function LocationTab(props: LocationTabProps) {
  const { t } = useTranslation("common");

  const handleClick = () => {
    toast("NOT IMPLEMENTED");
  };

  return (
    <div
      className="tabs__content-item"
      style={{
        display: props.show ? "flex" : "none",
      }}
    >
      <div className="location">
        <div className="location__top">
          <p className="location__address">
            {props.place.formatted_address ?? "..."} – 835m from you
          </p>
          <div className="location__map">
            {props.place.place_id !== undefined && (
              <iframe
                style={{ border: 0, width: "100%", height: "100%" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={
                  "https://www.google.com/maps/embed/v1/place?key=" +
                  encodeURIComponent(env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API) +
                  "&q=" +
                  encodeURIComponent("place_id:" + props.place.place_id)
                }
              />
            )}
          </div>
          <div className="location__footer">
            <button
              className="restaurant__btn call"
              type="button"
              onClick={handleClick}
            >
              <img src="/img/dashboard/call.svg" alt="call" />
              {t("buttonCall")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
