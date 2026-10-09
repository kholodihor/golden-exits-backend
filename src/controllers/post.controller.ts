import type { Context } from "hono";

import { HTTPException } from "hono/http-exception";

import CommentModel from "../models/comment.model";
import PostModel from "../models/post.model";
import { createPostSchema, updatePostSchema } from "../schema/index";
import { toggleLikeUpdate } from "../utils/likes";
import { assertOwner } from "../utils/ownership";
import { PUBLIC_USER_FIELDS } from "../utils/selects";
import { findPostComments } from "./comment.controller";

async function findPostOr404(postId: string) {
  const post = await PostModel.findById(postId);
  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  return post;
}

export async function create(c: Context) {
  const data = createPostSchema.parse(await c.req.json());
  const newPost = await PostModel.create({ ...data, user: c.get("userId") });
  return c.json(newPost.toJSON());
}

export async function getAllPosts(c: Context) {
  const posts = await PostModel.find().populate("user", PUBLIC_USER_FIELDS).lean();
  return c.json(posts);
}

export async function getOne(c: Context) {
  const post = await PostModel.findById(c.req.param("id"))
    .populate("user", PUBLIC_USER_FIELDS)
    .lean();
  if (!post) {
    throw new HTTPException(404, { message: "Post not found" });
  }
  return c.json(post);
}

export async function remove(c: Context) {
  const post = await findPostOr404(c.req.param("id"));
  assertOwner(post, c.get("userId"));

  await CommentModel.deleteMany({ _id: { $in: post.comments } });
  await post.deleteOne();

  return c.json({ success: true });
}

export async function update(c: Context) {
  const postId = c.req.param("id");
  const data = updatePostSchema.parse(await c.req.json());

  assertOwner(await findPostOr404(postId), c.get("userId"));

  const updatedPost = await PostModel.findByIdAndUpdate(postId, { $set: data }, { new: true })
    .populate("user", PUBLIC_USER_FIELDS)
    .lean();

  return c.json(updatedPost);
}

export async function likePost(c: Context) {
  const postId = c.req.param("id");
  const post = await findPostOr404(postId);
  const { update } = toggleLikeUpdate(post.likes, c.get("userId"));

  const updatedPost = await PostModel.findByIdAndUpdate(postId, update, { new: true })
    .populate("user", PUBLIC_USER_FIELDS)
    .lean();

  return c.json(updatedPost);
}

export async function getPostComments(c: Context) {
  const comments = await findPostComments(c.req.param("id"), -1);
  return c.json(comments);
}
