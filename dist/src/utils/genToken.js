import dotenv from "dotenv";
import { Jwt } from "hono/utils/jwt";
import process from "node:process";
dotenv.config();
export function genToken(id) {
    return Jwt.sign({ id }, process.env.JWT_SECRET || "");
}
