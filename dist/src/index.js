import { serve } from "@hono/node-server";
import app from "./app.js";
const port = Number.parseInt(process.env.PORT) || 8080;
const host = "0.0.0.0";
console.log(`Server is running on http://${host}:${port}`);
serve({
    fetch: app.fetch,
    port,
    hostname: host,
});
