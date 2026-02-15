import {createAuthClient} from "better-auth/react";

export const authClient = createAuthClient({
  // Use NEXT_PUBLIC_ so the browser can see it
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const googleLogin = async () => {
  await authClient.signIn.social(
    {
      provider: "google",
      callbackURL: "/", // Redirects home after login
    },
    {
      onRequest: () => console.log("Redirecting to Google..."),
      onError: (ctx) => alert(ctx.error.message),
    },
  );
};
