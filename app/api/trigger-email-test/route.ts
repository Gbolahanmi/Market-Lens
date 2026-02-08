// app/api/trigger-email-test/route.ts
import { inngest } from "@/lib/inngest/client";

export async function GET() {
  try {
    await inngest.send({
      name: "app/user.created",
      data: {
        email: "test@example.com",
        name: "Test User",
        country: "USA",
        investmentGoals: "Growth",
        riskTolerance: "Medium",
        preferredIndustry: "Technology",
      },
    });

    return Response.json({ success: true, message: "Event triggered" });
  } catch (error) {
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
