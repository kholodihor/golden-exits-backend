import type { Context } from "hono";

import bcrypt from "bcryptjs";
import { HTTPException } from "hono/http-exception";

import UserModel from "../models/user.model";
import { loginSchema, registerSchema } from "../schema/index";
import { genToken } from "../utils/genToken";

async function authResponse(c: Context, user: InstanceType<typeof UserModel>, message: string) {
  const token = await genToken(user._id.toString());
  return c.json({
    success: true,
    data: { _id: user._id, username: user.username, email: user.email },
    token,
    message,
  });
}

export async function register(c: Context) {
  const { username, email, password, avatarUrl } = registerSchema.parse(await c.req.json());

  if (await UserModel.exists({ email })) {
    throw new HTTPException(400, { message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ username, email, avatarUrl, passwordHash });

  return authResponse(c, user, "User created successfully");
}

export async function login(c: Context) {
  const { email, password } = loginSchema.parse(await c.req.json());

  const user = await UserModel.findOne({ email });
  // Same error for unknown email and wrong password, so emails can't be enumerated.
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  return authResponse(c, user, "User logged in successfully");
}

export async function getUser(c: Context) {
  const user = await UserModel.findById(c.get("userId"));
  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return c.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
  });
}
