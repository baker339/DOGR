// pages/api/users/index.ts

import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandling } from "@/middleware/errorMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("dogrdb"); // Replace with your actual database name
    const users = await db.collection("users").find({}).toArray(); // Fetch all users

    // Map users to include only necessary fields
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      userId: user.userId,
      name: user.name,
      hotdogsEaten: user.hotdogsEaten || 0, // Default to 0 if not present
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Failed to fetch users", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withErrorHandling(handler);
