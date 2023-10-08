import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { gmClient } from "~/server/gm-client";
import { Place } from "~/server/gm-client/types";
import { dnull } from "dnull";
import { Prisma } from "@prisma/client";

export const placeRouter = createTRPCRouter({
  getPlace: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(async ({ input, ctx }): Promise<Place | null> => {
      const placeId = input.placeId;

      const existsPlace = await ctx.db.gPlace.findFirst({
        where: {
          place_id: placeId,
        },
      });

      if (existsPlace !== null) {
        const { created_at, updated_at, ...rest } = existsPlace;
        return dnull(rest);
      }

      const placeDetails = await gmClient.placeDetails({
        queries: {
          place_id: placeId,
          key: env.GOOGLE_MAPS_API_KEY,
        },
      });

      const fetchedPlace = placeDetails.result;
      if (!fetchedPlace) {
        return null;
      }

      if (fetchedPlace.place_id === undefined) {
        return null;
      }

      try {
        await ctx.db.gPlace.create({
          data: fetchedPlace,
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return fetchedPlace;
        } else {
          throw error;
        }
      }

      return fetchedPlace;
    }),
});
