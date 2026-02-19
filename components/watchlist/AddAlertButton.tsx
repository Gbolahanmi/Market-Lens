"use client";

import { useState } from "react";
import { Bell, Pencil, Trash2 } from "lucide-react";
import {
  createAlert,
  deleteAlert,
  updateAlertStatus,
} from "@/lib/actions/alert.actions";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";

interface AddAlertButtonProps {
  symbol: string;
  company: string;
  action?: "add" | "edit" | "delete";
  alertId?: string;
  existingThreshold?: number;
  onAlertCreated?: () => void;
}

export default function AddAlertButton({
  symbol,
  company,
  action = "add",
  alertId,
  existingThreshold,
  onAlertCreated,
}: AddAlertButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alertType, setAlertType] = useState<"change">("change");
  const [threshold, setThreshold] = useState(existingThreshold || 5);
  const [priceTarget, setPriceTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const notification = useNotification();

  const handleAction = async () => {
    try {
      setLoading(true);

      if (action === "add") {
        if (alertType !== "change" && !priceTarget) {
          notification.warning("Please enter a price target");
          return;
        }

        const { error, success } = await createAlert(
          symbol,
          company,
          alertType,
          alertType === "change"
            ? threshold
            : parseFloat(priceTarget) || threshold,
          alertType !== "change" ? parseFloat(priceTarget) : undefined,
        );

        if (!success || error) {
          notification.error(error || "Failed to create alert");
          return;
        }

        notification.success(`Alert created for ${symbol}`);
      } else if (action === "edit" && alertId) {
        // TODO: Implement alert update functionality when backend supports it
        notification.success(`Alert updated for ${symbol}`);
      } else if (action === "delete" && alertId) {
        const { error, success } = await deleteAlert(alertId);

        if (!success || error) {
          notification.error(error || "Failed to delete alert");
          return;
        }

        notification.success(`Alert deleted for ${symbol}`);
      }

      setIsOpen(false);
      setThreshold(existingThreshold || 5);
      setPriceTarget("");
      onAlertCreated?.();
    } finally {
      setLoading(false);
    }
  };

  const getButtonConfig = () => {
    switch (action) {
      case "edit":
        return {
          icon: Pencil,
          // label: "Edit",
          title: "Edit alert",
          dialogTitle: `Edit Price Alert for ${symbol}`,
          buttonText: "Update Alert",
          buttonColor: "bg-amber-600 hover:bg-amber-700",
        };
      case "delete":
        return {
          icon: Trash2,
          // label: "Delete",
          title: "Delete alert",
          dialogTitle: `Delete Alert for ${symbol}?`,
          buttonText: "Delete Alert",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      default:
        return {
          icon: Bell,
          label: "Alert",
          title: "Add price alert",
          dialogTitle: `Set Price Alert for ${symbol}`,
          buttonText: "Create Alert",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const config = getButtonConfig();
  const IconComponent = config.icon;

  return (
    <>
      {/* Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition text-sm flex items-center gap-2"
        title={config.title}
      >
        <IconComponent size={14} />
        {config.label}
      </button>

      {/* Action Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {config.dialogTitle}
            </h3>

            {/* Form Fields (only for add/edit modes) */}
            {action !== "delete" && (
              <>
                {/* Alert Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alert Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="alertType"
                        value="change"
                        checked={alertType === "change"}
                        onChange={(e) =>
                          setAlertType(e.target.value as "change")
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Price Change %</span>
                    </label>
                  </div>
                </div>

                {/* Threshold Input */}
                {alertType === "change" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Alert when price changes by
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={threshold}
                        onChange={(e) =>
                          setThreshold(parseFloat(e.target.value) || 5)
                        }
                        min="0.1"
                        max="100"
                        step="0.1"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                  </div>
                )}

                {/* Price Target Input */}
                {alertType !== "change" && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Price
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={priceTarget}
                        onChange={(e) => setPriceTarget(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.1"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Delete Confirmation Message */}
            {action === "delete" && (
              <p className="text-gray-300 mb-6 p-3 bg-gray-700 rounded border border-red-600/30">
                Are you sure you want to delete this alert? This action cannot
                be undone.
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAction}
                disabled={loading}
                className={`flex-1 text-white ${config.buttonColor}`}
              >
                {loading ? "Processing..." : config.buttonText}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-200 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
