// lib/models/Post.ts
import { ObjectId } from "mongodb";

export interface Comment {
  userId: string;
  text: string;
  createdAt: Date;
}

export interface Post {
  _id: ObjectId;
  userId: string;
  imageUrl: string;
  caption: string;
  location: string;
  createdAt: Date;
  likes: string[]; // Array of user IDs
  comments: Comment[];
  title: string;
  hotDogsConsumed: number;
}

const postSchema = {
  userId: String,
  imageUrl: String,
  caption: String,
  location: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String], // Array of user IDs who liked the post
    default: [],
  },
  comments: {
    type: [
      {
        userId: String,
        text: String,
        createdAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    default: [],
  },
};
