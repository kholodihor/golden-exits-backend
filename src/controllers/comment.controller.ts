import type { Context } from "hono";

import CommentModel from "../models/comment.model";
import PostModel from "../models/post.model";

export async function createComment(c: Context) {
  try {
    const { userId, comment } = await c.req.json();
    const postId = c.req.param("id");

    if (!comment) {
      c.status(400);
      return c.json({ success: false, message: "Comment can't be empty" });
    }

    const newComment = new CommentModel({ comment, user: userId });
    await newComment.save();

    try {
      await PostModel.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    }
    catch (error) {
      console.error("Error updating post with comment:", error);
      // Continue execution even if post update fails
    }
    c.status(200);
    return c.json({ success: true, newComment });
  }
  catch (err) {
    console.error("Error creating comment:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to create comment" });
  }
}

export async function getCommentsByPost(c: Context) {
  try {
    const postId = c.req.param("id");
    
    if (!postId) {
      c.status(400);
      return c.json({ success: false, message: "Post ID is required" });
    }
    
    // Find the post and populate its comments
    const post = await PostModel.findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username avatar"
        }
      })
      .exec();
    
    if (!post) {
      c.status(404);
      return c.json({ success: false, message: "Post not found" });
    }
    
    return c.json({
      success: true,
      comments: post.comments || []
    });
  }
  catch (err) {
    console.error("Error fetching comments:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to fetch comments" });
  }
}
