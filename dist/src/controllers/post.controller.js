import CommentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";
import { createPostSchema, updatePostSchema } from "../schema/index.js";
export async function create(c) {
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
        return c.json(newPost.toJSON());
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Failed to create post");
    }
}
export async function getAllPosts(c) {
    try {
        const posts = await PostModel.find()
            .populate("user", "-passwordHash")
            .lean()
            .exec();
        return c.json(posts);
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Can't get posts");
    }
}
export async function getOne(c) {
    try {
        const postId = c.req.param("id");
        const post = await PostModel.findOne({ _id: postId })
            .populate("user", "-passwordHash")
            .lean()
            .exec();
        if (!post) {
            c.status(404);
            throw new Error(`Post not found with id ${postId}`);
        }
        return c.json(post);
    }
    catch (err) {
        console.log(err);
        if (c.res.status !== 404) {
            c.status(500);
        }
        throw new Error(`Can't get post with id ${c.req.param("id")}`);
    }
}
export async function remove(c) {
    try {
        const postId = c.req.param("id");
        const userId = c.get("userId");
        const post = await PostModel.findOne({ _id: postId });
        if (!post) {
            c.status(404);
            throw new Error("Post not found");
        }
        if (post.user.toString() !== userId) {
            c.status(403);
            throw new Error("No permission to delete this post");
        }
        await PostModel.findOneAndDelete({ _id: postId });
        await CommentModel.deleteMany({ post: postId });
        return c.json({ success: true });
    }
    catch (err) {
        console.log(err);
        if (!c.res.status) {
            c.status(500);
        }
        throw err;
    }
}
export async function update(c) {
    try {
        const postId = c.req.param("id");
        const userId = c.get("userId");
        const data = await c.req.json();
        const updateData = updatePostSchema.parse(data);
        const post = await PostModel.findOne({ _id: postId });
        if (!post) {
            c.status(404);
            throw new Error("Post not found");
        }
        if (post.user.toString() !== userId) {
            c.status(403);
            throw new Error("No permission to update this post");
        }
        const updatedPost = await PostModel.findOneAndUpdate({ _id: postId }, { $set: updateData }, { new: true })
            .populate("user", "-passwordHash")
            .lean();
        return c.json(updatedPost);
    }
    catch (err) {
        console.log(err);
        if (!c.res.status) {
            c.status(500);
        }
        throw err;
    }
}
export async function likePost(c) {
    try {
        const postId = c.req.param("id");
        const data = await c.req.json();
        const userId = data.userId;
        const post = await PostModel.findById(postId);
        if (!post) {
            c.status(404);
            throw new Error("Post not found");
        }
        // Toggle like
        if (post.likes[userId]) {
            delete post.likes[userId];
        }
        else {
            post.likes[userId] = true;
        }
        const updatedPost = await PostModel.findByIdAndUpdate(postId, { likes: post.likes }, { new: true })
            .populate("user", "-passwordHash")
            .lean();
        return c.json(updatedPost);
    }
    catch (err) {
        console.log(err);
        if (!c.res.status) {
            c.status(500);
        }
        throw err;
    }
}
export async function getPostComments(c) {
    try {
        const postId = c.req.param("id");
        const comments = await CommentModel.find({ post: postId })
            .populate("user", "-passwordHash")
            .lean()
            .sort({ createdAt: -1 })
            .exec();
        return c.json(comments);
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Failed to get comments");
    }
}
