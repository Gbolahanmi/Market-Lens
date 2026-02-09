// import { User } from "@/lib/models/user.model";
// import { connectToDatabase } from "@/lib/mongodb";

import dbConnect from "@/database/mongoose";

export async function getAllUsersForEmail() {
  try {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    // const users = await User.find({}).select("email name").lean();
    const users = await db
      .collection("users")
      .find({ email: { $exists: true, $ne: null } })
      .project({ email: 1, name: 1, _id: 1, country: 1, id: 1 })
      .toArray();

    return users
      .filter((user) => user.email && user.name)
      .map((user) => ({
        email: user.email,
        name: user.name,
        id: user._id?.toString() ?? "",
      })); // Ensure we only return users with an email
  } catch (error) {
    console.error("Error fetching users for email:", error);
    throw new Error("Failed to fetch users");
  }
}
