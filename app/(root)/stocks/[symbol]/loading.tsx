import SkeletonWidget from "@/components/skeletons/SkeletonWidget";

export default function StockLoading() {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="container py-8">
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2 columns wide */}
          <div className="lg:col-span-2 space-y-6">
            <SkeletonWidget height={170} />
            <SkeletonWidget height={600} />
            <SkeletonWidget height={600} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SkeletonWidget height={50} />
            <SkeletonWidget height={400} />
            <SkeletonWidget height={440} />
            <SkeletonWidget height={464} />
          </div>
        </div>
      </div>
    </div>
  );
}
