import { ObjectId, Schema, model } from "mongoose";

interface Topic {
  topic_id: string | ObjectId;
  title: string;
  posts: number;
  created_at: Date;
}

const topicSchema = new Schema<Topic>({
  title: {
    type: String,
    required: true,
    index: "text",
  },
  posts: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
});

export const TopicModel = model<Topic>("Topic", topicSchema);
