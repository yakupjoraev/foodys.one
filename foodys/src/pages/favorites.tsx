import { useGeolocation } from "@uidotdev/usehooks";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { useMemo, useReducer, useState } from "react";
import { CryptoModal } from "~/components/CryptoModal";
import { DashboardAside } from "~/components/DashboardAside";
import { Layout } from "~/components/Layout";
import { RestaurantCard } from "~/components/RestaurantCard";
import {
  PlaceListingItem,
  fetchAllFavoriteGPlaces,
} from "~/server/api/utils/g-place";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

type OptimisticPlaceUpdateAction =
  | { type: "add"; update: OptimisticPlaceUpdate }
  | { type: "remove"; update: OptimisticPlaceUpdate }
  | { type: "clear" };

type PermanentPlaceUpdateAction =
  | { type: "add"; update: OptimisticPlaceUpdate }
  | { type: "clear" };

interface OptimisticPlaceUpdate {
  place_id: string;
  favorite?: boolean;
}

const DEFAULT_PERMANENT_UPDATES: OptimisticPlaceUpdate[] = [];
const DEFAULT_OPTIMISTIC_UPDATES: OptimisticPlaceUpdate[] = [];

export const getServerSideProps = (async (ctx) => {
  const session = await getServerAuthSession(ctx);
  if (session === null) {
    return {
      redirect: {
        statusCode: 307,
        destination: "/",
      },
    };
  }

  const places = await fetchAllFavoriteGPlaces(session.user.id);

  return { props: { places: places } };
}) satisfies GetServerSideProps<{ places: PlaceListingItem[] }>;

export default function Favorites(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const session = useSession();
  const geolocation = useGeolocation();
  const [cryptoModelOpen, setCryptoModalOpen] = useState(false);
  const [optimisticUpdates, dispatchOptimisticUpdatesAction] = useReducer(
    optimisticPlaceUpdatesReducer,
    DEFAULT_OPTIMISTIC_UPDATES
  );
  const [permanentUpdates, dispatchPermanentUpdatesAction] = useReducer(
    permanentPlaceUpdatesReducer,
    DEFAULT_PERMANENT_UPDATES
  );

  const favoriteGPlace = api.favorite.favoriteGPlace.useMutation();

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
    const update = { place_id: placeId, favorite };
    favoriteGPlace
      .mutateAsync({
        placeId,
        favorite,
      })
      .then(() => {
        dispatchOptimisticUpdatesAction({ type: "remove", update });
        dispatchPermanentUpdatesAction({ type: "add", update });
      })
      .catch((error) => {
        console.error(error);
        dispatchOptimisticUpdatesAction({ type: "remove", update });
      });
    dispatchOptimisticUpdatesAction({
      type: "add",
      update,
    });
    if (cb) {
      cb(favorite);
    }
  };

  const authentificated = session.status === "authenticated";

  const updatedListing = useMemo(
    () => applyOptimisticUpdates(props.places, permanentUpdates),
    [props.places, permanentUpdates]
  );

  const optimisticListing = useMemo(
    () => applyOptimisticUpdates(updatedListing, optimisticUpdates),
    [updatedListing, optimisticUpdates]
  );

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
    <Layout title="Foodys - Favorites">
      <main className="main">
        <div className="dashboard">
          <div className="container">
            <div className="dashboard__main">
              <div className="restaurants">
                {props.places.length === 0
                  ? "Not found."
                  : optimisticListing.map((placeListingItem) => {
                      if (placeListingItem.place_id === undefined) {
                        return null;
                      }
                      return (
                        <RestaurantCard
                          name={placeListingItem.name}
                          formattedAddress={placeListingItem.formatted_address}
                          priceLevel={placeListingItem.price_level}
                          rating={placeListingItem.rating}
                          userRatingTotal={placeListingItem.user_rating_total}
                          placeId={placeListingItem.place_id}
                          photos={placeListingItem.photos}
                          favorite={placeListingItem.favorite}
                          clientCoordinates={clientCoordinates}
                          placeCoordinates={placeListingItem.location}
                          authentificated={authentificated}
                          url={placeListingItem.url}
                          onChangeFavorite={handleChangeFavorite}
                          onPayInCryptoBtnClick={handlePayInCryptoBtnClick}
                          key={placeListingItem.place_id}
                        />
                      );
                    })}
              </div>
              <DashboardAside />
            </div>
          </div>
        </div>
      </main>
      <CryptoModal open={cryptoModelOpen} onClose={handleCryptoModalClose} />
    </Layout>
  );
}

function optimisticPlaceUpdatesReducer(
  state: OptimisticPlaceUpdate[],
  action: OptimisticPlaceUpdateAction
): OptimisticPlaceUpdate[] {
  switch (action.type) {
    case "add": {
      return [...state, action.update];
    }
    case "remove": {
      const index = state.indexOf(action.update);
      if (index === -1) {
        return state;
      }
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    case "clear": {
      return DEFAULT_OPTIMISTIC_UPDATES;
    }
  }
}

function permanentPlaceUpdatesReducer(
  state: OptimisticPlaceUpdate[],
  action: PermanentPlaceUpdateAction
): OptimisticPlaceUpdate[] {
  switch (action.type) {
    case "add": {
      const prevUpdateIndex = state.findIndex(
        ({ place_id }) => place_id === action.update.place_id
      );
      if (prevUpdateIndex === -1) {
        return [...state, action.update];
      }
      const prevUpdate = state[prevUpdateIndex];
      if (prevUpdate === undefined) {
        return [...state, action.update];
      }
      const mergedUpdate: OptimisticPlaceUpdate = {
        ...prevUpdate,
      };
      mergedUpdate.favorite = action.update.favorite;
      return [
        ...state.slice(0, prevUpdateIndex),
        mergedUpdate,
        ...state.slice(prevUpdateIndex + 1),
      ];
    }
    case "clear": {
      return DEFAULT_OPTIMISTIC_UPDATES;
    }
  }
}

function applyOptimisticUpdates(
  listing: PlaceListingItem[],
  updates: OptimisticPlaceUpdate[]
) {
  if (updates.length === 0) {
    return listing;
  }
  return listing.map((listingItem) => {
    if (listingItem.place_id === undefined) {
      return listingItem;
    }
    const update = updates.find(
      ({ place_id }) => place_id === listingItem.place_id
    );
    if (update === undefined) {
      return listingItem;
    }
    const nextListingItem = { ...listingItem };
    if (update.favorite !== undefined) {
      nextListingItem.favorite = update.favorite;
    }
    return nextListingItem;
  });
}
