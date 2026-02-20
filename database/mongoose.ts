import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI)
    throw new Error("MONGODB_URI is not set in environment variables");

  // Return existing connection if healthy
  if (cached.conn) {
    const readyState = cached.conn.connection?.readyState;
    // readyState 1 = connected, 0 = disconnected
    if (readyState === 1) {
      return cached.conn;
    }
    // Connection is stale, reset it
    cached.conn = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Connection timeout (increased from 5s to 30s for reliability)
      serverSelectionTimeoutMS: 30000,
      // Socket timeout (45s - time to wait for single operation)
      socketTimeoutMS: 45000,
      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 2,
      // Retry writes for better reliability
      retryWrites: true,
      retryReads: true,
      // Heartbeat to detect stale connections
      heartbeatFrequencyMS: 30000,
      // Use IPv4 by default (avoid IPv6 issues)
      family: 4 as const,
      // App name for MongoDB diagnostics
      appName: "MarketLens",
    };

    try {
      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => {
          // console.log("✅ MongoDB connected successfully");
          // Set up event listeners for connection issues
          mongoose.connection.on("disconnected", () => {
            // console.warn("⚠️ MongoDB disconnected");
          });
          mongoose.connection.on("reconnected", () => {
            // console.log("✅ MongoDB reconnected");
          });
          mongoose.connection.on("error", (err) => {
            // console.error("❌ MongoDB error:", err.message);
          });
          return mongoose;
        })
        .catch((error) => {
          // console.error("❌ MongoDB connection failed:", error.message);
          cached.promise = null;
          throw error;
        });
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

/**
 * Gracefully disconnect from MongoDB
 * Useful for cleanup in server shutdown or testing
 */
export async function dbDisconnect() {
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
    cached.promise = null;
    // console.log("✅ MongoDB disconnected");
  }
}

export default dbConnect;
