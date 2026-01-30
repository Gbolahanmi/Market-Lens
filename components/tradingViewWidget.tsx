"use client";

// TradingViewWidget.jsx
import React, { useRef, memo } from "react";
import useTradingViewWidget from "@/hooks/useTradingWidget";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

function TradingViewWidget({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);
  // (
  //   "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
  // );
  return (
    <div className="w-full">
      {title && (
        <h2 className="mb-5 text-gray-100 text-2xl font-semibold">{title}</h2>
      )}
      <div
        className={`tradingview-widget-container ${className || ""}`}
        ref={containerRef}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        ></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
            rel="noopener nofollow"
            target="_blank"
          >
            <span className="blue-text">AAPL stock chart</span>
          </a>
          <span className="trademark"> by TradingView</span>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
