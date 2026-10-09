import { HTTPException } from "hono/http-exception";
import CommentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";
import { createCommentSchema } from "../schema/index.js";
import { PUBLIC_USER_FIELDS } from "../utils/selects.js";
export async function findPostComments(postId, order) {
    const post = await PostModel.findById(postId).select("comments").lean();
    if (!post) {
        throw new HTTPException(404, { message: "Post not found" });
    }
    return CommentModel.find({ _id: { $in: post.comments } })
        .populate("user", PUBLIC_USER_FIELDS)
        .sort({ createdAt: order })
        .lean();
}
export async function createComment(c) {
    const { comment } = createCommentSchema.parse(await c.req.json());
    const postId = c.req.param("id");
    if (!(await PostModel.exists({ _id: postId }))) {
        throw new HTTPException(404, { message: "Post not found" });
    }
    const newComment = await CommentModel.create({ comment, user: c.get("userId") });
    await PostModel.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    return c.json({ success: true, newComment });
}
export async function getCommentsByPost(c) {
    const comments = await findPostComments(c.req.param("id"), 1);
    return c.json({ success: true, comments });
}
