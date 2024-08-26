import mongoose from "mongoose";

export interface IArticle {
  title: string;
  content: string;
  imageUrl: string;
}

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IArticle>("News", NewsSchema);
