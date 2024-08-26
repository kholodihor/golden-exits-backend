import { Context } from "hono";
import VideoModel from "../models/video.model";
import { createVideoSchema } from "../schema";

export const uploadVideo = async (c: Context) => {
  const data = await c.req.json();
  try {
    const video = createVideoSchema.parse(data);
    const newVideo = new VideoModel(video);
    await newVideo.save();
    return c.json(newVideo);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to create post");
  }
};

export const getVideos = async (c: Context) => {
  try {
    const videos = await VideoModel.find().populate("user").exec();
    return c.json(videos);
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to get videos");
  }
};

export const updateViews = async (c: Context) => {
  try {
    const { views } = await c.req.json();
    const videoId = c.req.param("id");
    await VideoModel.updateOne(
      {
        _id: videoId,
      },
      {
        views,
      }
    );
    c.status(200);
    return c.json({ success: true });
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to update views");
  }
};

export const likeVideo = async (c: Context) => {
  try {
    const videoId = c.req.param("id");
    const { userId } = await c.req.json();
    const video = await VideoModel.findById(videoId);
    if (video) {
      const isLiked = video.likes.get(userId);

      if (isLiked) {
        video.likes.delete(userId);
      } else {
        video.likes.set(userId, true);
      }

      await VideoModel.findByIdAndUpdate(
        {
          _id: videoId,
        },
        { likes: video.likes },
        { new: true }
      );

      c.status(200);
      return c.json({ success: true });
    } else {
      c.status(404);
      return c.json({ message: "Video not found", success: false });
    }
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to update likes");
  }
};
