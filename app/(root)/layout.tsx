import Header from "@/components/Header";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MarketLens",
  description: "Market analysis and insights platform",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen text-gray-400">
      <Header />
      <div className="container py-10 mx-auto">{children}</div>
    </main>
  );
}
