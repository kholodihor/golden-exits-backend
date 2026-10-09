import { sign } from "hono/jwt";
import { requireEnv } from "../config/env.js";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
export function genToken(id) {
    const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    return sign({ id, exp }, requireEnv("JWT_SECRET"));
}
