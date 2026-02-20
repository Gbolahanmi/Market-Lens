"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewsNotFound() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-900 py-8">
      <div className="container max-w-3xl">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-8 border-gray-600 text-gray-200 hover:bg-gray-700"
        >
          ← Back
        </Button>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Article Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The news article you're looking for doesn't exist. It may have been
            removed or the link is incorrect.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push("/watchlist")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Watchlist
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-700"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
