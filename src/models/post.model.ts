import mongoose from "mongoose";
import { IComment } from "./comment.model";

export interface IPost {
  title: string;
  text: string;
  user: string;
  comments: IComment[];
  likes: any;
  imageUrl: string;
}

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: Array,
      of: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>("Post", PostSchema);
