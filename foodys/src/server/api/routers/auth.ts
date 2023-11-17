import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import addHours from "date-fns/addHours";
import { sendEmail } from "~/utils/mailer";
import { env } from "~/env.mjs";
import { hashPassword } from "~/utils/hash";
import { passwordStrength } from "check-password-strength";
import { render } from "@react-email/render";
import ResetPasswordEmail from "../../../../emails/ResetPasswordEmail";
import ConfirmEmailEmail from "emails/ConfirmEmailEmail";
import { Prisma } from "@prisma/client";

export type SignUpResponse =
  | {
      code: "SUCCESS";
    }
  | {
      code: "USER_EXISTS";
    }
  | {
      code: "WEAK_PASSWORD";
    };

export type ConfirmEmailResponse =
  | {
      code: "SUCCESS";
    }
  | {
      code: "TOKEN_NOT_FOUND";
    }
  | {
      code: "USER_NOT_FOUND";
    };

export type SendConfirmEmailLinkResponse =
  | {
      code: "SUCCESS";
    }
  | {
      code: "USER_NOT_FOUND";
    }
  | {
      code: "EMAIL_CONFIRMED";
    };
export type RequestPasswordResetResponse =
  | {
      code: "SUCCESS";
    }
  | {
      code: "USER_NOT_FOUND";
    };

export type ResetPasswordResponse =
  | {
      code: "SUCCESS";
    }
  | {
      code: "TOKEN_NOT_FOUND";
    }
  | {
      code: "WEAK_PASSWORD";
    };

const EXPIRES_HOURS = 24;

export const authRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(256),
        lastName: z.string().min(1).max(256),
        nickname: z.optional(
          z
            .string()
            .min(1)
            .max(256)
            .regex(/^[a-z0-9_]*$/)
        ),
        email: z.string().email(),
        password: z.string().max(256),
      })
    )
    .mutation(async ({ ctx, input }): Promise<SignUpResponse> => {
      const existsUser = await ctx.db.user.findFirst({
        where: { email: input.email },
      });
      if (existsUser) {
        return { code: "USER_EXISTS" };
      }
      const strength = passwordStrength(input.password);
      if (strength.id <= 1) {
        return { code: "WEAK_PASSWORD" };
      }

      const passwordHash = await hashPassword(input.password);
      const userModel = await ctx.db.user.create({
        data: {
          email: input.email,
          password: passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          nickname: input.nickname,
          name: `${input.firstName} ${input.lastName}`,
        },
      });

      const expires = addHours(new Date(), EXPIRES_HOURS);
      const confirmEmailToken = await ctx.db.confirmEmailToken.create({
        data: {
          user_id: userModel.id,
          expires,
        },
      });

      const confirmUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
      confirmUrl.searchParams.set("confirm", confirmEmailToken.id);

      const email = ConfirmEmailEmail({ confirmUrl: confirmUrl.toString() });
      const emailHtml = render(email);
      const emailText = render(email, { plainText: true });

      await sendEmail({
        to: input.email,
        subject: "Confirm your email",
        html: emailHtml,
        text: emailText,
      });

      return { code: "SUCCESS" };
    }),
  confirmUserEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }): Promise<ConfirmEmailResponse> => {
      const confirmEmailToken = await ctx.db.confirmEmailToken.findFirst({
        where: {
          id: input.token,
        },
      });
      if (confirmEmailToken === null) {
        return { code: "TOKEN_NOT_FOUND" };
      }
      if (confirmEmailToken.expires.getTime() <= Date.now()) {
        return { code: "TOKEN_NOT_FOUND" };
      }

      const now = new Date();
      try {
        await ctx.db.user.update({
          where: {
            id: confirmEmailToken.user_id,
          },
          data: {
            emailVerified: now,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return { code: "USER_NOT_FOUND" };
        }
        throw error;
      }

      await ctx.db.confirmEmailToken.delete({
        where: {
          id: input.token,
        },
      });

      return { code: "SUCCESS" };
    }),
  sendConfirmEmailLink: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<SendConfirmEmailLinkResponse> => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (user === null) {
        return { code: "USER_NOT_FOUND" };
      }
      if (user.emailVerified) {
        return { code: "EMAIL_CONFIRMED" };
      }
      const expires = addHours(new Date(), EXPIRES_HOURS);
      const confirmEmailToken = await ctx.db.confirmEmailToken.create({
        data: {
          user_id: user.id,
          expires,
        },
      });

      const confirmUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
      confirmUrl.searchParams.set("confirm", confirmEmailToken.id);

      const email = ConfirmEmailEmail({ confirmUrl: confirmUrl.toString() });
      const emailHtml = render(email);
      const emailText = render(email, { plainText: true });

      await sendEmail({
        to: input.email,
        subject: "Confirm your email",
        html: emailHtml,
        text: emailText,
      });

      return { code: "SUCCESS" };
    }),
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<RequestPasswordResetResponse> => {
      const user = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (user === null) {
        return { code: "USER_NOT_FOUND" };
      }

      const expires = addHours(new Date(), EXPIRES_HOURS);

      console.log("create model");
      const tokenModel = await ctx.db.resetPasswordToken.create({
        data: {
          user_id: user.id,
          expires,
        },
      });

      const resetUrl = new URL(env.NEXT_PUBLIC_SITE_URL);
      resetUrl.searchParams.set("reset", tokenModel.id);
      const email = ResetPasswordEmail({ resetUrl: resetUrl.toString() });

      const emailHtml = render(email);
      const emailPlain = render(email, { plainText: true });

      console.log("send mail");
      await sendEmail({
        to: input.email,
        subject: "Reset your Foodys.one password",
        html: emailHtml,
        text: emailPlain,
      });

      return { code: "SUCCESS" };
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string(),
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<ResetPasswordResponse> => {
      const token = await ctx.db.resetPasswordToken.findFirst({
        where: {
          id: input.token,
        },
      });

      if (token === null) {
        return { code: "TOKEN_NOT_FOUND" };
      }

      const now = new Date();
      if (token.expires.getTime() < now.getTime()) {
        return { code: "TOKEN_NOT_FOUND" };
      }

      const strength = passwordStrength(input.password);
      if (strength.id <= 1) {
        return { code: "WEAK_PASSWORD" };
      }

      const passwordHash = await hashPassword(input.password);

      await ctx.db.user.update({
        where: {
          id: token.user_id,
        },
        data: {
          password: passwordHash,
        },
      });

      await ctx.db.resetPasswordToken.delete({
        where: {
          id: token.id,
        },
      });

      return { code: "SUCCESS" };
    }),
});
