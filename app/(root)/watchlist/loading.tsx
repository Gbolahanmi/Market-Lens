import SkeletonWatchlistTable from "@/components/skeletons/SkeletonWatchlistTable";
import SkeletonAlertCards from "@/components/skeletons/SkeletonAlertCards";
import SkeletonNewsCards from "@/components/skeletons/SkeletonNewsCards";

export default function WatchlistLoading() {
  return (
    <div className="w-full min-h-screen bg-gray-900 py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-800 rounded animate-pulse mb-3"></div>
          <div className="h-4 w-80 bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Column - Table (2 cols wide) */}
          <div className="lg:col-span-2">
            <SkeletonWatchlistTable />
          </div>

          {/* Right Column - Alert Summary Cards */}
          <div className="lg:col-span-1">
            <SkeletonAlertCards count={3} />
          </div>
        </div>

        {/* News Section */}
        <div className="mb-12">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-6"></div>
          <SkeletonNewsCards />
        </div>
      </div>
    </div>
  );
}
