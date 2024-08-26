import mongoose from "mongoose";

export interface IVideo {
  title: string;
  url: string;
  genre: string;
  likes: any;
  views: number;
  user: string;
}

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 50,
    },
    url: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: "",
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    views: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVideo>("Video", VideoSchema);
