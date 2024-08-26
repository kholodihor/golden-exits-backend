import { Context } from "hono";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/genToken";
import UserModel from "../models/user.model";

export const getUsers = async (c: Context) => {
  const users = await UserModel.find();
  return c.json({ users });
};

export const register = async (c: Context) => {
  const { name, email, password } = await c.req.json();

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    c.status(400);
    throw new Error("User already exists");
  }

  const user = await UserModel.create({
    name,
    email,
    password,
  });

  if (!user) {
    c.status(400);
    throw new Error("Invalid user data");
  }

  const token = await genToken(user._id.toString());

  return c.json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
    message: "User created successfully",
  });
};

export const login = async (c: Context) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    c.status(400);
    throw new Error("Please provide an email and password");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    c.status(401);
    throw new Error("No user found with this email");
  }

  const isValidPass = await bcrypt.compare(password, user.password);

  if (!isValidPass) {
    c.status(401);
    throw new Error("Invalid credentials");
  } else {
    const token = await genToken(user._id.toString());

    return c.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
      message: "User logged in successfully",
    });
  }
};

export const getUser = async (c: Context) => {
  try {
    const userId = c.req.param("id");
    const user = await UserModel.findById(userId);

    if (user) {
      c.status(200);
      return c.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    } else {
      c.status(400);
      throw new Error("User not found");
    }
  } catch (err) {
    console.log(err);
    c.status(500);
    throw new Error("Failed to get user");
  }
};
