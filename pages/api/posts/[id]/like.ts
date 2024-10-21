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

  console.log({ method, id, userId });

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
      // Ensure likes is initialized as an array
      if (!Array.isArray(post.likes)) {
        post.likes = [];
      }

      const likes: string[] = post.likes;
      const hasLiked = likes.includes(userId);

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
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error liking post", error: error.toString() });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
