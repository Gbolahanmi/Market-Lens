"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for debugging
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 px-4 max-w-md">
        <h1 className="text-6xl font-bold text-gray-100">⚠️</h1>
        <h2 className="text-3xl font-semibold text-gray-200">
          Something Went Wrong
        </h2>
        <p className="text-gray-400 text-lg">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-gray-500 text-sm font-mono">
            Error: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center pt-4 flex-wrap">
          <Button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-gray-600 text-gray-200 hover:bg-gray-800"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
