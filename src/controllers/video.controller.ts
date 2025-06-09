import type { Context } from "hono";

import VideoModel from "../models/video.model";
import { createVideoSchema } from "../schema/index";

export async function uploadVideo(c: Context) {
  const data = await c.req.json();
  try {
    const video = createVideoSchema.parse(data);
    const newVideo = new VideoModel(video);
    await newVideo.save();
    return c.json(newVideo);
  }
  catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to create post");
  }
}

export async function getVideos(c: Context) {
  try {
    const videos = await VideoModel.find().populate("user").exec();
    return c.json(videos);
  }
  catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to get videos");
  }
}

export async function updateViews(c: Context) {
  try {
    const videoId = c.req.param("id");
    
    // Validate video ID
    if (!videoId) {
      c.status(400);
      return c.json({ success: false, message: "Video ID is required" });
    }

    // Increment view count by 1 using $inc operator
    const result = await VideoModel.findByIdAndUpdate(
      videoId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!result) {
      c.status(404);
      return c.json({ success: false, message: "Video not found" });
    }

    c.status(200);
    return c.json({ success: true, views: result.views });
  }
  catch (err) {
    console.error("Error updating views:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to update views" });
  }
}

export async function getVideoById(c: Context) {
  try {
    const videoId = c.req.param("id");
    
    if (!videoId) {
      c.status(400);
      return c.json({ success: false, message: "Video ID is required" });
    }

    const video = await VideoModel.findById(videoId).populate("user").exec();
    
    if (!video) {
      c.status(404);
      return c.json({ success: false, message: "Video not found" });
    }

    return c.json({
      success: true,
      video
    });
  }
  catch (err) {
    console.error("Error fetching video:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to fetch video" });
  }
}

export async function likeVideo(c: Context) {
  try {
    const videoId = c.req.param("id");
    const { userId } = await c.req.json();
    
    // Validate inputs
    if (!videoId || !userId) {
      c.status(400);
      return c.json({ success: false, message: "Video ID and user ID are required" });
    }

    // Find the video first to check if it exists
    const video = await VideoModel.findById(videoId);
    if (!video) {
      c.status(404);
      return c.json({ success: false, message: "Video not found" });
    }

    // Check if user has already liked the video
    const isLiked = video.likes.get(userId);
    
    // Use MongoDB's atomic operations to update in a single operation
    const updateOperation = isLiked
      ? { $unset: { [`likes.${userId}`]: "" } } // Remove the like
      : { $set: { [`likes.${userId}`]: true } };  // Add the like
    
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      updateOperation,
      { new: true }
    );

    // Return the updated like status
    c.status(200);
    return c.json({ 
      success: true, 
      liked: !isLiked,
      likesCount: updatedVideo?.likes.size || 0
    });
  }
  catch (err) {
    console.error("Error updating likes:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to update likes" });
  }
}
