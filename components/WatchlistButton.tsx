"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { useNotification } from "@/hooks/useNotification";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist?: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onUpdate?: () => void;
}

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist = false,
  showTrashIcon = false,
  type = "button",
  onUpdate,
}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);
  const [loading, setLoading] = useState(false);
  const notification = useNotification();

  const handleToggleWatchlist = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        // Remove from watchlist
        const { error } = await removeFromWatchlist(symbol);
        if (error) {
          notification.error("Failed to remove from watchlist", error);
          return;
        }
        setInWatchlist(false);
        notification.success("Removed from watchlist");
      } else {
        // Add to watchlist
        const { error } = await addToWatchlist(symbol, company);
        if (error) {
          notification.error("Failed to add to watchlist", error);
          return;
        }
        setInWatchlist(true);
        notification.success("Added to watchlist");
      }

      // Call parent update callback
      onUpdate?.();
    } catch (error) {
      // console.error("❌ Error toggling watchlist:", error);
      notification.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (type === "icon") {
    return (
      <button
        onClick={handleToggleWatchlist}
        disabled={loading}
        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        title={
          inWatchlist
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
      >
        {showTrashIcon && inWatchlist ? (
          <Star
            className="h-5 w-5  hover:bg-yellow-400 text-yellow-500"
            fill="currentColor"
          />
        ) : (
          <Star
            className={`h-5 w-5 ${
              inWatchlist
                ? "text-yellow-400 fill-current"
                : "text-gray-400 hover:text-yellow-400"
            }`}
            fill={inWatchlist ? "currentColor" : "none"}
          />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleWatchlist}
      disabled={loading}
      className={`px-4 w-full py-2 rounded-lg font-medium transition-colors ${
        inWatchlist
          ? "bg-yellow-500 text-black hover:bg-yellow-400"
          : "bg-gray-700 text-gray-100 hover:bg-gray-600"
      }`}
    >
      {inWatchlist ? (
        <>
          <Star className="inline h-5 w-5 mr-2 fill-current" />
          In Watchlist
        </>
      ) : (
        <>
          <Star className="inline h-5 w-5 mr-2" />
          Add to Watchlist
        </>
      )}
    </button>
  );
}
