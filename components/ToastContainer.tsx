"use client";

import { useToast, ToastType } from "@/context/ToastContext";
import React from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const toastConfig = {
  success: {
    bg: "bg-green-500",
    icon: CheckCircle,
    title: "Success",
  },
  error: {
    bg: "bg-red-500",
    icon: AlertCircle,
    title: "Error",
  },
  warning: {
    bg: "bg-yellow-500",
    icon: AlertTriangle,
    title: "Warning",
  },
  info: {
    bg: "bg-blue-500",
    icon: Info,
    title: "Info",
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: any;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const config = toastConfig[toast.type as ToastType];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} text-white px-6 py-4 rounded-lg shadow-2xl flex items-start gap-4 max-w-sm pointer-events-auto animate-slideInRight backdrop-blur-sm bg-opacity-95`}
    >
      <Icon size={24} className="flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-xs opacity-90 mt-1">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action.onClick();
              onClose();
            }}
            className="text-xs font-semibold mt-2 underline hover:opacity-80 transition"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition p-1"
      >
        <X size={18} />
      </button>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
