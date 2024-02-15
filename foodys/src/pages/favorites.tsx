import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useMemo, useState } from "react";
import { CryptoModal } from "~/components/CryptoModal";
import { Layout } from "~/components/Layout";
import { RestaurantCard } from "~/components/RestaurantCard";
import { CookiesModalContainer } from "~/containers/CookiesModalContainer";
import {
  useClientFavorites,
  useClientFavoritesSnapshot,
} from "~/providers/favorites-provider";
import { useSharedGeolocation } from "~/providers/shared-geolocation-provider";
import { api } from "~/utils/api";
import { getLangFromLocale } from "~/utils/lang";

export default function Favorites() {
  const { t, lang: locale } = useTranslation("common");
  const session = useSession();
  const geolocation = useSharedGeolocation();
  const [cryptoModelOpen, setCryptoModalOpen] = useState(false);
  const visibleFavoriteIds = useClientFavoritesSnapshot();
  const [clientFavorites, appendClientFavorite, removeClientFavorite] =
    useClientFavorites();
  const queryResponse = api.places.getPlacesByGoogleId.useQuery(
    {
      lang: getLangFromLocale(locale),
      ids: visibleFavoriteIds,
    },
    { enabled: false, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    void queryResponse.refetch();
  }, [visibleFavoriteIds, queryResponse]);

  const handlePayInCryptoBtnClick = () => {
    setCryptoModalOpen(true);
  };

  const handleCryptoModalClose = () => {
    setCryptoModalOpen(false);
  };

  const handleChangeFavorite = (
    placeId: string,
    favorite: boolean,
    cb?: (favorite: boolean) => void
  ) => {
    if (favorite) {
      appendClientFavorite(placeId);
    } else {
      removeClientFavorite(placeId);
    }
    if (cb) {
      cb(favorite);
    }
  };

  const authentificated = session.status === "authenticated";

  const clientCoordinates: { lat: number; lng: number } | undefined =
    useMemo(() => {
      const lat = geolocation.latitude;
      const lng = geolocation.longitude;
      if (lat === null) {
        return undefined;
      }
      if (lng === null) {
        return undefined;
      }
      return { lat, lng };
    }, [geolocation]);

  return (
    <Layout title={t("pageTitleFavourites")}>
      <main className="main">
        <div className="dashboard">
          <div className="container">
            <div className="dashboard__main">
              <div className="restaurants">
                {queryResponse.isLoading && t("placeholderLoading")}
                {queryResponse.data &&
                  (queryResponse.data.length === 0
                    ? t("favoritesNotFound")
                    : queryResponse.data.map((placeListingItem) => {
                        if (placeListingItem.place_id === undefined) {
                          return null;
                        }
                        return (
                          <RestaurantCard
                            name={placeListingItem.name}
                            formattedAddress={
                              placeListingItem.formatted_address
                            }
                            priceLevel={placeListingItem.price_level}
                            rating={placeListingItem.rating}
                            userRatingTotal={placeListingItem.user_rating_total}
                            placeId={placeListingItem.place_id}
                            photos={placeListingItem.photos}
                            favorite={clientFavorites.includes(
                              placeListingItem.place_id
                            )}
                            clientCoordinates={clientCoordinates}
                            placeCoordinates={placeListingItem.location}
                            authentificated={authentificated}
                            url={placeListingItem.url}
                            openingPeriods={placeListingItem.opening_periods}
                            utcOffset={placeListingItem.utc_offset}
                            hasTrackedPhone={placeListingItem.has_tracked_phone}
                            onChangeFavorite={handleChangeFavorite}
                            onPayInCryptoBtnClick={handlePayInCryptoBtnClick}
                            key={placeListingItem.place_id}
                          />
                        );
                      }))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <CryptoModal open={cryptoModelOpen} onClose={handleCryptoModalClose} />
      <CookiesModalContainer />
    </Layout>
  );
}
