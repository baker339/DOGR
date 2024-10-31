import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb"; // Import clientPromise
import { withErrorHandling } from "@/middleware/errorMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const client = await clientPromise; // Get the MongoDB client
  const db = client.db("dogrdb"); // Access the database

  switch (method) {
    case "GET":
      try {
        const posts = await db
          .collection("posts")
          .find({})
          .sort({ createdAt: -1 })
          .toArray(); // Fetch posts
        res.status(200).json(posts);
      } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
      }
      break;

    case "POST":
      try {
        const { userId, imageUrl, caption, location, hotDogsConsumed, title } =
          req.body;
        const newPost = {
          userId,
          imageUrl,
          caption,
          location,
          hotDogsConsumed,
          title,
          createdAt: new Date(),
        };
        await db.collection("posts").insertOne(newPost); // Insert new post
        res.status(201).json(newPost);
      } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default withErrorHandling(handler);
