import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const client = await clientPromise;
  const db = client.db("dogrdb");

  if (req.method === "DELETE") {
    try {
      const result = await db
        .collection("posts")
        .deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete post", error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
