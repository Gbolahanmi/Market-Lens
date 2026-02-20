"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getStockData } from "@/lib/actions/stock-data.actions";
import { createArticleId } from "@/lib/utils";
import WatchlistTable from "@/components/watchlist/WatchlistTable";
import AlertSummaryCards from "@/components/watchlist/AlertSummaryCards";
import NewsCards from "@/components/watchlist/NewsCards";
import { useNotification } from "@/hooks/useNotification";
import { useNews } from "@/context/NewsContext";

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
  logoUrl?: string;
}

interface NewsArticle {
  id?: string | number;
  headline: string;
  source: string;
  url: string;
  image?: string;
  related?: string;
  datetime?: number;
}

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const notification = useNotification();
  const { setArticles } = useNews();

  const loadWatchlist = useCallback(
    async (options?: { includeNews?: boolean; showLoader?: boolean }) => {
      const includeNews = options?.includeNews ?? false;
      const showLoader = options?.showLoader ?? false;

      if (showLoader) setLoading(true);

      try {
        const { data: items, error } = await getUserWatchlist();

        if (error) {
          notification.error("Error loading watchlist");
          return;
        }

        if (!items || items.length === 0) {
          setWatchlistItems([]);
          if (includeNews) {
            setNews([]);
            setArticles([]);
          }
          return;
        }

        const symbols = items.map((item) => item.symbol);
        const stockDataArray = await getStockData(symbols);

        const mergedItems = items.map((item) => {
          const stockData = stockDataArray.find(
            (s) => s.symbol === item.symbol,
          );
          return {
            ...item,
            price: stockData?.price,
            change: stockData?.changePercent,
            marketCap: stockData?.marketCap?.toString(),
            peRatio: stockData?.peRatio,
            forwardPe: stockData?.forwardPe,
            epsTTM: stockData?.epsTTM,
            revenueGrowth: stockData?.revenueGrowth,
            analyzeRating: stockData?.analyzeRating,
            logoUrl: stockData?.logoUrl,
          };
        });

        setWatchlistItems(mergedItems);

        if (includeNews) {
          const newsData = await getNews(symbols);
          const newsWithIds = (newsData || []).map((article, index) => ({
            ...article,
            id: createArticleId(article, index),
          }));
          setNews(newsWithIds);
          setArticles(newsWithIds);
        }
      } catch (err) {
        console.error("❌ Error loading watchlist page:", err);
        notification.error("Failed to load watchlist");
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [notification, setArticles],
  );

  useEffect(() => {
    void loadWatchlist({ includeNews: true, showLoader: true });
  }, [loadWatchlist]);

  const handleWatchlistUpdate = useCallback(() => {
    // Re-hydrate with Finnhub data so UI does not become N/A
    void loadWatchlist({ includeNews: false, showLoader: false });
  }, [loadWatchlist]);

  return (
    <div className="w-full min-h-screen bg-gray-900 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100">Watchlist</h1>
          <p className="text-gray-400 mt-2">
            Track your favorite stocks and set up alerts
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Column - Table (2 cols wide) */}
          <div className="lg:col-span-2 overflow-x-auto">
            <WatchlistTable
              items={watchlistItems}
              onUpdate={handleWatchlistUpdate}
            />
          </div>

          {/* Right Column - Alert Summary Cards */}
          <div className="lg:col-span-1">
            <AlertSummaryCards
              items={watchlistItems}
              onUpdate={handleWatchlistUpdate}
            />
          </div>
        </div>

        {/* News Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Market News</h2>
          <NewsCards news={news} />
        </div>

        {/* Empty State */}
        {watchlistItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Your watchlist is empty. Search for stocks to add them to your
              watchlist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
