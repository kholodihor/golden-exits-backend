import { serve } from "@hono/node-server";
import process from "node:process";
import app from "./app.js";
const port = Number(process.env.PORT) || 8080;
const host = "0.0.0.0";
console.log(`Server is running on http://${host}:${port}`);
serve({
    fetch: app.fetch,
    port,
    hostname: host,
});
