import type { Context } from "hono";

import process from "node:process";

// Error Handler
export function errorHandler(c: Context) {
  console.log(c.res.status);

  return c.json({
    success: false,
    message: c.error?.message,
    stack: process.env.NODE_ENV === "production" ? null : c.error?.stack,
  });
}

// Not Found Handler
export function notFound(c: Context) {
  return c.json({
    success: false,
    message: `Not Found - [${c.req.method}] ${c.req.url}`,
  });
}
