import type { Context, Next } from "hono";

import dotenv from "dotenv";
import { Jwt } from "hono/utils/jwt";

import UserModel from "../models/user.model";

dotenv.config();

// Protect Route for Authenticated Users
export async function checkAuth(c: Context, next: Next) {
  let token;
  if (c.req.header("Authorization")) {
    try {
      token = c.req.header("Authorization")?.replace(/Bearer\s+/i, "");
      if (!token) {
        return c.json({ message: "Not authorized to access this route" });
      }

      const { id } = await Jwt.verify(token, process.env.JWT_SECRET || "");
      const user = await UserModel.findById(id).select("-password");
      c.set("userId", user?._id);

      await next();
    }
    catch {
      return c.json({ message: "Not authorized, token failed" }, 401);
    }
  }

  if (!token) {
    throw new Error("Not authorized! No token found!");
  }
}
