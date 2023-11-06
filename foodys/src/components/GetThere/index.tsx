import Trans from "next-translate/Trans";
import haversine from "haversine-distance";
import { useMemo } from "react";

export interface GetThereProps {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  googlePlaceId?: string;
}

export function GetThere(props: GetThereProps) {
  const distance = useMemo(() => {
    const distance = haversine(props.from, props.to);
    return Math.round(distance);
  }, [props.from, props.to]);

  const directionUrl = useMemo(() => {
    const url = new URL("https://www.google.com/maps/dir/?api=1");
    url.searchParams.set("origin", `${props.from.lat},${props.from.lng}`);
    url.searchParams.set("destination", `${props.to.lat},${props.to.lng}`);
    if (props.googlePlaceId) {
      url.searchParams.set("destination_place_id ", props.googlePlaceId);
    }
    return url.toString();
  }, [props.from, props.to, props.googlePlaceId]);

  return (
    <div className="restaurant__address-gets">
      <Trans
        i18nKey="common:textGetThere"
        components={[
          // eslint-disable-next-line react/jsx-key
          <a
            className="restaurant__address-get"
            href={directionUrl}
            target="_blank"
          />,
          // eslint-disable-next-line react/jsx-key
          <div className="restaurant__address-distance" />,
        ]}
        values={{ distance }}
      />
    </div>
  );
}
