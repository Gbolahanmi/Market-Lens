import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dbConnect from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";
import { Db } from "mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;
let authPromise: Promise<ReturnType<typeof betterAuth>> | null = null;

export const getAuth = async () => {
  // Return cached instance if available
  if (authInstance) {
    return authInstance;
  }

  // Return existing promise to avoid multiple concurrent connection attempts
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
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
        ],
      });

      // console.log("✅ Better Auth initialized successfully");
      return authInstance;
    } catch (error) {
      authPromise = null;
      // console.error("❌ Failed to initialize Better Auth:", error);
      throw error;
    }
  })();

  return authPromise;
};

// Initialize auth on demand - don't force at module load
export const auth = getAuth();
