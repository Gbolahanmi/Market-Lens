// app/api/test-db/route.ts
import dbConnect from "@/database/mongoose";

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ status: "✅ Connected" });
  } catch (error) {
    return Response.json(
      { status: "❌ Failed", error: String(error) },
      { status: 500 },
    );
  }
}
