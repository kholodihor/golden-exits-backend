import cloudinary from "../libs/cloudinary.js";
import { uploadImageSchema, uploadVideoSchema } from "../schema/index.js";
export async function uploadImage(c) {
    const { image } = uploadImageSchema.parse(await c.req.json());
    const result = await cloudinary.uploader.upload(image, { folder: "posts" });
    return c.json({ url: result.secure_url });
}
export async function uploadVideo(c) {
    const { video } = uploadVideoSchema.parse(await c.req.json());
    const result = await cloudinary.uploader.upload(video, { resource_type: "video", folder: "videos" });
    return c.json({ url: result.secure_url });
}
