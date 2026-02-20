export default function SkeletonNewsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition cursor-pointer animate-pulse"
        >
          <div className="aspect-video bg-gray-700"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-700 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-700 rounded"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-12 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-12 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
