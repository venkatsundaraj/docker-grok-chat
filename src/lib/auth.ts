import "server-only";

import { env } from "@/env";
import { db } from "@/server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, oAuthProxy } from "better-auth/plugins";

// const getTrustedOrigins = () => {
//   const origins = new Set<string>();
//   const add = (v?: string) => v && origins.add(v);

//   const toOrigin = (host?: string) =>
//     host?.startsWith("http") ? host : host ? `https://${host}` : undefined;
//   const toWWWOrigin = (host?: string) =>
//     host?.startsWith("http") ? host : host ? `https://www.${host}` : undefined;

//   add(process.env.BETTER_AUTH_URL);

//   add(toOrigin(process.env.VERCEL_BRANCH_URL));
//   add(toOrigin(process.env.VERCEL_URL));
//   add(toWWWOrigin(process.env.VERCEL_BRANCH_URL));
//   add(toWWWOrigin(process.env.VERCEL_URL));

//   add("https://www.contentport.io"); // prod
//   add("http://localhost:3000"); // local dev
//   return Array.from(origins);
// };

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
  }),
  secret: env.BETTER_AUTH_SECRET!,
  baseURL: env.BETTER_AUTH_URL!,

  // trustedOrigins: getTrustedOrigins(),
  plugins:
    env.NODE_ENV === "production"
      ? [
          oAuthProxy({
            productionURL: "http://localhost:3000", // Replace with your domain
            currentURL: env.BETTER_AUTH_URL,
          }),
        ]
      : [],

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI:
        env.NODE_ENV === "production"
          ? "http://localhost:3000/api/auth/callback/google" // Replace with your domain
          : "http://localhost:3000/api/auth/callback/google",
    },
  },
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const session = ctx.context.newSession;
      if (session) {
        ctx.redirect("/dashboard");
      } else {
        ctx.redirect("/");
      }
    }),
  },
});
