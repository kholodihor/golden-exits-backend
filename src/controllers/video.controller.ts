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
    const videos = await VideoModel.find()
      .populate({
        path: 'user',
        select: 'fullName avatarUrl'
      })
      .select('-__v')
      .lean()
      .exec();
    
    return c.json(videos);
  }
  catch (err) {
    console.error('Error fetching videos:', err);
    c.status(500);
    return c.json({ success: false, message: "Failed to get videos" });
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

export async function updateVideo(c: Context) {
  try {
    const videoId = c.req.param("id");
    const userId = c.get('userId');
    const updateData = await c.req.json();
    
    if (!videoId) {
      c.status(400);
      return c.json({ success: false, message: "Video ID is required" });
    }

    // First find the video to check ownership
    const video = await VideoModel.findById(videoId);
    if (!video) {
      c.status(404);
      return c.json({ success: false, message: "Video not found" });
    }

    // Check if the user is the owner of the video
    if (video.user.toString() !== userId) {
      c.status(403);
      return c.json({ success: false, message: "Not authorized to update this video" });
    }

    // Update the video
    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      { $set: updateData },
      { new: true }
    );

    return c.json({ success: true, video: updatedVideo });
  } catch (err) {
    console.error("Error updating video:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to update video" });
  }
}

export async function deleteVideo(c: Context) {
  try {
    const videoId = c.req.param("id");
    const userId = c.get('userId');
    
    if (!videoId) {
      c.status(400);
      return c.json({ success: false, message: "Video ID is required" });
    }

    // First find the video to check ownership
    const video = await VideoModel.findById(videoId);
    if (!video) {
      c.status(404);
      return c.json({ success: false, message: "Video not found" });
    }

    // Check if the user is the owner of the video
    // Convert both IDs to strings for consistent comparison
    const videoUserId = video.user.toString();
    const currentUserId = userId.toString();
    
    console.log('Video user ID:', videoUserId, typeof videoUserId);
    console.log('Current user ID:', currentUserId, typeof currentUserId);
    
    if (videoUserId !== currentUserId) {
      console.log(`User ${currentUserId} is not authorized to delete video ${videoId} owned by ${videoUserId}`);
      c.status(403);
      return c.json({ success: false, message: "Not authorized to delete this video" });
    }

    // Delete the video
    await VideoModel.findByIdAndDelete(videoId);

    return c.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    c.status(500);
    return c.json({ success: false, message: "Failed to delete video" });
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
