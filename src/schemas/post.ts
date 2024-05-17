import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface Post {
  _id: string | ObjectId;
  topic_id: string | ObjectId;
  author_id: string | ObjectId;
  upvotes: number;
  downvotes: number;
  shares: number;
  caption: string;
  media_url: string;
  tiktok: string;
  media_source: MediaSource;
  created_at: Date;
}

export enum MediaSource {
  UPLOAD = "upload",
  TIKTOK = "tiktok",
}

const postSchema = new Schema<Post>(
  {
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    caption: {
      type: String,
      required: true
    },
    media_url: {
      type: String,
      required: true
    },
    tiktok: {
      type: String,
      required: true
    },
    media_source: {
      type: String,
      enum: MediaSource,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const PostModel = model<Post>("Post", postSchema);
