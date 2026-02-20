import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/Auth";
import { cache } from "react";

// Timeout helper for async operations
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error("Operation timed out")), ms),
  );
  return Promise.race([promise, timeout]);
}

// Cache the session check to avoid uncached data during prerendering
const getAuthSession = cache(async () => {
  try {
    const authInstance = await withTimeout(auth, 8000);
    const session = await withTimeout(
      authInstance.api.getSession({ headers: await headers() }),
      5000,
    );
    return session?.user ?? null;
  } catch (error) {
    // If auth fails, return null to allow auth pages to render
    return null;
  }
});

export default async function AuthSessionRedirect() {
  const user = await getAuthSession();

  if (user) {
    redirect("/");
  }

  return null;
}
