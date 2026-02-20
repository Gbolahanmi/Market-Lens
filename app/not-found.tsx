"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-gray-100">404</h1>
        <h2 className="text-3xl font-semibold text-gray-200">Page Not Found</h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go Home
            </Button>
          </Link>
          <Link href="/watchlist">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-800"
            >
              View Watchlist
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
