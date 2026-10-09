import { HTTPException } from "hono/http-exception";
import VideoModel from "../models/video.model.js";
import { createVideoSchema, updateVideoSchema } from "../schema/index.js";
import { toggleLikeUpdate } from "../utils/likes.js";
import { assertOwner } from "../utils/ownership.js";
import { PUBLIC_USER_FIELDS } from "../utils/selects.js";
async function findVideoOr404(videoId) {
    const video = await VideoModel.findById(videoId);
    if (!video) {
        throw new HTTPException(404, { message: "Video not found" });
    }
    return video;
}
export async function uploadVideo(c) {
    const data = createVideoSchema.parse(await c.req.json());
    const newVideo = await VideoModel.create({ ...data, user: c.get("userId") });
    return c.json(newVideo);
}
export async function getVideos(c) {
    const videos = await VideoModel.find()
        .populate("user", PUBLIC_USER_FIELDS)
        .select("-__v")
        .lean();
    return c.json(videos);
}
export async function getVideoById(c) {
    const video = await VideoModel.findById(c.req.param("id"))
        .populate("user", PUBLIC_USER_FIELDS)
        .lean();
    if (!video) {
        throw new HTTPException(404, { message: "Video not found" });
    }
    return c.json({ success: true, video });
}
export async function updateViews(c) {
    const video = await VideoModel.findByIdAndUpdate(c.req.param("id"), { $inc: { views: 1 } }, { new: true });
    if (!video) {
        throw new HTTPException(404, { message: "Video not found" });
    }
    return c.json({ success: true, views: video.views });
}
export async function updateVideo(c) {
    const videoId = c.req.param("id");
    const data = updateVideoSchema.parse(await c.req.json());
    assertOwner(await findVideoOr404(videoId), c.get("userId"));
    const video = await VideoModel.findByIdAndUpdate(videoId, { $set: data }, { new: true });
    return c.json({ success: true, video });
}
export async function deleteVideo(c) {
    const video = await findVideoOr404(c.req.param("id"));
    assertOwner(video, c.get("userId"));
    await video.deleteOne();
    return c.json({ success: true, message: "Video deleted successfully" });
}
export async function likeVideo(c) {
    const videoId = c.req.param("id");
    const video = await findVideoOr404(videoId);
    const { liked, update } = toggleLikeUpdate(video.likes, c.get("userId"));
    const updatedVideo = await VideoModel.findByIdAndUpdate(videoId, update, { new: true });
    return c.json({ success: true, liked, likesCount: updatedVideo?.likes?.size ?? 0 });
}
