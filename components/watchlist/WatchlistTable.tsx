"use client";

import WatchlistButton from "../WatchlistButton";
import AddAlertButton from "./AddAlertButton";

interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
  price?: number;
  change?: number;
  marketCap?: string;
  peRatio?: number;
  forwardPe?: number;
  epsTTM?: number;
  revenueGrowth?: number;
  analyzeRating?: string;
}

interface WatchlistTableProps {
  items: WatchlistItem[];
  onUpdate: () => void;
}

export default function WatchlistTable({
  items,
  onUpdate,
}: WatchlistTableProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 bg-gray-900">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200 w-10"></th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Company
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Price
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Change
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Market Cap
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Forward P/E
            </th>
            {/* <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              Revenue Growth
            </th> */}
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">
              EPS (TTM)
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-200">
              Analyst Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.symbol}
              className="border-b border-gray-700 hover:bg-gray-700/50 transition"
            >
              <td className="px-6 py-4 text-sm text-gray-100">
                <WatchlistButton
                  symbol={item.symbol}
                  company={item.company}
                  isInWatchlist={true}
                  type="icon"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-blue-400">
                {item.company}
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                ${item.price?.toFixed(2) || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={
                    item.change
                      ? item.change >= 0
                        ? "text-green-400 font-medium"
                        : "text-red-400 font-medium"
                      : ""
                  }
                >
                  {item.change ? (item.change >= 0 ? "+" : "") : ""}
                  {item.change?.toFixed(2) || "N/A"}%
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {item.marketCap ? `$${item.marketCap}B` : "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-100">
                {item.forwardPe?.toFixed(2) || "N/A"}
              </td>
              {/* <td className="px-6 py-4 text-sm">
                <span
                  className={
                    item.revenueGrowth
                      ? item.revenueGrowth >= 0
                        ? "text-green-400 font-medium"
                        : "text-red-400 font-medium"
                      : ""
                  }
                >
                  {item.revenueGrowth
                    ? item.revenueGrowth >= 0
                      ? "+"
                      : ""
                    : ""}
                  {item.revenueGrowth?.toFixed(2) || "N/A"}%
                </span>
              </td> */}
              <td className="px-6 py-4 text-sm text-gray-100">
                ${item.epsTTM?.toFixed(2) || "N/A"}
              </td>
              <td className="px-6 py-4 text-center">
                {item.analyzeRating ? (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.analyzeRating === "Strong Buy"
                        ? "bg-green-900/50 text-green-300"
                        : item.analyzeRating === "Buy"
                          ? "bg-green-900/30 text-green-400"
                          : item.analyzeRating === "Hold"
                            ? "bg-yellow-900/50 text-yellow-300"
                            : item.analyzeRating === "Sell"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-red-900/50 text-red-300"
                    }`}
                  >
                    {item.analyzeRating}
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No stocks in your watchlist yet
        </div>
      )}
    </div>
  );
}
