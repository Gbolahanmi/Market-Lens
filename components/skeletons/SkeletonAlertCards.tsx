interface SkeletonAlertCardsProps {
  count?: number;
}

export default function SkeletonAlertCards({
  count = 3,
}: SkeletonAlertCardsProps) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse"
        >
          <div className="h-4 w-32 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-700 rounded"></div>
            <div className="h-3 w-4/5 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
