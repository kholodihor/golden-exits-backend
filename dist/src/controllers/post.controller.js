import { HTTPException } from "hono/http-exception";
import CommentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";
import { createPostSchema, updatePostSchema } from "../schema/index.js";
import { toggleLikeUpdate } from "../utils/likes.js";
import { assertOwner } from "../utils/ownership.js";
import { PUBLIC_USER_FIELDS } from "../utils/selects.js";
import { findPostComments } from "./comment.controller.js";
async function findPostOr404(postId) {
    const post = await PostModel.findById(postId);
    if (!post) {
        throw new HTTPException(404, { message: "Post not found" });
    }
    return post;
}
export async function create(c) {
    const data = createPostSchema.parse(await c.req.json());
    const newPost = await PostModel.create({ ...data, user: c.get("userId") });
    return c.json(newPost.toJSON());
}
export async function getAllPosts(c) {
    const posts = await PostModel.find().populate("user", PUBLIC_USER_FIELDS).lean();
    return c.json(posts);
}
export async function getOne(c) {
    const post = await PostModel.findById(c.req.param("id"))
        .populate("user", PUBLIC_USER_FIELDS)
        .lean();
    if (!post) {
        throw new HTTPException(404, { message: "Post not found" });
    }
    return c.json(post);
}
export async function remove(c) {
    const post = await findPostOr404(c.req.param("id"));
    assertOwner(post, c.get("userId"));
    await CommentModel.deleteMany({ _id: { $in: post.comments } });
    await post.deleteOne();
    return c.json({ success: true });
}
export async function update(c) {
    const postId = c.req.param("id");
    const data = updatePostSchema.parse(await c.req.json());
    assertOwner(await findPostOr404(postId), c.get("userId"));
    const updatedPost = await PostModel.findByIdAndUpdate(postId, { $set: data }, { new: true })
        .populate("user", PUBLIC_USER_FIELDS)
        .lean();
    return c.json(updatedPost);
}
export async function likePost(c) {
    const postId = c.req.param("id");
    const post = await findPostOr404(postId);
    const { update } = toggleLikeUpdate(post.likes, c.get("userId"));
    const updatedPost = await PostModel.findByIdAndUpdate(postId, update, { new: true })
        .populate("user", PUBLIC_USER_FIELDS)
        .lean();
    return c.json(updatedPost);
}
export async function getPostComments(c) {
    const comments = await findPostComments(c.req.param("id"), -1);
    return c.json(comments);
}
