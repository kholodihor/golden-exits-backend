import mongoose from "mongoose";

export interface IComment {
  comment: string;
  user: string;
}

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
