interface SkeletonWidgetProps {
  height?: number;
}

export default function SkeletonWidget({ height = 600 }: SkeletonWidgetProps) {
  return (
    <div
      className="bg-gray-800 rounded-lg border border-gray-700 animate-pulse"
      style={{ height: `${height}px` }}
    ></div>
  );
}
