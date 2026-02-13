import React from "react";
import TradingViewWidget from "@/components/tradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
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

export default async function StockDetails({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol: routeSymbol } = await params;
  const decodedSymbol = decodeURIComponent(routeSymbol).toUpperCase();
  const symbol = decodedSymbol.includes(":")
    ? decodedSymbol.split(":").pop() || decodedSymbol
    : decodedSymbol;

  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="container py-8">
        {/* Header with symbol and watchlist button */}
        {/* <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-100">
            {symbol.toUpperCase()}
          </h1>
          <WatchlistButton
            symbol={symbol}
            company={symbol}
            isInWatchlist={false}
            type="button"
          />
        </div>

        // Quick Symbol Selector 
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-300 text-sm font-semibold mb-3">
            Quick Jump to Symbol:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_STOCK_SYMBOLS.slice(0, 15).map((sym) => (
              <Link
                key={sym}
                href={`/stocks/${sym.toLowerCase()}`}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  symbol.toUpperCase() === sym
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-gray-700 text-gray-100 hover:bg-gray-600"
                }`}
              >
                {sym}
              </Link>
            ))}
          </div>
        </div> */}

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
            <div /* className="sticky top-20 z-10" */>
              <WatchlistButton
                symbol={symbol}
                company={symbol}
                isInWatchlist={false}
                type="button"
              />
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
