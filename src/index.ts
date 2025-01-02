import { serve } from "@hono/node-server";
import process from "node:process";

import app from "./app";

const port = Number.parseInt(process.env.PORT!) || 4000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
