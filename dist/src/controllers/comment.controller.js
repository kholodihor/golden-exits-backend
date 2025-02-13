import CommentModel from "../models/comment.model.js";
import PostModel from "../models/post.model.js";
export async function createComment(c) {
    try {
        const { userId, comment } = await c.req.json();
        const postId = c.req.param("id");
        if (!comment) {
            c.status(500);
            return c.json({ message: "Comment can`t be empty" });
        }
        const newComment = new CommentModel({ comment, user: userId });
        await newComment.save();
        try {
            await PostModel.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            });
        }
        catch (error) {
            console.log(error);
        }
        c.status(200);
        return c.json({ success: true, newComment });
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Fail to create comment");
    }
}
