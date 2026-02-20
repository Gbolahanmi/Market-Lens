import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import AuthSessionRedirect from "@/components/AuthSessionRedirect";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<></>}>
        <AuthSessionRedirect />
      </Suspense>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </>
  );
};

function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
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
