"use server";

import { Watchlist } from "@/database/models/watchlist.models";
import dbConnect from "@/database/mongoose";
import { auth } from "@/lib/better-auth/Auth";
import { headers } from "next/headers";

export async function getWatchlistSymbolsByEmail(
  email: string,
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    // Better Auth stores users in the "user" collection
    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export async function getUserWatchlist() {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", data: [] };
    }

    await dbConnect();

    const watchlistItems = await Watchlist.find({
      userId: session.user.id,
    }).sort({
      addedAt: -1,
    });

    return {
      data: watchlistItems.map((item) => ({
        id: item._id.toString(),
        userId: item.userId,
        symbol: item.symbol,
        company: item.company,
        addedAt: item.addedAt,
      })),
      error: null,
    };
  } catch (error) {
    console.error("❌ Error fetching watchlist:", error);
    return { error: "Failed to fetch watchlist", data: [] };
  }
}

export async function addToWatchlist(symbol: string, company: string) {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", success: false, data: null };
    }

    await dbConnect();

    console.log(`📌 Adding ${symbol} to watchlist for user ${session.user.id}`);

    const result = await Watchlist.findOneAndUpdate(
      { userId: session.user.id, symbol: symbol.toUpperCase() },
      {
        userId: session.user.id,
        symbol: symbol.toUpperCase(),
        company,
        addedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log(`✅ Added ${symbol} to watchlist`);
    return {
      success: true,
      error: null,
      data: {
        id: result._id.toString(),
        userId: result.userId,
        symbol: result.symbol,
        company: result.company,
        addedAt: result.addedAt,
      },
    };
  } catch (error) {
    console.error(`❌ Error adding ${symbol} to watchlist:`, error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to add to watchlist",
      success: false,
      data: null,
    };
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await (
      await auth
    ).api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { error: "Not authenticated", success: false };
    }

    await dbConnect();

    console.log(
      `🗑️ Removing ${symbol} from watchlist for user ${session.user.id}`,
    );

    await Watchlist.deleteOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    console.log(`✅ Removed ${symbol} from watchlist`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ Error removing ${symbol} from watchlist:`, error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove from watchlist",
      success: false,
    };
  }
}
