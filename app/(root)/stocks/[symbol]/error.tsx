"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StockErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StockError({ error, reset }: StockErrorProps) {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-900 py-8">
      <div className="container max-w-2xl">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Failed to Load Stock Details
          </h2>
          <p className="text-gray-400 mb-6">
            {error.message ||
              "Something went wrong while loading stock information."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              Go Home
            </Button>
            <Button
              onClick={() => router.push("/search")}
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              Search Stocks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
