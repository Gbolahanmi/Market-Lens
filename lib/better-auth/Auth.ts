import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dbConnect from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import { Db } from "mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) {
    return authInstance;
  }

  const mongoose = await dbConnect();
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection not established");
  }
  authInstance = betterAuth({
    database: mongodbAdapter(db as Db),
    secret: process.env.BETTER_AUTH_SECRET || "default_secret",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    plugins: [
      nextCookies(), // Add Next.js cookies plugin for session management
      // Add any plugins you want to use here
    ],
  });
  return authInstance;
};

export const auth = getAuth();
