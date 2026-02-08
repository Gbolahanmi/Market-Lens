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
  const session = await (
    await auth
  ).api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const user = {
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
