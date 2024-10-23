import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { withErrorHandling } from "@/middleware/errorMiddleware";

interface Comment {
  userId: string;
  text: string;
  createdAt: Date;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query; // Post ID
  const { userId, text } = req.body; // User who commented and the comment text

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

      // Create the comment object
      const newComment: Comment = {
        userId, // Assuming userId is already validated
        text, // Text of the comment
        createdAt: new Date(), // Date when comment was made
      };

      // Use $push to add the comment to the comments array in the post document
      await db.collection("posts").updateOne(
        { _id: new ObjectId(id as string) },
        { $addToSet: { comments: newComment } } // Explicitly push the comment
      );

      const updatedPost = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(id as string) });
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding comment" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default withErrorHandling(handler);
