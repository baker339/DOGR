import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { withErrorHandling } from "@/middleware/errorMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { userId, limit, skip } = req.query;

  const client = await clientPromise;
  const db = client.db("dogrdb");

  switch (method) {
    case "GET":
      try {
        // 1. Fetch the current user's follow list
        const user = await db.collection("users").findOne({ userId });
        const followingIds = user?.following || [];
        // let postIds = [];

        // // 2. Get posts from followed users
        // const followedPosts = await db
        //   .collection("posts")
        //   .find({ userId: { $in: followingIds } })
        //   .sort({ createdAt: -1 })
        //   .limit(20)
        //   .toArray();

        // postIds.push(...followedPosts.map((x) => x._id));

        // // 3. Fetch some random posts for discovery (exclude followed users' posts)
        // const additionalPosts = await db
        //   .collection("posts")
        //   .aggregate([
        //     { $match: { userId: { $nin: followingIds } } },
        //     { $sample: { size: 5 } },
        //   ])
        //   .toArray();

        // postIds.push(...additionalPosts.map((x) => x._id));

        // const restOfPosts = await db
        //   .collection("posts")
        //   .aggregate([{ $match: { _id: { $nin: postIds } } }])
        //   .toArray();

        // // 4. Combine and return the posts
        // const posts = [...followedPosts, ...additionalPosts, ...restOfPosts];

        // 1. Fetch posts from followed users with pagination
        const followedPosts = await db
          .collection("posts")
          .find({ userId: { $in: followingIds } })
          .sort({ createdAt: -1 })
          .skip(Number(skip)) // Skipping already fetched posts
          .limit(Number(limit)) // Limiting the number of posts per request
          .toArray();

        // 2. Additional posts for discovery (excluding followed users' posts)
        const additionalPosts = await db
          .collection("posts")
          .aggregate([
            { $match: { userId: { $nin: followingIds } } },
            { $sample: { size: 5 } },
          ])
          .toArray();

        // Combine followed and discovery posts
        const posts = [...followedPosts, ...additionalPosts];

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
        await db.collection("posts").insertOne(newPost);
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
