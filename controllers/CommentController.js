import CommentModel from "../models/CommentModel.js";
import PostModel from "../models/PostModel.js";

export const createComment = async (req, res) => {
  try {
    const { userId, comment } = req.body;
    const postId = req.params.id;

    if (!comment) return res.json({ message: "Comment can`t be empty" });

    const newComment = new CommentModel({ comment, user: userId });
    await newComment.save();

    try {
      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.log(error);
    }
    res.json(newComment);
  } catch (error) {
    res.status(500).json({
      message: "Fail to create a comment",
    });
  }
};
