import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { FavoritesProvider } from "~/providers/favorites-provider";
import { BlockedReviewsProvider } from "~/providers/blocked-reviews-provider";
import { Provider as BusProvider } from "react-bus";
import { api } from "~/utils/api";
import "~/styles/style.scss";
import "@smastrom/react-rating/style.css";
import { SharedGeolocationProvider } from "~/providers/shared-geolocation-provider";
import { LikesProvider } from "~/providers/likes-provider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SharedGeolocationProvider>
        <FavoritesProvider>
          <BlockedReviewsProvider>
            <LikesProvider>
              <BusProvider>
                <Component {...pageProps} />
              </BusProvider>
            </LikesProvider>
          </BlockedReviewsProvider>
        </FavoritesProvider>
      </SharedGeolocationProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
