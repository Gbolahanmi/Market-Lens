export default function SkeletonHeader() {
  return (
    <div className="bg-gray-800 border-b border-gray-700 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo/Brand skeleton */}
        <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>

        {/* Nav links skeleton */}
        <div className="flex gap-6 items-center">
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* User menu skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
