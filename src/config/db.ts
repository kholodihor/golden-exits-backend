import * as mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URL !== undefined) {
      const conn = await mongoose.connect(process.env.MONGODB_URL, {
        autoIndex: true,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
