import dbConnect from "@/database/mongoose";

async function testConnection() {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    const mongoose = await dbConnect();

    console.log("✅ Successfully connected to MongoDB!");
    console.log("📊 Connection state:", mongoose.connection.readyState);
    console.log("🗂️ Database name:", mongoose.connection.name);
    console.log("🔗 Host:", mongoose.connection.host);

    // List all collections
    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    console.log("📦 Collections:", collections?.map((c) => c.name) || []);

    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
