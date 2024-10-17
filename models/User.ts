import { Schema, model, Document } from "mongoose";

interface User extends Document {
  displayName: string;
  email: string;
  hotDogsConsumed: {
    month: number;
    year: number;
    allTime: number;
  };
  following: string[]; // Array of user IDs that the user follows
}

const userSchema = new Schema<User>({
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hotDogsConsumed: {
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    allTime: { type: Number, default: 0 },
  },
  following: [{ type: String }],
});

const UserModel = model<User>("User", userSchema);

export default UserModel;
