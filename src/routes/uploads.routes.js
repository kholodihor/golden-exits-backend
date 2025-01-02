import { Hono } from "hono";
import { checkAuth } from "../middleware/checkAuth";
import cloudinary from "../libs/cloudinary";
export const uploadsRoutes = new Hono()
    .post("/upload", checkAuth, async (c) => {
    const { image } = await c.req.json();
    try {
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts",
        });
        return c.json({
            url: result.secure_url,
        });
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Failed to upload");
    }
})
    .post("/uploadvideo", async (c) => {
    const { video } = await c.req.json();
    try {
        const result = await cloudinary.uploader.upload(video, {
            resource_type: "video",
            folder: "videos",
        });
        return c.json({
            url: result.secure_url,
        });
    }
    catch (err) {
        console.log(err);
        c.status(500);
        throw new Error("Failed to upload");
    }
});
