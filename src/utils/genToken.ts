import { Jwt } from "hono/utils/jwt";
import dotenv from "dotenv";

dotenv.config();

export const genToken = (id: string) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET || "");
};
