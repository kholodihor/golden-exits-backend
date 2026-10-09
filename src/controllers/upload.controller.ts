import type { Context } from "hono";

import cloudinary from "../libs/cloudinary";
import { uploadImageSchema, uploadVideoSchema } from "../schema/index";

export async function uploadImage(c: Context) {
  const { image } = uploadImageSchema.parse(await c.req.json());
  const result = await cloudinary.uploader.upload(image, { folder: "posts" });
  return c.json({ url: result.secure_url });
}

export async function uploadVideo(c: Context) {
  const { video } = uploadVideoSchema.parse(await c.req.json());
  const result = await cloudinary.uploader.upload(video, { resource_type: "video", folder: "videos" });
  return c.json({ url: result.secure_url });
}
