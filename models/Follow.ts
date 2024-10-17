// models/Follow.ts
import { ObjectId } from "mongodb";

export interface Follow {
  _id: ObjectId;
  followerId: ObjectId; // The user who is following
  followedId: ObjectId; // The user being followed
  createdAt: Date;
}
