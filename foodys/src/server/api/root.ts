import { exampleRouter } from "~/server/api/routers/example";
import { placesRouter } from "./routers/places";
import { createTRPCRouter } from "~/server/api/trpc";
import { favoriteRouter } from "./routers/favorite";
import { reviewsRouter } from "./routers/reviews";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  places: placesRouter,
  favorite: favoriteRouter,
  reviews: reviewsRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
