import { serve } from "@hono/node-server";
import app from "./app";

const port = parseInt(process.env.PORT!) || 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
