import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { requireEnv } from "../config/env.js";
import UserModel from "../models/user.model.js";
// Protect Route for Authenticated Users
export const checkAuth = createMiddleware(async (c, next) => {
    const token = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) {
        throw new HTTPException(401, { message: "Not authorized, no token provided" });
    }
    const secret = requireEnv("JWT_SECRET");
    let payload;
    try {
        payload = await verify(token, secret);
    }
    catch {
        throw new HTTPException(401, { message: "Not authorized, token failed" });
    }
    if (typeof payload.id !== "string" || !(await UserModel.exists({ _id: payload.id }))) {
        throw new HTTPException(401, { message: "Not authorized, user not found" });
    }
    c.set("userId", payload.id);
    await next();
});
