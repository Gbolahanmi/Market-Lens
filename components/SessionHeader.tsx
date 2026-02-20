import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/Auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SessionHeader() {
  let user;
  let session;

  try {
    session = await (await auth).api.getSession({ headers: await headers() });
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

  return <Header user={user} />;
}
