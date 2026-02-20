import SkeletonWidget from "@/components/skeletons/SkeletonWidget";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen home-wrapper">
      <main className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl:col-span-1">
          <SkeletonWidget height={600} />
        </div>
        <div className="md:col-span xl:col-span-2">
          <SkeletonWidget height={600} />
        </div>
      </main>
      <main className="grid w-full gap-8 home-section">
        <div className="h-full md:col-span-1 xl:col-span-1">
          <SkeletonWidget height={600} />
        </div>
        <div className="h-full md:col-span-1 xl:col-span-2">
          <SkeletonWidget height={600} />
        </div>
      </main>
    </div>
  );
}
