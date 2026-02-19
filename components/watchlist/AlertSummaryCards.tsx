"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Bell, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddAlertButton from "./AddAlertButton";
import { getUserAlerts } from "@/lib/actions/alert.actions";

interface UserAlert {
  id: string; // MongoDB ObjectId - 24 char hex string
  symbol: string;
  threshold?: number;
  alertType: string;
  isActive: boolean;
}

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
  logoUrl?: string;
}

interface AlertSummaryCardsProps {
  items: WatchlistItem[];
  onUpdate?: () => void;
}

export default function AlertSummaryCards({
  items,
  onUpdate,
}: AlertSummaryCardsProps) {
  const [userAlerts, setUserAlerts] = useState<Map<string, UserAlert>>(
    new Map(),
  );

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data: alerts } = await getUserAlerts();
        if (alerts && Array.isArray(alerts)) {
          // Create Map: symbol -> alert with valid MongoDB ObjectId
          const alertsMap = new Map(
            alerts.map((alert) => [alert.symbol, alert]),
          );
          setUserAlerts(alertsMap);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <AlertCircle className="mx-auto mb-3 text-gray-500" size={32} />
        <p className="text-gray-400">No stocks to track</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {items.map((item) => {
        const priceChange = item.change || 0;
        const isPositive = priceChange >= 0;
        const existingAlert = userAlerts.get(item.symbol);

        return (
          <div
            key={item.symbol}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-blue-600 hover:shadow-lg transition duration-200"
          >
            {/* Top Row: Symbol, Price, Change */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {item.logoUrl ? (
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image
                        src={item.logoUrl}
                        alt={item.symbol}
                        fill
                        className="object-contain rounded"
                        priority={false}
                        onError={(e) => {
                          // Fallback to letter badge if logo fails to load
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center"><span class="text-white text-xs font-bold">${item.symbol.charAt(0)}</span></div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {item.symbol.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-100 text-sm">
                      {item.symbol}
                    </h3>
                    <p className="text-xs text-gray-500">{item.company}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-100">
                  ${item.price?.toFixed(2) || "N/A"}
                </p>
                <div
                  className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <hr className="mb-2" />

            {/* Additional Info Row */}
            {/* <div className="bg-gray-700/50 rounded px-3 py-2 mb-3 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>
                  Market Cap: {item.marketCap ? `$${item.marketCap}B` : "N/A"}
                </span>
                <span>P/E: {item.peRatio?.toFixed(2) || "N/A"}</span>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex justify-between px-3 py-2 mb-3 text-xs text-gray-300">
              <div className="flex flex-col">
                <span>
                  Added: {new Date(item.addedAt).toLocaleDateString()}
                </span>
                <span className="text-gray-500">
                  {/* Placeholder for alert status */}
                  No active alerts
                </span>
              </div>
              <div className="flex flex-col">
                <span className="flex gap-2">
                  {existingAlert?.id ? (
                    <>
                      <AddAlertButton
                        symbol={item.symbol}
                        company={item.company}
                        onAlertCreated={onUpdate}
                        existingThreshold={existingAlert.threshold || 5}
                        action="edit"
                        alertId={existingAlert.id}
                      />
                      <AddAlertButton
                        symbol={item.symbol}
                        company={item.company}
                        onAlertCreated={onUpdate}
                        action="delete"
                        alertId={existingAlert.id}
                      />
                    </>
                  ) : (
                    <AddAlertButton
                      symbol={item.symbol}
                      company={item.company}
                      onAlertCreated={onUpdate}
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
