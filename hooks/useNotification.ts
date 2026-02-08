"use client";

import { useToast, ToastType } from "@/context/ToastContext";

export function useNotification() {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string, duration?: number) =>
      addToast({
        type: "success",
        title,
        message,
        duration,
      }),

    error: (title: string, message?: string, duration?: number) =>
      addToast({
        type: "error",
        title,
        message,
        duration,
      }),

    warning: (title: string, message?: string, duration?: number) =>
      addToast({
        type: "warning",
        title,
        message,
        duration,
      }),

    info: (title: string, message?: string, duration?: number) =>
      addToast({
        type: "info",
        title,
        message,
        duration,
      }),

    custom: (
      type: ToastType,
      title: string,
      message?: string,
      duration?: number
    ) =>
      addToast({
        type,
        title,
        message,
        duration,
      }),
  };
}
