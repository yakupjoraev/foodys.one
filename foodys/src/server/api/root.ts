import { exampleRouter } from "~/server/api/routers/example";
import { placesRouter } from "./routers/places";
import { placeRouter } from "./routers/place";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  places: placesRouter,
  place: placeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
