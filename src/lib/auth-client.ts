import { env } from "@/env";
import { createAuthClient } from "better-auth/react";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    onError: (e) => {
      console.error("Auth client error:", e);
    },

    onSuccess: (data) => {
      console.log("Auth success:", data);
    },
  },
});

// Export hooks for easy use
export const { signIn, signUp, signOut, useSession } = authClient;
