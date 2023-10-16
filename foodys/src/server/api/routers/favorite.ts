import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const favoriteRouter = createTRPCRouter({
  favoriteGPlace: protectedProcedure
    .input(z.object({ placeId: z.string(), favorite: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!input.favorite) {
        await ctx.db.favoriteGPlace.delete({
          where: {
            user_id_place_id: {
              user_id: userId,
              place_id: input.placeId,
            },
          },
        });
      } else {
        try {
          await ctx.db.favoriteGPlace.create({
            data: {
              place_id: input.placeId,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          });
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
          } else {
            throw error;
          }
        }
      }
    }),
});
