import { Context } from "hono";
import { createPostSchema, updatePostSchema } from "../schema";
import PostModel, { IPost } from "../models/post.model";
import CommentModel from "../models/comment.model";

export const create = async (c: Context) => {
  const data = await c.req.json();
  try {
    const post = createPostSchema.parse(data);
    const newPost = new PostModel({
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      comments: [],
      likes: {},
      user: c.get("userId"),
    });
    await newPost.save();
    return c.json(newPost);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to create post");
  }
};

export const getAllPosts = async (c: Context) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    return c.json(posts);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Can`t get posts");
  }
};

export const getOne = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const post = PostModel.findOne({ _id: postId }).populate("user");
    return c.json(post);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error(`Can\`t get post with id ${c.req.param("id")} `);
  }
};

export const remove = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    await PostModel.findOneAndDelete({ _id: postId });
    return c.json({
      success: true,
      message: "Post successfuly deleted",
    });
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Can`t delete post");
  }
};

export const update = async (c: Context) => {
  const data = await c.req.json();
  try {
    const post = updatePostSchema.parse(data);
    const newPost = new PostModel({
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      comments: [],
      likes: {},
      user: c.get("userId"),
    });
    await newPost.save();
    return c.json(newPost);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to update post");
  }
};

export const likePost = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const { userId } = await c.req.json();
    const post = await PostModel.findById(postId);
    const isLiked = post?.likes.get(userId);

    if (isLiked) {
      post?.likes.delete(userId);
    } else {
      post?.likes.set(userId, true);
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      { likes: post?.likes },
      { new: true }
    );
    return c.json(updatedPost);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to update post");
  }
};

export const getPostComments = async (c: Context) => {
  try {
    const postId = c.req.param("id");
    const post = await PostModel.findById(postId);
    const list = await Promise.all(
      (post as IPost).comments.map((comment) => {
        return CommentModel.findById(comment).populate("user");
      })
    );
    return c.json(list);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to update post");
  }
};
