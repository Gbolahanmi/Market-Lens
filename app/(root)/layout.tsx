import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/Auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MarketLens",
  description: "Market analysis and insights platform",
};

export default async function Layout({ children }: { children: ReactNode }) {
  let user;
  let session;

  try {
    session = await (
      await auth
    ).api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("❌ Layout error fetching session:", error);
    redirect("/signin");
  }

  if (!session) {
    redirect("/signin");
  }

  user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10 mx-auto">{children}</div>
    </main>
  );
}
