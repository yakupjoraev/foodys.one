import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import addHours from "date-fns/addHours";
import { sendEmail } from "~/utils/mailer";
import { env } from "~/env.mjs";
import { hashPassword } from "~/utils/hash";
import { passwordStrength } from "check-password-strength";

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

      console.log("send mail");
      await sendEmail({
        to: input.email,
        subject: "Reset your Foodys.one password",
        text: createPasswordResetMail(
          env.NEXT_PUBLIC_SITE_URL + "/?reset=" + tokenModel.id
        ),
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

function createPasswordResetMail(link: string) {
  let body = "# Password Reset";
  body += "\n";
  body += "\n";
  body +=
    "If you've lost your password or wish to reset it, use the link below to get started.";
  body += "\n";
  body += "\n";
  body += "[Reset Your Password](" + link + ")";
  body += "\n";
  body += "\n";
  body +=
    "If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.";

  return body;
}
