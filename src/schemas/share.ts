import mongoose, { ObjectId, Schema, model } from "mongoose";

interface Share {
  post_id: string | ObjectId;
  sharerer_id: string | ObjectId; // user that share the post
  clicks: number; // no of time the link was opened
  upvotes: number; // upvotes gotten through share
  downvotes: number; // downvotes gotten through share
  medium: ShareMedium;
}

export enum ShareMedium {
  X = "x",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
  WHATSAPP = "whatsapp",
  GENERIC = "generic",
}

const shareSchema = new Schema<Share>(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    sharerer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    medium: {
      type: String,
      enum: ShareMedium,
      default: ShareMedium.GENERIC,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const ShareModel = model<Share>("Share", shareSchema);
