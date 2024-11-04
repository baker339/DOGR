// pages/api/follow.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function followUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { targetUserId, currentUserId } = req.body;

  if (!targetUserId)
    return res.status(400).json({ message: "User ID is required" });

  try {
    const client = await clientPromise;
    const db = client.db("dogrdb"); // Replace with your actual database name

    // Add targetUserId to the current user's 'following' list
    await db
      .collection("users")
      .updateOne(
        { userId: currentUserId },
        { $pull: { following: targetUserId } }
      );

    // Add currentUserId to the target user's 'followers' list
    await db
      .collection("users")
      .updateOne(
        { userId: targetUserId },
        { $pull: { followers: currentUserId } }
      );

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
