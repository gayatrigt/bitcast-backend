import { ObjectId, Schema, model } from "mongoose";

export interface User {
  _id: string | ObjectId;
  address: string;
}

const userSchema = new Schema<User>({
  address: {
    type: String,
    unique: true,
    required: true,
  },
},
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

export const UserModel = model<User>("User", userSchema);
