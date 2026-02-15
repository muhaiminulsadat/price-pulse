import {betterAuth} from "better-auth";
import {mongodbAdapter} from "better-auth/adapters/mongodb"; // Use mongodbAdapter
import mongoose from "mongoose";
import connectDB from "./db";
import {headers} from "next/headers";
import {redirect} from "next/dist/server/api-utils";

await connectDB();

export const auth = betterAuth({
  database: mongodbAdapter(mongoose.connection.db, {
    // Better Auth will use your existing Mongoose connection
    client: mongoose.connection.getClient(),
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 3,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!session) {
  //   redirect("/"); // Protect the route
  // }

  return session;
};
