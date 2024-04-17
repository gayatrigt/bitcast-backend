import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface Vote {
  user_id: string | ObjectId;
  post_id: string | ObjectId;
  type: VoteType;
  share_id: string;
}

export enum VoteType {
  UPVOTE = "upvote",
  DOWNVOTE = "downvote",
}

const voteSchema = new Schema<Vote>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  type: {
    type: String,
    enum: VoteType,
    required: true,
  },
},
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

export const VoteModel = model<Vote>("Vote", voteSchema);
