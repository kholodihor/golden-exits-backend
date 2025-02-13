import dotenv from "dotenv";
import * as mongoose from "mongoose";
import process from "node:process";
dotenv.config();
async function connectDB() {
    try {
        if (process.env.MONGODB_URI !== undefined) {
            const conn = await mongoose.connect(process.env.MONGODB_URI, {
                autoIndex: true,
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 15000,
                maxPoolSize: 50,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        }
    }
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}
export default connectDB;
