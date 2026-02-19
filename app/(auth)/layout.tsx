import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { auth } from "@/lib/better-auth/Auth";

// Timeout helper for async operations
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), ms),
  );
  return Promise.race([promise, timeout]);
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  try {
    // Add timeout to prevent indefinite hangs
    const authInstance = await withTimeout(auth, 8000);
    const session = await withTimeout(
      authInstance.api.getSession({ headers: await headers() }),
      5000,
    );

    if (session?.user) redirect("/");
  } catch (error) {
    // If auth fails, we still show the auth pages (signup/signin)
    // This allows users to access auth pages even if DB is temporarily down
    console.warn(
      "⚠️ Auth check failed, proceeding with unauthenticated view:",
      error instanceof Error ? error.message : error,
    );
  }

  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image
            className="dark:invert"
            src="/logo.webp"
            alt="MarketLens Logo"
            width={140}
            height={43}
          />
        </Link>

        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            {" "}
            MarketLens helps investors understand market trends with clarity and
            confidence. Our advanced analytics cut through noise to reveal
            actionable insights. From real-time data to predictive modeling, we
            empower your investment decisions with intelligence that matters.
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">- Ethan R.</cite>
              <p className="max-md:text-xs text-gray-500">Retail Investor</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image
            src="/dashboard.jpeg"
            alt="Dashboard Preview"
            width={1440}
            height={1150}
            className="auth-dashboard-preview absolute top-0"
          />
        </div>
      </section>
    </main>
  );
};
export default Layout;
