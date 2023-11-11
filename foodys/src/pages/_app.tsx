import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";
import { FavoritesProvider } from "~/providers/favorites-provider";
import { api } from "~/utils/api";
import "~/styles/style.scss";
import "@smastrom/react-rating/style.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <FavoritesProvider>
        <Component {...pageProps} />
      </FavoritesProvider>
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
