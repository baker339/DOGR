// pages/api/logError.ts

import clientPromise from "@/lib/mongodb"; // assuming you have a MongoDB connection utility
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { error, userId, location, context } = req.body;

    try {
      const client = await clientPromise;
      const db = client.db("dogrdb"); // Replace with your actual database name
      const errorsCollection = db.collection("errors");

      await errorsCollection.insertOne({
        error,
        userId,
        location,
        context,
        timestamp: new Date(),
      });

      return res.status(200).json({ message: "Error logged successfully" });
    } catch (err) {
      return res.status(500).json({ message: "Failed to log error", err });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
