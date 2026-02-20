import SessionHeader from "@/components/SessionHeader";
import SkeletonHeader from "@/components/skeletons/SkeletonHeader";
import { NewsProvider } from "@/context/NewsContext";
import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";

export const metadata: Metadata = {
  title: "MarketLens",
  description: "Market analysis and insights platform",
};

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen text-gray-400">
      <Suspense fallback={<SkeletonHeader />}>
        <SessionHeader />
      </Suspense>
      <Suspense fallback={null}>
        <NewsProvider>
          <div className="container py-10 dark:bg-black mx-auto">{children}</div>
        </NewsProvider>
      </Suspense>
    </main>
  );
}
