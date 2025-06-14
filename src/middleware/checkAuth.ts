import type { Context, Next } from "hono";

import dotenv from "dotenv";
import { Jwt } from "hono/utils/jwt";

import UserModel from "../models/user.model";

dotenv.config();

// Protect Route for Authenticated Users
export async function checkAuth(c: Context, next: Next) {
  let token;
  try {
    token = c.req.header("Authorization")?.replace(/Bearer\s+/i, "");
    
    if (!token) {
      c.status(401);
      return c.json({ success: false, message: "Not authorized, no token provided" });
    }

    const decoded = await Jwt.verify(token, process.env.JWT_SECRET || "");
    
    if (!decoded || !decoded.id) {
      c.status(401);
      return c.json({ success: false, message: "Invalid token" });
    }

    const user = await UserModel.findById(decoded.id).select("-password");
    
    if (!user) {
      c.status(401);
      return c.json({ success: false, message: "User not found" });
    }

    // Set user ID in context for use in controllers
    c.set("userId", user._id.toString());
    
    await next();
  } catch (error) {
    console.error("Auth error:", error);
    c.status(401);
    return c.json({ success: false, message: "Not authorized, token failed" });
  }
}
