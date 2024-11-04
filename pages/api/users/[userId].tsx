// pages/api/users/[userId].ts
import clientPromise from "@/lib/mongodb"; // Adjust the import according to your structure
import { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandling } from "@/middleware/errorMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db("dogrdb"); // Replace with your database name

    if (req.method === "GET") {
      // Check if the user exists
      const profileUser = await db.collection("users").findOne({ userId });
      // Check if the current user follows the profile user

      if (profileUser) {
        return res.status(200).json(profileUser); // User exists
      } else {
        return res.status(404).json({ message: "User not found" }); // User does not exist
      }
    }

    if (req.method === "POST") {
      // Create a new user
      const newUser = {
        userId: req.body.userId,
        name: req.body.name,
        createdAt: new Date(),
        // Add any additional fields you want to store
      };
      console.log({ newUser });
      await db.collection("users").insertOne(newUser);
      return res.status(201).json(newUser); // Return the created user
    }

    return res
      .setHeader("Allow", ["GET", "POST"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Error in users API:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default withErrorHandling(handler);
