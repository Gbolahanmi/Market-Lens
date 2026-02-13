"use client";

import { useState } from "react";
import { Star, Trash2 } from "lucide-react";

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
}: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist);
  const [loading, setLoading] = useState(false);

  const handleToggleWatchlist = async () => {
    setLoading(true);
    try {
      // TODO: Call your watchlist action here
      console.log(
        `${inWatchlist ? "Removing" : "Adding"} ${symbol} to watchlist`,
      );
      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error("Error toggling watchlist:", error);
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
          <Trash2
            className="h-5 w-5 text-red-500 hover:text-red-400"
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
          <Star className="inline h-4 w-4 mr-2 fill-current" />
          In Watchlist
        </>
      ) : (
        <>
          <Star className="inline h-4 w-4 mr-2" />
          Add to Watchlist
        </>
      )}
    </button>
  );
}
