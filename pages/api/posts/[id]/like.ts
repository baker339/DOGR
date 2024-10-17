// pages/api/posts/[id]/like.ts
import clientPromise from "@/lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query; // Post ID
  const { userId } = req.body; // User who liked the post

  const client = await clientPromise;
  const db = client.db("dogrdb");

  if (method === "POST") {
    try {
      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(id as string) });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user has already liked the post
      const hasLiked = post.likes.includes(userId);

      if (hasLiked) {
        // Remove the like
        await db
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(id as string) },
            { $pull: { likes: userId } }
          );
      } else {
        // Add the like
        await db
          .collection("posts")
          .updateOne(
            { _id: new ObjectId(id as string) },
            { $addToSet: { likes: userId } }
          );
      }

      const updatedPost = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(id as string) });
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: "Error liking post" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
