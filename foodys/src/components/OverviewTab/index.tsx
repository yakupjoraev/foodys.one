import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import { type PlaceResource } from "~/server/api/utils/g-place";

export interface OverviewTabProps {
  place: PlaceResource;
  show: boolean;
}

export function OverviewTab(props: OverviewTabProps) {
  const { t } = useTranslation("common");

  return (
    <div
      className="tabs__content-item"
      style={{
        display: props.show ? "flex" : "none",
      }}
    >
      <div className="overview-content">
        {props.place.editorial_summary?.overview && (
          <p className="overview-content__text">
            {props.place.editorial_summary.overview}
          </p>
        )}
        <p className="overview-content__text">
          {props.place.formatted_address ?? "..."}
          {props.place.website && (
            <a href={props.place.website} target="_blank">
              {props.place.website}
            </a>
          )}
        </p>
        {renderServices(props.place, t)}
      </div>
    </div>
  );
}

function renderServices(place: PlaceResource, t: Translate) {
  const services: string[] = [];

  if (place.dine_in) {
    services.push(t("valueServiceDineIn"));
  }
  if (place.takeout) {
    services.push(t("valueServiceTakeOut"));
  }
  if (place.delivery) {
    services.push(t("valueServiceDelivery"));
  }
  if (place.curbside_pickup) {
    services.push(t("valueServicePickUp"));
  }

  if (services.length) {
    return (
      <p className="overview-content__text">Services: {services.join(", ")}</p>
    );
  } else {
    return null;
  }
}
