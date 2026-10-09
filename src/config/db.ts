import mongoose from "mongoose";

import { requireEnv } from "./env";

export async function connectDB() {
  const conn = await mongoose.connect(requireEnv("MONGODB_URI"), {
    autoIndex: true,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
    maxPoolSize: 50,
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);
}
