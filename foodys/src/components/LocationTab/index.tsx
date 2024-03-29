import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { ServicePhone } from "../ServicePhone";
import { env } from "~/env.mjs";
import { type PlaceResource } from "~/server/api/utils/g-place";
import haversine from "haversine-distance";
import { useMemo } from "react";
import { formatDistance } from "~/utils/distance-format";
import { useServicePhone } from "~/hooks/use-service-phone";

export interface LocationTabProps {
  place: PlaceResource;
  show: boolean;
  from?: { lat: number; lng: number };
  to?: { lat: number; lng: number };
  hasTrackedPhone: boolean;
}

export function LocationTab(props: LocationTabProps) {
  const { t } = useTranslation("common");

  const [servicePhone, , fetchServicePhone] = useServicePhone(
    props.place.place_id
  );

  const handleCallBtnClick = () => {
    if (servicePhone !== null) {
      return;
    }
    fetchServicePhone();
  };

  const distance = useMemo(() => {
    if (props.from === undefined || props.to === undefined) {
      return null;
    }
    const distance = haversine(props.from, props.to);
    return formatDistance(distance);
  }, [props.from, props.to]);

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
            {props.place.formatted_address ?? "..."}
            {distance !== null && " – " + t("textDistance", { distance })}
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
            <div className="location__footer-btns">
              {props.hasTrackedPhone && (
                <button
                  className="restaurant__btn call"
                  type="button"
                  onClick={handleCallBtnClick}
                >
                  <img src="/img/dashboard/call.svg" alt="call" />
                  {t("buttonCall")}
                </button>
              )}
            </div>
            {servicePhone !== null && (
              <div className="service-phone-group location__service-phone">
                <ServicePhone phone={servicePhone} />
                <p className="service-phone-help">
                  <Trans
                    i18nKey="common:textNumberExplanation"
                    components={[
                      // eslint-disable-next-line react/jsx-key
                      <a
                        className="service-phone-help__link"
                        href={t("urlNumber")}
                      />,
                    ]}
                  />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
