"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import TradingViewWidget from "@/components/tradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  SYMBOL_OVERVIEW_WIDGET_CONFIG,
  POPULAR_STOCK_SYMBOLS,
} from "@/lib/constants";
import Link from "next/link";
import { useParams } from "next/navigation";

const TRADINGVIEW_WIDGET_URLS = {
  symbolInfo:
    "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js",
  candleChart:
    "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
  overview:
    "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
  technicalAnalysis:
    "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
  companyProfile:
    "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js",
  companyFinancials:
    "https://s3.tradingview.com/external-embedding/embed-widget-financials.js",
};

export default function StockDetails() {
  const params = useParams();
  const routeSymbol = params?.symbol as string;
  const decodedSymbol = decodeURIComponent(routeSymbol).toUpperCase();
  const symbol = decodedSymbol.includes(":")
    ? decodedSymbol.split(":").pop() || decodedSymbol
    : decodedSymbol;

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkWatchlist = useCallback(async () => {
    // Abort previous request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    try {
      const { data } = await getUserWatchlist();

      // Check if this request was aborted
      if (abortController.signal.aborted) {
        return;
      }

      const inWatchlist = data?.some((item) => item.symbol === symbol);
      setIsInWatchlist(inWatchlist || false);
    } catch (err) {
      // Don't log errors from aborted requests
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Error checking watchlist:", err);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [symbol]);

  useEffect(() => {
    void checkWatchlist();
  }, [symbol, checkWatchlist]);

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="container py-8">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 columns wide */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Info Widget */}
            <TradingViewWidget
              scriptUrl={TRADINGVIEW_WIDGET_URLS.symbolInfo}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />

            {/* Candle Chart Widget */}
            <TradingViewWidget
              title="Price Chart"
              scriptUrl={TRADINGVIEW_WIDGET_URLS.candleChart}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              height={600}
            />
            {/* Symbol Overview Widget */}
            <TradingViewWidget
              title="Symbol Overview"
              scriptUrl={TRADINGVIEW_WIDGET_URLS.overview}
              config={SYMBOL_OVERVIEW_WIDGET_CONFIG(symbol)}
              height={600}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Watchlist Button */}
            <div>
              {loading ? (
                <div className="h-10 bg-gray-700 rounded-md animate-pulse" />
              ) : (
                <WatchlistButton
                  symbol={symbol}
                  company={symbol}
                  isInWatchlist={isInWatchlist}
                  type="button"
                  onUpdate={() => setIsInWatchlist(!isInWatchlist)}
                />
              )}
            </div>

            {/* Technical Analysis Widget */}
            <TradingViewWidget
              scriptUrl={TRADINGVIEW_WIDGET_URLS.technicalAnalysis}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />

            {/* Company Profile Widget */}
            <TradingViewWidget
              scriptUrl={TRADINGVIEW_WIDGET_URLS.companyProfile}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />

            {/* Company Financials Widget */}
            <TradingViewWidget
              scriptUrl={TRADINGVIEW_WIDGET_URLS.companyFinancials}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
